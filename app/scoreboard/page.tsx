import { getScoreboard } from "@/lib/scoreboard";

export default async function ScoreboardPage() {
  const players = await getScoreboard();

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono">
      <section className="mx-auto max-w-5xl px-8 py-20">
        <p className="text-xs tracking-[0.3em] text-green-700">
          // SYSTEM RANKINGS
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-widest">
          SCOREBOARD
        </h1>

        <p className="mt-5 text-green-800">
          The strongest operators rise to the top.
        </p>

        <div className="mt-12 overflow-x-auto border border-green-900">
          {/* Table Header */}
          <div className="grid min-w-[700px] grid-cols-5 border-b border-green-900 px-6 py-4 text-xs tracking-widest text-green-700">
            <span>RANK</span>
            <span>PLAYER</span>
            <span className="text-center">SOLVED</span>
            <span className="text-right">POINTS</span>
            <span className="text-right">LAST SOLVE</span>
          </div>

          {players.length === 0 ? (
            <div className="px-6 py-12 text-center text-green-800">
              NO OPERATORS FOUND.
            </div>
          ) : (
            players.map((player, index) => (
              <div
                key={player.id}
                className="grid min-w-[700px] grid-cols-5 border-b border-green-950 px-6 py-5"
              >
                {/* Rank */}
                <span>
                  #{index + 1}
                </span>

                {/* Player */}
                <span className="font-bold">
                  {player.name}
                </span>

                {/* Solved */}
                <span className="text-center">
                  {player.solved}
                </span>

                {/* Points */}
                <span className="text-right font-bold">
                  {player.score}
                </span>

                {/* Latest Solve */}
                <span className="text-right text-xs">
                  {player.latestSolve
                    ? new Date(player.latestSolve).toLocaleTimeString()
                    : "-"}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}