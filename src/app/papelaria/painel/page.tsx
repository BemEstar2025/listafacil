import { exigirSessao } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProdutosSection from "./ProdutosSection";
import OrcamentosSection from "./OrcamentosSection";
import DestaqueSection from "./DestaqueSection";
import Topbar from "../../Topbar";
import LogoutButton from "../../LogoutButton";

export default async function PainelPapelariaPage() {
  let sessao;
  try {
    sessao = await exigirSessao("papelaria");
  } catch {
    redirect("/papelaria/login");
  }

  const papelaria = await prisma.papelaria.findUnique({ where: { id: sessao.sub } });
  const produtos = await prisma.produto.findMany({
    where: { papelariaId: sessao.sub },
    orderBy: { criadoEm: "desc" },
  });
  const orcamentos = await prisma.orcamento.findMany({
    where: { papelariaId: sessao.sub },
    include: { itens: { include: { itemLista: true, produto: true } }, lista: { include: { turma: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <>
      <Topbar titulo={papelaria?.nomeFantasia ?? ""} cor="accent" acoes={<LogoutButton />} />
      <main className="mx-auto max-w-4xl px-8 pb-8">
        <section>
          <DestaqueSection destacadaAte={papelaria?.destacadaAte?.toISOString() ?? null} />
        </section>

        <section className="mt-8">
          <ProdutosSection produtosIniciais={produtos} />
        </section>

        <section className="mt-12">
          <OrcamentosSection orcamentosIniciais={orcamentos} />
        </section>
      </main>
    </>
  );
}
