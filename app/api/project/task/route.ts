import db from "@/lib/client";

export async function GET() {
  const completedTasks = await db.task.findMany({
    where: { status: "Completed" },

  });

  return Response.json(completedTasks);
}

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: "Task ID missing" }, { status: 400 });
  }
  try {
    const updatedTask = await db.task.update({
      where: { id },
      data: { status: "Completed" },
    });

    return Response.json(updatedTask);
  } catch (err) {
    return Response.json({ error: err }, { status: 500 });
  }
}