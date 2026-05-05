import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import db from "@/lib/client";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "No token" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, image: true, employeeId: true, department: true, isLogin: true },
    });

    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
