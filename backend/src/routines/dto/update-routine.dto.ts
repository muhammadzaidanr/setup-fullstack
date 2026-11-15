import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateRoutineDto } from './create-routine.dto';

export class UpdateRoutineDto extends PartialType(CreateRoutineDto) {
  @IsOptional()
  @IsBoolean()
  selesai?: boolean;
}