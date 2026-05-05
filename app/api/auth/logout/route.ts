import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Logout internal server error" },
      { status: 500 }
    );
  }
}
