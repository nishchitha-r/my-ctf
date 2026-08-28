"use client";

import { useState } from "react";

export default function TargetPanel() {
  const [profileId, setProfileId] = useState("1001");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function accessProfile() {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch(
        `/api/target/profile?id=${profileId}`
      );

      const data = await response.json();

      setResult(JSON.stringify(data, null, 2));
    } catch {
      setResult("Connection to target failed.");
    }

    setLoading(false);
  }

  return (
    <div className="mt-8 border border-green-900 p-6">
      <p className="text-xs tracking-widest text-green-700">
        // TARGET SYSTEM
      </p>

      <div className="mt-4 space-y-2 text-sm text-green-800">
        <p>Profile lookup service</p>
        <p>Current session: GUEST</p>
        <p className="text-green-700">
          Authorized profile: 1001
        </p>
      </div>

      <div className="mt-6 border border-green-900 p-4">
        <p className="text-xs tracking-widest text-green-700">
          PROFILE LOOKUP
        </p>

        <p className="mt-3 text-xs text-green-800">
          Enter a profile identifier to retrieve account information.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={profileId}
            onChange={(event) =>
              setProfileId(event.target.value)
            }
            className="flex-1 border border-green-900 bg-black px-4 py-3 text-green-400 outline-none focus:border-green-400"
            placeholder="Profile ID"
          />

          <button
            onClick={accessProfile}
            disabled={loading}
            className="border border-green-500 px-6 py-3 font-bold tracking-widest transition hover:bg-green-500 hover:text-black disabled:opacity-50"
          >
            {loading ? "ACCESSING..." : "ACCESS"}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6">
          <p className="text-xs tracking-widest text-green-700">
            // SERVER RESPONSE
          </p>

          <pre className="mt-3 overflow-x-auto border border-green-900 bg-black p-4 text-sm text-green-500">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}