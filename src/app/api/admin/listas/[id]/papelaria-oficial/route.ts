import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { autenticarAdmin } from "@/lib/admin";

const schema = z.object({
  papelariaId: z.string().nullable(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!autenticarAdmin(request)) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  const lista = await prisma.lista.findUnique({ where: { id } });
  if (!lista) return NextResponse.json({ erro: "Lista não encontrada" }, { status: 404 });

  if (parsed.data.papelariaId) {
    const papelaria = await prisma.papelaria.findUnique({ where: { id: parsed.data.papelariaId } });
    if (!papelaria) return NextResponse.json({ erro: "Papelaria não encontrada" }, { status: 404 });
  }

  const atualizada = await prisma.lista.update({
    where: { id },
    data: { papelariaOficialId: parsed.data.papelariaId },
    include: { papelariaOficial: true },
  });

  return NextResponse.json(atualizada);
}
