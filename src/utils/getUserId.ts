import { cookies } from "next/headers";

export async function getUserId() {
  const nextCookies = await cookies();
  const userCookie = nextCookies.get("LEGGAL::USER");
  const cookieValue = userCookie?.value || "{}";
  const userInfos = JSON.parse(cookieValue);
  return userInfos.id;
}