const challenges = [
  {
    number: "01",
    slug: "broken-gate",
    category: "WEB",
    title: "BROKEN GATE",
    description: "Find your way through a vulnerable web application.",
    points: 100,
    difficulty: "EASY",
  },
  {
    number: "02",
    slug: "hidden-signal",
    category: "STEGO",
    title: "HIDDEN SIGNAL",
    description: "Something is hiding inside the evidence.",
    points: 150,
    difficulty: "MEDIUM",
  },
  {
    number: "03",
    slug: "silent-ai",
    category: "AI",
    title: "SILENT AI",
    description: "Make an AI reveal what it was never supposed to reveal.",
    points: 200,
    difficulty: "HARD",
  },
];

export default function Challenges() {
  return (
    <main className="min-h-screen bg-black text-green-400 font-mono">
      {/* Navigation */}
      

      {/* Header */}
      <section className="mx-auto max-w-5xl px-8 py-16">
        <p className="text-xs tracking-[0.3em] text-green-700">
          // TARGET DIRECTORY
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-widest">
          CHALLENGES
        </h1>

        <p className="mt-5 max-w-2xl text-green-800">
          Select a target. Study the evidence. Find the flag.
        </p>
      </section>

      {/* Challenge List */}
      <section className="mx-auto max-w-5xl px-8 pb-20">
        <div className="space-y-5">
          {challenges.map((challenge) => (
            <div
              key={challenge.number}
              className="border border-green-900 p-6 transition hover:border-green-400"
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row">
                <div>
                  <p className="text-xs tracking-widest text-green-700">
                    {challenge.number} // {challenge.category}
                  </p>

                  <h2 className="mt-3 text-2xl font-bold">
                    {challenge.title}
                  </h2>

                  <p className="mt-3 max-w-xl text-sm text-green-800">
                    {challenge.description}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <span className="border border-green-900 px-3 py-1 text-xs">
                    {challenge.difficulty}
                  </span>

                  <span className="text-lg font-bold">
                    {challenge.points} PTS
                  </span>

                  <a
  href={`/challenges/${challenge.slug}`}
  className="border border-green-500 px-5 py-2 text-xs font-bold tracking-widest transition hover:bg-green-500 hover:text-black"
>
  ACCESS →
</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-green-900 px-8 py-6 text-center text-xs text-green-800">
        NULL//DROP — TARGETS ARE WAITING.
      </footer>
    </main>
  );
}