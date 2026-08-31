import { cookies } from "next/headers";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  const adminCookie = cookieStore.get("null-drop-admin");

  return adminCookie?.value === "authenticated";
}