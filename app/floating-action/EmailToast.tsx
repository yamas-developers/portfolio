"use client";

import { useEffect, useRef, useState } from "react";
import { projectEmail } from "../contact-section/contactDetails";
import { captureEvent } from "../analytics/posthog";

export default function EmailToast() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleShowToast = () => {
      setIsOpen(true);
      setCopied(false);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 6000);
    };

    window.addEventListener("show-email-toast", handleShowToast);
    return () => {
      window.removeEventListener("show-email-toast", handleShowToast);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(projectEmail);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = projectEmail;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      captureEvent("email_copied_to_clipboard", { location: "toast" });

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    } catch {
      // Fallback
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`email-toast${isOpen ? " is-open" : ""}`}
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
      }}
      onMouseLeave={() => {
        if (isOpen) {
          timerRef.current = setTimeout(() => setIsOpen(false), 3000);
        }
      }}
    >
      <span className="toast-message">Opening mail app...</span>
      <button
        type="button"
        className={`toast-copy-btn${copied ? " is-copied" : ""}`}
        onClick={handleCopy}
      >
        {copied ? "Copied! ✓" : "Copy email"}
      </button>
      <button
        type="button"
        className="toast-close-btn"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
