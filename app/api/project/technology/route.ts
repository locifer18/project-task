import db from "@/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { projectId, tech } = await req.json();

    if (!projectId || !Array.isArray(tech)) {
      return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
    }

    const projectTechnology = await db.projectTechnology.upsert({
      where: { projectId },
      update: { tech },
      create: { projectId, tech }
    });

    return NextResponse.json({ success: true, data: projectTechnology });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update technology" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ success: false, message: "Project ID required" }, { status: 400 });
    }

    const projectTechnology = await db.projectTechnology.findUnique({
      where: { projectId }
    });

    return NextResponse.json({ success: true, data: projectTechnology });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch technology" }, { status: 500 });
  }
}