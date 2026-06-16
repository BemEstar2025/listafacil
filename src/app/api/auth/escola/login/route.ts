import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { compararSenha, gerarToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/session";

const schema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  const escola = await prisma.escola.findUnique({ where: { email: parsed.data.email } });
  if (!escola || !(await compararSenha(parsed.data.senha, escola.senhaHash))) {
    return NextResponse.json({ erro: "E-mail ou senha incorretos" }, { status: 401 });
  }

  const token = gerarToken({ sub: escola.id, tipo: "escola" });
  const response = NextResponse.json({ id: escola.id, nome: escola.nome, email: escola.email });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
