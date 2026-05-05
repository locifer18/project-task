import { NextResponse } from "next/server";
import db from '@/lib/client';

// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     // In case there are encoded characters in the URL (spaces, etc.)
//     // Fetch ONE user by name, including their projects
//     const user = await db.user.findFirst({
//       where: {
//         id: id,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         employeeId: true,
//         department: true,
//         phone: true,
//         createdAt: true,
//         image: true,
//         isLogin: true,
//         workingAs: true,
//         bio: true,

//         // Include project membership
//         projectMembers: {
//           include: {
//             project: {
//               select: {
//                 id: true,
//                 name: true,
//                 summary: true,
//                 priority: true,
//                 progress: true,
//                 status: true,
//                 createdAt: true,
//                 members: {
//                   include: {
//                     user: {
//                       select: {
//                         id: true,
//                         name: true,
//                         image: true,
//                       },
//                     },
//                   },
//                 },
//                 projectInfo: {
//                   select: {
//                     budget: true,
//                     projectType: true,
//                     supervisorAdmin: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         user,
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("GET_USER_BY_USERNAME_ERROR:", err);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await db.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        employeeId: true,
        department: true,
        phone: true,
        createdAt: true,
        image: true,
        isLogin: true,
        workingAs: true,
        bio: true,

        projectMembers: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                summary: true,
                priority: true,
                progress: true,
                status: true,
                createdAt: true,

                members: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        image: true,
                      },
                    },
                  },
                },

                // ✅ FIXED CORRECTLY
                projectInfo: {
                  select: {
                    budget: true,
                    projectType: true,
                    supervisor: {
                      select: {
                        id: true,
                        name: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET_USER_BY_USERNAME_ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}