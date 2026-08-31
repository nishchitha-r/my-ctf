import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request
) {
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
    const contentType =
      request.headers.get("content-type") ?? "";

    let slug = "";
    let enabled = false;

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      const body = await request.json();

      slug = body.slug;
      enabled = body.enabled;
    } else {
      const formData =
        await request.formData();

      slug = String(
        formData.get("slug") ?? ""
      );

      enabled =
        String(
          formData.get("enabled")
        ) === "true";
    }

    if (
      !slug ||
      typeof enabled !== "boolean"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid challenge status.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("challenge_status")
      .upsert(
        {
          slug,
          enabled,
        },
        {
          onConflict: "slug",
        }
      );

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.redirect(
      new URL("/admin", request.url)
    );
  } catch (error) {
    console.error(
      "Challenge status error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update challenge status.",
      },
      { status: 500 }
    );
  }
}