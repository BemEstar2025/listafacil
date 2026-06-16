import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AvaliacaoForm from "./AvaliacaoForm";

const STATUS_LABEL: Record<string, string> = {
  NOVO: "Novo",
  VISUALIZADO: "Visualizado",
  EM_SEPARACAO: "Em separação",
  PRONTO: "Pronto",
  ENTREGUE: "Entregue",
};

export default async function OrcamentoStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: { papelaria: true, avaliacao: true, itens: { include: { itemLista: true } } },
  });

  if (!orcamento) notFound();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Status do orçamento</h1>
      <p className="mt-1 text-gray-600">{orcamento.papelaria.nomeFantasia}</p>

      <div className="mt-4 rounded-md border border-gray-200 p-4">
        <p className="mb-2">
          Status: <span className="font-semibold">{STATUS_LABEL[orcamento.status]}</span>
        </p>
        {orcamento.prazo && <p className="mb-2 text-sm text-gray-600">Prazo: {orcamento.prazo}</p>}
        <ul className="text-sm">
          {orcamento.itens.map((i) => (
            <li key={i.id}>
              {i.quantidade}x {i.itemLista.nome} — R$ {i.precoUnitario.toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="mt-2 font-semibold">Total: R$ {orcamento.total.toFixed(2)}</p>
      </div>

      {orcamento.status === "ENTREGUE" && !orcamento.avaliacao && (
        <div className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">Avalie a papelaria</h2>
          <AvaliacaoForm orcamentoId={orcamento.id} />
        </div>
      )}

      {orcamento.avaliacao && (
        <p className="mt-6 text-sm text-gray-600">
          Você avaliou esta papelaria com nota {orcamento.avaliacao.nota}/5. Obrigado!
        </p>
      )}
    </main>
  );
}
