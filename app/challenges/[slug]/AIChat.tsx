"use client";

import { useState } from "react";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "I am SILENT_AI. Ask me something.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Connection to SILENT_AI failed.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="mt-8 border border-green-900 p-6">
      <p className="text-xs tracking-widest text-green-700">
        // SILENT_AI TERMINAL
      </p>

      <div className="mt-5 h-64 overflow-y-auto border border-green-900 bg-black p-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <span className="text-xs text-green-700">
              {message.role === "user" ? "YOU" : "SILENT_AI"}
            </span>

            <p
              className={
                message.role === "user"
                  ? "mt-1 text-green-400"
                  : "mt-1 text-green-600"
              }
            >
              {message.text}
            </p>
          </div>
        ))}

        {loading && (
          <p className="text-green-700">
            SILENT_AI is thinking...
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Talk to SILENT_AI..."
          className="flex-1 border border-green-900 bg-black px-4 py-3 text-green-400 outline-none focus:border-green-400"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="border border-green-500 px-6 py-3 font-bold tracking-widest transition hover:bg-green-500 hover:text-black disabled:opacity-50"
        >
          SEND
        </button>
      </div>
    </div>
  );
}