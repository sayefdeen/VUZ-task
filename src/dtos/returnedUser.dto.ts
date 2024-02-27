import { Expose, Type } from 'class-transformer';
import { Role } from 'src/enums';

class UserDto {
  @Expose()
  email: string;
  @Expose()
  fullName: string;
  @Expose()
  role: Role;
}

export class ReturnedUserDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  token: string;
}
