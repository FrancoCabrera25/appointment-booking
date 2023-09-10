import { Test, TestingModule } from '@nestjs/testing';
import { InspectionResultService } from './inspection-result.service';

describe('InspectionResultService', () => {
  let service: InspectionResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InspectionResultService],
    }).compile();

    service = module.get<InspectionResultService>(InspectionResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
