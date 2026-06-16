"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ItemOrcamento = {
  id: string;
  quantidade: number;
  precoUnitario: number;
  itemLista: { nome: string };
};

type Orcamento = {
  id: string;
  responsavelNome: string;
  responsavelTelefone: string;
  nomeAluno: string | null;
  status: string;
  total: number;
  prazo: string | null;
  criadoEm: string | Date;
  itens: ItemOrcamento[];
  lista: { turma: { nome: string } };
};

const STATUS_LABEL: Record<string, string> = {
  NOVO: "Novo",
  VISUALIZADO: "Visualizado",
  EM_SEPARACAO: "Em separação",
  PRONTO: "Pronto",
  ENTREGUE: "Entregue",
};

export default function OrcamentosSection({ orcamentosIniciais }: { orcamentosIniciais: Orcamento[] }) {
  const router = useRouter();
  const [prazos, setPrazos] = useState<Record<string, string>>({});

  async function atualizarStatus(id: string, status: string) {
    await fetch(`/api/papelaria/orcamentos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function salvarPrazo(id: string) {
    const prazo = prazos[id];
    if (!prazo) return;
    await fetch(`/api/papelaria/orcamentos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prazo }),
    });
    router.refresh();
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Orçamentos recebidos</h2>
      {orcamentosIniciais.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum orçamento recebido ainda.</p>
      )}
      <ul className="flex flex-col gap-3">
        {orcamentosIniciais.map((orcamento) => {
          const mensagem = encodeURIComponent(
            `Olá ${orcamento.responsavelNome}! Sobre o orçamento da turma ${orcamento.lista.turma.nome}: status atual "${STATUS_LABEL[orcamento.status]}". Total: R$ ${orcamento.total.toFixed(2)}.`
          );
          return (
            <li key={orcamento.id} className="rounded-md border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {orcamento.responsavelNome} {orcamento.nomeAluno && `— aluno(a) ${orcamento.nomeAluno}`}
                  </p>
                  <p className="text-sm text-gray-500">Turma: {orcamento.lista.turma.nome}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(orcamento.criadoEm).toLocaleString("pt-BR")}
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                  {STATUS_LABEL[orcamento.status]}
                </span>
              </div>

              <ul className="mt-3 flex flex-col gap-1 text-sm">
                {orcamento.itens.map((item) => (
                  <li key={item.id}>
                    {item.quantidade}x {item.itemLista.nome} — R$ {item.precoUnitario.toFixed(2)} cada
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-semibold">Total: R$ {orcamento.total.toFixed(2)}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  defaultValue={orcamento.status}
                  onChange={(e) => atualizarStatus(orcamento.id, e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                >
                  {Object.entries(STATUS_LABEL).map(([valor, label]) => (
                    <option key={valor} value={valor}>
                      {label}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Prazo (ex: retirar até sexta)"
                  defaultValue={orcamento.prazo ?? ""}
                  onChange={(e) => setPrazos((p) => ({ ...p, [orcamento.id]: e.target.value }))}
                  className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                />
                <button
                  onClick={() => salvarPrazo(orcamento.id)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Salvar prazo
                </button>

                <a
                  href={`https://wa.me/${orcamento.responsavelTelefone.replace(/\D/g, "")}?text=${mensagem}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                >
                  Responder via WhatsApp
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
