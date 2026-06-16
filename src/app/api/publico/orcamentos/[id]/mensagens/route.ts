import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  texto: z.string().min(1).max(1000),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const mensagens = await prisma.mensagemOrcamento.findMany({
    where: { orcamentoId: id },
    orderBy: { criadoEm: "asc" },
  });
  return NextResponse.json(mensagens);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const orcamento = await prisma.orcamento.findUnique({ where: { id } });
  if (!orcamento) return NextResponse.json({ erro: "Orçamento não encontrado" }, { status: 404 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Mensagem inválida" }, { status: 400 });
  }

  const mensagem = await prisma.mensagemOrcamento.create({
    data: { orcamentoId: id, autor: "PAI", texto: parsed.data.texto },
  });
  return NextResponse.json(mensagem, { status: 201 });
}
