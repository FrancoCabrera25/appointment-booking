import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { LoginUserDto } from './entities/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockJwtService = {
    sign: jest.fn(),
    getJwtToken: jest.fn(),
  };
  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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
      imports: [JwtModule.register({})],
      // imports: [AuthModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user as a client', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const createResult = {
        user: {
          fullName: 'John Doe',
          email: 'johndoe@example.com',
          role: 'CLIENT',
        },
        token: 'jwtToken',
      };

      jest
        .spyOn(authService, 'create')
        .mockImplementation(async () => createResult);

      expect(await controller.create(createUserDto)).toBe(createResult);
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const loginResult = {
        _id: '12345',
        email: 'johndoe@example.com',
        role: 'user',
        fullName: 'franco cabrera',
        token: 'jwtToken',
      };

      jest
        .spyOn(authService, 'login')
        .mockImplementation(async () => loginResult);

      expect(await controller.login(loginUserDto)).toBe(loginResult);
    });
  });
});
