import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("escola");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const turma = await prisma.turma.findFirst({
    where: { id, escolaId: sessao.sub },
    include: { listas: { include: { itens: true } } },
  });
  if (!turma) return NextResponse.json({ erro: "Turma não encontrada" }, { status: 404 });
  return NextResponse.json(turma);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("escola");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const turma = await prisma.turma.findFirst({ where: { id, escolaId: sessao.sub } });
  if (!turma) return NextResponse.json({ erro: "Turma não encontrada" }, { status: 404 });

  await prisma.turma.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
