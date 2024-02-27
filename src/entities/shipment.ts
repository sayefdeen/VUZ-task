import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeliveryVehicleType, ShipmentStatus } from 'src/enums';

@Schema({ versionKey: false })
export class Shipment extends Document {
  @Prop({ required: true })
  origin: string;

  @Prop({ required: true })
  destination: string;

  @Prop({
    _id: false,
    required: true,
    type: {
      deliveryTimeWindows: {
        from: String,
        to: String,
      },
      packagingInstructions: String,
      deliveryVehicleTypePreferences: {
        type: String,
        enum: Object.values(DeliveryVehicleType),
        default: DeliveryVehicleType.STANDARD,
      },
    },
  })
  deliveryPreferences: {
    deliveryTimeWindows: { from: string; to: string };
    packagingInstructions: string;
    deliveryVehicleTypePreferences: DeliveryVehicleType;
  };

  @Prop({
    enum: ShipmentStatus,
    default: ShipmentStatus.SCHEDULED,
    required: true,
  })
  status: ShipmentStatus;

  @Prop({
    _id: false,
    type: {
      rating: Number,
      comments: String,
    },
  })
  feedback: {
    rating: number;
    comments: string;
  };

  @Prop()
  history: {
    status: ShipmentStatus;
    createdAt: Date;
  }[];
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
