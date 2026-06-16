import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashSenha, gerarToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/session";

const schema = z.object({
  nomeFantasia: z.string().min(2),
  razaoSocial: z.string().min(2),
  cnpj: z.string().min(14),
  endereco: z.string().min(5),
  cep: z.string().min(8),
  whatsapp: z.string().min(8),
  telefone: z.string().optional(),
  horario: z.string().optional(),
  raioKm: z.number().positive().default(5),
  entregaDomicilio: z.boolean().default(false),
  retiradaLocal: z.boolean().default(true),
  email: z.string().email(),
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

  const existente = await prisma.papelaria.findFirst({
    where: { OR: [{ email: dados.email }, { cnpj: dados.cnpj }] },
  });
  if (existente) {
    return NextResponse.json({ erro: "E-mail ou CNPJ já cadastrado" }, { status: 409 });
  }

  const papelaria = await prisma.papelaria.create({
    data: { ...dados, senhaHash: await hashSenha(senha) },
  });

  const token = gerarToken({ sub: papelaria.id, tipo: "papelaria" });
  const response = NextResponse.json({
    id: papelaria.id,
    nomeFantasia: papelaria.nomeFantasia,
    email: papelaria.email,
  });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
