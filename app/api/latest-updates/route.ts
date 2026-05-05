import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/client";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "Project ID required" },
        { status: 400 }
      );
    }

    const updates = await db.latestUpdate.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    return NextResponse.json({ success: true, updates });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch updates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, projectId, createdBy } = await req.json();

    if (!title || !projectId || !createdBy) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const projectUser = await db.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    const update = await db.latestUpdate.create({
      data: {
        title,
        projectId,
        createdBy,
        date: new Date().toLocaleDateString()
      }
    });

    // Get user IDs
    const userIds = projectUser?.members.map((m: any) => m.userId) ?? [];

    // Fetch users with roles
    const users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, name: true, role: true },
    });

    // Send DB notifications to all members
    await Promise.all(
      users.map((user: any) =>
        db.notification.create({
          data: {
            userId: user.id,
            title: "Project Update",
            message: "A new project update has been posted.",
            type: "PROJECT_UPDATE",
            meta: { projectId, updateId: update.id },
          },
        })
      )
    );

    return NextResponse.json({ success: true, update });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create update" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload: any = verifyToken(token);
    const userId = payload.userId || payload.id;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admin can delete updates" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await db.latestUpdate.delete({ where: { id: id } });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("DELETE MEETING ERROR:", error);
    return NextResponse.json({ error: "Failed to latest" }, { status: 500 });
  }
}
