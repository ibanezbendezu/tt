/*
  Warnings:

  - You are about to drop the column `leftFileId` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `rightFileId` on the `Pair` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "similarity" REAL NOT NULL,
    "leftFilepath" TEXT NOT NULL,
    "leftFileSha" TEXT NOT NULL,
    "charCountLeft" INTEGER NOT NULL,
    "lineCountLeft" INTEGER NOT NULL,
    "rightFilepath" TEXT NOT NULL,
    "rightFileSha" TEXT NOT NULL,
    "charCountRight" INTEGER NOT NULL,
    "lineCountRight" INTEGER NOT NULL,
    "comparisonId" INTEGER NOT NULL,
    CONSTRAINT "Pair_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pair" ("charCountLeft", "charCountRight", "comparisonId", "id", "leftFileSha", "leftFilepath", "lineCountLeft", "lineCountRight", "rightFileSha", "rightFilepath", "similarity") SELECT "charCountLeft", "charCountRight", "comparisonId", "id", "leftFileSha", "leftFilepath", "lineCountLeft", "lineCountRight", "rightFileSha", "rightFilepath", "similarity" FROM "Pair";
DROP TABLE "Pair";
ALTER TABLE "new_Pair" RENAME TO "Pair";
PRAGMA foreign_key_check("Pair");
PRAGMA foreign_keys=ON;
