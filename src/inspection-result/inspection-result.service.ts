import { Injectable } from '@nestjs/common';
import { CreateInspectionResultDto } from './dto/create-inspection-result.dto';
import mongoose, { Model } from 'mongoose';
import { InspectionResult } from './entities/inspection-result.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { inspectionCalculator } from './utils/inspection-calculator';
import { TurnService } from '../turn/turn.service';

@Injectable()
export class InspectionResultService {
  constructor(
    @InjectModel(InspectionResult.name)
    private readonly inspectionResultModel: Model<InspectionResult>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly turnService: TurnService,
  ) {}

  async create(
    createInspectionResultDto: CreateInspectionResultDto,
    userId: string,
  ) {
    const { details, turnId } = createInspectionResultDto;

    const inspectionQualification = inspectionCalculator(details);
    // const session = await this.connection.startSession();
    // session.startTransaction();

    try {
      console.log('prev');
      const inspectionResult = await this.inspectionResultModel.create({
        qualification: inspectionQualification.qualification,
        details,
        userId,
        turnId,
        status: 'DONE',
        inspectionStatus: inspectionQualification.status.toString(),
      });
      console.log('add');
      await this.turnService.updateTurnStatus(turnId, 'FINISHED');

      return inspectionResult;
    } catch (error) {
      //  await session.abortTransaction();
      console.log('error', error);
    }
  }
}
