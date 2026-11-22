-- CreateEnum
CREATE TYPE "Tingkat" AS ENUM ('pemula', 'menengah', 'lanjutan');

-- CreateTable
CREATE TABLE "routines" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "fokus" TEXT NOT NULL,
    "tanggalLatihan" TIMESTAMP(3),
    "tingkat" "Tingkat" NOT NULL DEFAULT 'pemula',
    "selesai" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);
