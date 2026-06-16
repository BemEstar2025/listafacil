import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";
import { listaPertenceAEscola } from "@/lib/ownership";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("escola");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const lista = await listaPertenceAEscola(id, sessao.sub);
  if (!lista) return NextResponse.json({ erro: "Lista não encontrada" }, { status: 404 });

  const fullLista = await prisma.lista.findUnique({ where: { id } });
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/lista/${fullLista!.linkUnico}`;
  const dataUrl = await QRCode.toDataURL(url, { width: 300 });

  return NextResponse.json({ url, qrCodeDataUrl: dataUrl });
}
