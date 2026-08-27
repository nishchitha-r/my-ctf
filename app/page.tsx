export default function Home() {
  return (
    <main className="min-h-screen bg-black text-green-400 font-mono">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-green-900 px-8 py-5">
        <div className="text-xl font-bold tracking-widest">
          NULL//DROP
        </div>

        <div className="flex gap-6 text-sm">
          <a href="/" className="hover:text-white">
            HOME
          </a>
          <a href="/challenges" className="hover:text-white">
            CHALLENGES
          </a>
          <a href="/scoreboard" className="hover:text-white">
            SCOREBOARD
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm tracking-[0.4em] text-green-700">
          SYSTEM ONLINE
        </p>

        <h1 className="text-6xl font-black tracking-widest text-green-400 md:text-8xl">
          NULL//DROP
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-green-700">
          A digital dead drop containing secrets, vulnerabilities and
          challenges. Find the flags. Break the system.
        </p>

        <a
          href="/challenges"
          className="mt-10 border border-green-500 px-8 py-4 text-sm font-bold tracking-widest transition hover:bg-green-500 hover:text-black"
        >
          ENTER THE DROP →
        </a>
      </section>

      {/* Status */}
      <section className="border-y border-green-900 px-8 py-10">
        <div className="mx-auto grid max-w-4xl gap-8 text-center md:grid-cols-3">
          <div>
            <p className="text-3xl font-bold">03</p>
            <p className="mt-2 text-xs tracking-widest text-green-700">
              CHALLENGES
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold">∞</p>
            <p className="mt-2 text-xs tracking-widest text-green-700">
              ATTEMPTS
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold">ONLINE</p>
            <p className="mt-2 text-xs tracking-widest text-green-700">
              SYSTEM STATUS
            </p>
          </div>
        </div>
      </section>

      {/* Challenge Categories */}
      <section className="mx-auto max-w-5xl px-8 py-20">
        <p className="mb-3 text-xs tracking-[0.3em] text-green-700">
          AVAILABLE TARGETS
        </p>

        <h2 className="mb-10 text-3xl font-bold tracking-widest">
          CHALLENGES
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="border border-green-900 p-6 transition hover:border-green-400">
            <p className="text-xs text-green-700">01 // WEB</p>
            <h3 className="mt-4 text-xl font-bold">BROKEN GATE</h3>
            <p className="mt-3 text-sm text-green-800">
              Find your way through a vulnerable web application.
            </p>
            <p className="mt-6 text-xs">100 POINTS</p>
          </div>

          <div className="border border-green-900 p-6 transition hover:border-green-400">
            <p className="text-xs text-green-700">02 // STEGO</p>
            <h3 className="mt-4 text-xl font-bold">HIDDEN SIGNAL</h3>
            <p className="mt-3 text-sm text-green-800">
              Something is hiding inside the evidence.
            </p>
            <p className="mt-6 text-xs">150 POINTS</p>
          </div>

          <div className="border border-green-900 p-6 transition hover:border-green-400">
            <p className="text-xs text-green-700">03 // AI</p>
            <h3 className="mt-4 text-xl font-bold">SILENT AI</h3>
            <p className="mt-3 text-sm text-green-800">
              Make an AI reveal what it was never supposed to reveal.
            </p>
            <p className="mt-6 text-xs">200 POINTS</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-900 px-8 py-6 text-center text-xs text-green-800">
        NULL//DROP — FIND THE FLAG.
      </footer>
    </main>
  );
}