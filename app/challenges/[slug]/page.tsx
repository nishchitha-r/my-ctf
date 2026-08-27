import FlagForm from "./FlagForm";
import AIChat from "./AIChat";
import { challenges } from "@/data/challenges";

type ChallengePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ChallengePage({
  params,
}: ChallengePageProps) {
  const { slug } = await params;

  const challenge = challenges.find(
    (challenge) => challenge.slug === slug
  );

  if (!challenge) {
    return (
      <main className="min-h-screen bg-black p-10 font-mono text-green-400">
        <h1 className="text-4xl font-bold">TARGET NOT FOUND</h1>

        <p className="mt-4 text-green-700">
          No challenge exists with the identifier: {slug}
        </p>

        <a
          href="/challenges"
          className="mt-8 inline-block border border-green-500 px-5 py-3 hover:bg-green-500 hover:text-black"
        >
          ← BACK TO CHALLENGES
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-green-900 px-8 py-5">
        <a href="/" className="text-xl font-bold tracking-widest">
          NULL//DROP
        </a>

        <a
          href="/challenges"
          className="text-sm hover:text-white"
        >
          ← BACK TO CHALLENGES
        </a>
      </nav>

      {/* Challenge Header */}
      <section className="mx-auto max-w-4xl px-8 py-20">
        <p className="text-xs tracking-[0.3em] text-green-700">
          {challenge.number} // {challenge.category}
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-widest">
          {challenge.title}
        </h1>

        <p className="mt-5 text-green-800">
          {challenge.description}
        </p>

        <div className="mt-6 flex gap-4 text-xs">
          <span className="border border-green-900 px-3 py-2">
            {challenge.difficulty}
          </span>

          <span className="border border-green-900 px-3 py-2">
            {challenge.points} POINTS
          </span>
        </div>

        {/* Challenge Box */}
        <div className="mt-12 border border-green-900 p-8">
          <p className="text-xs tracking-widest text-green-700">
            OBJECTIVE
          </p>

          <p className="mt-4 text-green-800">
  {challenge.objective}
</p>

{challenge.slug === "hidden-signal" && (
  <div className="mt-8">
    <p className="text-xs tracking-widest text-green-700">
      // EVIDENCE FILE
    </p>

    <img
      src="/hidden-signal.png"
      alt="Evidence for Hidden Signal"
      className="mt-4 w-full border border-green-900"
    />

    <p className="mt-4 text-xs text-green-800">
      Analyze the evidence carefully. Something may not be
      what it appears to be.
    </p>
  </div>
)}

{challenge.slug === "silent-ai" && <AIChat />}

<FlagForm slug={challenge.slug} />
        </div>
      </section>
    </main>
  );
}