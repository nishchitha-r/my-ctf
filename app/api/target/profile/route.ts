import { NextResponse } from "next/server";

const profiles: Record<string, {
  id: string;
  username: string;
  role: string;
  message: string;
  flag?: string;
}> = {
  "1001": {
    id: "1001",
    username: "guest",
    role: "user",
    message:
  "Welcome, guest. Account records are maintained in sequential order.",
  },

  "1002": {
    id: "1002",
    username: "admin",
    role: "administrator",
    message:
      "ADMIN PROFILE — This account contains restricted information.",
    flag: "FLAG{broken_gate_101}",
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      {
        error: "Missing profile identifier.",
      },
      { status: 400 }
    );
  }

  const profile = profiles[id];

  if (!profile) {
    return NextResponse.json(
      {
        error: "Profile not found.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(profile);
}