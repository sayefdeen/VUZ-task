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
    const offset = limit * (page - 1);
    const shipments = await this.shipmentModel
      .find({})
      .limit(limit)
      .skip(offset);

    return shipments;
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
  }
}
