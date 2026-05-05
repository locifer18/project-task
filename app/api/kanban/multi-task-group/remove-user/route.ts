import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // MultiTaskGroup model not in schema
  return NextResponse.json({ success: true, group: null }, { status: 200 });
}
