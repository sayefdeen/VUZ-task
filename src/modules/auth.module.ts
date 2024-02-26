import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from 'src/controllers';
import { UserSchema, User } from 'src/entities';
import {
  BcryptService,
  JwtService,
  AuthService,
  MailService,
} from 'src/services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [BcryptService, JwtService, AuthService, MailService],
})
export class AuthModule {}
