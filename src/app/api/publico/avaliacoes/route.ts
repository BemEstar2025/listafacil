import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  orcamentoId: z.string(),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const orcamento = await prisma.orcamento.findUnique({ where: { id: parsed.data.orcamentoId } });
  if (!orcamento) return NextResponse.json({ erro: "Orçamento não encontrado" }, { status: 404 });

  const existente = await prisma.avaliacao.findUnique({ where: { orcamentoId: orcamento.id } });
  if (existente) return NextResponse.json({ erro: "Este orçamento já foi avaliado" }, { status: 409 });

  const avaliacao = await prisma.avaliacao.create({
    data: {
      papelariaId: orcamento.papelariaId,
      orcamentoId: orcamento.id,
      nota: parsed.data.nota,
      comentario: parsed.data.comentario,
    },
  });

  return NextResponse.json(avaliacao, { status: 201 });
}
