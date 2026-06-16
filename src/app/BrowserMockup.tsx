export default function BrowserMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <div className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-xs text-gray-400">
          listafacil.app/lista/1ano-a
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs font-medium text-gray-400">Lista de material — 1º Ano A · 2026</p>
        <p className="mt-3 text-sm font-semibold text-gray-700">Comparar papelarias</p>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between rounded-xl border-2 px-3 py-2.5" style={{ borderColor: "var(--color-accent)", background: "var(--color-accent-light)" }}>
            <div className="flex items-center gap-2">
              <span className="badge-accent">⭐ Oficial</span>
              <span className="text-sm font-medium text-gray-800">Papelaria Estrela</span>
            </div>
            <span className="text-sm font-bold text-gray-800">R$ 78,90</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2.5">
            <span className="text-sm text-gray-600">Papelaria Central</span>
            <span className="text-sm text-gray-500">R$ 84,20</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2.5">
            <span className="text-sm text-gray-600">Papelaria Bairro Novo</span>
            <span className="text-sm text-gray-500">R$ 91,40</span>
          </div>
        </div>

        <button className="btn-primary mt-4 w-full text-sm">Solicitar orçamento</button>
      </div>
    </div>
  );
}
