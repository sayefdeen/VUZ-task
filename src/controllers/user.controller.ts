import { Controller } from '@nestjs/common';
import { UserService } from 'src/services';

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}
}
