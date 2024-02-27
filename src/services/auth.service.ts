import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { MailService } from './mail.service';
import { User } from 'src/entities';
import { Model } from 'mongoose';
import { CreateUserDto, ReturnedUserDto } from 'src/dtos';
import { UserStatus } from 'src/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ReturnedUserDto> {
    const { email, password } = createUserDto;
    const hashedPassword = await this.bcryptService.hashPassword(password);
    const checkUser = await this.userModel.findOne({ email });
    if (checkUser) {
      throw new BadRequestException('Email Already in use');
    }

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const createdUser = await user.save();

    this.mailService.sendMail({
      from: { name: 'Admin', address: 'admin@vuz.com' },
      recipients: [{ name: user.fullName, address: user.email }],
      subject: 'Welcome to Task',
      html: '<p>Hi John, welcome</p>',
    });

    const token = this.jwtService.generateToken(createdUser);

    return {
      user: createdUser,
      token,
    };
  }

  async login(email: string, password: string): Promise<ReturnedUserDto> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User Not found');
    }

    const isValidPassword = await this.bcryptService.comparePassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Email or password is incorrect');
    }

    if (user.status === UserStatus.DISABLED) {
      throw new UnauthorizedException('Your Account is not approved Yet');
    }

    const token = this.jwtService.generateToken(user);

    return {
      user,
      token,
    };
  }
}
