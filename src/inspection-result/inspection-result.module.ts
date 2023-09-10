import { Module } from '@nestjs/common';
import { InspectionResultService } from './inspection-result.service';
import { InspectionResultController } from './inspection-result.controller';

@Module({
  controllers: [InspectionResultController],
  providers: [InspectionResultService]
})
export class InspectionResultModule {}
