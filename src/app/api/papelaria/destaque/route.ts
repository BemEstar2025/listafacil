import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";

const DIAS_DESTAQUE = 30;

export async function POST() {
  let sessao;
  try {
    sessao = await exigirSessao("papelaria");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const papelaria = await prisma.papelaria.findUnique({ where: { id: sessao.sub } });
  if (!papelaria) return NextResponse.json({ erro: "Papelaria não encontrada" }, { status: 404 });

  const baseAtual =
    papelaria.destacadaAte && papelaria.destacadaAte > new Date() ? papelaria.destacadaAte : new Date();
  const destacadaAte = new Date(baseAtual.getTime() + DIAS_DESTAQUE * 24 * 60 * 60 * 1000);

  const atualizada = await prisma.papelaria.update({
    where: { id: sessao.sub },
    data: { destacadaAte },
  });

  return NextResponse.json({ destacadaAte: atualizada.destacadaAte });
}
