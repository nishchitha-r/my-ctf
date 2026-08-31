"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid password.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono">
      <section className="mx-auto max-w-md px-8 py-24">
        <p className="text-xs tracking-[0.3em] text-green-700">
          // RESTRICTED ACCESS
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-widest">
          ADMIN LOGIN
        </h1>

        <p className="mt-4 text-sm text-green-800">
          Authorized operators only.
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-10 border border-green-900 p-6"
        >
          <label className="text-xs tracking-widest text-green-700">
            ADMIN PASSWORD
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3 w-full border border-green-900 bg-black px-4 py-3 text-green-400 outline-none focus:border-green-400"
            placeholder="ENTER PASSWORD"
            required
          />

          {error && (
            <p className="mt-4 border border-red-900 px-4 py-3 text-xs text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full border border-green-500 px-5 py-3 text-xs font-bold tracking-widest transition hover:bg-green-500 hover:text-black disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "ENTER ADMIN PANEL →"}
          </button>
        </form>
      </section>
    </main>
  );
}