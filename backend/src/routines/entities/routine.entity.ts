export type Tingkat = 'pemula' | 'menengah' | 'lanjutan';

export class Routine {
  id!: string;
  nama!: string;
  fokus!: string;
  tanggalLatihan!: string | null;
  tingkat!: Tingkat;
  selesai!: boolean;
  createdAt!: string;
  updatedAt!: string;
}