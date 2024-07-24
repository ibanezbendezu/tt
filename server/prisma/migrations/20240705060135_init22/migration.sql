/*
  Warnings:

  - You are about to drop the column `clusterId` on the `Comparison` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ClusterToComparison" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ClusterToComparison_A_fkey" FOREIGN KEY ("A") REFERENCES "Cluster" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClusterToComparison_B_fkey" FOREIGN KEY ("B") REFERENCES "Comparison" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comparison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sha" TEXT NOT NULL,
    "similarity" REAL NOT NULL,
    "comparisonDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Comparison" ("comparisonDate", "id", "sha", "similarity") SELECT "comparisonDate", "id", "sha", "similarity" FROM "Comparison";
DROP TABLE "Comparison";
ALTER TABLE "new_Comparison" RENAME TO "Comparison";
CREATE UNIQUE INDEX "Comparison_sha_key" ON "Comparison"("sha");
PRAGMA foreign_key_check("Comparison");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ClusterToComparison_AB_unique" ON "_ClusterToComparison"("A", "B");

-- CreateIndex
CREATE INDEX "_ClusterToComparison_B_index" ON "_ClusterToComparison"("B");
