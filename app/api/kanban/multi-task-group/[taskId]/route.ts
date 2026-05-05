import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  // MultiTaskGroup model not in schema
  return NextResponse.json({ success: true, group: null }, { status: 200 });
}