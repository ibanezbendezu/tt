/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Repository` table. All the data in the column will be lost.
  - Added the required column `owner` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Repository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Repository" ("githubId", "id", "name") SELECT "githubId", "id", "name" FROM "Repository";
DROP TABLE "Repository";
ALTER TABLE "new_Repository" RENAME TO "Repository";
CREATE UNIQUE INDEX "Repository_githubId_key" ON "Repository"("githubId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT
);
INSERT INTO "new_User" ("email", "githubId", "id", "name") SELECT "email", "githubId", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
