import db from "@/lib/client";
import { sendProjectTicketEmail } from "@/lib/mailer";
import { sendNotification } from "@/lib/notification-service";


export async function POST(req: Request) {
  try {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
    const SOCKET_PORT = process.env.NEXT_PUBLIC_SOCKET_PORT;
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

    // 🔹 Extract user IDs
    const userIds = blockedTeammates.map((t: { id: string }) => t.id);

    // 🔹 Fetch users
    const users = await db.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // 🔹 Fetch notification config
    const notificationRow = await db.notificationlist.findFirst({
      where: { package: "notificationlist" },
    });

    if (notificationRow) {
      const notifications = notificationRow.notification as any[];

      const notification = notifications.find(
        (n) => n.key === "RISK_BLOCKAGE"
      );

      if (notification) {
        const title = "Project Blockage Reported";
        const message = `${reportedBy} reported a blockage: ${reason}`;

        for (const user of users) {
          const roleName = user.role;
          if (!roleName) continue;

          const rolePermission = notification?.roles?.[roleName];
          let permission = null;

          if (rolePermission && typeof rolePermission === "object") {
            if ("inapp" in rolePermission || "mail" in rolePermission) {
              permission = rolePermission;
            } else {
              // Fallback for old nested subRole object structure
              const subRoleName = user.role;
              permission = rolePermission[subRoleName] ?? null;
            }
          }

          if (!permission) continue;

          // 🔹 In-app
          if (permission.inapp) {
            await fetch(`${SOCKET_URL}:${SOCKET_PORT}/emit`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                clientId: user.id,
                notification: {
                  title,
                  message,
                  section: "/tickets",
                  createdAt: new Date(),
                  isRead: false,
                },
              }),
            }).catch((err) =>
              console.error("Socket emit failed:", user.id, err)
            );
          }

          // 🔹 DB
          await db.notification.create({
            data: {
              userId: user.id,
              title,
              message,
              type: "PROJECT_TICKET",
              image: null, // optional
              meta: {
                projectId,
                ticketId: ticket.id,
                reason,
              },
              isRead: false,
            },
          });

          // 🔹 Email
          if (permission.mail && user.email) {
            await sendProjectTicketEmail(
              user.email,
              user.name,
              reportedBy,
              reason
            ).catch((err) =>
              console.error("Email failed:", user.id, err)
            );
          }
        }
      }
    }

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
