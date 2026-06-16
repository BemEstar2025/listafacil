import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ListaPublicaClient from "./ListaPublicaClient";

export default async function ListaPublicaPage({ params }: { params: Promise<{ linkUnico: string }> }) {
  const { linkUnico } = await params;

  const lista = await prisma.lista.findUnique({
    where: { linkUnico },
    include: { itens: true, turma: { include: { escola: true } } },
  });

  if (!lista) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-6">
        <p className="text-sm text-gray-500">{lista.turma.escola.nome}</p>
        <h1 className="text-2xl font-bold">{lista.turma.nome}</h1>
        <p className="text-sm text-gray-500">Lista de material escolar {lista.ano}</p>
      </header>

      <section className="mb-8 rounded-md border border-gray-200 p-4">
        <h2 className="mb-3 text-lg font-semibold">Itens da lista</h2>
        <ul className="flex flex-col gap-2">
          {lista.itens.map((item) => (
            <li key={item.id} className="text-sm">
              <span className="font-medium">
                {item.quantidade}x {item.nome}
              </span>{" "}
              {!item.obrigatorio && <span className="text-xs text-gray-400">(opcional)</span>}
              {item.especificacao && <span className="text-gray-500"> — {item.especificacao}</span>}
              {item.observacao && <p className="text-xs text-gray-400">Obs: {item.observacao}</p>}
            </li>
          ))}
        </ul>
      </section>

      <ListaPublicaClient
        listaId={lista.id}
        escolaNome={lista.turma.escola.nome}
        turmaNome={lista.turma.nome}
      />
    </main>
  );
}
