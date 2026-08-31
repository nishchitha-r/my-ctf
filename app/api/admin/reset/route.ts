import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function POST() {
  const cookieStore = await cookies();
  const authenticated =
    cookieStore.get("admin_authenticated");

  if (authenticated?.value !== "true") {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  try {
    // Remove solved challenge records
    const { error: submissionsError } =
      await supabase
        .from("submissions")
        .delete()
        .neq("id", 0);

    if (submissionsError) {
      throw new Error(
        submissionsError.message
      );
    }

    // Keep players, but reset their scores
    const { error: playersError } =
      await supabase
        .from("players")
        .update({ score: 0 })
        .neq("id", 0);

    if (playersError) {
      throw new Error(playersError.message);
    }

    return NextResponse.json({
      success: true,
      message:
        "Scoreboard reset successfully.",
    });
  } catch (error) {
    console.error("Reset error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to reset scoreboard.",
      },
      { status: 500 }
    );
  }
}