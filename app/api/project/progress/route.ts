import db from "@/lib/client";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = verifyToken(token) as any;
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { progress } = await req.json();

  const user = await db.user.findUnique({
    where: { id: payload.userId || payload.id },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  if (user.role !== "ADMIN") {
    const isLeader = await db.projectMember.findFirst({
      where: {
        projectId: id!,
        userId: user.id,
        isLeader: true,
      },
    });

    if (!isLeader) {
      return Response.json({ error: "Only admin/leader can update progress" }, { status: 403 });
    }
  }

  const updated = await db.project.update({
    where: { id: id! },
    data: { progress },
  });

  return Response.json(updated);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const project = await db.project.findUnique({
    where: { id: id! },
    select: { progress: true },
  });

  return Response.json(project);
}
