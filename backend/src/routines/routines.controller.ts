import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutinesService } from './routines.service';

@Controller('routines')
export class RoutinesController {
  constructor(
    private readonly routinesService: RoutinesService,
  ) {}

  @Get()
  findAll() {
    return this.routinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routinesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRoutineDto) {
    return this.routinesService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRoutineDto,
  ) {
    return this.routinesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.routinesService.remove(id);
  }
}