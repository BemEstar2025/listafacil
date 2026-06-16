export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-6 py-24 text-center">
      <div>
        <h1 className="text-4xl font-bold text-blue-700">🎒 ListaFácil</h1>
        <p className="mt-3 text-lg text-gray-600">
          Conecta escolas, papelarias e pais para resolver a lista de material escolar sem complicação.
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Sou uma Escola</h2>
          <p className="mt-2 text-sm text-gray-500">
            Cadastre turmas, monte listas de material e compartilhe com os pais via link ou QR Code.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <a href="/escola/login" className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
              Entrar
            </a>
            <a href="/escola/cadastro" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Cadastrar escola
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold">Sou uma Papelaria</h2>
          <p className="mt-2 text-sm text-gray-500">
            Cadastre seus produtos, importe seu catálogo e receba orçamentos de pais da região.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <a href="/papelaria/login" className="rounded-md border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50">
              Entrar
            </a>
            <a href="/papelaria/cadastro" className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
              Cadastrar papelaria
            </a>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        É pai ou responsável? Acesse a lista da turma do seu filho pelo link enviado pela escola.
      </p>
    </main>
  );
}
