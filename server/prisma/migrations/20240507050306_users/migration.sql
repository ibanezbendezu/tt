/*
  Warnings:

  - You are about to drop the column `owner` on the `Repository` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Repository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Repository_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Repository" ("githubId", "id", "name") SELECT "githubId", "id", "name" FROM "Repository";
DROP TABLE "Repository";
ALTER TABLE "new_Repository" RENAME TO "Repository";
CREATE UNIQUE INDEX "Repository_githubId_key" ON "Repository"("githubId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
