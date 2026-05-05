import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import db from "@/lib/client";

export async function getUserId(req?: Request): Promise<string> {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) token = authHeader.substring(7);
  }

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  }

  if (!token) throw new Error("Unauthorized");
  const payload = verifyToken(token) as any;
  return payload.userId;
}

export async function getUserRole(req?: Request): Promise<string> {
  const userId = await getUserId(req);
  const user = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
  return user?.role || "MEMBER";
}

export async function getUser(req?: Request) {
  const userId = await getUserId(req);
  return db.user.findUnique({ where: { id: userId } });
}
