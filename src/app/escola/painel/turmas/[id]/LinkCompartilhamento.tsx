"use client";

import { useEffect, useState } from "react";

export default function LinkCompartilhamento({ listaId }: { listaId: string }) {
  const [dados, setDados] = useState<{ url: string; qrCodeDataUrl: string } | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    fetch(`/api/listas/${listaId}/qrcode`)
      .then((res) => res.json())
      .then(setDados);
  }, [listaId]);

  if (!dados) return <p className="text-sm text-gray-500">Carregando link...</p>;

  async function copiarLink() {
    await navigator.clipboard.writeText(dados!.url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const mensagemWhatsapp = encodeURIComponent(
    `Olá! Segue o link da lista de material escolar: ${dados.url}`
  );

  return (
    <section className="rounded-md border border-gray-200 p-4">
      <h2 className="mb-3 text-lg font-semibold">Compartilhar lista</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <img src={dados.qrCodeDataUrl} alt="QR Code da lista" className="h-32 w-32 rounded-md border" />
        <div className="flex flex-1 flex-col gap-2">
          <code className="break-all rounded bg-gray-100 px-2 py-1 text-xs">{dados.url}</code>
          <div className="flex flex-wrap gap-2">
            <button onClick={copiarLink} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
              {copiado ? "Copiado!" : "Copiar link"}
            </button>
            <a
              href={`https://wa.me/?text=${mensagemWhatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
            >
              Compartilhar via WhatsApp
            </a>
            <a
              href={`mailto:?subject=Lista%20de%20material%20escolar&body=${mensagemWhatsapp}`}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Enviar por e-mail
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
