import { NextResponse } from "next/server";
import { getSessao } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessao = await getSessao();
  if (!sessao) {
    return NextResponse.json({ autenticado: false }, { status: 200 });
  }

  if (sessao.tipo === "escola") {
    const escola = await prisma.escola.findUnique({ where: { id: sessao.sub } });
    if (!escola) return NextResponse.json({ autenticado: false });
    return NextResponse.json({
      autenticado: true,
      tipo: "escola",
      usuario: { id: escola.id, nome: escola.nome, email: escola.email },
    });
  }

  const papelaria = await prisma.papelaria.findUnique({ where: { id: sessao.sub } });
  if (!papelaria) return NextResponse.json({ autenticado: false });
  return NextResponse.json({
    autenticado: true,
    tipo: "papelaria",
    usuario: { id: papelaria.id, nome: papelaria.nomeFantasia, email: papelaria.email },
  });
}
