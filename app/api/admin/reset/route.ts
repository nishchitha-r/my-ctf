import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const authenticated =
    cookieStore.get("admin_authenticated");

  if (authenticated?.value !== "true") {
    return NextResponse.redirect(
      new URL("/admin/login", request.url),
      303
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
      throw new Error(submissionsError.message);
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

    // Return to admin panel after successful reset
    return NextResponse.redirect(
      new URL("/admin", request.url),
      303
    );
  } catch (error) {
    console.error("Reset error:", error);

    return NextResponse.redirect(
      new URL("/admin?reset=failed", request.url),
      303
    );
  }
}