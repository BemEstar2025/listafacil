import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";

type Linha = {
  Nome?: string;
  Categoria?: string;
  Marca?: string;
  Especificacao?: string;
  Especificação?: string;
  Preco?: number;
  Preço?: number;
  Estoque?: number;
};

export async function POST(request: NextRequest) {
  let sessao;
  try {
    sessao = await exigirSessao("papelaria");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File)) {
    return NextResponse.json({ erro: "Arquivo não enviado" }, { status: 400 });
  }

  const buffer = await arquivo.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const linhas: Linha[] = XLSX.utils.sheet_to_json(sheet);

  const produtosValidos = linhas
    .map((linha) => ({
      nome: linha.Nome,
      categoria: linha.Categoria,
      marca: linha.Marca,
      especificacao: linha.Especificacao ?? linha.Especificação,
      preco: Number(linha.Preco ?? linha.Preço),
      estoque: Number(linha.Estoque ?? 0),
    }))
    .filter((p) => p.nome && p.categoria && !Number.isNaN(p.preco));

  if (produtosValidos.length === 0) {
    return NextResponse.json(
      { erro: "Nenhum produto válido encontrado. Use as colunas: Nome | Categoria | Marca | Especificação | Preço | Estoque" },
      { status: 400 }
    );
  }

  await prisma.produto.createMany({
    data: produtosValidos.map((p) => ({
      papelariaId: sessao.sub,
      nome: p.nome!,
      categoria: p.categoria!,
      marca: p.marca,
      especificacao: p.especificacao,
      preco: p.preco,
      estoque: p.estoque,
    })),
  });

  return NextResponse.json({ importados: produtosValidos.length });
}
