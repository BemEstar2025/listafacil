import { prisma } from "@/lib/prisma";
import SelecionarOficial from "./SelecionarOficial";
import LogoutButton from "./LogoutButton";

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
    <main className="mx-auto max-w-4xl p-8">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🔐 Painel Admin</h1>
          <p className="mt-1 text-sm text-violet-100">
            Defina a papelaria parceira oficial de cada lista
          </p>
        </div>
        <LogoutButton />
      </div>

      {listas.length === 0 && <p className="text-sm text-gray-500">Nenhuma lista cadastrada ainda.</p>}

      <ul className="flex flex-col gap-3">
        {listas.map((lista) => (
          <li key={lista.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">
                {lista.turma.escola.nome} — {lista.turma.nome} ({lista.ano})
              </p>
              <p className="text-xs text-gray-400">
                {lista.papelariaOficial ? `Parceira atual: ${lista.papelariaOficial.nomeFantasia}` : "Sem parceira oficial"}
              </p>
            </div>
            <SelecionarOficial
              listaId={lista.id}
              papelarias={papelarias}
              papelariaAtualId={lista.papelariaOficialId}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
