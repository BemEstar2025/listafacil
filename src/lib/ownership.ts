import { prisma } from "@/lib/prisma";

export async function listaPertenceAEscola(listaId: string, escolaId: string) {
  const lista = await prisma.lista.findFirst({
    where: { id: listaId, turma: { escolaId } },
  });
  return lista;
}
