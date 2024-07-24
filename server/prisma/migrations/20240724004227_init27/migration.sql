/*
  Warnings:

  - Added the required column `sha` to the `Cluster` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cluster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sha" TEXT NOT NULL,
    "clusterDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numberOfRepos" INTEGER NOT NULL
);
INSERT INTO "new_Cluster" ("clusterDate", "id", "numberOfRepos") SELECT "clusterDate", "id", "numberOfRepos" FROM "Cluster";
DROP TABLE "Cluster";
ALTER TABLE "new_Cluster" RENAME TO "Cluster";
CREATE UNIQUE INDEX "Cluster_sha_key" ON "Cluster"("sha");
PRAGMA foreign_key_check("Cluster");
PRAGMA foreign_keys=ON;
