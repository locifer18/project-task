import db from "@/lib/client";
import { getUserIdFromCookies } from "@/lib/getCookies";

export async function POST(req: Request) {
    try {
        const { projectId } = await req.json();
        const userId = await getUserIdFromCookies();

        if (!userId || !projectId) {
            return Response.json(
                { success: false, message: "userId and projectId are required" },
                { status: 400 }
            );
        }

        // Validate project
        const projectExists = await db.project.findUnique({
            where: { id: projectId }
        });

        if (!projectExists) {
            return Response.json(
                { success: false, message: "Project does not exist" },
                { status: 404 }
            );
        }

        // Check if a record already exists for the user
        const existing = await db.projectMember.findFirst({
            where: { userId }
        });

        let selection;

        if (existing) {
            // Update it
            selection = await db.projectMember.update({
                where: { id: existing.id },
                data: { projectId }
            });
        } else {
            // Create new
            selection = await db.projectMember.create({
                data: { userId, projectId }
            });
        }

        return Response.json({
            success: true,
            message: "Project selected successfully",
            selection
        });

    } catch (err) {
        console.error(err);
        return Response.json(
            { success: false, message: "Failed to select project", err },
            { status: 500 }
        );
    }
}
