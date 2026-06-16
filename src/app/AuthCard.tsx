import Link from "next/link";

export default function AuthCard({
  titulo,
  emoji,
  children,
}: {
  titulo: string;
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[calc(100vh-2rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-violet-600">
          🎒 ListaFácil
        </Link>
        <div className="card">
          <h1 className="mb-6 text-xl font-semibold">
            {emoji} {titulo}
          </h1>
          {children}
        </div>
      </div>
    </main>
  );
}
