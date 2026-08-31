import { supabase } from "@/lib/supabase";

export async function addPoints(
  name: string,
  points: number,
  challengeSlug: string
) {
  // 1. Find the player
  const { data: existingPlayer, error: playerError } =
    await supabase
      .from("players")
      .select("id, name, score")
      .eq("name", name)
      .maybeSingle();

  if (playerError) {
    throw new Error(playerError.message);
  }

  let player = existingPlayer;

  // 2. Create player if they don't exist
  if (!player) {
    const { data: newPlayer, error: createError } =
      await supabase
        .from("players")
        .insert({
          name,
          score: 0,
        })
        .select("id, name, score")
        .single();

    if (createError) {
      throw new Error(createError.message);
    }

    player = newPlayer;
  }

  // 3. Check whether this challenge was already solved
  const { data: existingSubmission, error: submissionError } =
    await supabase
      .from("submissions")
      .select("id")
      .eq("player_id", player.id)
      .eq("challenge_slug", challengeSlug)
      .maybeSingle();

  if (submissionError) {
    throw new Error(submissionError.message);
  }

  // Prevent duplicate points
  if (existingSubmission) {
    return false;
  }

  // 4. Record the solved challenge
  const { error: insertError } = await supabase
    .from("submissions")
    .insert({
      player_id: player.id,
      challenge_slug: challengeSlug,
      solved_at: new Date().toISOString(),
    });

  if (insertError) {
    throw new Error(insertError.message);
  }

  // 5. Add points
  const { error: scoreError } = await supabase
    .from("players")
    .update({
      score: player.score + points,
    })
    .eq("id", player.id);

  if (scoreError) {
    throw new Error(scoreError.message);
  }

  return true;
}


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
            .sort(
              (a, b) => b.getTime() - a.getTime()
            )[0]
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

    return (
      a.latestSolve.getTime() -
      b.latestSolve.getTime()
    );
  });

  return players;
}