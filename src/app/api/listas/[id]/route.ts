import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";
import { listaPertenceAEscola } from "@/lib/ownership";

const schema = z.object({
  status: z.enum(["ATIVA", "ARQUIVADA"]),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("escola");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const lista = await listaPertenceAEscola(id, sessao.sub);
  if (!lista) return NextResponse.json({ erro: "Lista não encontrada" }, { status: 404 });

  const completa = await prisma.lista.findUnique({
    where: { id },
    include: { itens: true, turma: true },
  });
  return NextResponse.json(completa);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("escola");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const lista = await listaPertenceAEscola(id, sessao.sub);
  if (!lista) return NextResponse.json({ erro: "Lista não encontrada" }, { status: 404 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const atualizada = await prisma.lista.update({ where: { id }, data: parsed.data });
  return NextResponse.json(atualizada);
}
