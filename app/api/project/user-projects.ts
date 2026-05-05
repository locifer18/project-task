import { getUserId } from "@/lib/auth";
import db from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);

    const userProjects = await db.projectMember.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            _count: {
              select: { members: true }
            }
          }
        }
      }
    });

    const projects = userProjects.map(up => ({
      id: up.project.id,
      name: up.project.name,
      summary: up.project.summary,
      priority: up.project.priority,
      basicDetails: up.project.basicDetails,
      membersCount: up.project._count.members,
      createdAt: up.project.createdAt
    }));

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error('Failed to fetch user projects:', error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch projects" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}