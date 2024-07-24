/*
  Warnings:

  - Added the required column `numberOfRepos` to the `Cluster` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cluster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clusterDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numberOfRepos" INTEGER NOT NULL
);
INSERT INTO "new_Cluster" ("clusterDate", "id") SELECT "clusterDate", "id" FROM "Cluster";
DROP TABLE "Cluster";
ALTER TABLE "new_Cluster" RENAME TO "Cluster";
PRAGMA foreign_key_check("Cluster");
PRAGMA foreign_keys=ON;
