import { NextResponse } from "next/server";
import db from "@/lib/client";
import { getUserIdFromCookies } from "@/lib/getCookies";

export async function POST(req: Request) {
  try {

    const userId = await getUserIdFromCookies();// extract user ID from token

    // Parse body input
    const { message, taskId } = await req.json();

    if (!message || !taskId) {
      return NextResponse.json(
        { error: "Message & Task ID are required" },
        { status: 400 }
      );
    }

    // Create report entry
    const report = await db.report.create({
      data: {
        message,
        taskId,
        reportedBy: userId, // stored as 'reportedBy' in Prisma model
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    // Get user ID for counting user-specific reports
    const userId = await getUserIdFromCookies();
    
    // Count reports by this user for this task (if user is authenticated)
    const count = userId ? await db.report.count({
      where: {
        taskId,
        reportedBy: userId,
      },
    }) : 0;

    // Get all messages for this task
    const messages = await db.report.findMany({
      where: {
        taskId,
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      userId: userId || null,
      taskId,
      count,
      messages,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

