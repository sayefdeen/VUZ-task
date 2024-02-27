import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { UserController } from 'src/controllers';
import { UserSchema, User, Shipment, ShipmentSchema } from 'src/entities';
import { JwtService, UserService } from 'src/services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
