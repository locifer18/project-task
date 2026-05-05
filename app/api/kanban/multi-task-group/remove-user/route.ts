import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/client";

export async function PUT(req: NextRequest) {
  try {
    const { groupId, userId } = await req.json();

    if (!groupId || !userId) {
      return NextResponse.json(
        { success: false, error: "groupId and userId are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Remove specific user from group
    await db.multiTaskUser.deleteMany({
      where: {
        groupId,
        userId,
      },
    });

    // 2️⃣ Count remaining users
    const remainingUsers = await db.multiTaskUser.count({
      where: { groupId },
    });

    // 3️⃣ If no users left → delete group
    if (remainingUsers === 0) {
      await db.multiTaskGroup.delete({
        where: { id: groupId },
      });

      return NextResponse.json({
        success: true,
        message: "Group deleted (no users remaining)",
        group: null,
      });
    }

    // 4️⃣ Otherwise return updated group
    const group = await db.multiTaskGroup.findUnique({
      where: { id: groupId },
      include: {
        users: {
          include: {
            user: true,
            task: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      group,
    });

  } catch (error) {
    console.error("Remove User Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to remove user" },
      { status: 500 }
    );
  }
}