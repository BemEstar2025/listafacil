"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DestaqueSection({ destacadaAte }: { destacadaAte: string | null }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  const ativo = destacadaAte && new Date(destacadaAte) > new Date();

  async function ativarDestaque() {
    setCarregando(true);
    await fetch("/api/papelaria/destaque", { method: "POST" });
    setCarregando(false);
    router.refresh();
  }

  return (
    <div className="card border-2 border-orange-200 bg-orange-50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-orange-700">⭐ Destaque no comparador</h2>
          {ativo ? (
            <p className="mt-1 text-sm text-orange-600">
              Ativo até {new Date(destacadaAte!).toLocaleDateString("pt-BR")} — sua papelaria aparece
              em primeiro lugar para os pais.
            </p>
          ) : (
            <p className="mt-1 text-sm text-orange-600">
              Apareça em 1º lugar no comparador de preços por 30 dias.
            </p>
          )}
        </div>
        <button onClick={ativarDestaque} disabled={carregando} className="btn-accent text-sm">
          {carregando ? "Ativando..." : ativo ? "Renovar destaque" : "Ativar destaque"}
        </button>
      </div>
    </div>
  );
}
