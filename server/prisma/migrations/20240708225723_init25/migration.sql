/*
  Warnings:

  - Added the required column `leftFileId` to the `Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leftFileSha` to the `Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rightFileId` to the `Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rightFileSha` to the `Pair` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "similarity" REAL NOT NULL,
    "leftFilepath" TEXT NOT NULL,
    "leftFileId" INTEGER NOT NULL,
    "leftFileSha" TEXT NOT NULL,
    "charCountLeft" INTEGER NOT NULL,
    "lineCountLeft" INTEGER NOT NULL,
    "rightFilepath" TEXT NOT NULL,
    "rightFileId" INTEGER NOT NULL,
    "rightFileSha" TEXT NOT NULL,
    "charCountRight" INTEGER NOT NULL,
    "lineCountRight" INTEGER NOT NULL,
    "comparisonId" INTEGER NOT NULL,
    CONSTRAINT "Pair_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pair" ("charCountLeft", "charCountRight", "comparisonId", "id", "leftFilepath", "lineCountLeft", "lineCountRight", "rightFilepath", "similarity") SELECT "charCountLeft", "charCountRight", "comparisonId", "id", "leftFilepath", "lineCountLeft", "lineCountRight", "rightFilepath", "similarity" FROM "Pair";
DROP TABLE "Pair";
ALTER TABLE "new_Pair" RENAME TO "Pair";
PRAGMA foreign_key_check("Pair");
PRAGMA foreign_keys=ON;
