import { NextResponse } from "next/server";
import { getCompetition } from "@/lib/competition";

export async function GET() {
  try {
    const competition = await getCompetition();

    return NextResponse.json({
      success: true,
      competition,
    });
  } catch (error) {
    console.error("Competition API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load competition.",
      },
      { status: 500 }
    );
  }
}