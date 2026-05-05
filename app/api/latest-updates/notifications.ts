import { NextResponse } from "next/server";
import db from "@/lib/client";
import { getUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);
    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ notifications });
  } catch {
    return NextResponse.json({ notifications: [] });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserId(req);
    await db.notification.deleteMany({ where: { userId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
