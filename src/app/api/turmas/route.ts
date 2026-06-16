import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";

const schema = z.object({
  nome: z.string().min(2),
  anoLetivo: z.number().int(),
  periodo: z.enum(["MANHA", "TARDE", "INTEGRAL"]),
  qtdAlunos: z.number().int().nonnegative(),
  professor: z.string().min(2),
});

export async function GET() {
  const sessao = await exigirSessaoOuErro();
  if (sessao instanceof NextResponse) return sessao;

  const turmas = await prisma.turma.findMany({
    where: { escolaId: sessao.sub },
    include: { listas: true },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(turmas);
}

export async function POST(request: NextRequest) {
  const sessao = await exigirSessaoOuErro();
  if (sessao instanceof NextResponse) return sessao;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const turma = await prisma.turma.create({
    data: {
      ...parsed.data,
      escolaId: sessao.sub,
      listas: { create: { ano: parsed.data.anoLetivo } },
    },
    include: { listas: true },
  });
  return NextResponse.json(turma, { status: 201 });
}

async function exigirSessaoOuErro() {
  try {
    return await exigirSessao("escola");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }
}
