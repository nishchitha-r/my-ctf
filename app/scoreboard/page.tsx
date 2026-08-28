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

        <div className="mt-12 border border-green-900">
          <div className="grid grid-cols-3 border-b border-green-900 px-6 py-4 text-xs tracking-widest text-green-700">
            <span>RANK</span>
            <span>PLAYER</span>
            <span className="text-right">POINTS</span>
          </div>

          {players.length === 0 ? (
            <div className="px-6 py-12 text-center text-green-800">
              NO OPERATORS FOUND.
            </div>
          ) : (
            players.map((player, index) => (
              <div
                key={player.name}
                className="grid grid-cols-3 border-b border-green-950 px-6 py-5"
              >
                <span>
                  #{index + 1}
                </span>

                <span className="font-bold">
                  {player.name}
                </span>

                <span className="text-right">
                  {player.score}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}