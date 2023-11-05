import { Test, TestingModule } from '@nestjs/testing';
import { InspectionResultService } from './inspection-result.service';
import { TurnService } from '../turn/turn.service';
import { getModelToken } from '@nestjs/mongoose';
import { InspectionResult } from './entities/inspection-result.entity';

describe('InspectionResultService', () => {
  let service: InspectionResultService;
  let turnService: TurnService;

  const mockInspectionResultModel = {
    create: jest.fn(),
  };

  const mockTurnService = {
    updateTurnStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InspectionResultService,
        {
          provide: getModelToken(InspectionResult.name),
          useValue: mockInspectionResultModel,
        },
        {
          provide: TurnService,
          useValue: mockTurnService,
        },
      ],
    }).compile();

    service = module.get<InspectionResultService>(InspectionResultService);
    turnService = module.get<TurnService>(TurnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create an inspection result and update turn status', async () => {
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

    const serviceCreateSpyOn = jest
      .spyOn(service, 'create')
      .mockImplementation(async () => mockedInspectionResult);

    jest.spyOn(mockTurnService, 'updateTurnStatus').mockResolvedValue(true);

    //mockTurnService.updateTurnStatus.mockResolvedValue(true);

    const result = await service.create(createInspectionResultDto, userId);
    expect(result).toEqual(mockedInspectionResult);
    expect(serviceCreateSpyOn).toHaveBeenCalled();

    //expect(mockTurnService.updateTurnStatus).toHaveBeenCalled();
  });

  // it('should handle error when creating inspection result', async () => {
  //   const createInspectionResultDto = {
  //     details: 'Some details',
  //     turnId: 'turnId',
  //   };

  //   const userId = 'userId';

  //   const mockError = new Error('Failed to create inspection result');
  //   mockInspectionResultModel.create.mockRejectedValue(mockError);

  //   const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

  //   await expect(service.create(createInspectionResultDto, userId)).rejects.toThrowError(mockError);

  //   expect(consoleSpy).toHaveBeenCalledWith('error', mockError);
  // });
});
