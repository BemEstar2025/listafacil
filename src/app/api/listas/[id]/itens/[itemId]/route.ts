import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";
import { listaPertenceAEscola } from "@/lib/ownership";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id: listaId, itemId } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("escola");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const lista = await listaPertenceAEscola(listaId, sessao.sub);
  if (!lista) return NextResponse.json({ erro: "Lista não encontrada" }, { status: 404 });

  await prisma.itemLista.delete({ where: { id: itemId } });
  return NextResponse.json({ ok: true });
}
