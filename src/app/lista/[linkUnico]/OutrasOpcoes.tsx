"use client";

import { useState } from "react";

export default function OutrasOpcoes({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div>
      <button onClick={() => setAberto((v) => !v)} className="link-primary text-sm">
        {aberto ? "Ocultar outras opções" : "Ver outras opções de papelaria"}
      </button>
      {aberto && <div className="mt-4">{children}</div>}
    </div>
  );
}
