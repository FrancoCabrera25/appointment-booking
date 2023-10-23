import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { error } from 'console';
describe('AuthService', () => {
  let authService: AuthService;

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    getJwtToken: jest.fn(),
  };

  const createUserDto: CreateUserDto = {
    email: 'cabrera.franco@outlook',
    password: '1234',
    fullName: 'franco cabrera',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return a token', async () => {
      const role = 'CLIENT';
      const userCreateResult = {
        user: {
          fullName: 'franco cabrera',
          email: 'cabrera.franco@outlook',
          role,
        },
        token: 'token',
      };

      const serviceCreateSpyOn = jest
        .spyOn(authService, 'create')
        .mockImplementation(async () => userCreateResult);

      const result = await authService.create(createUserDto, role);

      expect(serviceCreateSpyOn).toHaveBeenCalled();
      expect(result).toBe(userCreateResult);
    });

    it('should handle database errors', async () => {
      const role = 'CLIENT';
      const error = new BadRequestException('email duplicado');
      jest.spyOn(authService, 'create').mockRejectedValue(error);
      await expect(
        authService.create(createUserDto, role),
      ).rejects.toThrowError('email duplicado');
    });

    it('should log in a user and return user info and token', async () => {
      const loginUserDto = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const user = {
        _id: '12345',
        email: 'johndoe@example.com',
        password: 'hashedPassword',
        role: 'user',
        fullName: 'franco cabrera',
      };

      const loginResult = {
        _id: '12345',
        email: 'johndoe@example.com',
        role: 'user',
        fullName: 'franco cabrera',
        token: 'jwtToken',
      };

      jest.spyOn(mockJwtService, 'getJwtToken').mockReturnValue('jwtToken');
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(user);
      jest.spyOn(authService, 'login').mockResolvedValue(loginResult);

      const result = await authService.login(loginUserDto);

      expect(result).toEqual({
        _id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        token: 'jwtToken',
      });
    });

    it('should handle errors when logging in', async () => {
      const loginUserDto = {
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const error = new UnauthorizedException('user/password are not valid');
      jest.spyOn(authService, 'login').mockRejectedValue(error);
      await expect(authService.login(loginUserDto)).rejects.toThrowError(
        'user/password are not valid',
      );
    });
  });
});
