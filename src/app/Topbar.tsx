import Link from "next/link";

export default function Topbar({
  titulo,
  subtitulo,
  cor = "primary",
  voltarPara,
  acoes,
}: {
  titulo: string;
  subtitulo?: string;
  cor?: "primary" | "accent";
  voltarPara?: { href: string; label: string };
  acoes?: React.ReactNode;
}) {
  const corClasse = cor === "accent" ? "bg-orange-500" : "bg-violet-600";

  return (
    <header className="mb-8 w-full border-b border-[var(--border-subtle)] bg-white px-8 py-4">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold text-white ${corClasse}`}>
            🎒
          </span>
          <div>
            {voltarPara && (
              <Link href={voltarPara.href} className="block text-xs text-gray-400 hover:text-violet-600">
                ← {voltarPara.label}
              </Link>
            )}
            <h1 className="text-base font-semibold leading-tight">{titulo}</h1>
            {subtitulo && <p className="text-xs text-gray-500">{subtitulo}</p>}
          </div>
        </div>
        {acoes && <div className="flex items-center gap-2">{acoes}</div>}
      </div>
    </header>
  );
}
