"use client";

import { useState } from "react";

/** A code block with a label and copy button. */
export function Snippet({
  command,
  label,
  highlight = false,
  accent = false,
}: {
  command: string;
  label: string;
  /** Ember border and glow, for the one command that shouldn't blend in. */
  highlight?: boolean;
  /** Add a colored left border to a request or command. */
  accent?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const boxClass = highlight
    ? "install-card"
    : accent
      ? "border border-rule border-l-2"
      : "border border-rule";

  return (
    <div
      className={boxClass}
      style={accent ? { borderLeftColor: "var(--color-ember)" } : undefined}
    >
      <div
        className={`flex items-center justify-between px-4 py-2 ${
          highlight ? "border-b border-ember/40" : "border-b border-rule"
        }`}
      >
        <span
          className="label"
          style={highlight ? { color: "var(--color-ember)" } : undefined}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className="mono-xs uppercase tracking-[0.16em] text-fore-2 transition-colors hover:text-fore"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto px-4 py-4 text-[12px] leading-[1.9] text-fore">
        <code>{command}</code>
      </pre>
    </div>
  );
}
