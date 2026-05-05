import db from "@/lib/client";

export async function POST(req: Request) {
  try {
    const { projectId, title, description, dueDate, adminId } = await req.json();

    if (!projectId || !title || !dueDate || !adminId) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user has permission
    const user = await db.user.findUnique({ where: { id: adminId } });
    if (!user || (user.role !== "ADMIN" && user.role !== "EMPLOYEE")) {
      return Response.json(
        { success: false, message: "Only admins and employees can create milestones" },
        { status: 403 }
      );
    }

    const milestone = await db.milestone.create({
      data: {
        projectId,
        title,
        description,
        dueDate: new Date(dueDate),
        status: "PENDING",
        createdBy: adminId,
      },
    });

    return Response.json({ success: true, milestone });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to create milestone",error },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");

    if (!projectId) {
      return Response.json(
        { success: false, message: "projectId required" },
        { status: 400 }
      );
    }

    const milestones = await db.milestone.findMany({
      where: { projectId },
      orderBy: { dueDate: "asc" }
    });

    return Response.json({ success: true, milestones });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to fetch milestones",error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, description, dueDate, status } = await req.json();

    if (!id || !title || !dueDate) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const milestone = await db.milestone.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        status: status || "PENDING",
      },
    });

    return Response.json({ success: true, milestone });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to update milestone" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json(
        { success: false, message: "Milestone ID required" },
        { status: 400 }
      );
    }

    await db.milestone.delete({
      where: { id },
    });

    return Response.json({ success: true, message: "Milestone deleted" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to delete milestone" },
      { status: 500 }
    );
  }
}
