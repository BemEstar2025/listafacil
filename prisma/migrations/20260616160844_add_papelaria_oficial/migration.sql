-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_listas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "turmaId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVA',
    "linkUnico" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "papelariaOficialId" TEXT,
    CONSTRAINT "listas_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "listas_papelariaOficialId_fkey" FOREIGN KEY ("papelariaOficialId") REFERENCES "papelarias" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_listas" ("ano", "criadoEm", "id", "linkUnico", "status", "turmaId") SELECT "ano", "criadoEm", "id", "linkUnico", "status", "turmaId" FROM "listas";
DROP TABLE "listas";
ALTER TABLE "new_listas" RENAME TO "listas";
CREATE UNIQUE INDEX "listas_linkUnico_key" ON "listas"("linkUnico");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
