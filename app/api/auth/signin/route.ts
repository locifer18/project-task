import { NextResponse } from "next/server";
import db from "@/lib/client";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: { OR: [{ email }, { employeeId: email }] },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = createToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        employeeId: user.employeeId,
        department: user.department,
        isLogin: user.isLogin,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error("SIGNIN ERROR:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
