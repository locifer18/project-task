import { PrismaClient, MILESTONE_STATUS, OtpType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DB_URI;

if (!connectionString) {
  throw new Error("DB_URI environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.workDone.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.featureRequest.deleteMany();
  await prisma.latestUpdate.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.projectInfo.deleteMany();
  await prisma.designSystem.deleteMany();
  await prisma.projectTechnology.deleteMany();
  await prisma.riskBlockage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Create 20 Users
  const users = [];
  const departments = [
    "Engineering",
    "Design",
    "Product",
    "Marketing",
    "HR",
    "Finance",
  ];
  const positions = ["Developer", "Manager", "Lead", "Intern", "Designer"];

  for (let i = 1; i <= 20; i++) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const role = i <= 3 ? "ADMIN" : "MEMBER";

    const user = await prisma.user.create({
      data: {
        name: `Employee ${i}`,
        email: `employee${i}@taskmanager.com`,
        password: hashedPassword,
        employeeId: `emp-${String(i).padStart(3, "0")}`,
        phone: `+1234567${String(i).padStart(4, "0")}`,
        role,
        department: departments[i % departments.length],
        workingAs: positions[i % positions.length],
        bio: `I am Employee ${i}, working as ${positions[i % positions.length]}`,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=employee${i}`,
        dob: `199${i % 10}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
        joiningDate: new Date(`2023-${String((i % 12) + 1).padStart(2, "0")}-01`),
        isLogin: true,
      },
    });
    users.push(user);
  }

  console.log(`✅ Created 20 users`);

  // Create 20 Projects
  const projects = [];
  const projectStatuses = [0, 1, 2, 3];
  const projectPhases = [
    "Design",
    "Development",
    "Testing",
    "Deployment",
    "Maintenance",
  ];
  const projectTypes = [
    "Web Development",
    "Mobile App",
    "Desktop Software",
    "AI/ML",
    "Data Analytics",
  ];

  for (let i = 1; i <= 20; i++) {
    const project = await prisma.project.create({
      data: {
        name: `Project ${i}: ${["E-Commerce", "CRM", "Analytics", "Social Media", "Marketplace", "LMS", "Chat App", "Blog Platform", "Finance App", "Health Tracker"][i % 10]}`,
        summary: `This is a comprehensive ${projectTypes[i % projectTypes.length]} project aimed at delivering exceptional value to clients.`,
        priority: ["High", "Medium", "Low"][i % 3],
        basicDetails: `Project ${i} focuses on delivering cutting-edge solutions with modern technology stack.`,
        repository: `https://github.com/company/project-${i}`,
        status: projectStatuses[i % projectStatuses.length],
        progress: (i * 5) % 100,
        currentPhase: projectPhases[i % projectPhases.length],
      },
    });
    projects.push(project);
  }

  console.log(`✅ Created 20 projects`);

  // Create 20 ProjectInfo records
  for (let i = 0; i < 20; i++) {
    await prisma.projectInfo.create({
      data: {
        projectId: projects[i].id,
        budget: 50000 + i * 5000,
        paidAmount: 25000 + i * 2500,
        clientName: `Client ${i + 1}`,
        projectType: projectTypes[i % projectTypes.length],
        startDate: new Date(`2024-${String((i % 12) + 1).padStart(2, "0")}-01`),
        deadline: new Date(
          `2025-${String((i % 12) + 1).padStart(2, "0")}-28`
        ),
        supervisorAdmin: users[i % 3].id,
      },
    });
  }

  console.log(`✅ Created 20 project info records`);

  // Add project members
  for (let i = 0; i < 20; i++) {
    const membersCount = 3 + (i % 5);
    for (let j = 0; j < membersCount; j++) {
      await prisma.projectMember.create({
        data: {
          projectId: projects[i].id,
          userId: users[(i + j) % users.length].id,
          role: ["Developer", "Designer", "Manager", "QA"][j % 4],
          isLeader: j === 0,
        },
      });
    }
  }

  console.log(`✅ Added project members`);

  // Create 20 Milestones
  const milestoneStatuses = [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
    "DELAYED",
  ] as const;

  for (let i = 0; i < 20; i++) {
    await prisma.milestone.create({
      data: {
        projectId: projects[i].id,
        title: `Milestone ${i + 1}: ${["Design Approval", "MVP Release", "Beta Testing", "Final Deployment", "Post-Launch Support"][i % 5]}`,
        description: `Complete the ${["design", "development", "testing", "deployment"][i % 4]} phase for Project ${i + 1}`,
        dueDate: new Date(
          `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`
        ),
        status: milestoneStatuses[i % milestoneStatuses.length] as MILESTONE_STATUS,
        createdBy: users[i % users.length].id,
      },
    });
  }

  console.log(`✅ Created 20 milestones`);

  // Create 20 Tasks
  const priorities = ["High", "Medium", "Low"];
  const taskStatuses = ["assigned", "in-progress", "completed", "on-hold"];

  for (let i = 0; i < 20; i++) {
    await prisma.task.create({
      data: {
        title: `Task ${i + 1}: ${["Fix Bugs", "Implement Feature", "Code Review", "Optimize Performance", "Write Documentation"][i % 5]}`,
        description: `This task involves ${["fixing critical bugs", "implementing new features", "reviewing code quality", "optimizing database queries", "writing comprehensive documentation"][i % 5]} for the project.`,
        assignee: users[i % users.length].name,
        assigneeAvatar: users[i % users.length].image || undefined,
        priority: priorities[i % priorities.length],
        dueDate: new Date(
          `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`
        ),
        employeeId: users[i % users.length].employeeId || undefined,
        tags: [
          `priority-${priorities[i % priorities.length].toLowerCase()}`,
          ["frontend", "backend", "database", "devops"][i % 4],
          ["bug", "feature", "improvement"][i % 3],
        ],
        status: taskStatuses[i % taskStatuses.length],
        projectId: projects[i % projects.length].id,
      },
    });
  }

  console.log(`✅ Created 20 tasks`);

  // Create Comments
  const tasks = await prisma.task.findMany({ take: 20 });
  for (let i = 0; i < tasks.length; i++) {
    for (let j = 0; j < 2; j++) {
      await prisma.comment.create({
        data: {
          content: `Comment ${j + 1} on task: This looks good. Please make sure to ${["update the tests", "refactor the code", "add documentation", "optimize performance"][j % 4]}.`,
          taskId: tasks[i].id,
          userId: users[(i + j) % users.length].id,
        },
      });
    }
  }

  console.log(`✅ Created comments for tasks`);

  // Create Assets
  const assetTypes = ["Image", "Document", "Video", "Audio", "Design"];
  for (let i = 0; i < 20; i++) {
    await prisma.asset.create({
      data: {
        type: assetTypes[i % assetTypes.length],
        url: `https://assets.example.com/asset-${i}`,
        title: `Asset ${i + 1}: ${assetTypes[i % assetTypes.length]}`,
        uploadedBy: users[i % users.length].name,
        userImage: users[i % users.length].image || undefined,
        publicId: `public-asset-${i}`,
        liveUrl: `https://live.example.com/asset-${i}`,
        projectId: projects[i % projects.length].id,
      },
    });
  }

  console.log(`✅ Created assets`);

  // Create Work Done records
  const completedTasks = await prisma.task.findMany({
    where: { status: "completed" },
    take: 10,
  });

  for (let i = 0; i < Math.min(completedTasks.length, 10); i++) {
    await prisma.workDone.create({
      data: {
        projectId: projects[i % projects.length].id,
        taskId: completedTasks[i].id,
        title: completedTasks[i].title,
        description: `Successfully completed the task: ${completedTasks[i].description}`,
        priority: completedTasks[i].priority,
        dueDate: completedTasks[i].dueDate,
        tags: completedTasks[i].tags,
        userId: users[i % users.length].id,
      },
    });
  }

  console.log(`✅ Created work done records`);

  // Create Feature Requests
  for (let i = 0; i < 15; i++) {
    await prisma.featureRequest.create({
      data: {
        clientId: users[i % users.length].id,
        projectId: projects[i % projects.length].id,
        title: `Feature Request ${i + 1}: ${["Dark Mode", "Export to PDF", "Advanced Search", "Mobile App", "API Integration", "Analytics Dashboard", "Real-time Notifications", "Multi-language Support"][i % 8]}`,
        description: `Client requested to add ${["a new feature", "improved functionality", "better performance", "enhanced UI"][i % 4]} to the project.`,
        status: ["pending", "approved", "in-progress", "completed"][
          i % 4
        ],
      },
    });
  }

  console.log(`✅ Created feature requests`);

  // Create Latest Updates
  for (let i = 0; i < 20; i++) {
    await prisma.latestUpdate.create({
      data: {
        title: `Update ${i + 1}: ${["Bug Fixes", "New Features Released", "Performance Improvements", "Security Updates", "UI Enhancements"][i % 5]}`,
        date: new Date(
          `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`
        ).toISOString(),
        projectId: projects[i % projects.length].id,
        createdBy: users[i % users.length].id,
      },
    });
  }

  console.log(`✅ Created latest updates`);

  // Create Notifications
  for (let i = 0; i < 30; i++) {
    await prisma.notification.create({
      data: {
        userId: users[i % users.length].id,
        title: `Notification ${i + 1}`,
        message: `You have a new ${["task assignment", "project update", "comment on your task", "meeting scheduled"][i % 4]}`,
        type: ["task", "project", "comment", "meeting"][i % 4],
        isRead: i % 3 === 0,
      },
    });
  }

  console.log(`✅ Created notifications`);

  // Create Design System records
  for (let i = 0; i < 10; i++) {
    await prisma.designSystem.create({
      data: {
        projectId: projects[i].id,
        brandName: `Brand ${i + 1}`,
        colors: [
          "#FF6B6B",
          "#4ECDC4",
          "#45B7D1",
          "#FFA07A",
          "#98D8C8",
        ],
        fonts: {
          primary: "Inter",
          secondary: "Roboto",
          mono: "Fira Code",
        },
        designType: ["Modern", "Minimal", "Playful"],
        layoutStyle: {
          gridSize: 8,
          spacing: "standard",
        },
        contentTone: [
          "Professional",
          "Friendly",
          "Technical",
        ],
        visualGuidelines: {
          iconStyle: "Outlined",
          cornerRadius: "medium",
        },
        theme: ["Light", "Dark"],
        brandFeel: "Professional & Modern",
        keyPages: [
          "Dashboard",
          "Settings",
          "Profile",
        ],
        uniqueness: {
          signature: "Smooth animations",
          personality: "Tech-forward",
        },
      },
    });
  }

  console.log(`✅ Created design systems`);

  // Create Project Technology records
  for (let i = 0; i < 10; i++) {
    await prisma.projectTechnology.create({
      data: {
        projectId: projects[i].id,
        tech: [
          { name: "Next.js", category: "frontend" },
          { name: "React", category: "frontend" },
          { name: "PostgreSQL", category: "database" },
          { name: "Prisma", category: "orm" },
          { name: "TypeScript", category: "language" },
          { name: "Tailwind CSS", category: "styling" },
          { name: "Node.js", category: "backend" },
          { name: "Express", category: "backend" },
        ],
      },
    });
  }

  console.log(`✅ Created project technologies`);

  // Create Tickets
  for (let i = 0; i < 10; i++) {
    await prisma.ticket.create({
      data: {
        projectId: projects[i].id,
        reportedBy: users[i % users.length].id,
        reason: `Critical Issue: ${["Database connection timeout", "UI rendering bug", "API endpoint failure", "Authentication error", "Performance degradation"][i % 5]}`,
        blockedTeammates: [
          users[(i + 1) % users.length].id,
          users[(i + 2) % users.length].id,
        ],
      },
    });
  }

  console.log(`✅ Created tickets`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("🚨 Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

