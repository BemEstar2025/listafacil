import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";

const schema = z.object({
  ano: z.number().int(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: turmaId } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("escola");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const turma = await prisma.turma.findFirst({ where: { id: turmaId, escolaId: sessao.sub } });
  if (!turma) return NextResponse.json({ erro: "Turma não encontrada" }, { status: 404 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const lista = await prisma.lista.create({
    data: { turmaId, ano: parsed.data.ano },
  });
  return NextResponse.json(lista, { status: 201 });
}
