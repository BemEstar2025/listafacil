import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;

export type TokenPayload = {
  sub: string;
  tipo: "escola" | "papelaria";
};

export function hashSenha(senha: string) {
  return bcrypt.hash(senha, 10);
}

export function compararSenha(senha: string, hash: string) {
  return bcrypt.compare(senha, hash);
}

export function gerarToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verificarToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
