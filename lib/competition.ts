import { supabase } from "@/lib/supabase";

const COMPETITION_DURATION_MINUTES = 120;

export async function getCompetition() {
  const { data, error } = await supabase
    .from("competition_settings")
    .select("id, starts_at, ends_at, is_active")
    .eq("id", 1)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    start_time: data.starts_at,
    end_time: data.ends_at,
    duration_minutes: COMPETITION_DURATION_MINUTES,
    is_active: data.is_active,
  };
}

export async function startCompetition() {
  const now = new Date();

  const endTime = new Date(
    now.getTime() +
      COMPETITION_DURATION_MINUTES * 60 * 1000
  );

  const { error } = await supabase
    .from("competition_settings")
    .update({
      starts_at: now.toISOString(),
      ends_at: endTime.toISOString(),
      is_active: true,
    })
    .eq("id", 1);

  if (error) {
    throw new Error(error.message);
  }

  return {
    startTime: now.toISOString(),
    endTime: endTime.toISOString(),
  };
}

export async function stopCompetition() {
  const now = new Date();

  const { error } = await supabase
    .from("competition_settings")
    .update({
      ends_at: now.toISOString(),
      is_active: false,
    })
    .eq("id", 1);

  if (error) {
    throw new Error(error.message);
  }
}