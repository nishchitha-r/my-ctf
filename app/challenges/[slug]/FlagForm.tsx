"use client";

import { useEffect, useState } from "react";

type FlagFormProps = {
  slug: string;
};

export default function FlagForm({ slug }: FlagFormProps) {
  const [flag, setFlag] = useState("");
  const [name, setName] = useState("");
  const [nameLocked, setNameLocked] = useState(false);
  const [message, setMessage] = useState("");
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("ctf_player_name");

    if (savedName) {
      setName(savedName);
      setNameLocked(true);
    }
  }, []);

  function lockName() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setMessage("Enter your player name first.");
      setCorrect(false);
      return;
    }

    localStorage.setItem("ctf_player_name", trimmedName);
    setName(trimmedName);
    setNameLocked(true);
    setMessage("Player identity registered.");
    setCorrect(true);
  }

  async function submitFlag() {
    if (!name.trim()) {
      setMessage("Register your player name first.");
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

    try {
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
    } catch {
      setCorrect(false);
      setMessage("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10">
      <label className="text-xs tracking-widest text-green-700">
        PLAYER IDENTITY
      </label>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={nameLocked}
          placeholder="Enter your name"
          className="flex-1 border border-green-900 bg-black px-4 py-3 text-green-400 outline-none focus:border-green-400 disabled:opacity-60"
        />

        {!nameLocked && (
          <button
            onClick={lockName}
            className="border border-green-500 px-6 py-3 font-bold tracking-widest transition hover:bg-green-500 hover:text-black"
          >
            REGISTER
          </button>
        )}
      </div>

      {nameLocked && (
        <p className="mt-2 text-xs text-green-700">
          IDENTITY LOCKED: {name}
        </p>
      )}

      <label className="mt-6 block text-xs tracking-widest text-green-700">
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
          disabled={loading || !nameLocked}
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