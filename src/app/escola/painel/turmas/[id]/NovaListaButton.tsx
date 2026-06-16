"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaListaButton({ turmaId, anoLetivo }: { turmaId: string; anoLetivo: number }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function criarLista() {
    setCarregando(true);
    await fetch(`/api/turmas/${turmaId}/listas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ano: anoLetivo }),
    });
    setCarregando(false);
    router.refresh();
  }

  return (
    <button
      onClick={criarLista}
      disabled={carregando}
      className="btn-primary"
    >
      {carregando ? "Criando..." : "Criar lista de material"}
    </button>
  );
}
