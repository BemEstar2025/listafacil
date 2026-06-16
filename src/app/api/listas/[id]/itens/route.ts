import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";
import { listaPertenceAEscola } from "@/lib/ownership";

const schema = z.object({
  nome: z.string().min(2),
  quantidade: z.number().int().positive(),
  especificacao: z.string().optional(),
  observacao: z.string().optional(),
  obrigatorio: z.boolean().default(true),
  categoria: z.enum(["PAPELARIA", "HIGIENE", "UNIFORME", "OUTRO"]).default("PAPELARIA"),
});

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

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.itemLista.create({ data: { ...parsed.data, listaId } });
  return NextResponse.json(item, { status: 201 });
}
