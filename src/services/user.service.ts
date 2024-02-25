import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { User } from 'src/entities';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dtos';

type ReturnedUser = {
  user: User;
  token: string;
};

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ReturnedUser> {
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

    const token = this.jwtService.generateToken(createdUser);

    return {
      user: createdUser,
      token,
    };
  }

  async login(email: string, password: string): Promise<ReturnedUser> {
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

    const token = this.jwtService.generateToken(user);
    return {
      user,
      token,
    };
  }
}
