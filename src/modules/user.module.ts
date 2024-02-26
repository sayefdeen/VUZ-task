import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/controllers';
import { UserSchema, User, Shipment, ShipmentSchema } from 'src/entities';
import { JwtService, UserService } from 'src/services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
