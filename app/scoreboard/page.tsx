import { getScoreboard } from "@/lib/scoreboard";

function formatSolveTime(timestamp: string | null) {
  if (!timestamp) {
    return "—";
  }

  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default async function ScoreboardPage() {
  const players = await getScoreboard();

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <p className="text-xs tracking-[0.3em] text-green-700">
          // SYSTEM RANKINGS
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-widest sm:text-5xl">
          SCOREBOARD
        </h1>

        <p className="mt-5 max-w-2xl text-sm text-green-800 sm:text-base">
          The strongest operators rise to the top.
        </p>

        <div className="mt-10 overflow-hidden border border-green-900">
          {/* Header */}
          <div className="hidden grid-cols-12 border-b border-green-900 px-6 py-4 text-xs tracking-widest text-green-700 sm:grid">
            <span className="col-span-2">RANK</span>
            <span className="col-span-4">PLAYER</span>
            <span className="col-span-2 text-center">SOLVED</span>
            <span className="col-span-2 text-right">POINTS</span>
            <span className="col-span-2 text-right">LAST SOLVE</span>
          </div>

          {players.length === 0 ? (
            <div className="px-6 py-12 text-center text-green-800">
              NO OPERATORS FOUND.
            </div>
          ) : (
            players.map((player, index) => (
              <div
                key={player.name}
                className="border-b border-green-950 px-5 py-5 last:border-b-0 sm:grid sm:grid-cols-12 sm:items-center sm:px-6"
              >
                {/* Rank */}
                <div className="sm:col-span-2">
                  <span className="text-xs text-green-700 sm:hidden">
                    RANK{" "}
                  </span>

                  <span className="font-bold">
                    #{index + 1}
                  </span>
                </div>

                {/* Player */}
                <div className="mt-3 sm:col-span-4 sm:mt-0">
                  <span className="text-xs text-green-700 sm:hidden">
                    PLAYER{" "}
                  </span>

                  <span className="font-bold">
                    {player.name}
                  </span>
                </div>

                {/* Solved */}
                <div className="mt-3 sm:col-span-2 sm:mt-0 sm:text-center">
                  <span className="text-xs text-green-700 sm:hidden">
                    SOLVED{" "}
                  </span>

                  <span>{player.solvedCount}</span>
                </div>

                {/* Points */}
                <div className="mt-3 sm:col-span-2 sm:mt-0 sm:text-right">
                  <span className="text-xs text-green-700 sm:hidden">
                    POINTS{" "}
                  </span>

                  <span className="font-bold">
                    {player.score}
                  </span>
                </div>

                {/* Latest solve */}
                <div className="mt-3 text-xs sm:col-span-2 sm:mt-0 sm:text-right">
                  <span className="text-green-700 sm:hidden">
                    LAST SOLVE{" "}
                  </span>

                  <span className="text-green-500">
                    {formatSolveTime(player.latestSolve)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}