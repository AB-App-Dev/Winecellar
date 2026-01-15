-- CreateEnum
CREATE TYPE "WineArt" AS ENUM ('RED', 'WHITE', 'ROSE', 'SPARKLING', 'DESSERT');

-- CreateEnum
CREATE TYPE "WineTaste" AS ENUM ('DRY', 'SEMI_DRY', 'SEMI_SWEET', 'SWEET');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN');

-- CreateTable
CREATE TABLE "Wine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "growerId" TEXT NOT NULL,
    "art" "WineArt" NOT NULL,
    "taste" "WineTaste" NOT NULL,
    "year" INTEGER NOT NULL,
    "barrelType" TEXT,
    "alcoholPercentage" DECIMAL(4,2),
    "amount" TEXT,
    "wineVariety" TEXT,
    "land" TEXT NOT NULL,
    "region" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "bottlesAmount" INTEGER NOT NULL,
    "availableAtYear" INTEGER,
    "imageUrl" TEXT,
    "description" TEXT,
    "hiddenForGuests" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Winery" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "post" TEXT,
    "city" TEXT,
    "land" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Winery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "post" TEXT,
    "city" TEXT,
    "land" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "guestKey" TEXT NOT NULL,
    "wineId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Wine_price_idx" ON "Wine"("price");

-- CreateIndex
CREATE INDEX "Wine_year_idx" ON "Wine"("year");

-- CreateIndex
CREATE INDEX "Wine_art_idx" ON "Wine"("art");

-- CreateIndex
CREATE INDEX "Wine_taste_idx" ON "Wine"("taste");

-- CreateIndex
CREATE INDEX "Wine_land_idx" ON "Wine"("land");

-- CreateIndex
CREATE INDEX "Wine_hiddenForGuests_idx" ON "Wine"("hiddenForGuests");

-- CreateIndex
CREATE INDEX "Wine_growerId_idx" ON "Wine"("growerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Favorite_guestKey_idx" ON "Favorite"("guestKey");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_guestKey_wineId_key" ON "Favorite"("guestKey", "wineId");

-- AddForeignKey
ALTER TABLE "Wine" ADD CONSTRAINT "Wine_growerId_fkey" FOREIGN KEY ("growerId") REFERENCES "Winery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
