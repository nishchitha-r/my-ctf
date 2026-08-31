import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { challenges } from "@/data/challenges";
import { getCompetition } from "@/lib/competition";

export default async function AdminPage() {
  // Check admin authentication
  const cookieStore = await cookies();
  const authenticated = cookieStore.get("admin_authenticated");

  if (authenticated?.value !== "true") {
    redirect("/admin/login");
  }

  // Get registered players
  const { count } = await supabase
    .from("players")
    .select("*", {
      count: "exact",
      head: true,
    });

  // Get challenge status
  const { data: statuses } = await supabase
    .from("challenge_status")
    .select("slug, enabled");

  const statusMap = new Map(
    (statuses ?? []).map((status) => [
      status.slug,
      status.enabled,
    ])
  );

  // Get competition status
  const competition = await getCompetition();

  const now = new Date();

  let competitionStatus = "NOT STARTED";

  if (competition.start_time && competition.end_time) {
    const start = new Date(competition.start_time);
    const end = new Date(competition.end_time);

    if (now >= start && now < end) {
      competitionStatus = "RUNNING";
    } else if (now >= end) {
      competitionStatus = "ENDED";
    }
  }

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono">
      <section className="mx-auto max-w-5xl px-8 py-20">

        {/* HEADER */}
        <p className="text-xs tracking-[0.3em] text-green-700">
          // ADMIN CONTROL PANEL
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-widest">
          ADMIN
        </h1>

        <p className="mt-5 text-green-800">
          Competition management and controls.
        </p>

        {/* COMPETITION CONTROL */}
        <div className="mt-12 border border-green-900 p-6">
          <h2 className="text-xl font-bold tracking-widest">
            COMPETITION
          </h2>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs tracking-widest text-green-700">
                STATUS
              </p>

              <p className="mt-2 text-2xl font-bold">
                {competitionStatus}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <form
                action="/api/admin/competition"
                method="POST"
              >
                <input
                  type="hidden"
                  name="action"
                  value="start"
                />

                <button
                  type="submit"
                  disabled={
                    competitionStatus === "RUNNING"
                  }
                  className="border border-green-500 px-6 py-3 font-bold tracking-widest transition hover:bg-green-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  START
                </button>
              </form>

              <form
                action="/api/admin/competition"
                method="POST"
              >
                <input
                  type="hidden"
                  name="action"
                  value="stop"
                />

                <button
                  type="submit"
                  disabled={
                    competitionStatus !== "RUNNING"
                  }
                  className="border border-red-500 px-6 py-3 font-bold tracking-widest text-red-500 transition hover:bg-red-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  STOP
                </button>
              </form>
            </div>
          </div>

         <div className="mt-6 border-t border-green-950 pt-5 text-sm text-green-800">
  <div>
    Duration: {competition.duration_minutes} minutes
  </div>

  <div className="mt-2">
    Start Time:{" "}
    {competition.start_time
      ? new Date(competition.start_time).toLocaleString()
      : "NOT STARTED"}
  </div>

  <div className="mt-2">
    End Time:{" "}
    {competition.end_time
      ? new Date(competition.end_time).toLocaleString()
      : "NOT SET"}
  </div>
</div>
        </div>

        {/* SCOREBOARD */}
        <div className="mt-8 border border-green-900 p-6">
          <h2 className="text-xl font-bold tracking-widest">
            SCOREBOARD
          </h2>

          <p className="mt-4 text-green-700">
            {count ?? 0} registered players
          </p>

          <form
            action="/api/admin/reset"
            method="POST"
          >
            <button
              type="submit"
              className="mt-6 border border-red-500 px-6 py-3 font-bold tracking-widest text-red-500 transition hover:bg-red-500 hover:text-black"
            >
              RESET SCOREBOARD
            </button>
          </form>
        </div>

        {/* CHALLENGE CONTROL */}
        <div className="mt-8 border border-green-900">

          <div className="border-b border-green-900 p-6">
            <h2 className="text-xl font-bold tracking-widest">
              CHALLENGE CONTROL
            </h2>

            <p className="mt-2 text-sm text-green-800">
              Enable or disable challenges during the competition.
            </p>
          </div>

          {challenges.map((challenge) => {
            const enabled =
              statusMap.get(challenge.slug) ?? true;

            return (
              <div
                key={challenge.slug}
                className="flex flex-col gap-5 border-b border-green-950 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs tracking-widest text-green-700">
                    {challenge.number} // {challenge.category}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {challenge.title}
                  </h3>

                  <p className="mt-2 text-sm text-green-800">
                    {challenge.points} POINTS
                  </p>
                </div>

                <form
                  action="/api/admin/challenges"
                  method="POST"
                >
                  <input
                    type="hidden"
                    name="slug"
                    value={challenge.slug}
                  />

                  <input
                    type="hidden"
                    name="enabled"
                    value={String(!enabled)}
                  />

                  <button
                    type="submit"
                    className={
                      enabled
                        ? "border border-green-500 px-6 py-3 font-bold tracking-widest text-green-400 transition hover:bg-green-500 hover:text-black"
                        : "border border-red-500 px-6 py-3 font-bold tracking-widest text-red-500 transition hover:bg-red-500 hover:text-black"
                    }
                  >
                    {enabled
                      ? "ENABLED ✓"
                      : "DISABLED ✕"}
                  </button>
                </form>
              </div>
            );
          })}
        </div>

      </section>
    </main>
  );
}