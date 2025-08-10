-- CreateTable
CREATE TABLE "Bookmaker" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "url" TEXT,
    "bonus" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookmaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Montante" (
    "id" TEXT NOT NULL,
    "miseInitiale" DOUBLE PRECISION NOT NULL,
    "objectif" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EN_COURS',
    "miseActuelle" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gainFinal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Montante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Palier" (
    "id" TEXT NOT NULL,
    "montanteId" TEXT NOT NULL,
    "typePari" TEXT NOT NULL,
    "sports" TEXT[],
    "matchs" TEXT[],
    "typeParis" TEXT[],
    "pronostics" TEXT[],
    "cotes" DOUBLE PRECISION[],
    "dateParis" TIMESTAMP(3)[],
    "coteTotale" DOUBLE PRECISION NOT NULL,
    "bookmakerId" TEXT,
    "mise" DOUBLE PRECISION NOT NULL,
    "gainPotentiel" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Palier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "solde" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmaker_nom_key" ON "Bookmaker"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmaker_code_key" ON "Bookmaker"("code");

-- AddForeignKey
ALTER TABLE "Palier" ADD CONSTRAINT "Palier_montanteId_fkey" FOREIGN KEY ("montanteId") REFERENCES "Montante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palier" ADD CONSTRAINT "Palier_bookmakerId_fkey" FOREIGN KEY ("bookmakerId") REFERENCES "Bookmaker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
