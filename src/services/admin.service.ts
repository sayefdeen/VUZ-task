import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shipment, User } from 'src/entities';
import { Model } from 'mongoose';
import { ShipmentStatus, UserStatus } from 'src/enums';
import { CreateShipmentDto } from 'src/dtos';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Shipment.name) private shipmentModel: Model<Shipment>,
  ) {}

  async approveUser(email: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email },
      { $set: { status: UserStatus.ENABLED } },
    );
  }

  async rejectUser(email: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email },
      { $set: { status: UserStatus.DISABLED } },
    );
  }

  async listShipments(limit: number, page: number): Promise<Shipment[]> {
    const offset = limit * page;
    const shipments = await this.shipmentModel
      .find({})
      .limit(limit)
      .skip(offset);

    return shipments;
  }

  async createShipment(
    CreateShipmentDto: CreateShipmentDto,
  ): Promise<Shipment> {
    const shipment = await this.shipmentModel.create({
      ...CreateShipmentDto,
    });

    const createdShipment = await shipment.save();
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
    return updatedShipment;
  }

  async deleteShipment(shipmentId: string): Promise<void> {
    await this.shipmentModel.findByIdAndUpdate(shipmentId, {
      $set: { status: ShipmentStatus.DELETED },
    });
  }
}
