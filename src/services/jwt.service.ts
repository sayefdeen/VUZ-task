import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/users';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  generateToken(user: Partial<User>): string {
    const payload = { email: user.email, userRole: user.role };
    const secretKey = this.configService.get<string>('JWT_SECRET');
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
  }

  verifyToken(token: string): any {
    const secretKey = this.configService.get<string>('JWT_SECRET');
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      throw new InternalServerErrorException('Error in jwt generate');
    }
  }
}
