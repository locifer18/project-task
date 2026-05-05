import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import db from "@/lib/client";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = verifyToken(token) as any;
    if (admin.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { name, email, password, role, dob, joiningDate, department, workingAs, phone } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

    const lastEmployee = await db.user.findFirst({
      where: { employeeId: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { employeeId: true },
    });

    let nextNumber = 1;
    if (lastEmployee?.employeeId) {
      const num = parseInt(lastEmployee.employeeId.split("-")[1], 10);
      if (!isNaN(num)) nextNumber = num + 1;
    }

    const employeeId = `emp-${String(nextNumber).padStart(3, "0")}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name, email, password: hashedPassword, role,
        department, workingAs, phone, dob,
        joiningDate: joiningDate ? new Date(joiningDate) : null,
        isLogin: false,
        employeeId,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, name, email, phone, department, workingAs, image, dob, joiningDate, employeeId, role } = await req.json();

    if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    if (!name || !email) return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });

    const existingUser = await db.user.findUnique({ where: { id } });
    if (!existingUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        name, email,
        phone: phone || null,
        department: department || null,
        workingAs: workingAs || null,
        image: image || null,
        employeeId: employeeId || null,
        dob: dob || null,
        joiningDate: joiningDate ? new Date(joiningDate) : undefined,
        role,
      },
    });

    return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error("UPDATE_USER_ERROR:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const user = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await db.projectMember.deleteMany({ where: { userId: user.id } });
    await db.notification.deleteMany({ where: { userId: user.id } });
    await db.user.delete({ where: { id: user.id } });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE_USER_ERROR:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
