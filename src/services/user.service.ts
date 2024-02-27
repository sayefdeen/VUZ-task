import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Shipment, User } from 'src/entities';
import { Model } from 'mongoose';
import { CreateShipmentDto, ShipmentFeedBack } from 'src/dtos';
import { ShipmentStatus } from 'src/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Shipment.name) private shipmentModel: Model<Shipment>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async allShipments(
    email: string,
    limit: number,
    page: number,
  ): Promise<Shipment[]> {
    const cacheKey = `user-shipments-${email}-${parseInt(limit.toString())}-${page}`;
    const userShipments = await this.cacheService.get<Shipment[]>(cacheKey);

    if (userShipments) {
      return userShipments;
    }

    const offset = limit * (page - 1);

    const pipeline = [
      {
        $match: { email: email },
      },
      {
        $lookup: {
          from: 'shipments',
          localField: 'shipments',
          foreignField: '_id',
          as: 'shipments',
        },
      },
      {
        $unwind: '$shipments',
      },
      {
        $skip: offset,
      },
      {
        $limit: parseInt(limit.toString()),
      },
      {
        $group: {
          _id: '$_id',
          email: { $first: '$email' },
          fullName: { $first: '$fullName' },
          role: { $first: '$role' },
          status: { $first: '$status' },
          shipments: { $push: '$shipments' },
        },
      },
    ];

    const user = await this.userModel.aggregate(pipeline).exec();
    await this.cacheService.set(cacheKey, user[0].shipments, 60000);
    return user.length > 0 ? user[0].shipments : [];
  }

  async updateShipment(
    shipmentId: string,
    body: Partial<CreateShipmentDto>,
  ): Promise<Shipment> {
    const shipment = await this.shipmentModel.findByIdAndUpdate(
      shipmentId,
      body,
      {
        new: true,
      },
    );
    await this.cacheService.reset();
    return shipment;
  }

  async cancelShipment(shipmentId: string): Promise<Shipment> {
    const shipment = await this.shipmentModel.findById(shipmentId);

    if (shipment.status !== ShipmentStatus.SCHEDULED) {
      throw new BadRequestException("Can't cancel this shipment");
    }
    const updatedShipment = await this.shipmentModel.findByIdAndUpdate(
      shipmentId,
      {
        $set: { status: ShipmentStatus.CANCELLED },
        $push: {
          history: { status: ShipmentStatus.CANCELLED, date: new Date() },
        },
      },
      {
        new: true,
      },
    );

    await this.cacheService.reset();

    return updatedShipment;
  }

  async updateFeedBack(
    shipmentId: string,
    body: ShipmentFeedBack,
  ): Promise<Shipment> {
    return await this.shipmentModel.findByIdAndUpdate(
      shipmentId,
      {
        $set: { feedback: body },
      },
      {
        new: true,
      },
    );
  }

  async createShipment(
    createShipmentDto: CreateShipmentDto,
    userEmail: string,
  ): Promise<Shipment> {
    const shipment = await this.shipmentModel.create({
      origin: createShipmentDto.origin,
      destination: createShipmentDto.destination,
      deliveryPreferences: {
        deliveryTimeWindows: [
          `${createShipmentDto.deliveryTimeStart}-${createShipmentDto.deliveryTimeEnd}`,
        ],
        packagingInstructions: createShipmentDto.packagingInstructions,
        deliveryVehicleTypePreferences: createShipmentDto.vehicleType,
      },
      history: {
        status: ShipmentStatus.SCHEDULED,
        createdAt: new Date(),
      },
    });

    const createdShipment = await shipment.save();

    await this.userModel.findOneAndUpdate(
      { email: userEmail },
      { $push: { shipments: createdShipment._id } },
    );
    await this.cacheService.reset();
    return createdShipment;
  }
}
