import { supabase } from "@/lib/supabase";

export async function getChallengeStatus(slug: string) {
  const { data, error } = await supabase
    .from("challenge_status")
    .select("enabled")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  // If no status exists, keep the challenge enabled.
  return data?.enabled ?? true;
}