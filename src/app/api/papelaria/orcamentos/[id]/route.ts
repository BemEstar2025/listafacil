import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";

const schema = z.object({
  status: z.enum(["NOVO", "VISUALIZADO", "EM_SEPARACAO", "PRONTO", "ENTREGUE"]).optional(),
  prazo: z.string().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("papelaria");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const orcamento = await prisma.orcamento.findFirst({ where: { id, papelariaId: sessao.sub } });
  if (!orcamento) return NextResponse.json({ erro: "Orçamento não encontrado" }, { status: 404 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const atualizado = await prisma.orcamento.update({ where: { id }, data: parsed.data });
  return NextResponse.json(atualizado);
}
