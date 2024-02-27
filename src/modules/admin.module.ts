import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from 'src/controllers';
import { UserSchema, User, Shipment, ShipmentSchema } from 'src/entities';
import { AdminService, JwtService } from 'src/services';
import { ShipmentDeleteConsumer, ShipmentUpdateConsumer } from 'src/consumers';
import { KafkaModule } from './kafka.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
    KafkaModule,
  ],
  providers: [
    ShipmentDeleteConsumer,
    ShipmentUpdateConsumer,
    AdminService,
    JwtService,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
