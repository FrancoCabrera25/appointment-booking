import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './entities/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createAuthDto: CreateUserDto, role: string) {
    try {
      const { password, ...userData } = createAuthDto;
      const passwwordHash = bcrypt.hashSync(password, 10);

      const userCreate = await this.userModel.create({
        ...userData,
        password: passwwordHash,
        role,
      });

      return {
        user: {
          fullName: userCreate.fullName,
          email: userCreate.email,
          role: userCreate.role,
        },
        token: this.getJwtToken({
          id: userCreate._id.toString(),
          role: userCreate.role,
        }),
      };
    } catch (error) {
      console.log('error', error);
      this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userModel
      .findOne({ email })
      .select('email password id role')
      .lean();

    if (!user) {
      throw new UnauthorizedException('user/password are not valid');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    delete user.password;

    console.log('user', user);
    return {
      ...user,
      token: this.getJwtToken({ id: user._id.toString(), role: user.role }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Please check server logs ');
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // // remove(id: number) {
  // //   return `This action removes a #${id} auth`;
  // }
}
