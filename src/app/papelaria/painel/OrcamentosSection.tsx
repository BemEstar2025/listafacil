"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatOrcamento from "../../ChatOrcamento";

type ItemOrcamento = {
  id: string;
  quantidade: number;
  precoUnitario: number;
  itemLista: { nome: string };
};

type Orcamento = {
  id: string;
  responsavelNome: string;
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
  const [chatAberto, setChatAberto] = useState<string | null>(null);

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
        {orcamentosIniciais.map((orcamento) => (
          <li key={orcamento.id} className="card p-4">
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
              <span className="badge">{STATUS_LABEL[orcamento.status]}</span>
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
                className="input px-2 py-1.5 text-sm"
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
                className="input px-2 py-1.5 text-sm"
              />
              <button onClick={() => salvarPrazo(orcamento.id)} className="btn-outline text-sm px-3 py-1.5">
                Salvar prazo
              </button>

              <button
                onClick={() => setChatAberto(chatAberto === orcamento.id ? null : orcamento.id)}
                className="btn-whatsapp text-sm"
              >
                {chatAberto === orcamento.id ? "Fechar chat" : "💬 Conversar"}
              </button>
            </div>

            {chatAberto === orcamento.id && (
              <div className="mt-3">
                <ChatOrcamento orcamentoId={orcamento.id} autor="PAPELARIA" apiBase="/api/papelaria/orcamentos" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
