import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shipment, User } from 'src/entities';
import { Model } from 'mongoose';
import { ProducerTopics, ShipmentStatus, UserStatus } from 'src/enums';
import { CreateShipmentDto } from 'src/dtos';
import { KafkaProducerService } from './kafkaProducer.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Shipment.name) private shipmentModel: Model<Shipment>,
    private readonly kafkaProducer: KafkaProducerService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async approveUser(email: string, userEmail: string): Promise<void> {
    if (email === userEmail) {
      throw new BadRequestException("You can't approve yourself");
    }

    await this.userModel.findOneAndUpdate(
      { email },
      { $set: { status: UserStatus.ENABLED } },
    );
  }

  async rejectUser(email: string, userEmail: string): Promise<void> {
    if (email === userEmail) {
      throw new BadRequestException("You can't Reject yourself");
    }

    await this.userModel.findOneAndUpdate(
      { email },
      { $set: { status: UserStatus.DISABLED } },
    );
  }

  async listShipments(limit: number, page: number): Promise<Shipment[]> {
    const cacheKey = `shipments-${limit}-${page}`;
    let shipments = await this.cacheService.get<Shipment[]>(cacheKey);

    if (!shipments) {
      const offset = limit * (page - 1);
      shipments = await this.shipmentModel.find({}).limit(limit).skip(offset);

      await this.cacheService.set(cacheKey, shipments, 60000);
      return shipments;
    } else {
      return shipments;
    }
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
    return createdShipment;
  }

  async updateShipment(
    shipmentId: string,
    updateOptions: Partial<CreateShipmentDto>,
  ): Promise<Shipment> {
    const shipment = await this.shipmentModel.findById(shipmentId);
    if (shipment.status !== ShipmentStatus.SCHEDULED) {
      throw new BadRequestException("Can't update this shipment");
    }

    const updatedShipment = await this.shipmentModel.findByIdAndUpdate(
      shipmentId,
      updateOptions,
      {
        new: true,
      },
    );

    this.kafkaProducer.produce({
      topic: ProducerTopics.SHIPMENT_TRANSIT,
      messages: [{ value: 'Your Shipment status is updated to in transit' }],
    });

    return updatedShipment;
  }

  async deleteShipment(shipmentId: string): Promise<void> {
    const shipment = await this.shipmentModel.findById(shipmentId);
    if (
      shipment.status === ShipmentStatus.DELETED ||
      shipment.status === ShipmentStatus.IN_TRANSIT
    ) {
      throw new BadRequestException("Can't delete this shipping");
    }
    await this.shipmentModel.findByIdAndUpdate(shipmentId, {
      $set: { status: ShipmentStatus.DELETED },
      $push: {
        history: {
          status: ShipmentStatus.DELETED,
          Date: new Date(),
        },
      },
    });

    this.kafkaProducer.produce({
      topic: ProducerTopics.SHIPMENT_DELETED,
      messages: [{ value: 'Your Shipment status is deleted bu Admin' }],
    });
  }
}
