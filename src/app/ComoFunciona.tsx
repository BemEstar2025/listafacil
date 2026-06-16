"use client";

import { useState } from "react";
import { School, BookOpen, User } from "lucide-react";
import Reveal from "./Reveal";

type PerfilKey = "escola" | "papelaria" | "pai";

const PERFIS: Record<
  PerfilKey,
  {
    Icone: React.ComponentType<{ size?: number; className?: string }>;
    titulo: string;
    cor: string;
    passos: string[];
    mockup: React.ReactNode;
  }
> = {
  escola: {
    Icone: School,
    titulo: "Escola",
    cor: "primary",
    passos: [
      "Cadastre suas turmas em poucos cliques",
      "Suba a lista de material direto do Excel",
      "Compartilhe o link/QR Code com os pais no grupo do WhatsApp",
    ],
    mockup: (
      <div className="card p-4">
        <p className="mb-2 text-xs font-semibold" style={{ color: "var(--color-primary)" }}>1º Ano A · 2026</p>
        <div className="flex items-center gap-2 rounded-xl border-2 border-dashed p-3 text-sm" style={{ borderColor: "var(--color-primary-light)" }}>
          <span className="text-gray-700">lista-1ano-a.xlsx</span>
          <span className="ml-auto badge">importado ✓</span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl p-3 text-sm text-gray-500" style={{ background: "var(--color-primary-light)" }}>
          listafacil.app/lista/8f2a91...
        </div>
      </div>
    ),
  },
  papelaria: {
    Icone: BookOpen,
    titulo: "Papelaria",
    cor: "accent",
    passos: [
      "Cadastre seu catálogo (manual ou planilha)",
      "Receba pedidos de orçamento automaticamente no painel",
      "Responda pelo WhatsApp e fature a venda — sem mensalidade fixa, só comissão",
    ],
    mockup: (
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">Novo orçamento recebido</p>
          <span className="badge-accent">Novo</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">João Pai — 1º Ano A</p>
        <p className="mt-1 text-sm text-gray-700">7 itens · R$ 78,90 estimado</p>
        <div className="mt-3 btn-whatsapp w-fit text-sm">Responder via WhatsApp</div>
      </div>
    ),
  },
  pai: {
    Icone: User,
    titulo: "Pai / Responsável",
    cor: "primary",
    passos: [
      "Acesse a lista pelo link, sem precisar criar conta",
      "Compare papelarias por preço, distância e disponibilidade",
      "Envie o orçamento com 1 clique direto pro WhatsApp da loja",
    ],
    mockup: (
      <div className="card flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between rounded-xl border-2 p-2 text-sm" style={{ borderColor: "var(--color-primary)", background: "var(--color-primary-light)" }}>
          <span className="text-gray-700">Papelaria Estrela</span>
          <span className="font-semibold" style={{ color: "var(--color-primary)" }}>R$ 78,90</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border-2 border-transparent p-2 text-sm text-gray-500">
          <span>Papelaria Centro</span>
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
  const Icone = perfil.Icone;

  return (
    <Reveal className="w-full">
      <section className="w-full">
        <h2 className="text-center text-2xl font-bold text-gray-900">Como funciona</h2>
        <p className="mt-1 text-center text-gray-500">Escolha seu perfil e veja a jornada completa</p>

        <div className="mt-6 flex justify-center gap-2">
          {(Object.keys(PERFIS) as PerfilKey[]).map((key) => {
            const P = PERFIS[key];
            const ativoClasse = ativo === key ? (P.cor === "accent" ? "btn-accent" : "btn-primary") : "btn-outline";
            return (
              <button key={key} onClick={() => setAtivo(key)} className={`${ativoClasse} text-sm`}>
                <P.Icone size={16} />
                {P.titulo}
              </button>
            );
          })}
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
          <div key={ativo} className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: perfil.cor === "accent" ? "var(--color-accent-light)" : "var(--color-primary-light)" }}>
              <Icone size={22} className={perfil.cor === "accent" ? "text-amber-800" : "text-indigo-700"} />
            </div>
            <div className="w-full animate-[fadeIn_0.5s_ease-out_0.1s_backwards]">{perfil.mockup}</div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
