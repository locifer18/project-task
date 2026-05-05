import db from "@/lib/client";

export async function POST(req: Request) {
    try {
        const { projectId, userId, tip } = await req.json();

        if (!projectId || !userId || !tip) {
            return Response.json(
                { success: false, message: "projectId, userId, tip are required" },
                { status: 400 }
            );
        }

        // Fetch user
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { name: true }
        });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const newTip = await db.usefulTip.create({
            data: { projectId, userId, user: user.name, tip },
        });

        return Response.json({ success: true, tip: newTip });
    } catch (err) {
        console.error(err);
        return Response.json(
            { success: false, message: "Failed to add tip", err },
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
                { success: false, message: "projectId is required" },
                { status: 400 }
            );
        }

        const tips = await db.usefulTip.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" }
        });

        return Response.json({ success: true, tips });
    } catch (err) {
        console.error(err);
        return Response.json(
            { success: false, message: "Failed to fetch tips", err },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { tipId } = await req.json();

        if (!tipId) {
            return Response.json(
                { success: false, message: "tipId is required" },
                { status: 400 }
            );
        }

        await db.usefulTip.delete({ where: { id: tipId } });

        return Response.json({ success: true, message: "Tip deleted" });
    } catch (err) {
        console.error(err);
        return Response.json(
            { success: false, message: "Failed to delete tip", err },
            { status: 500 }
        );
    }
}
