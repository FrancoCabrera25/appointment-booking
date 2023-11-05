import { Test, TestingModule } from '@nestjs/testing';
import { TurnController } from './turn.controller';
import { TurnService } from './turn.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { CanActivate } from '@nestjs/common';
import { CreateTurnDto } from './dto/create-turn.dto';

const mockJwtService = {
  sign: jest.fn(),
  getJwtToken: jest.fn(),
};
describe('TurnController', () => {
  let controller: TurnController;
  let turnService: TurnService;

  beforeEach(async () => {
    const mockAuthGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurnController],
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      providers: [
        {
          provide: TurnService,
          useValue: {
            create: jest.fn(),
            findAvailableTurnByDay: jest.fn(),
            findAllTurnByDate: jest.fn(),
            findAllTurnByUserId: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<TurnController>(TurnController);
    turnService = module.get<TurnService>(TurnService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new turn', async () => {
    const createTurnDto: CreateTurnDto = {
      date: '2023-11-11',
      hour: '22:00',
      patent: 'ACD234',
    };
    const user = {
      id: 'exampleUserId',
      // Otros datos de usuario necesarios
    };
    const newTurnMock: any = {
      date: new Date(),
      hour: '10:00',
      vehicleId: 'ssssss',
    };

    jest
      .spyOn(turnService, 'create')
      .mockImplementation(async () => newTurnMock);

    expect(await controller.create(createTurnDto, user.id)).toEqual(
      newTurnMock,
    );
  });
});
