import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema, Document } from 'mongoose';
import { DeliveryVehicleType, ShipmentStatus } from 'src/enums';

const DeliveryPreferencesSchema = new Schema({
  deliveryTimeWindows: [String],
  packagingInstructions: String,
  deliveryVehicleTypePreferences: {
    type: String,
    enum: Object.values(DeliveryVehicleType),
  },
});

const ShipmentFeedbackSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comments: String,
});

const ShipmentHistory = new Schema({
  status: {
    type: String,
    enum: Object.values(ShipmentStatus),
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export class Shipment extends Document {
  @Prop({ required: true, type: String })
  origin: string;
  @Prop({ required: true, type: String })
  destination: string;
  @Prop({ required: true, type: DeliveryPreferencesSchema })
  deliveryPreferences: typeof DeliveryPreferencesSchema;
  @Prop({
    enum: ShipmentStatus,
    default: ShipmentStatus.SCHEDULED,
    required: true,
  })
  status: ShipmentStatus;
  @Prop({ required: false, type: ShipmentFeedbackSchema })
  feedback?: typeof ShipmentFeedbackSchema;
  @Prop({ required: false, type: ShipmentHistory })
  history: { status: ShipmentStatus; createdAt: Date }[];
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
