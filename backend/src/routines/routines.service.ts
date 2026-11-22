import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Injectable()
export class RoutinesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.routine.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const routine = await this.prisma.routine.findUnique({
      where: { id },
    });

    if (!routine) {
      throw new NotFoundException(`Routine dengan id ${id} tidak ditemukan`);
    }

    return routine;
  }

  async create(dto: CreateRoutineDto) {
    const nama = dto.nama.trim();
    const fokus = dto.fokus.trim();

    await this.validasiRoutine(nama, fokus);

    return this.prisma.routine.create({
      data: {
        nama,
        fokus,
        tanggalLatihan: dto.tanggalLatihan
          ? new Date(dto.tanggalLatihan)
          : null,
        tingkat: dto.tingkat ?? 'pemula',
      },
    });
  }

  async update(id: string, dto: UpdateRoutineDto) {
    const existing = await this.findOne(id);

    const nama = dto.nama?.trim() ?? existing.nama;
    const fokus = dto.fokus?.trim() ?? existing.fokus;

    await this.validasiRoutine(nama, fokus, id);

    try {
      return await this.prisma.routine.update({
        where: { id },
        data: {
          nama,
          fokus,
          tanggalLatihan:
            dto.tanggalLatihan === undefined
              ? undefined
              : dto.tanggalLatihan
                ? new Date(dto.tanggalLatihan)
                : null,
          tingkat: dto.tingkat,
          selesai: dto.selesai,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Routine dengan id ${id} tidak ditemukan`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.routine.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Routine dengan id ${id} tidak ditemukan`);
      }
      throw error;
    }
  }

    async getStats() {
    const [total, selesai, belumSelesai, pemula, menengah, lanjutan] =
      await Promise.all([
        this.prisma.routine.count(),
        this.prisma.routine.count({ where: { selesai: true } }),
        this.prisma.routine.count({ where: { selesai: false } }),
        this.prisma.routine.count({ where: { tingkat: 'pemula' } }),
        this.prisma.routine.count({ where: { tingkat: 'menengah' } }),
        this.prisma.routine.count({ where: { tingkat: 'lanjutan' } }),
      ]);

    return {
      total,
      selesai,
      belumSelesai,
      berdasarkanTingkat: {
        pemula,
        menengah,
        lanjutan,
      },
    };
  }

  private async validasiRoutine(
    nama: string,
    fokus: string,
    abaikanId?: string,
  ): Promise<void> {
    if (nama.length < 3 || fokus.length < 3) {
      throw new BadRequestException(
        'Nama dan fokus minimal 3 karakter setelah spasi tepi dihapus',
      );
    }

    const duplikat = await this.prisma.routine.findFirst({
      where: {
        nama: {
          equals: nama,
          mode: 'insensitive',
        },
        ...(abaikanId ? { NOT: { id: abaikanId } } : {}),
      },
    });

    if (duplikat) {
      throw new ConflictException(
        `Routine dengan nama "${nama}" sudah tersedia`,
      );
    }
  }
}