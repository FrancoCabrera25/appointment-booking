import { Module } from '@nestjs/common';
import { InspectionResultService } from './inspection-result.service';
import { InspectionResultController } from './inspection-result.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { TurnModule } from '../turn/turn.module';
import {
  InspectionResult,
  InspectionResultSchema,
} from './entities/inspection-result.entity';

@Module({
  controllers: [InspectionResultController],
  providers: [InspectionResultService],
  imports: [
    MongooseModule.forFeature([
      {
        name: InspectionResult.name,
        schema: InspectionResultSchema,
      },
    ]),
    AuthModule,
    TurnModule,
  ],
  exports: [MongooseModule],
})
export class InspectionResultModule {}
