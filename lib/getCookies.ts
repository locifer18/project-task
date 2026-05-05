import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserIdFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.id; // your JWT contains { id }
  } catch {
    return null;
  }
}
