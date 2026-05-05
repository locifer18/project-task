import { NextResponse } from "next/server";
import db from "@/lib/client";
import { getUserId } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const roleParam = url.searchParams.get("role");

        if (!roleParam) {
            return NextResponse.json(
                { error: "Role is required" },
                { status: 400 }
            );
        }

        const roleUpper = roleParam.toUpperCase();

        const validRoles = ["ADMIN", "MEMBER"];
        if (!validRoles.includes(roleUpper)) {
            return NextResponse.json(
                { error: "Invalid role" },
                { status: 400 }
            );
        }

        const userId = await getUserId(req);

        const currentUser = await db.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const users = await db.user.findMany({
            where: { role: roleUpper },
            include: {
                projectMembers: {
                    include: {
                        project: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, users });

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Server error" },
            { status: 500 }
        );
    }
}