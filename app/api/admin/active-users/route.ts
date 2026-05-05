import { NextResponse } from "next/server";
import db from "@/lib/client";
import { getUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);

    const currentUser = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const allowedRoles = ["ADMIN", "MEMBER"];

    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const users = await db.user.findMany({
      where: {
        role: { in: ["ADMIN", "MEMBER"] },
      }
    });

    // Sort users: active (clocked in) first, then inactive
    const sortedUsers = users.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ success: true, users: sortedUsers });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}