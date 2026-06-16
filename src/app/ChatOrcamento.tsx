"use client";

import { useEffect, useRef, useState } from "react";

type Mensagem = {
  id: string;
  autor: "PAI" | "PAPELARIA";
  texto: string;
  criadoEm: string;
};

export default function ChatOrcamento({
  orcamentoId,
  autor,
  apiBase,
}: {
  orcamentoId: string;
  autor: "PAI" | "PAPELARIA";
  apiBase: string;
}) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const listaRef = useRef<HTMLDivElement>(null);

  async function buscarMensagens() {
    const res = await fetch(`${apiBase}/${orcamentoId}/mensagens`);
    if (!res.ok) return;
    setMensagens(await res.json());
  }

  useEffect(() => {
    buscarMensagens();
    const intervalo = setInterval(buscarMensagens, 5000);
    return () => clearInterval(intervalo);
  }, [orcamentoId]);

  useEffect(() => {
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight });
  }, [mensagens]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviando(true);
    const res = await fetch(`${apiBase}/${orcamentoId}/mensagens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });
    setEnviando(false);
    if (res.ok) {
      setTexto("");
      buscarMensagens();
    }
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700">
        💬 Chat — seu contato fica protegido, a conversa acontece aqui dentro
      </div>
      <div ref={listaRef} className="flex max-h-64 flex-col gap-2 overflow-y-auto p-4">
        {mensagens.length === 0 && (
          <p className="text-sm text-gray-400">Nenhuma mensagem ainda. Diga olá!</p>
        )}
        {mensagens.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              m.autor === autor
                ? "self-end bg-violet-600 text-white"
                : "self-start bg-gray-100 text-gray-800"
            }`}
          >
            {m.texto}
          </div>
        ))}
      </div>
      <form onSubmit={enviar} className="flex gap-2 border-t border-violet-100 p-3">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva sua mensagem..."
          className="input"
        />
        <button type="submit" disabled={enviando} className="btn-primary text-sm">
          Enviar
        </button>
      </form>
    </div>
  );
}
