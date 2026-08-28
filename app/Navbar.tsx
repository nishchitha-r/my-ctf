import Link from "next/link";
import CompetitionTimer from "./CompetitionTimer";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-green-900 px-8 py-4">
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-bold tracking-widest text-green-400"
      >
        NULL//DROP
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-white">
            HOME
          </Link>

          <Link href="/challenges" className="hover:text-white">
            CHALLENGES
          </Link>

          <Link href="/scoreboard" className="hover:text-white">
            SCOREBOARD
          </Link>
        </div>

        <CompetitionTimer />
      </div>
    </nav>
  );
}