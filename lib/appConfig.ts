export const appConfig = {
  name: process.env.APP_NAME || "Task Manager",
  logo: process.env.APP_LOGO_URL || "/next.svg",
  supportEmail: process.env.APP_SUPPORT_EMAIL || "support@taskmanager.com",
  managementEmail: process.env.APP_MANAGEMENT_EMAIL || "management@taskmanager.com",
  portalUrl: process.env.APP_PORTAL_URL || "http://localhost:3000",
  url: process.env.APP_URL || "http://localhost:3000",
  webUrl: process.env.APP_WEB_URL || "http://localhost:3000",
  firstName: process.env.APP_FIRST_NAME || "Task",
  lastName: process.env.APP_LAST_NAME || "Manager",
};
