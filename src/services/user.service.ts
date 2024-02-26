import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shipment, User } from 'src/entities';
import { Model, Types } from 'mongoose';
import { CreateShipmentDto, ShipmentFeedBack } from 'src/dtos';
import { ShipmentStatus } from 'src/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Shipment.name) private shipmentModel: Model<Shipment>,
  ) {}

  async allShipments(
    userId: string,
    limit: number,
    page: number,
  ): Promise<Shipment[]> {
    const offset = limit * page;

    const pipeline = [
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'shipments',
          localField: 'shipments',
          foreignField: '_id',
          as: 'shipments',
        },
      },
      { $unwind: '$shipments' },
      { $skip: offset },
      { $limit: limit },
    ];

    const user = await this.userModel.aggregate(pipeline).exec();
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

    return shipment;
  }

  async cancelShipment(shipmentId: string): Promise<Shipment> {
    const shipment = await this.shipmentModel.findById(shipmentId);

    if (shipment.status !== ShipmentStatus.SCHEDULED) {
      throw new BadRequestException("Can't cancel this shipment");
    }

    return await this.shipmentModel.findByIdAndUpdate(
      shipmentId,
      {
        $set: { status: ShipmentStatus.CANCELLED },
      },
      {
        new: true,
      },
    );
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
}
