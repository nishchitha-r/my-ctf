import { supabase } from "@/lib/supabase";

export async function getChallengeStatus(slug: string) {
  try {
    const { data, error } = await supabase
      .from("challenge_status")
      .select("enabled")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Challenge status error:", error);
      return true;
    }

    return data?.enabled ?? true;
  } catch (error) {
    console.error("Challenge status fetch failed:", error);
    return true;
  }
}