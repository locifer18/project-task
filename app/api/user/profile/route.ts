import { NextResponse } from "next/server";
import db from "@/lib/client";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");

    const decoded: any = verifyToken(token);

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        department: true,
        employeeId: true,
      },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
