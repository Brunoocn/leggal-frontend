import { cookies } from "next/headers";

export async function getToken() {
    const nextCookies = await cookies();
    const token = nextCookies.get("LEGGAL::TOKEN");
    return token?.value;
}