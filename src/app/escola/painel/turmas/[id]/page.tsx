import { exigirSessao } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import NovaListaButton from "./NovaListaButton";
import ListaItens from "./ListaItens";
import LinkCompartilhamento from "./LinkCompartilhamento";
import Topbar from "../../../../Topbar";
import LogoutButton from "../../../../LogoutButton";

export default async function TurmaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let sessao;
  try {
    sessao = await exigirSessao("escola");
  } catch {
    redirect("/escola/login");
  }

  const turma = await prisma.turma.findFirst({
    where: { id, escolaId: sessao.sub },
    include: { listas: { include: { itens: true }, orderBy: { criadoEm: "desc" } } },
  });

  if (!turma) notFound();

  const listaAtiva = turma.listas.find((l) => l.status === "ATIVA") ?? turma.listas[0];

  return (
    <>
      <Topbar
        titulo={turma.nome}
        subtitulo={`${turma.anoLetivo} · ${turma.periodo} · ${turma.qtdAlunos} alunos · Prof. ${turma.professor}`}
        voltarPara={{ href: "/escola/painel", label: "Turmas" }}
        acoes={<LogoutButton />}
      />
      <main className="mx-auto max-w-3xl px-8 pb-8">
        {!listaAtiva ? (
          <div>
            <p className="mb-3 text-sm text-gray-600">Esta turma ainda não tem lista de material.</p>
            <NovaListaButton turmaId={turma.id} anoLetivo={turma.anoLetivo} />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <LinkCompartilhamento listaId={listaAtiva.id} />
            <ListaItens listaId={listaAtiva.id} itens={listaAtiva.itens} />
          </div>
        )}
      </main>
    </>
  );
}
