import { cookies } from "next/headers";
import { verificarToken, type TokenPayload } from "@/lib/auth";

export const COOKIE_NAME = "listafacil_token";

export async function getSessao(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verificarToken(token);
}

export async function exigirSessao(tipo: TokenPayload["tipo"]): Promise<TokenPayload> {
  const sessao = await getSessao();
  if (!sessao || sessao.tipo !== tipo) {
    throw new Error("UNAUTHORIZED");
  }
  return sessao;
}
