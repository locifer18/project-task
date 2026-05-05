import { NextResponse } from "next/server";
import db from "@/lib/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    const userId = searchParams.get("userId");

    if (!taskId || !userId) {
      return NextResponse.json(
        { error: "taskId and userId required" },
        { status: 400 }
      );
    }

    const count = await db.report.count({
      where: {
        taskId,
        reportedBy: userId,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
