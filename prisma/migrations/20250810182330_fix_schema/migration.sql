/*
  Warnings:

  - The primary key for the `Bookmaker` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `actif` on the `Bookmaker` table. All the data in the column will be lost.
  - You are about to drop the column `bonus` on the `Bookmaker` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Bookmaker` table. All the data in the column will be lost.
  - You are about to drop the column `ordre` on the `Bookmaker` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Bookmaker` table. All the data in the column will be lost.
  - The `id` column on the `Bookmaker` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Montante` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dateDebut` on the `Montante` table. All the data in the column will be lost.
  - You are about to drop the column `miseActuelle` on the `Montante` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Montante` table. All the data in the column will be lost.
  - The `id` column on the `Montante` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Palier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookmakerId` on the `Palier` table. All the data in the column will be lost.
  - You are about to drop the column `coteTotale` on the `Palier` table. All the data in the column will be lost.
  - You are about to drop the column `cotes` on the `Palier` table. All the data in the column will be lost.
  - You are about to drop the column `dateParis` on the `Palier` table. All the data in the column will be lost.
  - You are about to drop the column `matchs` on the `Palier` table. All the data in the column will be lost.
  - You are about to drop the column `pronostics` on the `Palier` table. All the data in the column will be lost.
  - You are about to drop the column `sports` on the `Palier` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Palier` table. All the data in the column will be lost.
  - You are about to drop the column `typePari` on the `Palier` table. All the data in the column will be lost.
  - You are about to drop the column `typeParis` on the `Palier` table. All the data in the column will be lost.
  - The `id` column on the `Palier` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reference` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `solde` on the `Transaction` table. All the data in the column will be lost.
  - The `id` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `bookmakerId` to the `Montante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cote` to the `Palier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Palier` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `montanteId` on the `Palier` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Palier" DROP CONSTRAINT "Palier_bookmakerId_fkey";

-- DropForeignKey
ALTER TABLE "Palier" DROP CONSTRAINT "Palier_montanteId_fkey";

-- DropIndex
DROP INDEX "Bookmaker_code_key";

-- AlterTable
ALTER TABLE "Bookmaker" DROP CONSTRAINT "Bookmaker_pkey",
DROP COLUMN "actif",
DROP COLUMN "bonus",
DROP COLUMN "code",
DROP COLUMN "ordre",
DROP COLUMN "url",
ADD COLUMN     "couleur" TEXT NOT NULL DEFAULT '#3B82F6',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Bookmaker_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Montante" DROP CONSTRAINT "Montante_pkey",
DROP COLUMN "dateDebut",
DROP COLUMN "miseActuelle",
DROP COLUMN "status",
ADD COLUMN     "bookmakerId" INTEGER NOT NULL,
ADD COLUMN     "palierActuel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "statut" TEXT NOT NULL DEFAULT 'en_cours',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Montante_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Palier" DROP CONSTRAINT "Palier_pkey",
DROP COLUMN "bookmakerId",
DROP COLUMN "coteTotale",
DROP COLUMN "cotes",
DROP COLUMN "dateParis",
DROP COLUMN "matchs",
DROP COLUMN "pronostics",
DROP COLUMN "sports",
DROP COLUMN "status",
DROP COLUMN "typePari",
DROP COLUMN "typeParis",
ADD COLUMN     "cote" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dateResultat" TIMESTAMP(3),
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "numero" INTEGER NOT NULL,
ADD COLUMN     "statut" TEXT NOT NULL DEFAULT 'en_attente',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "montanteId",
ADD COLUMN     "montanteId" INTEGER NOT NULL,
ADD CONSTRAINT "Palier_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "reference",
DROP COLUMN "solde",
ADD COLUMN     "montanteId" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Montante" ADD CONSTRAINT "Montante_bookmakerId_fkey" FOREIGN KEY ("bookmakerId") REFERENCES "Bookmaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palier" ADD CONSTRAINT "Palier_montanteId_fkey" FOREIGN KEY ("montanteId") REFERENCES "Montante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_montanteId_fkey" FOREIGN KEY ("montanteId") REFERENCES "Montante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
