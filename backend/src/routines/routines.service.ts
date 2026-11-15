import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { Routine } from './entities/routine.entity';

@Injectable()
export class RoutinesService {
  private routines: Routine[] = [];

  findAll(): Routine[] {
    return [...this.routines].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  findOne(id: string): Routine {
    const routine = this.routines.find((item) => item.id === id);

    if (!routine) {
      throw new NotFoundException(
        `Routine dengan id ${id} tidak ditemukan`,
      );
    }

    return routine;
  }

  create(dto: CreateRoutineDto): Routine {
    const nama = dto.nama.trim();
    const fokus = dto.fokus.trim();

    this.validasiRoutine(nama, fokus);

    const now = new Date().toISOString();

    const routine: Routine = {
      id: randomUUID(),
      nama,
      fokus,
      tanggalLatihan: dto.tanggalLatihan ?? null,
      tingkat: dto.tingkat ?? 'pemula',
      selesai: false,
      createdAt: now,
      updatedAt: now,
    };

    this.routines.push(routine);

    return routine;
  }

  update(id: string, dto: UpdateRoutineDto): Routine {
    const routine = this.findOne(id);

    const nama = dto.nama?.trim() ?? routine.nama;
    const fokus = dto.fokus?.trim() ?? routine.fokus;

    this.validasiRoutine(nama, fokus, id);

    Object.assign(routine, {
      nama,
      fokus,
      tanggalLatihan:
        dto.tanggalLatihan === undefined
          ? routine.tanggalLatihan
          : dto.tanggalLatihan,
      tingkat: dto.tingkat ?? routine.tingkat,
      selesai: dto.selesai ?? routine.selesai,
      updatedAt: new Date().toISOString(),
    });

    return routine;
  }

  remove(id: string): void {
    const routine = this.findOne(id);

    this.routines = this.routines.filter(
      (item) => item.id !== routine.id,
    );
  }

  private validasiRoutine(
    nama: string,
    fokus: string,
    abaikanId?: string,
  ): void {
    if (nama.length < 3 || fokus.length < 3) {
      throw new BadRequestException(
        'Nama dan fokus minimal 3 karakter setelah spasi tepi dihapus',
      );
    }

    const namaSudahAda = this.routines.some(
      (item) =>
        item.id !== abaikanId &&
        item.nama.toLowerCase() === nama.toLowerCase(),
    );

    if (namaSudahAda) {
      throw new ConflictException(
        `Routine dengan nama "${nama}" sudah tersedia`,
      );
    }
  }
}