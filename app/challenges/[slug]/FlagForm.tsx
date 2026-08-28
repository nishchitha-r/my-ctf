"use client";

import { useEffect, useState } from "react";

type FlagFormProps = {
  slug: string;
};

const PLAYER_NAME_KEY = "null-drop-player-name";

export default function FlagForm({ slug }: FlagFormProps) {
  const [flag, setFlag] = useState("");
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nameLocked, setNameLocked] = useState(false);

  const [message, setMessage] = useState("");
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // Load saved player name
  useEffect(() => {
    const savedName = localStorage.getItem(PLAYER_NAME_KEY);

    if (savedName) {
      setName(savedName);
      setNameInput(savedName);
      setNameLocked(true);
    }
  }, []);

  function saveName() {
    const trimmedName = nameInput.trim();

    if (!trimmedName) {
      setMessage("Enter your player name first.");
      setCorrect(false);
      return;
    }

    localStorage.setItem(PLAYER_NAME_KEY, trimmedName);

    setName(trimmedName);
    setNameInput(trimmedName);
    setNameLocked(true);

    setMessage("");
    setCorrect(null);
  }

  function changeName() {
    setNameLocked(false);
    setMessage("");
    setCorrect(null);
  }

  async function submitFlag() {
    if (!name.trim()) {
      setMessage("Set your player name first.");
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
          flag: flag.trim(),
        }),
      });

      const data = await response.json();

      setCorrect(data.correct);
      setMessage(data.message);

      if (data.correct) {
        setFlag("");
      }
    } catch {
      setCorrect(false);
      setMessage("Unable to reach the submission server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10">
      {/* PLAYER IDENTITY */}
      <label className="text-xs tracking-widest text-green-700">
        PLAYER NAME
      </label>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
          disabled={nameLocked}
          placeholder="Enter your name"
          className="flex-1 border border-green-900 bg-black px-4 py-3 text-green-400 outline-none focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {nameLocked ? (
          <button
            onClick={changeName}
            className="border border-green-900 px-5 py-3 font-bold tracking-widest transition hover:border-green-500 hover:bg-green-500 hover:text-black"
          >
            CHANGE NAME
          </button>
        ) : (
          <button
            onClick={saveName}
            className="border border-green-500 px-5 py-3 font-bold tracking-widest transition hover:bg-green-500 hover:text-black"
          >
            LOCK NAME
          </button>
        )}
      </div>

      {nameLocked && (
        <p className="mt-2 text-xs text-green-700">
          IDENTITY LOCKED: {name}
        </p>
      )}

      {/* FLAG */}
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
          className="border border-green-500 px-6 py-3 font-bold tracking-widest transition hover:bg-green-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "CHECKING..." : "SUBMIT"}
        </button>
      </div>

      {!nameLocked && (
        <p className="mt-3 text-xs text-yellow-600">
          Lock your player name before submitting a flag.
        </p>
      )}

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