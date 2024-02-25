import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateUserValidationPipe } from 'src/Pipes/createUserValidation.pipe';
import { CreateUserDto, SignInDto } from 'src/dtos';
import { UserService } from 'src/services/user.service';

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @UsePipes(new CreateUserValidationPipe())
  async create(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @Post('/signin')
  async signIn(@Body() body: SignInDto) {
    return await this.userService.login(body.email, body.password);
  }
}
