import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/services';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;

    if (!headers.authorization) {
      throw new UnauthorizedException('Token not provided');
    }

    const token = headers.authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decodedToken = this.jwtService.verifyToken(token);
      request.user = decodedToken;
      return handler.handle();
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
