import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";
import { listaPertenceAEscola } from "@/lib/ownership";

type Linha = {
  Nome?: string;
  Quantidade?: number;
  Especificacao?: string;
  Especificação?: string;
  Observacao?: string;
  Observação?: string;
  Obrigatorio?: string | boolean;
  Obrigatório?: string | boolean;
  Categoria?: string;
};

const CATEGORIAS_VALIDAS = ["PAPELARIA", "HIGIENE", "UNIFORME", "OUTRO"];

function normalizarCategoria(valor?: string): "PAPELARIA" | "HIGIENE" | "UNIFORME" | "OUTRO" {
  const v = (valor ?? "").trim().toUpperCase();
  return (CATEGORIAS_VALIDAS.includes(v) ? v : "PAPELARIA") as "PAPELARIA" | "HIGIENE" | "UNIFORME" | "OUTRO";
}

function normalizarObrigatorio(valor?: string | boolean): boolean {
  if (typeof valor === "boolean") return valor;
  if (!valor) return true;
  const v = valor.toString().trim().toLowerCase();
  return !["nao", "não", "n", "false", "0", "opcional"].includes(v);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: listaId } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("escola");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const lista = await listaPertenceAEscola(listaId, sessao.sub);
  if (!lista) return NextResponse.json({ erro: "Lista não encontrada" }, { status: 404 });

  const formData = await request.formData();
  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File)) {
    return NextResponse.json({ erro: "Arquivo não enviado" }, { status: 400 });
  }

  const buffer = await arquivo.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const linhas: Linha[] = XLSX.utils.sheet_to_json(sheet);

  const itensValidos = linhas
    .map((linha) => ({
      nome: linha.Nome?.toString().trim(),
      quantidade: Number(linha.Quantidade ?? 1),
      especificacao: linha.Especificacao ?? linha.Especificação,
      observacao: linha.Observacao ?? linha.Observação,
      obrigatorio: normalizarObrigatorio(linha.Obrigatorio ?? linha.Obrigatório),
      categoria: normalizarCategoria(linha.Categoria),
    }))
    .filter((item) => item.nome && !Number.isNaN(item.quantidade));

  if (itensValidos.length === 0) {
    return NextResponse.json(
      {
        erro:
          "Nenhum item válido encontrado. Use as colunas: Nome | Quantidade | Especificação | Observação | Obrigatorio | Categoria",
      },
      { status: 400 }
    );
  }

  await prisma.itemLista.createMany({
    data: itensValidos.map((item) => ({
      listaId,
      nome: item.nome!,
      quantidade: item.quantidade,
      especificacao: item.especificacao,
      observacao: item.observacao,
      obrigatorio: item.obrigatorio,
      categoria: item.categoria,
    })),
  });

  return NextResponse.json({ importados: itensValidos.length });
}
