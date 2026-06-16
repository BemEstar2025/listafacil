"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AvaliacaoForm({ orcamentoId }: { orcamentoId: string }) {
  const router = useRouter();
  const [nota, setNota] = useState(5);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/publico/avaliacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orcamentoId,
        nota,
        comentario: form.get("comentario") || undefined,
      }),
    });

    setEnviando(false);

    if (!res.ok) {
      setErro("Erro ao enviar avaliação.");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 card p-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setNota(n)}
            className={`text-2xl ${n <= nota ? "text-yellow-500" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        name="comentario"
        placeholder="Comentário (opcional)"
        className="input"
      />
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="submit"
        disabled={enviando}
        className="btn-primary self-start"
      >
        {enviando ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
