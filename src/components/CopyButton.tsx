import { useState } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
};

export function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
      alert("Could not copy text. Please copy manually.");
    }
  }

  return (
    <button type="button" className="copy-button" onClick={handleCopy}>
      {copied ? "Copied!" : label}
    </button>
  );
}
