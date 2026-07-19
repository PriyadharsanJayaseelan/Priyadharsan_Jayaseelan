import { useState, useEffect, useCallback } from "react";

const GMAIL_ADDRESS = "priyadharsanjayaseelan@gmail.com";
const OUTLOOK_ADDRESS = "pjayasee@kent.edu";

const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${GMAIL_ADDRESS}`;
const OUTLOOK_COMPOSE = `https://outlook.office.com/mail/deeplink/compose?to=${OUTLOOK_ADDRESS}`;

/** Call this from any button to open the picker. */
export function openEmailPicker() {
  window.dispatchEvent(new CustomEvent("open-email-picker"));
}

function ProviderRow({
  name,
  address,
  composeUrl,
  icon,
}: {
  name: string;
  address: string;
  composeUrl: string;
  icon: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <a
      href={composeUrl}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-4 p-4 rounded-2xl no-underline transition-all duration-200 group"
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,255,255,0.22)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.03)";
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,255,255,0.1)";
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white mb-0.5">{name}</div>
        <div
          className="text-xs truncate"
          style={{ color: "hsl(240,4%,58%)" }}
        >
          {address}
        </div>
      </div>
      <button
        onClick={copy}
        aria-label={`Copy ${address}`}
        className="text-xs px-3 py-1.5 rounded-full flex-shrink-0 cursor-pointer transition-all duration-200"
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          background: "transparent",
          color: copied ? "#4ade80" : "hsl(240,4%,62%)",
        }}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <span
        className="text-sm transition-transform duration-200 group-hover:translate-x-0.5"
        style={{ color: "hsl(240,4%,55%)" }}
      >
        →
      </span>
    </a>
  );
}

export default function EmailPicker() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      setOpen(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    };
    window.addEventListener("open-email-picker", show);
    return () => window.removeEventListener("open-email-picker", show);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-6">
      {/* Backdrop */}
      <div
        onClick={close}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "rgba(0,15,30,0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-md rounded-3xl p-8 transition-all duration-300"
        style={{
          background: "hsl(201,80%,10%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)",
        }}
      >
        {/* Close */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h3
          className="text-3xl font-normal text-white mb-2"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Let's talk.
        </h3>
        <p className="text-sm mb-7" style={{ color: "hsl(240,4%,60%)" }}>
          Pick whichever inbox works best for you.
        </p>

        <div className="flex flex-col gap-3">
          <ProviderRow
            name="Gmail"
            address={GMAIL_ADDRESS}
            composeUrl={GMAIL_COMPOSE}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 6.5V18a1.5 1.5 0 001.5 1.5H6V10l6 4.5 6-4.5v9.5h2.5A1.5 1.5 0 0022 18V6.5l-10 7.5L2 6.5z"
                  fill="#EA4335"
                />
                <path d="M2 6.5l10 7.5 10-7.5V6a1.5 1.5 0 00-2.4-1.2L12 10.4 4.4 4.8A1.5 1.5 0 002 6v.5z" fill="#fff" fillOpacity="0.85" />
              </svg>
            }
          />
          <ProviderRow
            name="Outlook"
            address={OUTLOOK_ADDRESS}
            composeUrl={OUTLOOK_COMPOSE}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="12" height="14" rx="2" fill="#0078D4" />
                <ellipse cx="8" cy="12" rx="3.2" ry="3.6" fill="#fff" />
                <ellipse cx="8" cy="12" rx="1.6" ry="2" fill="#0078D4" />
                <path d="M15 8h6a1 1 0 011 1v9a1 1 0 01-1 1h-6V8z" fill="#28A8EA" />
                <path d="M15 8l3.5 2.5L22 8v1.2l-3.5 2.5L15 9.2V8z" fill="#fff" fillOpacity="0.85" />
              </svg>
            }
          />
        </div>

        <p
          className="text-xs mt-6 text-center"
          style={{ color: "hsl(240,4%,45%)" }}
        >
          Opens a compose window in a new tab. Or copy the address for your own
          mail app.
        </p>
      </div>
    </div>
  );
}
