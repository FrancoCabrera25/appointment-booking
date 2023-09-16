import { IsInt, IsString, Max, Min } from 'class-validator';

export class InspectionResultDetailDto {
  @IsString()
  title: string;
  @IsInt()
  @Min(1)
  @Max(10)
  point: number;
}
