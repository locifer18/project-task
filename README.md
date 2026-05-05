# Team Task Manager

A full-stack **Project & Task Management System** built with **Next.js 16**, **PostgreSQL**, and **Prisma ORM** — featuring role-based access control, a drag-and-drop Kanban board, real-time notifications, file uploads, and a rich project overview dashboard.

---

## Live Demo

> Add your deployment URL here after deploying

---

## Features

### Authentication & Security
- OTP-based email verification on signup
- JWT sessions stored in HTTP-only cookies
- Forgot password with OTP reset flow
- bcrypt password hashing

### Role-Based Access Control
| Role | Capabilities |
|------|-------------|
| **ADMIN** | Create & manage all projects, assign tasks to any member, manage team, view all stats |
| **MEMBER** | View assigned projects, manage own tasks, add comments, report issues |

### Project Management
- Create, edit, and delete projects
- Set priority (High / Medium / Low), budget, deadlines, repository link
- Assign team members with roles (Developer, Designer, Manager, QA)
- Track project progress with a visual gauge (0–100%)
- Current phase tracker (Design → Development → Testing → Deployment)
- Technology stack configuration per project
- Design system management (colors, fonts, brand feel, layout style)
- Milestone tracking with status (Pending, In Progress, Completed, Delayed)
- Latest project updates feed
- Asset management (images, documents, videos)

### Kanban Board
- Create tasks with title, rich-text description, priority, due date, tags, and file attachments
- Drag-and-drop tasks across columns: **On Hold → Assigned → In Progress → Completed**
- Completed tasks automatically logged to Work Done history
- Comment system with edit and delete support
- Issue reporting per task
- Admin can view and manage tasks for any team member

### Dashboard
- **Admin view** — stats across ALL members (total projects, all tasks, completed, overdue, in-progress)
- **Member view** — stats scoped to their own assigned work
- Recent projects with progress bars
- Overdue tasks highlighted with due dates

### Notifications
- In-app notifications for task assignments, project updates, and payment events
- DB-persisted notification history

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, Tailwind CSS v4 |
| Backend | Next.js API Routes (REST) |
| Database | PostgreSQL |
| ORM | Prisma 7 with pg adapter |
| Auth | JWT + bcrypt + OTP (Nodemailer) |
| Rich Text | Tiptap editor |
| File Upload | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| UI Components | Lucide React, Radix UI |
| Validation | Zod |

---

## Project Structure

```
project-task/
├── app/
│   ├── (auth)/          # Login, Signup, Forgot Password pages
│   ├── api/             # All REST API routes
│   │   ├── auth/        # signin, signup, logout, me
│   │   ├── project/     # CRUD + members, milestones, assets, tech
│   │   ├── kanban/      # tasks, comments, reports
│   │   ├── admin/       # user management, role control
│   │   └── design-system/
│   ├── kanban/          # Kanban board page
│   └── project/         # Projects list + detail pages
├── components/
│   ├── project/         # All project tab components
│   ├── Dashboard.tsx
│   └── common/          # Shared UI (editor, loading, etc.)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── lib/                 # auth, jwt, cloudinary, mailer utils
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

```bash
git clone <repo-url>
cd project-task
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
DB_URI="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-jwt-secret"
EMAIL="your-gmail@gmail.com"
EMAIL_PASS="your-gmail-app-password"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
APP_NAME="Team Task Manager"
APP_URL="http://localhost:3000"
```

### Run

```bash
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `employee1@taskmanager.com` | `password123` |
| Member | `employee4@taskmanager.com` | `password123` |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register with OTP verification |
| POST | `/api/auth/signin` | Login, returns JWT cookie |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | OTP password reset |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/project` | All projects (admin) / assigned (member) |
| POST | `/api/project` | Create project (admin only) |
| GET | `/api/project/[projectId]` | Project overview |
| PUT | `/api/project` | Update project |
| DELETE | `/api/project` | Delete project |
| GET/POST | `/api/project/member` | Get / add project members |
| GET/POST | `/api/project/milestone` | Milestones |
| GET/POST | `/api/project/technology` | Tech stack |
| GET/POST | `/api/design-system` | Design system |

### Tasks (Kanban)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kanban/task` | Own tasks / all tasks (admin with `?all=true`) |
| GET | `/api/kanban/task?projectId=` | All tasks for a project |
| POST | `/api/kanban/task` | Create task |
| PUT | `/api/kanban/task` | Update task / drag status |
| DELETE | `/api/kanban/task` | Delete task |
| POST | `/api/kanban/comment` | Add comment |
| PUT | `/api/kanban/comment` | Edit comment |
| DELETE | `/api/kanban/comment` | Delete comment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users` | Update user role |
| GET | `/api/admin/adminOnly` | Admin-only users |

---

## Database Schema (Key Models)

```
User          — id, name, email, role (ADMIN/MEMBER), employeeId
Project       — id, name, priority, progress, currentPhase
ProjectInfo   — budget, deadline, clientName, supervisorAdmin
ProjectMember — projectId, userId, role, isLeader
Task          — title, description, assignee, employeeId, status, priority
Comment       — content, taskId, userId
Milestone     — title, dueDate, status
DesignSystem  — colors, fonts, brandName, theme, keyPages
ProjectTechnology — tech (JSON array of {key, value})
LatestUpdate  — title, date, projectId
Notification  — userId, title, message, type, isRead
```

---

## Deployment (Railway)

1. Push code to GitHub
2. Create new project on [Railway](https://railway.app)
3. Add a PostgreSQL plugin
4. Set all environment variables
5. Set build command: `npm run build`
6. Set start command: `npm start`
7. Run `npx prisma db push` via Railway shell after first deploy


## Author

Built as a full-stack assignment project demonstrating:
- Next.js App Router with REST API design
- Role-based access control patterns
- Relational database modeling with Prisma
- Real-world UI/UX with drag-and-drop, rich text, file uploads
