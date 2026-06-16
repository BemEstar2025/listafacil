# ListaFácil

Plataforma que conecta escolas, papelarias e pais para resolver a lista de material escolar: a escola cadastra a lista e gera um link único por turma, o pai compara preços entre papelarias próximas e envia o orçamento via WhatsApp, e a papelaria responde e gerencia o pedido em um painel.

Construído conforme o prompt mestre em `prompt-sistema-escolar.md`, cobrindo o MVP completo (Sprints 1-4): cadastro de escola/turmas/listas, cadastro de papelaria/produtos, comparador de preços + geração de mensagem WhatsApp, painel de orçamentos e avaliações.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Prisma 7** com **SQLite** local (fácil trocar para Postgres/Supabase em produção)
- **Tailwind CSS**
- Autenticação via **JWT** em cookie httpOnly
- **wa.me** para envio de mensagens WhatsApp (sem custo, sem API paga)
- **xlsx** para importação de catálogo de produtos
- **qrcode** para geração de QR Code do link da lista

## Como rodar

```bash
npm install
npx prisma migrate dev   # cria o banco SQLite (dev.db) com todas as tabelas
npm run dev              # http://localhost:3000
```

Variáveis de ambiente (já configuradas em `.env` para desenvolvimento):

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="troque-em-producao"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Fluxo do sistema

1. **Escola** se cadastra em `/escola/cadastro`, cria turmas e listas de material no painel (`/escola/painel`), e compartilha o link único/QR Code gerado para cada turma.
2. **Papelaria** se cadastra em `/papelaria/cadastro`, cadastra produtos manualmente ou importa um catálogo (.xlsx/.csv com colunas `Nome | Categoria | Marca | Especificação | Preço | Estoque`).
3. **Pai/responsável** acessa a lista pelo link recebido (`/lista/[linkUnico]`), informa o CEP, compara papelarias (disponibilidade, preço total estimado, distância), monta o orçamento e envia via WhatsApp com um clique.
4. **Papelaria** vê o orçamento no painel, atualiza o status (Novo → Visualizado → Em separação → Pronto → Entregue) e responde via WhatsApp.
5. Após a entrega, o pai pode avaliar a papelaria (`/orcamento/[id]`).

## O que está fora do MVP (conforme o próprio documento marca como "fase 2")

- **Pagamento online** (Stripe/PIX) — toda negociação financeira hoje é direta entre pai e papelaria.
- **Geolocalização real** (Google Maps/Nominatim) — a "distância estimada" no comparador hoje é um cálculo simplificado a partir do CEP, não uma distância geográfica real. Para produção, integrar uma API de geocodificação.
- **API paga do WhatsApp** (Z-API/Evolution API/template oficial Meta) — o envio usa `wa.me`, que funciona bem para o volume de um MVP mas depende do usuário ter o WhatsApp instalado/logado.
- **Upload de imagens** (logo, fotos de produtos) — os campos existem no banco, mas não há integração com Cloudinary/S3 ainda.
- **Notificações automáticas** (e-mail, push, resumo diário) — descritas no documento, ainda não implementadas.

## Estrutura

```
src/
  app/
    api/              # rotas de API (auth, turmas, listas, produtos, orçamentos, avaliações)
    escola/            # cadastro, login e painel da escola
    papelaria/          # cadastro, login e painel da papelaria
    lista/[linkUnico]/  # página pública da lista (acesso do pai)
    orcamento/[id]/     # status do orçamento + avaliação
  lib/                # prisma, auth (JWT/bcrypt), sessão, matching produto↔item, ownership
  proxy.ts            # protege /escola/painel e /papelaria/painel (substitui middleware no Next 16)
prisma/
  schema.prisma        # todas as tabelas do documento original
```
