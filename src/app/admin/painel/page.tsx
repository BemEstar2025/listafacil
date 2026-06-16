import { prisma } from "@/lib/prisma";
import SelecionarOficial from "./SelecionarOficial";
import Topbar from "../../Topbar";
import LogoutButton from "../../LogoutButton";
import { Table, Th, Td, Tr } from "../../Table";

export const dynamic = "force-dynamic";

export default async function AdminPainelPage() {
  const listas = await prisma.lista.findMany({
    include: {
      turma: { include: { escola: true } },
      papelariaOficial: true,
    },
    orderBy: { criadoEm: "desc" },
  });

  const papelarias = await prisma.papelaria.findMany({
    select: { id: true, nomeFantasia: true, cep: true },
    orderBy: { nomeFantasia: "asc" },
  });

  return (
    <>
      <Topbar
        titulo="Painel Admin"
        subtitulo="Defina a papelaria parceira oficial de cada lista"
        acoes={<LogoutButton endpoint="/api/admin/logout" redirectTo="/admin/login" />}
      />
      <main className="mx-auto max-w-4xl px-8 pb-8">
        {listas.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma lista cadastrada ainda.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Escola / Turma</Th>
                <Th>Ano</Th>
                <Th>Parceira oficial</Th>
              </tr>
            </thead>
            <tbody>
              {listas.map((lista) => (
                <Tr key={lista.id}>
                  <Td className="font-medium text-[var(--foreground)]">
                    {lista.turma.escola.nome} — {lista.turma.nome}
                  </Td>
                  <Td>{lista.ano}</Td>
                  <Td>
                    <SelecionarOficial
                      listaId={lista.id}
                      papelarias={papelarias}
                      papelariaAtualId={lista.papelariaOficialId}
                    />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </main>
    </>
  );
}
