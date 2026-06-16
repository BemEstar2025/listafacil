import ComoFunciona from "./ComoFunciona";
import Reveal from "./Reveal";
import AnimatedCounter from "./AnimatedCounter";
import BrowserMockup from "./BrowserMockup";

export default function Home() {
  return (
    <main className="landing-bg flex flex-col items-center gap-24 overflow-x-hidden pb-20">
      {/* Hero */}
      <section className="w-full px-6 pb-4 pt-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 lg:flex-row">
          <div className="flex flex-1 flex-col items-start gap-6 text-left">
            <span
              className="badge animate-[fadeIn_0.6s_ease-out_backwards]"
              style={{ animationDelay: "0ms" }}
            >
              Para escolas, papelarias e famílias
            </span>
            <h1
              className="text-4xl font-bold leading-[1.1] text-gray-900 sm:text-5xl animate-[fadeIn_0.7s_ease-out_backwards]"
              style={{ animationDelay: "120ms" }}
            >
              A lista de material escolar, do Excel direto pro melhor preço.
            </h1>
            <p
              className="max-w-xl text-lg text-gray-500 animate-[fadeIn_0.7s_ease-out_backwards]"
              style={{ animationDelay: "240ms" }}
            >
              A escola sobe a lista, o pai compara papelarias e fecha o orçamento sem trocar
              telefone com ninguém. Sem mensalidade pra escola, sem app pra instalar.
            </p>
            <div
              className="flex flex-wrap gap-3 animate-[fadeIn_0.7s_ease-out_backwards]"
              style={{ animationDelay: "360ms" }}
            >
              <a href="#comecar" className="btn-primary">
                Quero começar agora
              </a>
              <a href="#como-funciona" className="btn-outline">
                Ver como funciona
              </a>
            </div>

            <div className="mt-2 flex w-full max-w-md gap-6 border-t border-gray-100 pt-6">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter to={100} suffix="%" />
                </p>
                <p className="text-xs text-gray-500">gratuito p/ escolas e pais</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter to={0} />
                </p>
                <p className="text-xs text-gray-500">apps para instalar</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter to={1} suffix=" clique" />
                </p>
                <p className="text-xs text-gray-500">para orçar no WhatsApp</p>
              </div>
            </div>
          </div>

          <div
            className="w-full max-w-md flex-1 animate-[fadeIn_0.9s_ease-out_backwards]"
            style={{ animationDelay: "200ms" }}
          >
            <BrowserMockup />
          </div>
        </div>
      </section>

      {/* Como funciona (interativo) */}
      <div id="como-funciona" className="w-full max-w-4xl px-6">
        <ComoFunciona />
      </div>

      {/* Benefícios */}
      <Reveal className="w-full max-w-4xl px-6">
        <section>
          <h2 className="text-center text-2xl font-bold text-gray-900">Por que ListaFácil?</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { titulo: "Rápido pra escola", texto: "Sem digitar item por item: sobe o Excel que já está pronto e já gera o link." },
              { titulo: "Economia pro pai", texto: "Compara preços entre papelarias da região antes de comprar, sem sair de casa." },
              { titulo: "Vendas pra papelaria", texto: "Recebe pedidos prontos no WhatsApp, sem mensalidade — só comissão sobre o que vender." },
            ].map((b) => (
              <div key={b.titulo} className="card transition-shadow hover:shadow-md">
                <h3 className="font-semibold text-gray-900">{b.titulo}</h3>
                <p className="mt-1 text-sm text-gray-500">{b.texto}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Pitch papelarias parceiras */}
      <Reveal className="w-full max-w-4xl px-6 sm:px-10">
        <section className="page-header-accent">
          <h2 className="text-2xl font-bold">Seja uma papelaria parceira</h2>
          <p className="mt-2 max-w-xl text-orange-50">
            Sem custo de adesão: você só paga uma pequena comissão sobre os orçamentos que se
            transformam em venda. Mais visibilidade pra sua loja, sem risco.
          </p>
          <a
            href="/papelaria/cadastro"
            className="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-amber-800 transition-transform hover:scale-105"
          >
            Cadastrar minha papelaria
          </a>
        </section>
      </Reveal>

      {/* CTA final / entrada */}
      <Reveal className="w-full max-w-4xl px-6" id="comecar">
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="card p-6 text-center transition-shadow hover:shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Sou uma Escola</h2>
            <p className="mt-2 text-sm text-gray-500">
              Cadastre turmas, monte listas de material e compartilhe com os pais via link ou QR Code.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <a href="/escola/login" className="btn-outline text-sm">
                Entrar
              </a>
              <a href="/escola/cadastro" className="btn-primary text-sm">
                Cadastrar escola
              </a>
            </div>
          </div>

          <div className="card p-6 text-center transition-shadow hover:shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Sou uma Papelaria</h2>
            <p className="mt-2 text-sm text-gray-500">
              Cadastre seus produtos, importe seu catálogo e receba orçamentos de pais da região.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <a href="/papelaria/login" className="btn-outline-accent text-sm">
                Entrar
              </a>
              <a href="/papelaria/cadastro" className="btn-accent text-sm">
                Cadastrar papelaria
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      <p className="px-6 text-center text-sm text-gray-400">
        É pai ou responsável? Acesse a lista da turma do seu filho pelo link enviado pela escola.
      </p>

      <footer className="w-full max-w-4xl border-t border-gray-100 px-6 pt-6 text-center text-xs text-gray-400">
        🎒 ListaFácil — conectando escolas, papelarias e pais.
      </footer>
    </main>
  );
}
