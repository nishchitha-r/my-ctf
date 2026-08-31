import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { password } = body;

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required.",
        },
        { status: 400 }
      );
    }

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error(
        "ADMIN_PASSWORD is not configured."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Admin authentication is not configured.",
        },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid admin password.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
    });

    response.cookies.set(
      "admin_authenticated",
      "true",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 4,
      }
    );

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}