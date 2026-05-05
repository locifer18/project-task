import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/client";

export async function PUT(req: NextRequest) {
  try {
    const { groupId, user } = await req.json();

    if (!groupId || !user) {
      return NextResponse.json(
        { success: false, error: "groupId and user required" },
        { status: 400 }
      );
    }

    const exists = await db.multiTaskUser.findFirst({
      where: {
        groupId,
        userId: user.userId,
      },
    });

    if (exists) {
      return NextResponse.json(
        { success: false, error: "User already exists in group" },
        { status: 400 }
      );
    }

    await db.multiTaskUser.create({
      data: {
        groupId,
        taskId: user.taskId,
        userId: user.userId,
        name: user.name,
        role: user.role,
      },
    });

    const group = await db.multiTaskGroup.findUnique({
      where: { id: groupId },
      include: { users: true },
    });

    return NextResponse.json({
      success: true,
      group,
    });
  } catch (error) {
    console.error("Add User Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add user" },
      { status: 500 }
    );
  }
}