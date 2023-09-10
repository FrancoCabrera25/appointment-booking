import {
  IsOptional,
  IsString,
  IsUppercase,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @MaxLength(6)
  @MinLength(6)
  @IsUppercase()
  patent: string;
  @IsString()
  @IsOptional()
  brand?: string;
  @IsString()
  @IsOptional()
  model?: string;
  @IsString()
  @IsOptional()
  @MaxLength(4)
  @MinLength(4)
  year?: string;
}
