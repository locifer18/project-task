import db from "@/lib/client";

export async function POST(req: Request) {
  try {
    const { projectId, reportedBy, reason, blockedTeammates } = await req.json();

    if (!projectId || !reportedBy || !reason) {
      return Response.json(
        { success: false, message: "projectId, reportedBy, reason are required" },
        { status: 400 }
      );
    }
    // console.log(projectId, reportedBy, reason, blockedTeammates, "ticket data");
    const teammateNames = blockedTeammates.map(
      (t: { id: string; name: string }) => t.name
    );
    // console.log(teammateNames, "teammate names");

    const ticket = await db.ticket.create({
      data: {
        projectId,
        reportedBy,
        reason,
        blockedTeammates: teammateNames || []
      },
    });

    return Response.json({ success: true, ticket });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Failed to create blockage ticket", err },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");

    if (!projectId) {
      return Response.json(
        { success: false, message: "projectId is required" },
        { status: 400 }
      );
    }

    const tickets = await db.ticket.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ success: true, tickets });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Failed to fetch tickets", err },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { ticketId } = await req.json();

    if (!ticketId) {
      return Response.json(
        { success: false, message: "ticketId is required" },
        { status: 400 }
      );
    }

    await db.ticket.delete({
      where: { id: ticketId },
    });

    return Response.json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Failed to delete ticket", err },
      { status: 500 }
    );
  }
}
