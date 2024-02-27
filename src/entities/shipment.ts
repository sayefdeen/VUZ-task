import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeliveryVehicleType, ShipmentStatus } from 'src/enums';

@Schema()
export class Shipment extends Document {
  @Prop({ required: true })
  origin: string;

  @Prop({ required: true })
  destination: string;

  @Prop({
    _id: false,
    required: true,
    type: {
      deliveryTimeWindows: [String],
      packagingInstructions: String,
      deliveryVehicleTypePreferences: {
        type: String,
        enum: Object.values(DeliveryVehicleType),
      },
    },
  })
  deliveryPreferences: {
    deliveryTimeWindows: string[];
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
    type: {
      rating: Number,
      comments: Number,
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
