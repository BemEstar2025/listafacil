-- CreateEnum
CREATE TYPE "StatusLista" AS ENUM ('ATIVA', 'ARQUIVADA');

-- CreateEnum
CREATE TYPE "CategoriaItem" AS ENUM ('PAPELARIA', 'HIGIENE', 'UNIFORME', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusOrcamento" AS ENUM ('NOVO', 'VISUALIZADO', 'EM_SEPARACAO', 'PRONTO', 'ENTREGUE');

-- CreateEnum
CREATE TYPE "Periodo" AS ENUM ('MANHA', 'TARDE', 'INTEGRAL');

-- CreateEnum
CREATE TYPE "AutorMensagem" AS ENUM ('PAI', 'PAPELARIA');

-- CreateTable
CREATE TABLE "escolas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logoUrl" TEXT,
    "responsavelNome" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "escolas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turmas" (
    "id" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "anoLetivo" INTEGER NOT NULL,
    "periodo" "Periodo" NOT NULL,
    "qtdAlunos" INTEGER NOT NULL,
    "professor" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listas" (
    "id" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "status" "StatusLista" NOT NULL DEFAULT 'ATIVA',
    "linkUnico" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "papelariaOficialId" TEXT,

    CONSTRAINT "listas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_lista" (
    "id" TEXT NOT NULL,
    "listaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "especificacao" TEXT,
    "observacao" TEXT,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT true,
    "categoria" "CategoriaItem" NOT NULL DEFAULT 'PAPELARIA',

    CONSTRAINT "itens_lista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "papelarias" (
    "id" TEXT NOT NULL,
    "nomeFantasia" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "whatsapp" TEXT NOT NULL,
    "telefone" TEXT,
    "horario" TEXT,
    "raioKm" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "logoUrl" TEXT,
    "fotos" TEXT,
    "entregaDomicilio" BOOLEAN NOT NULL DEFAULT false,
    "retiradaLocal" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "destacadaAte" TIMESTAMP(3),

    CONSTRAINT "papelarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "papelariaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sku" TEXT,
    "categoria" TEXT NOT NULL,
    "marca" TEXT,
    "especificacao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "fotoUrl" TEXT,
    "tags" TEXT,
    "esgotado" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orcamentos" (
    "id" TEXT NOT NULL,
    "listaId" TEXT NOT NULL,
    "papelariaId" TEXT NOT NULL,
    "responsavelNome" TEXT NOT NULL,
    "responsavelTelefone" TEXT NOT NULL,
    "nomeAluno" TEXT,
    "status" "StatusOrcamento" NOT NULL DEFAULT 'NOVO',
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prazo" TEXT,
    "validadeHoras" INTEGER NOT NULL DEFAULT 48,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orcamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens_orcamento" (
    "id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "autor" "AutorMensagem" NOT NULL,
    "texto" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagens_orcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_orcamento" (
    "id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "itemListaId" TEXT NOT NULL,
    "produtoId" TEXT,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "itens_orcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "papelariaId" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "escolas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listas" ADD CONSTRAINT "listas_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listas" ADD CONSTRAINT "listas_papelariaOficialId_fkey" FOREIGN KEY ("papelariaOficialId") REFERENCES "papelarias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_lista" ADD CONSTRAINT "itens_lista_listaId_fkey" FOREIGN KEY ("listaId") REFERENCES "listas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_papelariaId_fkey" FOREIGN KEY ("papelariaId") REFERENCES "papelarias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_listaId_fkey" FOREIGN KEY ("listaId") REFERENCES "listas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_papelariaId_fkey" FOREIGN KEY ("papelariaId") REFERENCES "papelarias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens_orcamento" ADD CONSTRAINT "mensagens_orcamento_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_orcamento" ADD CONSTRAINT "itens_orcamento_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_orcamento" ADD CONSTRAINT "itens_orcamento_itemListaId_fkey" FOREIGN KEY ("itemListaId") REFERENCES "itens_lista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_orcamento" ADD CONSTRAINT "itens_orcamento_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_papelariaId_fkey" FOREIGN KEY ("papelariaId") REFERENCES "papelarias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
