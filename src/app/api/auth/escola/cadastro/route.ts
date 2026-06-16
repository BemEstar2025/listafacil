import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashSenha, gerarToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/session";

const schema = z.object({
  nome: z.string().min(2),
  cnpj: z.string().min(14),
  endereco: z.string().min(5),
  telefone: z.string().min(8),
  email: z.string().email(),
  responsavelNome: z.string().min(2),
  senha: z.string().min(6),
  logoUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const { senha, ...dados } = parsed.data;

  const existente = await prisma.escola.findFirst({
    where: { OR: [{ email: dados.email }, { cnpj: dados.cnpj }] },
  });
  if (existente) {
    return NextResponse.json({ erro: "E-mail ou CNPJ já cadastrado" }, { status: 409 });
  }

  const escola = await prisma.escola.create({
    data: { ...dados, senhaHash: await hashSenha(senha) },
  });

  const token = gerarToken({ sub: escola.id, tipo: "escola" });
  const response = NextResponse.json({
    id: escola.id,
    nome: escola.nome,
    email: escola.email,
  });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
