export function getDriftAlertEmailTemplate(projectName: string, diffText: string) {
  const subject = `API Drift Detected: ${projectName}`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Drift Detected - Clud</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; background-color: #f8fafc; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="padding: 32px 16px; text-align: center;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width: 580px; width: 100%; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; text-align: left; border-collapse: separate;">
          <tr>
            <td style="padding: 22px 28px; background-color: #611F69; text-align: left;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="vertical-align: middle; padding-right: 10px;">
                    <img src="https://clud.samueltuoyo.com/clud-logo-white-512x512.png" width="28" height="28" alt="Clud" style="display: block; width: 28px; height: 28px; border: 0; outline: none; text-decoration: none;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1;">Clud</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px; text-align: left; background-color: #ffffff;">
              <h1 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px; text-align: left;">API Drift Detected</h1>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.55; text-align: left;">
                Clud has detected schema changes in the OpenAPI specification for <strong>${projectName}</strong>.
              </p>
              
              <div style="background-color: #f8fafc; color: #0f172a; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; margin-bottom: 24px; text-align: left;">${diffText}</div>
              
              <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.55; text-align: left;">
                Please review these changes with your team to ensure frontend and integration contract compatibility.
              </p>
            </td>
          </tr>
        </table>
        <div style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px; line-height: 1.5;">
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
