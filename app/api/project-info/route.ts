import db from "@/lib/client";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    try {
        const info = await db.projectInfo.findUnique({
            where: { projectId }
        });

        return Response.json({ data: info ?? {} });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}



export async function POST(req: Request) {
    const body = await req.json();
    const { projectId, budget, clientName, projectType, startDate, deadline } = body;

    if (!budget || !clientName || !projectType || !startDate || !deadline) {
      return Response.json(
        { error: "All fields (budget, clientName, projectType, startDate, deadline) are required." },
        { status: 400 }
      );
    }

    try {
        const info = await db.projectInfo.create({
            data: {
                projectId,
                budget: Number(budget),
                clientName,
                projectType,
                startDate: new Date(startDate),
                deadline: new Date(deadline),
            }
        });

        return Response.json({ message: "created", data: info });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}


export async function PUT(req: Request) {
    const body = await req.json();
    const { projectId, budget, clientName, projectType, startDate, deadline } = body;

    try {
        const exists = await db.projectInfo.findUnique({ where: { projectId } });
        if (!exists) {
            return Response.json({ error: "Record not found" }, { status: 404 });
        }

        const updated = await db.projectInfo.update({
            where: { projectId },
            data: {
                budget: budget !== undefined ? Number(budget) : exists.budget,
                clientName: clientName ?? exists.clientName,
                projectType: projectType ?? exists.projectType,
                startDate: startDate ? new Date(startDate) : exists.startDate,
                deadline: deadline ? new Date(deadline) : exists.deadline,
            }
        });

        return Response.json({ message: "updated", data: updated });
    } catch (error) {
        return Response.json({ error }, { status: 500 })
    }
}


export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    try {
        await db.projectInfo.delete({
            where: { projectId },
        });

        return Response.json({ message: "deleted" });
    } catch (error) {
        return Response.json({ error }, { status: 500 });

    }
}
