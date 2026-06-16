import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "listafacil_admin";

export function autenticarAdmin(request: NextRequest) {
  const doHeader = request.headers.get("x-admin-secret");
  const doCookie = request.cookies.get(ADMIN_COOKIE)?.value;
  const senha = doHeader || doCookie;
  return Boolean(senha) && senha === process.env.ADMIN_SECRET;
}
