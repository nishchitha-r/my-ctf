import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Player name is required.",
        },
        { status: 400 }
      );
    }

    if (name.length > 30) {
      return NextResponse.json(
        {
          success: false,
          message: "Player name is too long.",
        },
        { status: 400 }
      );
    }

    // Check whether this name already exists
    const { data: existingPlayer, error: findError } =
      await supabase
        .from("players")
        .select("id, name, player_token")
        .eq("name", name)
        .maybeSingle();

    if (findError) {
      throw new Error(findError.message);
    }

    // Existing player
    if (existingPlayer) {
      if (!existingPlayer.player_token) {
        const token = randomUUID();

        const { error: updateError } =
          await supabase
            .from("players")
            .update({
              player_token: token,
            })
            .eq("id", existingPlayer.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        return NextResponse.json({
          success: true,
          playerId: existingPlayer.id,
          name: existingPlayer.name,
          playerToken: token,
        });
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "This player name is already registered.",
        },
        { status: 409 }
      );
    }

    // Create new player
    const token = randomUUID();

    const { data: player, error: createError } =
      await supabase
        .from("players")
        .insert({
          name,
          score: 0,
          player_token: token,
        })
        .select("id, name, player_token")
        .single();

    if (createError) {
      throw new Error(createError.message);
    }

    return NextResponse.json({
      success: true,
      playerId: player.id,
      name: player.name,
      playerToken: player.player_token,
    });
  } catch (error) {
    console.error(
      "Player registration error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to register player.",
      },
      { status: 500 }
    );
  }
}