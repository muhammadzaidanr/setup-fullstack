import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { Tingkat } from '../entities/routine.entity';

export class CreateRoutineDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nama!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  fokus!: string;

  @IsOptional()
  @IsDateString()
  tanggalLatihan?: string | null;

  @IsOptional()
  @IsIn(['pemula', 'menengah', 'lanjutan'])
  tingkat?: Tingkat;
}