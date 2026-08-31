import { NextResponse } from "next/server";
import { challenges } from "@/data/challenges";
import { challengeFlags } from "@/data/flags";
import { addPoints } from "@/lib/scoreboard";
import { getChallengeStatus } from "@/lib/challengeStatus";
import { getCompetition } from "@/lib/competition";
import { supabase } from "@/lib/supabase";

// Rate limiting
const attempts = new Map<
  string,
  { count: number; resetAt: number }
>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 1000;

export async function POST(request: Request) {
  try {
    // 1. Identify requester
    const forwardedFor =
      request.headers.get("x-forwarded-for");

    const realIp =
      request.headers.get("x-real-ip");

    const ip =
      forwardedFor?.split(",")[0].trim() ||
      realIp ||
      "unknown";

    // 2. Rate limit
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

    // 3. Check competition
    const competition = await getCompetition();

    if (
      !competition.is_active ||
      !competition.start_time ||
      !competition.end_time
    ) {
      return NextResponse.json(
        {
          correct: false,
          message:
            "Competition is not currently active.",
        },
        { status: 403 }
      );
    }

    const startTime = new Date(
      competition.start_time
    ).getTime();

    const endTime = new Date(
      competition.end_time
    ).getTime();

    const currentTime = Date.now();

    if (
      currentTime < startTime ||
      currentTime >= endTime
    ) {
      return NextResponse.json(
        {
          correct: false,
          message: "Competition has ended.",
        },
        { status: 403 }
      );
    }

    // 4. Read request
    const body = await request.json();

    const {
      playerToken,
      slug,
      flag,
    } = body;

    // 5. Validate input
    if (!playerToken || !slug || !flag) {
      return NextResponse.json(
        {
          correct: false,
          message:
            "Missing player, challenge or flag.",
        },
        { status: 400 }
      );
    }

    // 6. Find player using server-generated token
    const { data: player, error: playerError } =
      await supabase
        .from("players")
        .select("id, name")
        .eq("player_token", playerToken)
        .maybeSingle();

    if (playerError) {
      throw new Error(playerError.message);
    }

    if (!player) {
      return NextResponse.json(
        {
          correct: false,
          message:
            "Invalid player session.",
        },
        { status: 401 }
      );
    }

    // 7. Find challenge
    const challenge = challenges.find(
      (challenge) =>
        challenge.slug === slug
    );

    if (!challenge) {
      return NextResponse.json(
        {
          correct: false,
          message:
            "Challenge not found.",
        },
        { status: 404 }
      );
    }

    // 8. Check challenge status
    const enabled =
      await getChallengeStatus(slug);

    if (!enabled) {
      return NextResponse.json(
        {
          correct: false,
          message:
            "This challenge is currently disabled.",
        },
        { status: 403 }
      );
    }

    // 9. Get secret flag
    const correctFlag =
      challengeFlags[slug];

    if (!correctFlag) {
      return NextResponse.json(
        {
          correct: false,
          message:
            "Challenge configuration error.",
        },
        { status: 500 }
      );
    }

    // 10. Check flag
    if (flag.trim() !== correctFlag) {
      return NextResponse.json({
        correct: false,
        message:
          "Incorrect flag. Keep investigating.",
      });
    }

    // 11. Award points to authenticated player
    const added = await addPoints(
      player.name,
      challenge.points,
      challenge.slug
    );

    // 12. Prevent duplicate solves
    if (!added) {
      return NextResponse.json({
        correct: false,
        alreadySolved: true,
        message:
          "You already solved this challenge.",
      });
    }

    // 13. Success
    return NextResponse.json({
      correct: true,
      message:
        `Correct! You earned ${challenge.points} points.`,
      points: challenge.points,
    });
  } catch (error) {
    console.error(
      "Submission error:",
      error
    );

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