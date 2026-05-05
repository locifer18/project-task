import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import db from "@/lib/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    if (searchParams.get("all") === "true") {
      const users = await db.user.findMany({
        select: { id: true, name: true, email: true, employeeId: true, role: true, workingAs: true, department: true, image: true, isLogin: true },
        orderBy: { name: "asc" },
      });
      return NextResponse.json({ success: true, users });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let payload: any;
    try { payload = verifyToken(token); } catch { return NextResponse.json({ error: "Invalid token" }, { status: 401 }); }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, employeeId: true, role: true, department: true, phone: true, bio: true, image: true, dob: true, joiningDate: true, workingAs: true, githubProfile: true, isLogin: true, createdAt: true, updatedAt: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let payload: any;
    try { payload = verifyToken(token); } catch { return NextResponse.json({ error: "Invalid token" }, { status: 401 }); }

    const { name, phone, bio, department, workingAs, dob, joiningDate, github } = await req.json();

    const user = await db.user.update({
      where: { id: payload.userId },
      data: { name, phone, bio, department, workingAs, dob, joiningDate: joiningDate ? new Date(joiningDate) : undefined, githubProfile: github },
      select: { id: true, name: true, email: true, employeeId: true, role: true, department: true, phone: true, bio: true, image: true, dob: true, joiningDate: true, workingAs: true, githubProfile: true },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
