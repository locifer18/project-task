import { appConfig } from "@/lib/appConfig";

export const mailToAdmin = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Meeting {{Action}}</title>
  <style>
    @media (prefers-color-scheme: dark) {
      body, table, td { background-color: #0b1220 !important; color: #e5e7eb !important; }
      .card { background-color: #111827 !important; border-color: #1f2937 !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="border-radius:10px; overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a,#1e293b); padding:28px;">
              <img src="${appConfig.logo}" alt="${appConfig.name}" height="48" />
              <h1 style="margin:0; font-size:20px; color:#ffffff;">Meeting {{Action}}</h1>
              <p style="margin:6px 0 0; font-size:13px; color:#cbd5f5;">${appConfig.name} Management</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff; padding:28px; border:1px solid #e5e7eb;">
              <p style="margin:0 0 16px; font-size:14px;">Hi <strong>{{Admin_Name}}</strong>,</p>
              <p style="margin:0 0 20px; font-size:14px;">Client <strong>{{Client_Name}}</strong> has <strong>{{Action}}</strong> the meeting.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr><td style="padding:10px 0; font-weight:600;">Project</td><td style="padding:10px 0;">{{Project_Name}}</td></tr>
                <tr><td style="padding:10px 0; font-weight:600;">Date</td><td style="padding:10px 0;">{{Meeting_Date}}</td></tr>
                <tr><td style="padding:10px 0; font-weight:600;">Time</td><td style="padding:10px 0;">{{Meeting_Time}}</td></tr>
                <tr><td style="padding:10px 0; font-weight:600;">Duration</td><td style="padding:10px 0;">{{Duration_Minutes}} minutes</td></tr>
              </table>
              <p style="margin:24px 0 0; font-size:14px;">Kind regards,<br><strong>${appConfig.name}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px; text-align:center; font-size:12px; color:#9ca3af;">© ${appConfig.name}. All rights reserved.</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export const mailToClient = `
<!DOCTYPE html>

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Meeting Request</title>

  <style>
    /* Dark mode overrides (supported clients) */
    @media (prefers-color-scheme: dark) {
      body, table, td {
        background-color: #0b1220 !important;
        color: #e5e7eb !important;
      }
      .card {
        background-color: #111827 !important;
        border-color: #1f2937 !important;
      }
      .muted {
        color: #9ca3af !important;
      }
      .divider {
        border-color: #1f2937 !important;
      }
      .button {
        background-color: #38bdf8 !important;
        color: #020617 !important;
      }
      .header {
        background: linear-gradient(135deg, #0f172a, #020617) !important;
      }
    }
  </style>

</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr>
      <td align="center">
    <!-- Container -->
    <table width="620" cellpadding="0" cellspacing="0" style="border-radius:10px; overflow:hidden;">

      <!-- Header -->
      <tr>
        <td class="header" style="background:linear-gradient(135deg,#0f172a,#1e293b); padding:28px; text-align:left;">
          
          <!-- LOGO AREA -->
          <img src="${appConfig.logo}" alt="${appConfig.name}" height="48" />

          <h1 style="margin:0; font-size:20px; font-weight:600; color:#ffffff;">
            Meeting Request
          </h1>
          <p style="margin:6px 0 0; font-size:13px; color:#cbd5f5;">
            ${appConfig.name} Management
          </p>
        </td>
      </tr>

      <!-- Card -->
      <tr>
        <td class="card" style="background-color:#ffffff; padding:28px; border:1px solid #e5e7eb;">
          
          <p style="margin:0 0 16px; font-size:14px;">
            HI, <strong>{{Client_Name}}</strong>,
          </p>

          <p style="margin:0 0 20px; font-size:14px; line-height:1.6;">
            We hope you are doing well. ${appConfig.name} has proposed a meeting to discuss the following engagement details:
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            <tr>
              <td style="padding:10px 0; font-weight:600;">Project</td>
              <td style="padding:10px 0;">{{Project_Name}}</td>
            </tr>
            <tr>
              <td style="padding:10px 0; font-weight:600;">Date</td>
              <td style="padding:10px 0;">{{Meeting_Date}}</td>
            </tr>
            <tr>
              <td style="padding:10px 0; font-weight:600;">Time</td>
              <td style="padding:10px 0;">{{Meeting_Time}}</td>
            </tr>
            <tr>
              <td style="padding:10px 0; font-weight:600;">Min. Duration</td>
              <td style="padding:10px 0;">{{Duration_Minutes}} minutes</td>
            </tr>
          </table>

          <hr class="divider" style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;">

          <p style="margin:0 0 20px; font-size:18px; line-height:1.6;">
            Please review this request in the ${appConfig.firstName} Management. You may <strong>approve</strong> the meeting or <strong>reschedule</strong> it as per your availability.
          </p>

          <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
            <tr>
              <td>
                <a href="${appConfig.webUrl}"
                   class="button"
                   style="display:inline-block; padding:14px 26px; background-color:#2E1065; color:#ffffff; text-decoration:none; border-radius:8px; font-size:14px; font-weight:600;">
                  Open Management Portal
                </a>
              </td>
            </tr>
          </table>

          <p class="muted" style="margin:0; font-size:13px; line-height:1.6; color:#6b7280;">
            If you have any questions or require further clarification, feel free to reach out to our team.
          </p>

          <p style="margin:24px 0 0; font-size:14px;">
            Kind regards,<br>
            <strong>${appConfig.name}</strong><br>
            Management Team
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding:18px; text-align:center; font-size:12px; color:#9ca3af;">
          © ${appConfig.name}. All rights reserved.<br>
          This is an automated notification. Please do not reply.
        </td>
      </tr>

    </table>

  </td>
</tr>
  </table>
</body>
</html>
`

export const signupTemplate = `<!DOCTYPE html>

<html>
<body style="margin:0; padding:0; background-color:#0F0A1F; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#18122B; margin-top:40px; border-radius:8px; border:1px solid #2E1065;">

      <tr>
        <td align="center" style="padding:32px;">
          <img src="${appConfig.logo}" alt="${appConfig.name}" style="max-height:56px;" />
        </td>
      </tr>

      <tr>
        <td style="padding:0 40px 36px 40px;">
          <h2 style="color:#EDE9FE; margin-bottom:16px;">
            {{TITLE}}
          </h2>

          <p style="color:#C4B5FD; font-size:14px;">
            Hello There,
          </p>

          <p style="color:#C4B5FD; font-size:14px;">
            Please confirm your email address to activate your <b>${appConfig.name}</b> Management System.
            Use the verification code below:
          </p>

          <div style="text-align:center; margin:32px 0;">
            <div style="
              display:inline-block;
              padding:16px 28px;
              background:#2E1065;
              border-radius:6px;
              font-size:28px;
              letter-spacing:6px;
              font-weight:bold;
              color:#EDE9FE;">
              {{OTP}}
            </div>
          </div>
          
          <p style="color: #C4B5FD; font-size:14px;">{{MESSAGE}}</p>
          <p style="color:#C4B5FD; font-size:14px;">
            This code expires in <span style="color: deeppink;"><b>10 min.</b></span> <br>
            If you did not sign up, you can safely ignore this email.
          </p>

          <p style="color:#9F8CFB; font-size:12px; margin-top:24px;">
            Support: ${appConfig.supportEmail}
          </p>
        </td>
      </tr>
    </table>

    <p style="font-size:11px; color:#6D5BD0; margin-top:24px;">
      © ${appConfig.name}. All rights reserved.
    </p>
  </td>
</tr>

  </table>
</body>
</html>`


export const loginTemplate = `<!DOCTYPE html>

<html>
<body style="margin:0; padding:0; background-color:#0F0A1F; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#18122B; margin-top:40px; border-radius:8px; border:1px solid #2E1065;">


      <tr>
        <td align="center" style="padding:32px;">
          <img src="${appConfig.logo}" alt="${appConfig.name}" style="max-height:56px;" />
        </td>
      </tr>

      <tr>
        <td style="padding:0 40px 36px 40px;">
          <h2 style="color:#EDE9FE;">
            {{TITLE}}
          </h2>

          <p style="color:#C4B5FD; font-size:14px;">
            Hello There,
          </p>

          <p style="color:#C4B5FD; font-size:14px;">
            A login attempt was made to your account.
            Enter the following OTP to continue:
          </p>

          <div style="text-align:center; margin:32px 0;">
            <div style="
              display:inline-block;
              padding:14px 26px;
              background:#7C3AED;
              border-radius:6px;
              font-size:26px;
              letter-spacing:5px;
              font-weight:bold;
              color:#FFFFFF;">
              {{OTP}}
            </div>
          </div>

          <p style="color: #C4B5FD; font-size:14px;">{{MESSAGE}}</p>
          <p style="color:#C4B5FD; font-size:14px;">
            This code expires in <span style="color: deeppink;"><b>10 min.</b></span> <br>
            If you did not sign up, you can safely ignore this email.
          </p>

          <p style="color:#9F8CFB; font-size:12px; margin-top:24px;">
            Support: ${appConfig.supportEmail}
          </p>
        </td>
      </tr>
    </table>

    <p style="font-size:11px; color:#6D5BD0; margin-top:24px;">
      © ${appConfig.name}. All rights reserved.
    </p>
  </td>
</tr>

  </table>
</body>
</html>`

export const forgetTemplate = `<!DOCTYPE html>

<html>
<body style="margin:0; padding:0; background-color:#0F0A1F; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#18122B; margin-top:40px; border-radius:8px; border:1px solid #2E1065;">

      <tr>
        <td align="center" style="padding:32px;">
          <img src="${appConfig.logo}" alt="${appConfig.name}" style="max-height:56px;" />
        </td>
      </tr>

      <tr>
        <td style="padding:0 40px 36px 40px;">
          <h2 style="color:#EDE9FE;">
            {{TITLE}}
          </h2>

          <p style="color:#C4B5FD; font-size:14px;">
            Hello There,
          </p>

          <p style="color:#C4B5FD; font-size:14px;">
            You requested to reset your password.
            Use the OTP below to proceed:
          </p>

          <div style="text-align:center; margin:32px 0;">
            <div style="
              display:inline-block;
              padding:16px 28px;
              background:#3B0764;
              border-radius:6px;
              font-size:28px;
              letter-spacing:6px;
              font-weight:bold;
              color:#F5F3FF;">
              {{OTP}}
            </div>
          </div>

          <p style="color: #C4B5FD; font-size:14px;">{{MESSAGE}}</p>
          <p style="color:#C4B5FD; font-size:14px;">
            This code expires in <span style="color: deeppink;"><b>10 min.</b></span> <br>
            If you did not sign up, you can safely ignore this email.
          </p>

          <p style="color:#9F8CFB; font-size:12px; margin-top:24px;">
            Need help? ${appConfig.supportEmail}
          </p>
        </td>
      </tr>
    </table>

    <p style="font-size:11px; color:#6D5BD0; margin-top:24px;">
      © ${appConfig.name}. All rights reserved.
    </p>
  </td>
</tr>

  </table>
</body>
</html>`

