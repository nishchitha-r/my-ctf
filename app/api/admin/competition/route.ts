import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  startCompetition,
  stopCompetition,
} from "@/lib/competition";

export async function POST(request: Request) {
  // Check admin authentication
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
    const formData = await request.formData();
    const action = String(
      formData.get("action") ?? ""
    );

    if (action === "start") {
      await startCompetition();

      return NextResponse.redirect(
        new URL("/admin", request.url),
        303
      );
    }

    if (action === "stop") {
      await stopCompetition();

      return NextResponse.redirect(
        new URL("/admin", request.url),
        303
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid competition action.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "Competition control error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update competition.",
      },
      { status: 500 }
    );
  }
}