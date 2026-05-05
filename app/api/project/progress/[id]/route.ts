import db from "@/lib/client";
import { getUserIdFromCookies } from "@/lib/getCookies";

export async function PATCH(req:Request) {
  const session = await getUserIdFromCookies()
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { progress } = await req.json();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check role
  if (session.user.role !== "ADMIN") {
    // Check if user is leader of this project
    const isLeader = await db.projectMember.findFirst({
      where: {
        projectId: id,
        userId: session.user.id,
        isLeader: true,
      },
    });

    if (!isLeader) {
      return Response.json({ error: "Only admin/leader can update progress" }, { status: 403 });
    }
  }

  const updated = await db.project.update({
    where: { id },
    data: { progress },
  });

  return Response.json(updated);
}


export async function GET(req:Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const project = await db.project.findUnique({
    where: { id },
    select: { progress: true },
  });

  return Response.json(project);
}
