import { Test, TestingModule } from '@nestjs/testing';
import { InspectionResultController } from './inspection-result.controller';
import { InspectionResultService } from './inspection-result.service';
import { JwtService } from '@nestjs/jwt';
import { PassportModule, AuthGuard } from '@nestjs/passport';
import { CanActivate } from '@nestjs/common';

const mockJwtService = {
  sign: jest.fn(),
  getJwtToken: jest.fn(),
};

describe('InspectionResultController', () => {
  let controller: InspectionResultController;
  let inspectionResultService: InspectionResultService;
  beforeEach(async () => {
    const mockAuthGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectionResultController],
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      providers: [
        {
          provide: InspectionResultService,
          useValue: {
            create: jest.fn(),
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

    controller = module.get<InspectionResultController>(
      InspectionResultController,
    );
    inspectionResultService = module.get<InspectionResultService>(
      InspectionResultService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/inspection-result (POST) - should create an inspection result', async () => {
    const createInspectionResultDto = {
      details: [
        {
          title: '222',
          point: 23,
        },
      ],
      turnId: 'turnId',
    };
    const userId = 'userId';
    const user = {
      fullName: 'Franco cabrera',
      id: '123123123123',
      email: 'email@franco',
      password: '',
      role: '',
    };
    const mockedInspectionResult = {
      qualification: 80,
      status: 'DONE',
      _id: '423423423423423',
      inspectionStatus: 'SAFE',
      details: [
        {
          title: '222',
          point: 23,
        },
      ],
      userId,
      turnId: 'turnId',
    };

    jest
      .spyOn(inspectionResultService, 'create')
      .mockImplementation(async () => mockedInspectionResult);

    expect(await controller.create(createInspectionResultDto, user)).toBe(
      mockedInspectionResult,
    );
  });
});
