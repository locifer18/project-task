import { NextResponse } from "next/server";
import db from "@/lib/client";
import bcrypt from "bcryptjs";
import { generateAndSendOtp, verifyOtp } from "@/lib/otp-utils";

// export async function POST(req: Request) {
//   try {
//     const { email, otp, newPassword, action } = await req.json();

//     if (action === "send-otp") {
//       // Check if user exists
//       const user = await db.user.findUnique({ where: { email } });
//       if (!user) {
//         return NextResponse.json({ error: "User not found" }, { status: 404 });
//       }

//       await generateAndSendOtp(email, "FORGOT_PASSWORD");
//       return NextResponse.json({ message: "OTP sent successfully" });
//     }

//     if (action === "reset-password") {
//       const isValid = await verifyOtp(email, otp, "FORGOT_PASSWORD");
//       if (!isValid) {
//         return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
//       }

//       // Reset password
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       await db.user.update({
//         where: { email },
//         data: { password: hashedPassword }
//       });

//       return NextResponse.json({ message: "Password reset successfully" });
//     }

//     return NextResponse.json({ error: "Invalid action" }, { status: 400 });
//   } catch (error) {
//     console.error("FORGOT_PASSWORD_ERROR:", error.message);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, newPassword, action } = body;
    // console.log(email, otp, newPassword, action);
    

    // ✅ GLOBAL validation
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (action === "send-otp") {
      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      await generateAndSendOtp(email, "FORGOT_PASSWORD");
      return NextResponse.json({ message: "OTP sent successfully" });
    }

    if (action === "reset-password") {
      if (!otp || !newPassword) {
        return NextResponse.json(
          { error: "OTP and new password are required" },
          { status: 400 }
        );
      }

      const isValid = await verifyOtp(email, otp, "FORGOT_PASSWORD");
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid or expired OTP" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ message: "Password reset successfully" });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

