import { NextResponse } from "next/server";
import db from "@/lib/client";
import { getUserId, getUserRole } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const role = await getUserRole(req);
    if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await db.user.findMany({
      include: {
        projectMembers: { include: { project: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// Admin can update a user's role
export async function PUT(req: Request) {
  try {
    const role = await getUserRole(req);
    if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { userId, newRole } = await req.json();
    if (!userId || !["ADMIN", "MEMBER"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
