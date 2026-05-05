import { NextResponse } from "next/server";
import db from "@/lib/client";
import { getUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { status: true }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      status: project.status 
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getUserId(req);
    const { projectId, status } = await req.json();

    if (!projectId || status === undefined) {
      return NextResponse.json(
        { error: "projectId and status are required" },
        { status: 400 }
      );
    }

    if (status < 0 || status > 100) {
      return NextResponse.json(
        { error: "Status must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Check if user is team leader or admin
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        projectMembers: {
          where: { projectId }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isTeamLeader = user.projectMembers.some(member => member.isLeader);
    const isAdmin = user.role === "ADMIN";

    if (!isTeamLeader && !isAdmin) {
      return NextResponse.json(
        { error: "Only team leaders and admins can update project status" },
        { status: 403 }
      );
    }

    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: { status }
    });

    return NextResponse.json({
      success: true,
      status: updatedProject.status
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}