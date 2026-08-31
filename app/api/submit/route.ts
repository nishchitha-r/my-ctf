import { NextResponse } from "next/server";
import { challenges } from "@/data/challenges";
import { challengeFlags } from "@/data/flags";
import { addPoints } from "@/lib/scoreboard";
import { getChallengeStatus } from "@/lib/challengeStatus";

// Rate limiting
const attempts = new Map<
  string,
  { count: number; resetAt: number }
>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 1000; // 10 seconds

export async function POST(request: Request) {
  try {
    // 1. Identify the requester
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");

    const ip =
      forwardedFor?.split(",")[0].trim() ||
      realIp ||
      "unknown";

    // 2. Check rate limit
    const now = Date.now();
    const existing = attempts.get(ip);

    if (existing && now < existing.resetAt) {
      if (existing.count >= MAX_ATTEMPTS) {
        const secondsLeft = Math.ceil(
          (existing.resetAt - now) / 1000
        );

        return NextResponse.json(
          {
            correct: false,
            rateLimited: true,
            message: `Too many attempts. Please wait ${secondsLeft} seconds.`,
          },
          { status: 429 }
        );
      }

      existing.count += 1;
    } else {
      attempts.set(ip, {
        count: 1,
        resetAt: now + WINDOW_MS,
      });
    }

    // 3. Read request body
    const body = await request.json();

    const { slug, flag, name } = body;

    // 4. Validate input
    if (!slug || !flag || !name) {
      return NextResponse.json(
        {
          correct: false,
          message: "Missing player name, challenge or flag.",
        },
        { status: 400 }
      );
    }

    // 5. Find the challenge
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
    // Check whether the challenge is enabled
const enabled = await getChallengeStatus(slug);

if (!enabled) {
  return NextResponse.json(
    {
      correct: false,
      message: "This challenge is currently disabled.",
    },
    { status: 403 }
  );
}

    // 6. Get the secret flag from the server-only file
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

    // 7. Check submitted flag
    if (flag.trim() !== correctFlag) {
      return NextResponse.json({
        correct: false,
        message: "Incorrect flag. Keep investigating.",
      });
    }

    // 8. Award points
    const added = await addPoints(
      name.trim(),
      challenge.points,
      challenge.slug
    );

    // 9. Prevent duplicate solves
    if (!added) {
      return NextResponse.json({
        correct: false,
        alreadySolved: true,
        message: "You already solved this challenge.",
      });
    }

    // 10. Success
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
        message:
          "Something went wrong while processing your submission.",
      },
      { status: 500 }
    );
  }
}