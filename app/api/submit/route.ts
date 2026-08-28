import { NextResponse } from "next/server";
import { challenges } from "@/data/challenges";
import { challengeFlags } from "@/data/flags";
import { addPoints } from "@/lib/scoreboard";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { slug, flag, name } = body;

    // 1. Validate input
    if (!slug || !flag || !name) {
      return NextResponse.json(
        {
          correct: false,
          message: "Missing player name, challenge or flag.",
        },
        { status: 400 }
      );
    }

    // 2. Find the challenge
    const challenge = challenges.find(
      (challenge) => challenge.slug === slug
    );

    if (!challenge) {
      return NextResponse.json(
        {
          correct: false,
          message: "Challenge not found.",
        },
        { status: 404 }
      );
    }

    // 3. Get the secret flag from the SERVER-ONLY file
    const correctFlag = challengeFlags[slug];

    if (!correctFlag) {
      return NextResponse.json(
        {
          correct: false,
          message: "Challenge configuration error.",
        },
        { status: 500 }
      );
    }

    // 4. Check submitted flag
    if (flag.trim() !== correctFlag) {
      return NextResponse.json({
        correct: false,
        message: "Incorrect flag. Keep investigating.",
      });
    }

    // 5. Award points
    const added = await addPoints(
      name.trim(),
      challenge.points,
      challenge.slug
    );

    // 6. Prevent duplicate solves
    if (!added) {
      return NextResponse.json({
        correct: false,
        alreadySolved: true,
        message: "You already solved this challenge.",
      });
    }

    // 7. Success
    return NextResponse.json({
      correct: true,
      message: `Correct! You earned ${challenge.points} points.`,
      points: challenge.points,
    });
  } catch (error) {
    console.error("Submission error:", error);

    return NextResponse.json(
      {
        correct: false,
        message: "Something went wrong while processing your submission.",
      },
      { status: 500 }
    );
  }
}