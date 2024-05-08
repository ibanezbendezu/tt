/*
  Warnings:

  - Added the required column `githubId` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Repository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Repository" ("id", "name", "owner") SELECT "id", "name", "owner" FROM "Repository";
DROP TABLE "Repository";
ALTER TABLE "new_Repository" RENAME TO "Repository";
CREATE UNIQUE INDEX "Repository_githubId_key" ON "Repository"("githubId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
