import { exigirSessao } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProdutosSection from "./ProdutosSection";
import OrcamentosSection from "./OrcamentosSection";

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
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-bold">Painel — {papelaria?.nomeFantasia}</h1>

      <section className="mt-8">
        <ProdutosSection produtosIniciais={produtos} />
      </section>

      <section className="mt-12">
        <OrcamentosSection orcamentosIniciais={orcamentos} />
      </section>
    </main>
  );
}
