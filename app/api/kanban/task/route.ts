export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/client";
import cloudinary from "@/lib/cloudinary";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { sendTaskAssignmentEmail } from "@/lib/mailer";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = verifyToken(token) as any;
    return decoded;
  } catch {
    return null;
  }
}

async function uploadFiles(files: File[]) {
  const attachments: any[] = [];
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name} exceeds 10MB`);
    const buffer = Buffer.from(await file.arrayBuffer());
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "kanban_attachments", resource_type: "auto" },
        (err, res) => (err ? reject(err) : resolve(res))
      ).end(buffer);
    });
    attachments.push({
      url: result.secure_url,
      public_id: result.public_id,
      size: file.size,
      contentType: file.type,
      originalName: file.name,
    });
  }
  return attachments;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const assignee = formData.get("assignee") as string;
    const employeeId = formData.get("employeeId") as string;
    const priority = (formData.get("priority") as string)?.trim();
    const dueDate = formData.get("dueDate") as string;
    const tagsRaw = formData.get("tags") as string;
    const status = (formData.get("status") as string)?.trim();
    const projectId = formData.get("projectId") as string | null;
    const attachmentFiles = formData.getAll("attachment") as File[];

    if (!title || !description || !assignee || !priority || !dueDate || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const attachments = attachmentFiles.length > 0 ? await uploadFiles(attachmentFiles) : [];
    const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];

    const task = await db.task.create({
      data: {
        title, description, assignee,
        employeeId: employeeId || null,
        assigneeAvatar: assignee.split(" ").map(n => n[0]).join("").toUpperCase(),
        priority, dueDate: new Date(dueDate),
        tags, attachments, status,
        projectId: projectId || null,
      },
    });

    // Send notification to assigned user
    if (employeeId) {
      const assignedUser = await db.user.findUnique({
        where: { id: employeeId },
        select: { id: true, name: true, email: true },
      });

      if (assignedUser) {
        await db.notification.create({
          data: {
            userId: assignedUser.id,
            title: "New Task Assigned",
            message: `"${title}" has been assigned to you. Due: ${new Date(dueDate).toLocaleDateString()}`,
            type: "TASK_ASSIGNED",
            meta: { taskId: task.id, priority, dueDate },
          },
        });

        if (assignedUser.email) {
          sendTaskAssignmentEmail(
            assignedUser.email, assignedUser.name, title, description,
            new Date(dueDate).toLocaleDateString(), priority
          ).catch(console.error);
        }
      }
    }

    return NextResponse.json({ message: "Task created successfully", task }, { status: 201 });
  } catch (error: any) {
    console.error("TASK CREATE ERROR:", error);
    return NextResponse.json({ message: error?.message || "Failed to create task" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { userId, role } = auth;
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const employeeIdFromQuery = searchParams.get("employeeId");

    const currentUser = await db.user.findUnique({ where: { id: userId } });
    if (!currentUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Build the employeeId filter — match by cuid OR emp-xxx string
    const buildEmployeeFilter = (user: { id: string; employeeId: string | null }) => ({
      OR: [
        { employeeId: user.id },
        ...(user.employeeId ? [{ employeeId: user.employeeId }] : []),
      ],
    });

    let whereClause: any = {};

    if (projectId) {
      // Project kanban — return all tasks for the project
      whereClause.projectId = projectId;
    } else if (searchParams.get("all") === "true" && role === "ADMIN") {
      // Admin dashboard — return all tasks across all users
      whereClause = {};
    } else if (employeeIdFromQuery && role === "ADMIN") {
      // Admin viewing a specific employee's tasks
      const targetUser = await db.user.findUnique({
        where: { id: employeeIdFromQuery },
        select: { id: true, employeeId: true },
      });
      if (targetUser) {
        whereClause = buildEmployeeFilter(targetUser);
      } else {
        whereClause.employeeId = employeeIdFromQuery;
      }
    } else if (employeeIdFromQuery) {
      // Non-admin with explicit employeeId param — look up that user
      const targetUser = await db.user.findUnique({
        where: { id: employeeIdFromQuery },
        select: { id: true, employeeId: true },
      });
      whereClause = targetUser ? buildEmployeeFilter(targetUser) : buildEmployeeFilter(currentUser);
    } else {
      // Current user's own tasks
      whereClause = buildEmployeeFilter(currentUser);
    }

    const tasks = await db.task.findMany({
      where: whereClause,
      include: {
        comments: {
          select: {
            id: true, content: true, createdAt: true,
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        Project: { select: { name: true, id: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, tasks });
  } catch (error: any) {
    console.error("TASK FETCH ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const contentType = req.headers.get("content-type") || "";
    let id: string;
    let data: any = {};

    if (contentType.includes("application/json")) {
      const body = await req.json();
      id = body.id;
      data.status = body.status;
    } else {
      const formData = await req.formData();
      id = formData.get("id") as string;
      const attachmentFiles = formData.getAll("attachment") as File[];
      const switchToUserId = formData.get("switchToUserId") as string | null;

      const attachments = attachmentFiles.length > 0 ? await uploadFiles(attachmentFiles) : [];

      data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        assignee: formData.get("assignee") as string,
        priority: formData.get("priority") as string,
        status: formData.get("status") as string,
        dueDate: new Date(formData.get("dueDate") as string),
        tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
        ...(attachments.length > 0 && { attachments }),
        ...(switchToUserId && { employeeId: switchToUserId }),
      };
    }

    if (!id) return NextResponse.json({ error: "Task ID missing" }, { status: 400 });

    const updatedTask = await db.task.update({
      where: { id },
      data,
      include: {
        comments: {
          select: {
            id: true, content: true, createdAt: true,
            user: { select: { id: true, name: true, image: true } },
          },
        },
        Project: { select: { name: true, id: true } },
      },
    });

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error: any) {
    console.error("TASK UPDATE ERROR:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "Task ID is required" }, { status: 400 });

    await db.task.delete({ where: { id } });
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ message: "Task not found" }, { status: 404 });
    return NextResponse.json({ message: "Failed to delete task" }, { status: 500 });
  }
}
