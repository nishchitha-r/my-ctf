"use client";

import { useState } from "react";

type FlagFormProps = {
  slug: string;
};

export default function FlagForm({ slug }: FlagFormProps) {
  const [flag, setFlag] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitFlag() {
    if (!name.trim()) {
    setMessage("Enter your player name first.");
    setCorrect(false);
    return;
    }

    if (!flag.trim()) {
    setMessage("Enter a flag first.");
    setCorrect(false);
    return;
    }

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        slug,
        flag,
      }),
    });

    const data = await response.json();

    setCorrect(data.correct);
    setMessage(data.message);
    setLoading(false);
  }

  return (
    <div className="mt-10">
      <label className="text-xs tracking-widest text-green-700">
      PLAYER NAME
      </label>

      <input
      type="text"
      value={name}
      onChange={(event) => setName(event.target.value)}
      placeholder="Enter your name"
      className="mt-3 w-full border border-green-900 bg-black px-4 py-3 text-green-400 outline-none focus:border-green-400"
      />
      <label className="text-xs tracking-widest text-green-700">
        ENTER FLAG
      </label>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={flag}
          onChange={(event) => setFlag(event.target.value)}
          placeholder="FLAG{...}"
          className="flex-1 border border-green-900 bg-black px-4 py-3 text-green-400 outline-none focus:border-green-400"
        />

        <button
          onClick={submitFlag}
          disabled={loading}
          className="border border-green-500 px-6 py-3 font-bold tracking-widest transition hover:bg-green-500 hover:text-black disabled:opacity-50"
        >
          {loading ? "CHECKING..." : "SUBMIT"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-4 text-sm ${
            correct ? "text-green-400" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}