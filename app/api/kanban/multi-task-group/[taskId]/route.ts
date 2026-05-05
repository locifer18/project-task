import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = await params;
    
    

    const group = await db.multiTaskGroup.findFirst({
      where: {
        users: {
          some: {
            taskId: taskId,
          },
        },
      },
      include: {
        users: true,
      },
    });
    

    if (!group) {
      return NextResponse.json(
        { success: false, error: "Group not found for this taskId" },
        { status: 404 }
      );
    }

    // console.log(group,"hello");
    
    return NextResponse.json(
      { success: true, group },
      { status: 200 }
    );
  } catch (error) {
    console.error("MultiTaskGroup GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}