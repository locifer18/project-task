import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // MultiTaskGroup model not in schema — tasks are created individually
  return NextResponse.json({ success: true, group: null }, { status: 201 });
}
