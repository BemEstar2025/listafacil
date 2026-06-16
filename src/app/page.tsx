import Image from "next/image";
import ComoFunciona from "./ComoFunciona";
import Reveal from "./Reveal";
import AnimatedCounter from "./AnimatedCounter";
import { IlustracaoPapelaria } from "./Ilustracoes";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-24 overflow-x-hidden pb-16">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-orange-500 px-6 pb-12 pt-16 text-white">
        <div
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          style={{ animation: "floaty 7s ease-in-out infinite" }}
        />
        <div
          className="absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl"
          style={{ animation: "floaty 9s ease-in-out infinite 1s" }}
        />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row">
          <div className="flex flex-1 flex-col items-start gap-6 text-left">
            <span
              className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur animate-[fadeIn_0.6s_ease-out_backwards]"
              style={{ animationDelay: "0ms" }}
            >
              🎒 A lista de material, do jeito fácil
            </span>
            <h1
              className="text-4xl font-bold leading-tight sm:text-5xl animate-[fadeIn_0.7s_ease-out_backwards]"
              style={{ animationDelay: "120ms" }}
            >
              Escola sobe o Excel. Pai compara preço. Papelaria fatura a venda.
            </h1>
            <p
              className="max-w-xl text-lg text-violet-100 animate-[fadeIn_0.7s_ease-out_backwards]"
              style={{ animationDelay: "240ms" }}
            >
              O ListaFácil conecta escolas, papelarias e famílias num só lugar — sem mensalidade
              pra escola, sem app pra instalar, e com comissão só quando a papelaria vende.
            </p>
            <div
              className="flex flex-wrap gap-3 animate-[fadeIn_0.7s_ease-out_backwards]"
              style={{ animationDelay: "360ms" }}
            >
              <a
                href="#comecar"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Quero começar agora
              </a>
              <a
                href="#como-funciona"
                className="rounded-full border-2 border-white/60 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Ver como funciona
              </a>
            </div>
          </div>

          <div
            className="relative w-full max-w-md flex-1 animate-[fadeIn_0.9s_ease-out_backwards]"
            style={{ animationDelay: "200ms" }}
          >
            <Image
              src="/landing/hero.png"
              alt="Pais, escola e papelaria conectados pelo ListaFácil"
              width={1376}
              height={768}
              priority
              className="w-full rounded-3xl shadow-2xl"
              style={{ animation: "floaty 6s ease-in-out 1s infinite" }}
            />
          </div>
        </div>

        <div className="relative mx-auto mt-12 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
            <p className="text-2xl font-bold">
              <AnimatedCounter to={100} suffix="%" />
            </p>
            <p className="text-xs text-violet-100">gratuito para escolas e pais</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
            <p className="text-2xl font-bold">
              <AnimatedCounter to={0} />
            </p>
            <p className="text-xs text-violet-100">apps para instalar — tudo via link</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
            <p className="text-2xl font-bold">
              <AnimatedCounter to={1} suffix=" clique" />
            </p>
            <p className="text-xs text-violet-100">para enviar o orçamento no WhatsApp</p>
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
          <h2 className="text-center text-2xl font-bold">Por que ListaFácil?</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icone: "⚡", titulo: "Rápido pra escola", texto: "Sem digitar item por item: sobe o Excel que já está pronto e já gera o link." },
              { icone: "💸", titulo: "Economia pro pai", texto: "Compara preços entre papelarias da região antes de comprar, sem sair de casa." },
              { icone: "📈", titulo: "Vendas pra papelaria", texto: "Recebe pedidos prontos no WhatsApp, sem mensalidade — só comissão sobre o que vender." },
            ].map((b, i) => (
              <div
                key={b.titulo}
                className="card transition-transform hover:-translate-y-1 hover:shadow-lg"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <p className="text-3xl">{b.icone}</p>
                <h3 className="mt-2 font-semibold">{b.titulo}</h3>
                <p className="mt-1 text-sm text-gray-500">{b.texto}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Pitch papelarias parceiras */}
      <Reveal className="w-full max-w-4xl px-6 sm:px-10">
        <section className="page-header-accent">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Seja uma papelaria parceira</h2>
              <p className="mt-2 max-w-xl text-orange-50">
                Sem custo de adesão: você só paga uma pequena comissão sobre os orçamentos que se
                transformam em venda. Mais visibilidade pra sua loja, sem risco.
              </p>
              <a
                href="/papelaria/cadastro"
                className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-orange-600 transition-transform hover:scale-105"
              >
                Cadastrar minha papelaria
              </a>
            </div>
            <IlustracaoPapelaria className="illustration-enter h-36 w-36 shrink-0" />
          </div>
        </section>
      </Reveal>

      {/* CTA final / entrada */}
      <Reveal className="w-full max-w-4xl px-6" id="comecar">
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="card p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-xl font-semibold">Sou uma Escola</h2>
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

          <div className="card p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-xl font-semibold">Sou uma Papelaria</h2>
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

      <footer className="w-full max-w-4xl border-t border-violet-100 px-6 pt-6 text-center text-xs text-gray-400">
        🎒 ListaFácil — conectando escolas, papelarias e pais.
      </footer>
    </main>
  );
}
