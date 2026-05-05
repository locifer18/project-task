import { NextResponse } from "next/server";
import db from "@/lib/client";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = verifyToken(token) as any;
    return decoded.userId || null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { taskId, content } = await req.json();
    if (!taskId || !content) return NextResponse.json({ error: "taskId and content required" }, { status: 400 });

    const comment = await db.comment.create({
      data: { content, taskId, userId },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("COMMENT POST ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { commentId, content } = await req.json();
    if (!commentId || !content) return NextResponse.json({ success: false }, { status: 400 });

    // Only allow editing own comment
    const existing = await db.comment.findUnique({ where: { id: commentId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.comment.update({ where: { id: commentId }, data: { content } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { commentId } = await req.json();
    if (!commentId) return NextResponse.json({ error: "commentId required" }, { status: 400 });

    const existing = await db.comment.findUnique({ where: { id: commentId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
