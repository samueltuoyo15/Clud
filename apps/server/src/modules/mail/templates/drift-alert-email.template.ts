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
    body { margin: 0; padding: 32px 16px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .card-wrapper { width: 100%; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; text-align: left; }
    .header-cell { padding: 22px 28px; background-color: #611F69; text-align: left; }
    .body-cell { padding: 32px 28px; text-align: left; }
    .main-heading { margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px; text-align: left; }
    .sub-text { margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.55; text-align: left; }
    .diff-box { background-color: #f8fafc; color: #0f172a; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; margin-bottom: 24px; text-align: left; }
    .footer-text { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px; line-height: 1.5; }
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
                <td style="vertical-align: middle;">
                  <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Clud</span>
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
