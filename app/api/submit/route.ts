import { NextResponse } from "next/server";
import { challenges } from "@/data/challenges";
import { flags } from "@/lib/flags";
import { addPoints } from "@/lib/scoreboard";

export async function POST(request: Request) {
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

  // 3. Get the correct flag from the SERVER-ONLY flag store
  const correctFlag = flags[slug];

  if (!correctFlag) {
    return NextResponse.json(
      {
        correct: false,
        message: "Flag configuration not found.",
      },
      { status: 500 }
    );
  }

  // 4. Check submitted flag
  if (flag.trim() === correctFlag) {
    // 5. Add points
    const added = await addPoints(
      name,
      challenge.points,
      challenge.slug
    );

    // 6. Prevent duplicate scoring
    if (!added) {
      return NextResponse.json({
        correct: false,
        alreadySolved: true,
        message: "You already solved this challenge.",
      });
    }

    return NextResponse.json({
      correct: true,
      message: `Correct! You earned ${challenge.points} points.`,
      points: challenge.points,
    });
  }

  // 7. Wrong flag
  return NextResponse.json({
    correct: false,
    message: "Incorrect flag. Keep investigating.",
  });
}