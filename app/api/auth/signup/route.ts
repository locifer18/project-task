import { NextResponse } from "next/server";
import db from "@/lib/client";
import bcrypt from "bcryptjs";
import { generateAndSendOtp, verifyOtp } from "@/lib/otp-utils";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const action = formData.get("action") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const otp = formData.get("otp") as string;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (action === "send-otp") {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) return NextResponse.json({ error: "User already exists" }, { status: 409 });
      await generateAndSendOtp(email, "SIGNUP");
      return NextResponse.json({ message: "OTP sent to your email" });
    }

    if (action === "verify-otp") {
      const isValid = await verifyOtp(email, otp, "SIGNUP");
      if (!isValid) return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });

      const existing = await db.user.findUnique({ where: { email } });
      if (existing) return NextResponse.json({ error: "User already exists" }, { status: 409 });

      const hashedPassword = await bcrypt.hash(password, 10);

      // Auto-generate employee ID
      const lastUser = await db.user.findFirst({
        where: { employeeId: { not: null } },
        orderBy: { createdAt: "desc" },
        select: { employeeId: true },
      });
      let nextNum = 1;
      if (lastUser?.employeeId) {
        const parsed = parseInt(lastUser.employeeId.split("-")[1], 10);
        if (!isNaN(parsed)) nextNum = parsed + 1;
      }

      const user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          employeeId: `emp-${String(nextNum).padStart(3, "0")}`,
          role: "MEMBER",
        },
      });

      return NextResponse.json(
        { message: "Account created successfully", user: { id: user.id, name: user.name, email: user.email, role: user.role, employeeId: user.employeeId } },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("SIGNUP_ERROR:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
