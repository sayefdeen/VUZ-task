import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/controllers';
import { UserSchema, User } from 'src/entities';
import {
  BcryptService,
  JwtService,
  UserService,
  MailService,
} from 'src/services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [BcryptService, JwtService, UserService, MailService],
})
export class UserModule {}
