"use client";

import { useState } from "react";
import { IlustracaoEscola, IlustracaoPapelaria, IlustracaoPai } from "./Ilustracoes";
import Reveal from "./Reveal";

type PerfilKey = "escola" | "papelaria" | "pai";

const PERFIS: Record<
  PerfilKey,
  {
    emoji: string;
    titulo: string;
    cor: string;
    Ilustracao: React.ComponentType<{ className?: string }>;
    passos: string[];
    mockup: React.ReactNode;
  }
> = {
  escola: {
    emoji: "🏫",
    titulo: "Escola",
    cor: "violet",
    Ilustracao: IlustracaoEscola,
    passos: [
      "Cadastre suas turmas em poucos cliques",
      "Suba a lista de material direto do Excel",
      "Compartilhe o link/QR Code com os pais no grupo do WhatsApp",
    ],
    mockup: (
      <div className="card p-4">
        <p className="mb-2 text-xs font-semibold text-violet-600">1º Ano A · 2026</p>
        <div className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 p-3 text-sm text-violet-700">
          📄 lista-1ano-a.xlsx
          <span className="ml-auto badge">importado ✓</span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-violet-50 p-3 text-sm">
          🔗 listafacil.app/lista/8f2a91...
        </div>
      </div>
    ),
  },
  papelaria: {
    emoji: "📚",
    titulo: "Papelaria",
    cor: "orange",
    Ilustracao: IlustracaoPapelaria,
    passos: [
      "Cadastre seu catálogo (manual ou planilha)",
      "Receba pedidos de orçamento automaticamente no painel",
      "Responda pelo WhatsApp e fature a venda — sem mensalidade fixa, só comissão",
    ],
    mockup: (
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Novo orçamento recebido</p>
          <span className="badge" style={{ background: "#ffedd5", color: "#c2410c" }}>
            Novo
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500">João Pai — 1º Ano A</p>
        <p className="mt-1 text-sm">7 itens · R$ 78,90 estimado</p>
        <div className="mt-3 btn-whatsapp w-fit text-sm">Responder via WhatsApp</div>
      </div>
    ),
  },
  pai: {
    emoji: "🎒",
    titulo: "Pai / Responsável",
    cor: "violet",
    Ilustracao: IlustracaoPai,
    passos: [
      "Acesse a lista pelo link, sem precisar criar conta",
      "Compare papelarias por preço, distância e disponibilidade",
      "Envie o orçamento com 1 clique direto pro WhatsApp da loja",
    ],
    mockup: (
      <div className="card flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between rounded-2xl border-2 border-violet-200 bg-violet-50 p-2 text-sm">
          <span>📍 Papelaria Estrela</span>
          <span className="font-semibold text-violet-700">R$ 78,90</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border-2 border-transparent p-2 text-sm text-gray-500">
          <span>📍 Papelaria Centro</span>
          <span>R$ 84,20</span>
        </div>
        <div className="btn-whatsapp mt-1 w-fit text-sm">Solicitar orçamento</div>
      </div>
    ),
  },
};

export default function ComoFunciona() {
  const [ativo, setAtivo] = useState<PerfilKey>("escola");
  const perfil = PERFIS[ativo];
  const Ilustracao = perfil.Ilustracao;

  return (
    <Reveal className="w-full">
      <section className="w-full">
        <h2 className="text-center text-2xl font-bold">Como funciona</h2>
        <p className="mt-1 text-center text-gray-500">Escolha seu perfil e veja a jornada completa</p>

        <div className="mt-6 flex justify-center gap-2">
          {(Object.keys(PERFIS) as PerfilKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setAtivo(key)}
              className={
                ativo === key
                  ? PERFIS[key].cor === "orange"
                    ? "btn-accent text-sm"
                    : "btn-primary text-sm"
                  : "btn-outline text-sm"
              }
            >
              {PERFIS[key].emoji} {PERFIS[key].titulo}
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-center gap-8 sm:grid-cols-2">
          <ol className="flex flex-col gap-4">
            {perfil.passos.map((passo, i) => (
              <li
                key={i}
                className="flex gap-3 animate-[fadeIn_0.4s_ease-out_backwards]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="badge flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700">{passo}</p>
              </li>
            ))}
          </ol>
          <div key={ativo} className="flex flex-col items-center gap-4">
            <Ilustracao className="illustration-enter h-40 w-40" />
            <div className="w-full animate-[fadeIn_0.5s_ease-out_0.1s_backwards]">{perfil.mockup}</div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
