import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  listaId: z.string(),
  papelariaId: z.string(),
  responsavelNome: z.string().min(2),
  responsavelTelefone: z.string().min(8),
  nomeAluno: z.string().optional(),
  itens: z
    .array(
      z.object({
        itemListaId: z.string(),
        produtoId: z.string().nullable(),
        quantidade: z.number().int().positive(),
        precoUnitario: z.number().nonnegative(),
      })
    )
    .min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const { itens, ...dados } = parsed.data;

  const lista = await prisma.lista.findUnique({
    where: { id: dados.listaId },
    include: { turma: { include: { escola: true } } },
  });
  const papelaria = await prisma.papelaria.findUnique({ where: { id: dados.papelariaId } });
  if (!lista || !papelaria) {
    return NextResponse.json({ erro: "Lista ou papelaria não encontrada" }, { status: 404 });
  }

  const total = itens.reduce((soma, i) => soma + i.precoUnitario * i.quantidade, 0);

  const orcamento = await prisma.orcamento.create({
    data: {
      listaId: dados.listaId,
      papelariaId: dados.papelariaId,
      responsavelNome: dados.responsavelNome,
      responsavelTelefone: dados.responsavelTelefone,
      nomeAluno: dados.nomeAluno,
      total,
      itens: {
        create: itens.map((i) => ({
          itemListaId: i.itemListaId,
          produtoId: i.produtoId,
          quantidade: i.quantidade,
          precoUnitario: i.precoUnitario,
        })),
      },
    },
    include: { itens: { include: { itemLista: true } } },
  });

  const linhasItens = orcamento.itens
    .map((i) => `• ${i.quantidade}x ${i.itemLista.nome} — R$ ${i.precoUnitario.toFixed(2)} cada`)
    .join("\n");

  const mensagem = `Olá, Papelaria ${papelaria.nomeFantasia}! 👋

Sou responsável pelo aluno(a) ${dados.nomeAluno ?? "—"}, da ${lista.turma.escola.nome} — ${lista.turma.nome}.

Gostaria de solicitar orçamento para os seguintes itens da lista escolar ${lista.ano}:

📦 ITENS SOLICITADOS:
${linhasItens}

💰 TOTAL ESTIMADO: R$ ${total.toFixed(2)}

Poderia confirmar a disponibilidade dos itens e informar:
✅ Itens em estoque
🗓️ Prazo para retirada ou entrega
💳 Formas de pagamento

Aguardo retorno. Obrigado(a)! 🙏

📋 Lista gerada pelo sistema ListaFácil`;

  const whatsappUrl = `https://wa.me/${papelaria.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`;

  return NextResponse.json({ orcamento, mensagem, whatsappUrl }, { status: 201 });
}
