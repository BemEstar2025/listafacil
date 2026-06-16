-- CreateTable
CREATE TABLE "escolas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logoUrl" TEXT,
    "responsavelNome" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "turmas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "escolaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "anoLetivo" INTEGER NOT NULL,
    "periodo" TEXT NOT NULL,
    "qtdAlunos" INTEGER NOT NULL,
    "professor" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "turmas_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "escolas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "listas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "turmaId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVA',
    "linkUnico" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "listas_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "itens_lista" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "especificacao" TEXT,
    "observacao" TEXT,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT true,
    "categoria" TEXT NOT NULL DEFAULT 'PAPELARIA',
    CONSTRAINT "itens_lista_listaId_fkey" FOREIGN KEY ("listaId") REFERENCES "listas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "papelarias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeFantasia" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "whatsapp" TEXT NOT NULL,
    "telefone" TEXT,
    "horario" TEXT,
    "raioKm" REAL NOT NULL DEFAULT 5,
    "logoUrl" TEXT,
    "fotos" TEXT,
    "entregaDomicilio" BOOLEAN NOT NULL DEFAULT false,
    "retiradaLocal" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "papelariaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sku" TEXT,
    "categoria" TEXT NOT NULL,
    "marca" TEXT,
    "especificacao" TEXT,
    "preco" REAL NOT NULL,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "fotoUrl" TEXT,
    "tags" TEXT,
    "esgotado" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "produtos_papelariaId_fkey" FOREIGN KEY ("papelariaId") REFERENCES "papelarias" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orcamentos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listaId" TEXT NOT NULL,
    "papelariaId" TEXT NOT NULL,
    "responsavelNome" TEXT NOT NULL,
    "responsavelTelefone" TEXT NOT NULL,
    "nomeAluno" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "total" REAL NOT NULL DEFAULT 0,
    "prazo" TEXT,
    "validadeHoras" INTEGER NOT NULL DEFAULT 48,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orcamentos_listaId_fkey" FOREIGN KEY ("listaId") REFERENCES "listas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "orcamentos_papelariaId_fkey" FOREIGN KEY ("papelariaId") REFERENCES "papelarias" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "itens_orcamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orcamentoId" TEXT NOT NULL,
    "itemListaId" TEXT NOT NULL,
    "produtoId" TEXT,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" REAL NOT NULL,
    CONSTRAINT "itens_orcamento_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "itens_orcamento_itemListaId_fkey" FOREIGN KEY ("itemListaId") REFERENCES "itens_lista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "itens_orcamento_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "papelariaId" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "avaliacoes_papelariaId_fkey" FOREIGN KEY ("papelariaId") REFERENCES "papelarias" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "avaliacoes_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "escolas_cnpj_key" ON "escolas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "escolas_email_key" ON "escolas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "listas_linkUnico_key" ON "listas"("linkUnico");

-- CreateIndex
CREATE UNIQUE INDEX "papelarias_cnpj_key" ON "papelarias"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "papelarias_email_key" ON "papelarias"("email");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_orcamentoId_key" ON "avaliacoes"("orcamentoId");
