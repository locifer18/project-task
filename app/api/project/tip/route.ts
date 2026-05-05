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

        return Response.json({ success: true, tip: { ...user, tip } });
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

        return Response.json({ success: true, tips: [] });
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

        return Response.json({ success: true, message: "Tip deleted" });
    } catch (err) {
        console.error(err);
        return Response.json(
            { success: false, message: "Failed to delete tip", err },
            { status: 500 }
        );
    }
}
