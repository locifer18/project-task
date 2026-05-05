import { NextResponse } from "next/server";
import db from "@/lib/client";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const existingTask = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const deleted = await db.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(
      { message: "Task deleted successfully", deletedTask: deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);

    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}

export async function GET(req:Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  try {
    const tasks = await db.task.findMany({
      where: {
        projectId: id,
      },
      include: {
        Project: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(tasks);
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}