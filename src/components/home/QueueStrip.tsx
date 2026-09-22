function Figure({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <>
        <circle cx="16" cy="20" r="7.5" />
        <path d="M7.5 31.5h17l-1.2 52H8.7z" />
        <rect x="10" y="83" width="4.4" height="77" />
        <rect x="17.6" y="83" width="4.4" height="77" />
      </>
    );
  }
  if (kind === 1) {
    return (
      <>
        <rect x="11" y="2" width="10" height="9" rx="0.6" />
        <rect x="7" y="10" width="18" height="3.2" />
        <circle cx="16" cy="23" r="7" />
        <path d="M8 33h16l-2 50H10z" />
        <rect x="10.5" y="83" width="4" height="77" />
        <rect x="17.5" y="83" width="4" height="77" />
      </>
    );
  }
  if (kind === 2) {
    return (
      <>
        <ellipse cx="16" cy="11" rx="11" ry="4.2" />
        <circle cx="16" cy="22" r="7" />
        <rect x="9" y="30" width="14" height="54" rx="1" />
        <rect x="10.5" y="84" width="4" height="76" />
        <rect x="17.5" y="84" width="4" height="76" />
      </>
    );
  }
  if (kind === 3) {
    return (
      <>
        <circle cx="16" cy="54" r="6.2" />
        <rect x="11" y="61" width="10" height="38" rx="1" />
        <rect x="11.6" y="99" width="3.6" height="61" />
        <rect x="16.8" y="99" width="3.6" height="61" />
      </>
    );
  }
  if (kind === 4) {
    return (
      <>
        <circle cx="15" cy="24" r="7" />
        <path d="M7.5 34h15.5l-1 50H8.5z" />
        <rect x="9.5" y="84" width="4" height="76" />
        <rect x="16.5" y="84" width="4" height="76" />
        <rect x="24" y="72" width="1.6" height="88" />
      </>
    );
  }
  if (kind === 5) {
    return (
      <>
        <circle cx="16" cy="22" r="7" />
        <path d="M11 31h10v18H11z" />
        <path d="M7 49h18L22 96H10z" />
        <rect x="11" y="96" width="4" height="64" />
        <rect x="17" y="96" width="4" height="64" />
      </>
    );
  }
  if (kind === 6) {
    return (
      <>
        <circle cx="16" cy="14" r="6.5" />
        <rect x="11" y="22" width="10" height="58" rx="1" />
        <rect x="11.4" y="80" width="3.6" height="80" />
        <rect x="17" y="80" width="3.6" height="80" />
      </>
    );
  }
  return (
    <>
      <circle cx="16" cy="28" r="6.8" />
      <path d="M8 38h15l-3 48H10z" />
      <rect x="10" y="86" width="4" height="74" />
      <rect x="16.5" y="86" width="4" height="74" />
      <rect x="23.5" y="78" width="1.5" height="82" />
    </>
  );
}

function Person({ seed }: { seed: number }) {
  const tone = seed % 3;
  const kind = seed % 8;
  const width = 21 + (seed % 5) * 2;

  return (
    <svg
      className="essay-person"
      data-tone={tone}
      width={width}
      height={142}
      viewBox="0 0 32 160"
      fill="currentColor"
      aria-hidden
    >
      <Figure kind={kind} />
    </svg>
  );
}

export function QueueStrip() {
  return (
    <div className="essay-queue" aria-hidden>
      <div className="essay-queue-row">
        {Array.from({ length: 72 }, (_, index) => (
          <Person key={index} seed={index} />
        ))}
      </div>
      <div className="essay-queue-ground" />
    </div>
  );
}
