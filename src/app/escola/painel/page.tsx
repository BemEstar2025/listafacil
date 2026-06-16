import { exigirSessao } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NovaTurmaForm from "./NovaTurmaForm";
import Topbar from "../../Topbar";
import LogoutButton from "../../LogoutButton";
import { Table, Th, Td, Tr } from "../../Table";

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
    <>
      <Topbar
        titulo={escola?.nome ?? ""}
        subtitulo={`Bem-vindo(a), ${escola?.responsavelNome}`}
        acoes={<LogoutButton />}
      />
      <main className="mx-auto max-w-3xl px-8 pb-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Nova turma</h2>
          <NovaTurmaForm />
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Turmas cadastradas</h2>
          {turmas.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma turma cadastrada ainda.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Turma</Th>
                  <Th>Ano</Th>
                  <Th>Período</Th>
                  <Th>Alunos</Th>
                  <Th>Professor</Th>
                  <Th>Listas</Th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((turma) => (
                  <Tr key={turma.id} href={`/escola/painel/turmas/${turma.id}`}>
                    <Td className="font-medium text-[var(--foreground)]">{turma.nome}</Td>
                    <Td>{turma.anoLetivo}</Td>
                    <Td className="capitalize">{turma.periodo.toLowerCase()}</Td>
                    <Td>{turma.qtdAlunos}</Td>
                    <Td>{turma.professor}</Td>
                    <Td>{turma.listas.length}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </section>
      </main>
    </>
  );
}
