import { Injectable } from '@nestjs/common';
import { CreateInspectionResultDto } from './dto/create-inspection-result.dto';
import { UpdateInspectionResultDto } from './dto/update-inspection-result.dto';

@Injectable()
export class InspectionResultService {
  create(createInspectionResultDto: CreateInspectionResultDto) {
    return 'This action adds a new inspectionResult';
  }

  findAll() {
    return `This action returns all inspectionResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inspectionResult`;
  }

  update(id: number, updateInspectionResultDto: UpdateInspectionResultDto) {
    return `This action updates a #${id} inspectionResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} inspectionResult`;
  }
}
