export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="16" r="3" fill="#0a1628" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#0a1628" strokeWidth="1.6" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#0a1628" strokeWidth="1.6" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#0a1628" strokeWidth="1.6" transform="rotate(120 16 16)" />
    </svg>
  );
}
