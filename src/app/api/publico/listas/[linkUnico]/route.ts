import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ linkUnico: string }> }) {
  const { linkUnico } = await params;

  const lista = await prisma.lista.findUnique({
    where: { linkUnico },
    include: {
      itens: true,
      turma: { include: { escola: true } },
    },
  });

  if (!lista) return NextResponse.json({ erro: "Lista não encontrada" }, { status: 404 });

  return NextResponse.json({
    id: lista.id,
    ano: lista.ano,
    status: lista.status,
    itens: lista.itens,
    turma: { nome: lista.turma.nome, periodo: lista.turma.periodo },
    escola: { nome: lista.turma.escola.nome, logoUrl: lista.turma.escola.logoUrl },
  });
}
