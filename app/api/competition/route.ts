import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("competition_settings")
    .select("name, starts_at, ends_at, is_active")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        active: false,
        message: "Competition configuration unavailable.",
      },
      { status: 500 }
    );
  }

  const now = new Date();
  const start = data.starts_at
    ? new Date(data.starts_at)
    : null;
  const end = data.ends_at
    ? new Date(data.ends_at)
    : null;

  const active =
    data.is_active &&
    start !== null &&
    end !== null &&
    now >= start &&
    now < end;

  return NextResponse.json({
    name: data.name,
    active,
    startsAt: data.starts_at,
    endsAt: data.ends_at,
  });
}