export function IlustracaoEscola({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="92" fill="#ede9fe" />
      <rect x="55" y="95" width="90" height="60" rx="8" fill="#7c3aed" />
      <polygon points="50,95 100,55 150,95" fill="#6d28d9" />
      <rect x="92" y="115" width="16" height="40" fill="#ede9fe" />
      <rect x="65" y="110" width="14" height="14" rx="2" fill="#ede9fe" />
      <rect x="121" y="110" width="14" height="14" rx="2" fill="#ede9fe" />
      <circle cx="100" cy="48" r="6" fill="#fb923c" />
      <rect x="30" y="140" width="22" height="28" rx="3" fill="#fb923c" />
      <rect x="148" y="135" width="20" height="33" rx="3" fill="#a78bfa" />
      <rect x="151" y="141" width="14" height="3" fill="#fff" />
      <rect x="151" y="147" width="14" height="3" fill="#fff" />
    </svg>
  );
}

export function IlustracaoPapelaria({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="92" fill="#ffedd5" />
      <rect x="48" y="90" width="104" height="65" rx="6" fill="#fff" stroke="#fb923c" strokeWidth="4" />
      <rect x="48" y="78" width="104" height="18" rx="4" fill="#ea580c" />
      <rect x="60" y="105" width="22" height="40" fill="#fdba74" />
      <rect x="90" y="105" width="22" height="40" fill="#fb923c" />
      <rect x="120" y="105" width="20" height="40" fill="#f97316" />
      <circle cx="155" cy="60" r="20" fill="#7c3aed" />
      <path d="M148 58a7 7 0 0 1 14 0v6l4 4h-22l4-4z" fill="#fff" />
    </svg>
  );
}

export function IlustracaoPai({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="92" fill="#ede9fe" />
      <circle cx="78" cy="80" r="22" fill="#fb923c" />
      <rect x="56" y="104" width="44" height="50" rx="16" fill="#7c3aed" />
      <circle cx="128" cy="92" r="14" fill="#fdba74" />
      <rect x="112" y="108" width="32" height="38" rx="12" fill="#a78bfa" />
      <rect x="70" y="120" width="64" height="44" rx="10" fill="#fff" stroke="#7c3aed" strokeWidth="4" />
      <circle cx="150" cy="60" r="9" fill="#facc15" />
      <circle cx="165" cy="85" r="6" fill="#fb923c" />
      <circle cx="40" cy="60" r="7" fill="#fb923c" />
    </svg>
  );
}
