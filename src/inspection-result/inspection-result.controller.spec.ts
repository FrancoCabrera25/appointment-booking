import { Test, TestingModule } from '@nestjs/testing';
import { InspectionResultController } from './inspection-result.controller';
import { InspectionResultService } from './inspection-result.service';

describe('InspectionResultController', () => {
  let controller: InspectionResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectionResultController],
      providers: [InspectionResultService],
    }).compile();

    controller = module.get<InspectionResultController>(InspectionResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
