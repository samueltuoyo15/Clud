export function getDriftAlertEmailTemplate(projectName: string, diffText: string) {
  const subject = `API Drift Detected: ${projectName}`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Drift Detected - Clud</title>
  <style>
    body { margin: 0; padding: 32px 12px; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .card-wrapper { max-width: 540px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden; }
    .header-cell { padding: 24px 28px; background-color: #611F69; }
    .body-cell { padding: 32px 28px; }
    .main-heading { margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #111111; letter-spacing: -0.3px; }
    .sub-text { margin: 0 0 20px 0; font-size: 14px; color: #4b5563; line-height: 1.5; }
    .diff-box { background-color: #f9fafb; color: #111827; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; margin-bottom: 24px; }
    .footer-text { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px; line-height: 1.5; }
  </style>
</head>
<body>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <div class="card-wrapper">
          <div class="header-cell">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align: middle; padding-right: 10px;">
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDU2IDQwIiBmaWxsPSJub25lIiBpZD0iTG9nbyI+IDxnIGlkPSJsb2dvZ3JhbSI+IDxwYXRoIGQ9Ik00MyAwQzUwLjE3OTcgNi40NDI3N2UtMDcgNTYgNS44MjAzIDU2IDEzQzU2IDIwLjE3OTcgNTAuMTc5NyAyNiA0MyAyNkgzNC40ODQ0TDQ4LjQ4NDQgNDBIMzEuNTE1NkwxNS43NTc4IDI0LjI0MjJDMTQuNjcyIDIzLjE1NjQgMTQgMjEuNjU2OSAxNCAyMEMxNCAxNi42ODYzIDE2LjY4NjMgMTQgMjAgMTRINDNDNDMuNTUyMyAxNCA0NCAxMy41NTIz NDQgMTNDNDQgMTIuNDQ3NyA0My41NTIzIDEyIDQzIDEySDIwQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyMi4zOTAxIDEzLjA0ODIgMjQuNTM0NyAxNC43MSAyNkgxNC42ODc1TDI4LjY4NzUgNDBIMjBDOC45NTQzMSA0MCAwIDMxLjA0NTcgMCAyMEMwIDguOTU0MzEgOC45NTQzIDAgMjAgMEg0M1oiIGZpbGw9IiNGRkZGRkYiLz4gPHBhdGggZD0iTTU2IDI4VjQwSDUxLjMxMjVMMzkuMzEyNSAyOEg1NloiIGZpbGw9IiNGRkZGRkYiLz4gPC9nPiA8L3N2Zz4=" alt="Clud" width="28" height="20" style="display: block;" />
                </td>
                <td style="vertical-align: middle;">
                  <span style="font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.4px;">Clud</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="body-cell">
            <h1 class="main-heading">API Drift Detected</h1>
            <p class="sub-text">
              Clud has detected schema changes in the OpenAPI specification for <strong>${projectName}</strong>.
            </p>
            
            <div class="diff-box">${diffText}</div>
            
            <p class="sub-text" style="margin-bottom: 0;">
              Please review these changes with your team to ensure frontend and integration contract compatibility.
            </p>
          </div>
        </div>
        <div class="footer-text">
          Automated alert from Clud API Monitoring.<br/>
          You are receiving this because you are subscribed to alerts for this workspace.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
