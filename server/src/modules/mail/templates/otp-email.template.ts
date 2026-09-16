export function getOtpEmailTemplate(code: string): {
  subject: string
  text: string
  html: string
} {
  return {
    subject: `${code} is your Clud verification code`,
    text: `Let's get this done\n\nYou're just one step away from verifying your email. Use the code below to proceed:\n\n${code}\n\nThis code will expire in 10 minutes.\nIf you did not request this code, you can safely ignore this email.\n\nContact support@clud.samueltuoyo.com`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your Clud account</title>
    <style>
        body { margin: 0; padding: 32px 16px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; text-align: left; }
        .card-wrapper { width: 100%; max-width: 480px; margin: 0; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; text-align: left; }
        .header-cell { padding: 22px 28px; background-color: #611F69; text-align: left; }
        .body-cell { padding: 32px 28px; text-align: left; }
        .main-heading { margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px; line-height: 1.3; text-align: left; }
        .sub-text { margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.5; text-align: left; }
        .code-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center; }
        .code-text { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 700; color: #0f172a; letter-spacing: 6px; }
        .footer-notice { margin: 0 0 16px 0; font-size: 13px; color: #64748b; line-height: 1.5; text-align: left; }
    </style>
</head>
<body>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="left">
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
                        <h1 class="main-heading">
                            Let's get this done
                        </h1>
                        <p class="sub-text">
                            You're just one step away from verifying your email. Use the code below to proceed.
                        </p>
                        <div class="code-box">
                            <span class="code-text">${code}</span>
                        </div>
                        <p class="footer-notice">
                            This code will expire in 10 minutes.<br>If you did not request this code, you can safely ignore this email.
                        </p>
                        <p style="margin: 0; font-size: 13px; color: #64748b; text-align: left;">
                            Contact <a href="mailto:support@clud.samueltuoyo.com" style="color: #611F69; text-decoration: underline; font-weight: 500;">support@clud.samueltuoyo.com</a>
                        </p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`,
  }
}
