"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  to,
  prefix = "",
  suffix = "",
  duration = 1200,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(0);
  const animou = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animou.current) {
          animou.current = true;
          const inicio = performance.now();

          function tick(agora: number) {
            const progresso = Math.min((agora - inicio) / duration, 1);
            const facilitado = 1 - Math.pow(1 - progresso, 3);
            setValor(Math.round(facilitado * to));
            if (progresso < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {valor}
      {suffix}
    </span>
  );
}
