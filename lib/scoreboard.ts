import { supabase } from "@/lib/supabase";
export async function getScoreboard() {
  const { data, error } = await supabase
    .from("players")
    .select(`
      id,
      name,
      score,
      submissions (
        solved_at
      )
    `)
    .order("score", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const players = (data ?? []).map((player) => {
    const submissions = player.submissions ?? [];

    const latestSolve =
      submissions.length > 0
        ? submissions
            .map((submission) => new Date(submission.solved_at))
            .sort((a, b) => b.getTime() - a.getTime())[0]
        : null;

    return {
      id: player.id,
      name: player.name,
      score: player.score,
      solved: submissions.length,
      latestSolve,
    };
  });

  // Higher score first.
  // If scores are equal, earlier latest solve gets priority.
  players.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    if (!a.latestSolve) return 1;
    if (!b.latestSolve) return -1;

    return a.latestSolve.getTime() - b.latestSolve.getTime();
  });

  return players;
}