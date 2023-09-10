import { PartialType } from '@nestjs/mapped-types';
import { CreateInspectionResultDto } from './create-inspection-result.dto';

export class UpdateInspectionResultDto extends PartialType(CreateInspectionResultDto) {}
