import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { InspectionResultDetailDto } from './Inspection-result-detail.Dto';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export class CreateInspectionResultDto {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(toMongoObjectId)
  turnId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InspectionResultDetailDto)
  details: InspectionResultDetailDto[];
}

export function toMongoObjectId({ value, key }): Types.ObjectId {
  if (Types.ObjectId.isValid(value)) {
    return value;
  }

  throw new BadRequestException(`${key} is not a valid MongoId`);
}
