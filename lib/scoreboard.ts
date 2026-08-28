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

  // 5. Add points to player's score
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
  const { data: players, error: playersError } =
    await supabase
      .from("players")
      .select("id, name, score")
      .order("score", { ascending: false });

  if (playersError) {
    throw new Error(playersError.message);
  }

  if (!players || players.length === 0) {
    return [];
  }

  const { data: submissions, error: submissionsError } =
    await supabase
      .from("submissions")
      .select("player_id, solved_at");

  if (submissionsError) {
    throw new Error(submissionsError.message);
  }

  const scoreboard = players.map((player) => {
    const playerSubmissions =
      submissions?.filter(
        (submission) =>
          submission.player_id === player.id
      ) ?? [];

    const latestSolve =
      playerSubmissions.length > 0
        ? playerSubmissions
            .map((submission) => submission.solved_at)
            .sort(
              (a, b) =>
                new Date(b).getTime() -
                new Date(a).getTime()
            )[0]
        : null;

    return {
      name: player.name,
      score: player.score,
      solvedCount: playerSubmissions.length,
      latestSolve,
    };
  });

  return scoreboard;
}