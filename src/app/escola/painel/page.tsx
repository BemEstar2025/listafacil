import { exigirSessao } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NovaTurmaForm from "./NovaTurmaForm";
import Link from "next/link";

export default async function PainelEscolaPage() {
  let sessao;
  try {
    sessao = await exigirSessao("escola");
  } catch {
    redirect("/escola/login");
  }

  const escola = await prisma.escola.findUnique({ where: { id: sessao.sub } });
  const turmas = await prisma.turma.findMany({
    where: { escolaId: sessao.sub },
    include: { listas: true },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="page-header">
        <h1 className="text-2xl font-bold">🏫 {escola?.nome}</h1>
        <p className="mt-1 text-violet-100">Bem-vindo(a), {escola?.responsavelNome}.</p>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Nova turma</h2>
        <NovaTurmaForm />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Turmas cadastradas</h2>
        {turmas.length === 0 && <p className="text-sm text-gray-500">Nenhuma turma cadastrada ainda.</p>}
        <ul className="flex flex-col gap-2">
          {turmas.map((turma) => (
            <li key={turma.id}>
              <Link
                href={`/escola/painel/turmas/${turma.id}`}
                className="block card p-4 hover:border-blue-400"
              >
                <p className="font-medium">{turma.nome}</p>
                <p className="text-sm text-gray-500">
                  {turma.anoLetivo} · {turma.periodo} · {turma.qtdAlunos} alunos · Prof. {turma.professor}
                </p>
                <p className="text-xs text-gray-400">
                  {turma.listas.length} lista(s) cadastrada(s)
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
