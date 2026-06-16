import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";

const schema = z.object({
  nome: z.string().min(2),
  sku: z.string().optional(),
  categoria: z.string().min(2),
  marca: z.string().optional(),
  especificacao: z.string().optional(),
  preco: z.number().positive(),
  estoque: z.number().int().nonnegative().default(0),
  fotoUrl: z.string().optional(),
  tags: z.string().optional(),
});

export async function GET() {
  let sessao;
  try {
    sessao = await exigirSessao("papelaria");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const produtos = await prisma.produto.findMany({
    where: { papelariaId: sessao.sub },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(produtos);
}

export async function POST(request: NextRequest) {
  let sessao;
  try {
    sessao = await exigirSessao("papelaria");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const produto = await prisma.produto.create({
    data: { ...parsed.data, papelariaId: sessao.sub },
  });
  return NextResponse.json(produto, { status: 201 });
}
