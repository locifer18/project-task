import { NextResponse } from "next/server";
import db from "@/lib/client";
import { getUserId, getUserRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const roleName = await getUserRole(req);
    if (roleName !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Only admins can create projects" }, { status: 403 });
    }

    const body = await req.json();
    const { name, summary, priority, basicDetails, memberIds, budget, projectType, startDate, deadline, supervisorAdmin, clientName, repository } = body;

    if (!name || !priority) {
      return NextResponse.json({ success: false, message: "Name and priority are required" }, { status: 400 });
    }

    const project = await db.project.create({
      data: {
        name, summary, priority,
        repository: repository || null,
        basicDetails,
        projectInfo: {
          create: {
            budget: parseFloat(budget) || 0,
            projectType,
            startDate: new Date(startDate),
            deadline: new Date(deadline),
            supervisorAdmin: supervisorAdmin || null,
            clientName: clientName || null,
          },
        },
      },
    });

    if (memberIds?.length) {
      await db.projectMember.createMany({
        data: memberIds.map((uid: string) => ({ projectId: project.id, userId: uid })),
        skipDuplicates: true,
      });

      // Notify each member
      await db.notification.createMany({
        data: memberIds.map((uid: string) => ({
          userId: uid,
          title: "New Project Assigned",
          message: `You have been assigned to project "${name}"`,
          type: "PROJECT_ASSIGNED",
          meta: { projectId: project.id, projectName: name },
        })),
      });
    }

    return NextResponse.json({ success: true, message: "Project created successfully", project }, { status: 201 });
  } catch (error: any) {
    console.error("PROJECT CREATE ERROR:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to create project" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userOnly = searchParams.get('userOnly');

    let roleName = "EMPLOYEE";
    let userId = "";
    try {
      roleName = await getUserRole(req);
      userId = await getUserId(req);
    } catch {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (userOnly === 'true' || roleName !== 'ADMIN') {
      const userProjects = await db.projectMember.findMany({
        where: { userId },
        include: {
          project: {
            include: {
              _count: { select: { members: true } },
              projectInfo: true,
            },
          },
        },
      });

      const projects = userProjects.map((up: any) => ({
        id: up.project.id,
        name: up.project.name,
        summary: up.project.summary,
        priority: up.project.priority,
        basicDetails: up.project.basicDetails,
        membersCount: up.project._count.members,
        progress: up.project.progress,
        createdAt: up.project.createdAt,
        deadline: up.project.projectInfo?.deadline,
        projectType: up.project.projectInfo?.projectType,
      }));

      return NextResponse.json({ success: true, projects });
    }

    const projects = await db.project.findMany({
      include: {
        _count: { select: { members: true } },
        projectInfo: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedProjects = projects.map(p => ({
      id: p.id,
      name: p.name,
      summary: p.summary,
      priority: p.priority,
      basicDetails: p.basicDetails,
      membersCount: p._count.members,
      progress: p.progress,
      createdAt: p.createdAt,
      deadline: p.projectInfo?.deadline,
      projectType: p.projectInfo?.projectType,
    }));

    return NextResponse.json({ success: true, projects: formattedProjects });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Failed to fetch projects" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const roleName = await getUserRole(req);
    if (roleName !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) return NextResponse.json({ success: false, message: "Project ID required" }, { status: 400 });

    await db.project.delete({ where: { id: projectId } });
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const roleName = await getUserRole(req);
    if (roleName !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { projectId, name, summary, priority, basicDetails, budget, projectType, startDate, deadline, supervisorAdmin, repository, currentPhase } = body;

    if (!projectId) return NextResponse.json({ success: false, message: "Project ID required" }, { status: 400 });

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (summary !== undefined) updateData.summary = summary;
    if (priority !== undefined) updateData.priority = priority;
    if (repository !== undefined) updateData.repository = repository || null;
    if (basicDetails !== undefined) updateData.basicDetails = basicDetails;
    if (currentPhase !== undefined) updateData.currentPhase = currentPhase;

    if (budget !== undefined && projectType !== undefined) {
      updateData.projectInfo = {
        update: {
          budget: parseFloat(budget) || 0,
          projectType,
          startDate: new Date(startDate),
          deadline: new Date(deadline),
          supervisorAdmin: supervisorAdmin || null,
        },
      };
    }

    const project = await db.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: "Project updated", project });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Failed" }, { status: 500 });
  }
}
