import {
  IsDateString,
  IsString,
  IsUppercase,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTurnDto {
  @IsDateString()
  date: string;

  @IsString()
  @Matches(/^([1-9]|1[0-2]):[0-5][0-9]$/, {
    message: 'El formato de hora debe ser hh:mm',
  })
  hour: string;

  @IsString()
  @IsUppercase()
  @MinLength(6)
  @MaxLength(6)
  patent: string;
}
