import { Injectable } from '@nestjs/common';
import { CreateInspectionResultDto } from './dto/create-inspection-result.dto';
import { Model } from 'mongoose';
import { InspectionResult } from './entities/inspection-result.entity';
import { InjectModel } from '@nestjs/mongoose';
import { inspectionCalculator } from './utils/inspection-calculator';
import { TurnService } from '../turn/turn.service';

@Injectable()
export class InspectionResultService {
  constructor(
    @InjectModel(InspectionResult.name)
    private readonly inspectionResultModel: Model<InspectionResult>,
    private readonly turnService: TurnService,
  ) {}

  async create(
    createInspectionResultDto: CreateInspectionResultDto,
    userId: string,
  ) {
    const { details: detailsDto, turnId } = createInspectionResultDto;

    const inspectionQualification = inspectionCalculator(detailsDto);

    try {
      console.log('prev');
      const inspectionResult = await this.inspectionResultModel.create({
        qualification: inspectionQualification.qualification,
        details: detailsDto,
        userId,
        turnId,
        status: 'DONE',
        inspectionStatus: inspectionQualification.status.toString(),
      });
      console.log('add');

      await this.turnService.updateTurnStatus(turnId, 'FINISHED');

      const { qualification, status, _id, inspectionStatus } =
        inspectionResult.toObject();

      return {
        qualification,
        status,
        _id,
        inspectionStatus,
        details: [...detailsDto],
        turnId,
        userId,
      };
    } catch (error) {
      console.log('error', error);
    }
  }
}
