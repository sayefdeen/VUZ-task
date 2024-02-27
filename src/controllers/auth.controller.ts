import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateUserValidationPipe } from 'src/Pipes/createUserValidation.pipe';
import { CreateUserDto, ReturnedUserDto, SignInDto } from 'src/dtos';
import { Serialize } from 'src/interceptors';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
@Serialize(ReturnedUserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @UsePipes(new CreateUserValidationPipe())
  async create(@Body() user: CreateUserDto) {
    return await this.authService.create(user);
  }

  @Post('/signin')
  async signIn(@Body() body: SignInDto) {
    return await this.authService.login(body.email, body.password);
  }
}
