import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/client";

export async function POST(req: NextRequest) {
  try {
    const { createdBy, users } = await req.json();

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, error: "No users provided" },
        { status: 400 }
      );
    }

    const group = await db.multiTaskGroup.create({
      data: {
        createdBy,
        users: {
          create: users.map((u: any) => ({
            taskId: u.taskId,
            userId: u.userId,
            name: u.name,
            role: u.role,
          })),
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(
      { success: true, group },
      { status: 201 }
    );
  } catch (error) {
    console.error("MultiTaskGroup Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create group" },
      { status: 500 }
    );
  }
}