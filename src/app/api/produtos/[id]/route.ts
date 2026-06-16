import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";

const schema = z.object({
  nome: z.string().min(2).optional(),
  preco: z.number().positive().optional(),
  estoque: z.number().int().nonnegative().optional(),
  esgotado: z.boolean().optional(),
  categoria: z.string().min(2).optional(),
  marca: z.string().optional(),
  especificacao: z.string().optional(),
  fotoUrl: z.string().optional(),
  tags: z.string().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("papelaria");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const produto = await prisma.produto.findFirst({ where: { id, papelariaId: sessao.sub } });
  if (!produto) return NextResponse.json({ erro: "Produto não encontrado" }, { status: 404 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const atualizado = await prisma.produto.update({ where: { id }, data: parsed.data });
  return NextResponse.json(atualizado);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("papelaria");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const produto = await prisma.produto.findFirst({ where: { id, papelariaId: sessao.sub } });
  if (!produto) return NextResponse.json({ erro: "Produto não encontrado" }, { status: 404 });

  await prisma.produto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
