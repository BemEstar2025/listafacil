type ProdutoBasico = {
  id: string;
  nome: string;
  tags: string | null;
  preco: number;
  estoque: number;
  esgotado: boolean;
};

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function encontrarMelhorProduto(nomeItem: string, produtos: ProdutoBasico[]) {
  const termo = normalizar(nomeItem);
  const palavras = termo.split(/\s+/).filter((p) => p.length > 2);

  const disponiveis = produtos.filter((p) => !p.esgotado && p.estoque > 0);

  let melhor: ProdutoBasico | null = null;
  let melhorPontuacao = 0;

  for (const produto of disponiveis) {
    const alvo = normalizar(`${produto.nome} ${produto.tags ?? ""}`);
    const pontuacao = palavras.filter((p) => alvo.includes(p)).length;
    if (pontuacao > melhorPontuacao) {
      melhorPontuacao = pontuacao;
      melhor = produto;
    }
  }

  return melhorPontuacao > 0 ? melhor : null;
}
