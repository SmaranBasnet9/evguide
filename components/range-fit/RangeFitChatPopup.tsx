"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles } from "lucide-react";

interface ChatEntry {
  role: "user" | "assistant";
  text: string;
}

const STARTER_PROMPT =
  "From Manchester to Sheffield in a Kia EV6, there and back — how much battery would that use?";

export default function RangeFitChatPopup() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatEntry[]>([
    {
      role: "assistant",
      text: "Tell me where you're going — e.g. \"From Leeds to York and back in a Tesla Model Y\" — and I'll estimate how much battery you'll use.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, open]);

  async function send(message: string) {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setHistory((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/range-fit-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setHistory((prev) => [
        ...prev,
        { role: "assistant", text: data.reply ?? data.error ?? "Sorry, something went wrong." },
      ]);
    } catch {
      setHistory((prev) => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-hover ${open ? "hidden" : "flex"}`}
      >
        <Sparkles className="h-4 w-4" />
        Ask about a route
      </button>

      {/* Popup panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              <p className="text-sm font-bold text-gray-900">Route &amp; battery chat</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-gray-400 transition hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {history.map((entry, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  entry.role === "user"
                    ? "ml-auto bg-brand text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {entry.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-3.5 py-2.5 text-sm text-gray-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Working it out…
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Starter suggestion */}
          {history.length === 1 && (
            <button
              type="button"
              onClick={() => send(STARTER_PROMPT)}
              className="mx-4 mb-2 rounded-xl border border-dashed border-gray-300 px-3 py-2 text-left text-xs text-gray-500 transition hover:border-brand/40 hover:text-brand"
            >
              Try: &ldquo;{STARTER_PROMPT}&rdquo;
            </button>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-gray-200 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. From Bristol to Bath and back…"
              maxLength={500}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition hover:bg-brand-hover disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
