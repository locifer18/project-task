import db from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    const projectId = searchParams.get("projectId")
    const id = searchParams.get("id")
    try {
    if (!projectId) {
        return NextResponse.json({success: false, response: "Provide a project ID"}, {status: 400})
    }

    if (id) {
        const data = await db.workDone.findMany({
            where: {id: id}
        })
        return NextResponse.json({success: true, response: data}, {status: 200})
    }

    const data = await db.workDone.findMany({
        where: {projectId: projectId},
        include: {completedBy: {
            select: {
                name: true, id: true, image: true, department: true
            }
        }}
    })
    return NextResponse.json({success: true, response: data}, {status: 200})
}
catch (err) {
        return NextResponse.json({success: false, response: err}, {status: 400})
}
}

/**
 * POST /api/work-done
 * Create a new workDone record
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      projectId,
      taskId,
      title,
      description,
      priority,
      dueDate,
      tags,
      userId,
    } = body;

    if (
      !projectId ||
      !taskId ||
      !title ||
      !description ||
      !priority ||
      !dueDate ||
      !userId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const workDone = await db.workDone.create({
      data: {
        projectId,
        taskId,
        title,
        description,
        priority,
        dueDate: new Date(dueDate),
        tags: tags ?? [],
        userId,
      },
    });

    return NextResponse.json(workDone, { status: 201 });
  } catch (error) {
    console.error("POST workDone error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/work-done
 * Update an existing workDone record
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      title,
      description,
      priority,
      dueDate,
      tags,
      completedBy,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "workDone id is required" },
        { status: 400 }
      );
    }

    const workDone = await db.workDone.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        tags,
        userId: completedBy,
      },
    });

    return NextResponse.json(workDone, { status: 200 });
  } catch (error) {
    console.error("PUT workDone error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/work-done
 * Delete a workDone record
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const taskId = searchParams.get("taskId");

    if (id) {
        await db.workDone.delete({
          where: { id },
        });
    return NextResponse.json(
      { message: "workDone deleted successfully" },
      { status: 200 }
    );
}
        await db.workDone.delete({
          where: { taskId: taskId },
        });
    

    return NextResponse.json(
      { message: "workDone deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE workDone error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
