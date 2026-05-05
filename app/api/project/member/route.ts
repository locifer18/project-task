import db from "@/lib/client";
import { sendProjectAssignmentEmail } from "@/lib/mailer";

//get member of a project
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            return Response.json(
                { success: false, message: "projectId required" },
                { status: 400 }
            );
        }

        const members = await db.projectMember.findMany({
            where: { projectId },
            include: {
                user: {
                    select: {
                        id: true, name: true, email: true, image: true, role: true,
                    }
                }
            }
        });

        return Response.json({ success: true, members });

    } catch (error) {
        console.error(error);
        return Response.json(
            { success: false, message: "Failed to fetch teammates", error },
            { status: 500 }
        );
    }
}

// Add new member to project
export async function POST(req: Request) {
    try {
        const { projectId, userId, role, isLeader } = await req.json();

        if (!projectId || !userId) {
            return Response.json(
                { success: false, message: "projectId and userId are required" },
                { status: 400 }
            );
        }

        // Check if member already exists
        const existingMember = await db.projectMember.findFirst({
            where: { projectId, userId },
        });

        if (existingMember) {
            return Response.json(
                { success: false, message: "User is already a member of this project" },
                { status: 409 }
            );
        }

        // If adding as leader, remove leader status from others
        if (isLeader === true) {
            await db.projectMember.updateMany({
                where: { projectId },
                data: { isLeader: false },
            });
        }

        // Create new member
        const newMember = await db.projectMember.create({
            data: {
                projectId,
                userId,
                role: role || "Member",
                isLeader: isLeader || false,
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                project: {
                    select: { name: true },
                },
            },
        });


        return Response.json({
            success: true,
            message: "Member added successfully",
            member: newMember,
        });

    } catch (error) {
        console.error(error);
        return Response.json(
            { success: false, message: "Failed to add member", error },
            { status: 500 }
        );
    }
}

// Update member role/leader status
export async function PUT(req: Request) {
    try {
        const { projectId, userId, role, isLeader } = await req.json();

        if (!projectId || !userId) {
            return Response.json(
                { success: false, message: "projectId and userId are required" },
                { status: 400 }
            );
        }

        const existingMember = await db.projectMember.findFirst({
            where: { projectId, userId },
        });

        if (!existingMember) {
            return Response.json(
                { success: false, message: "Member not found" },
                { status: 404 }
            );
        }

        if (isLeader === true) {
            await db.projectMember.updateMany({
                where: { projectId },
                data: { isLeader: false },
            });
        }

        const updatedMember = await db.projectMember.update({
            where: { id: existingMember.id },
            data: { role, isLeader },
        });

        return Response.json({ success: true, member: updatedMember });
    } catch (error) {
        return Response.json(
            { success: false, message: "Failed to update member" },
            { status: 500 }
        );
    }
}

// Remove member from project
export async function DELETE(req: Request) {
    try {
        const { projectId, userId } = await req.json();

        if (!projectId || !userId) {
            return Response.json(
                { success: false, message: "projectId and userId are required" },
                { status: 400 }
            );
        }

        const existingMember = await db.projectMember.findFirst({
            where: { projectId, userId },
        });

        if (!existingMember) {
            return Response.json(
                { success: false, message: "Member not found" },
                { status: 404 }
            );
        }

        await db.projectMember.delete({
            where: { id: existingMember.id },
        });

        return Response.json({ success: true, message: "Member removed" });
    } catch (error) {
        return Response.json(
            { success: false, message: "Failed to remove member" },
            { status: 500 }
        );
    }
}
