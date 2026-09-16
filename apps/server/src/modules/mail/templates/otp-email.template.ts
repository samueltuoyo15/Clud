export function getOtpEmailTemplate(code: string): {
  subject: string
  text: string
  html: string
} {
  return {
    subject: `${code} is your Clud verification code`,
    text: `Let's get this done\n\nYou're just one step away from verifying your email. Use the code below to proceed:\n\n${code}\n\nThis code will expire in 10 minutes.\nIf you did not request this code, you can safely ignore this email.\n\nContact support@samueltuoyo.com`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your Clud account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; background-color: #f8fafc; margin: 0; padding: 0;">
        <tr>
            <td align="center" style="padding: 32px 16px; text-align: center;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width: 480px; width: 100%; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; text-align: left; border-collapse: separate;">
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
                            <h1 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px; line-height: 1.3; text-align: left;">
                                Let's get this done
                            </h1>
                            <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.5; text-align: left;">
                                You're just one step away from verifying your email. Use the code below to proceed.
                            </p>
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
                                <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 700; color: #0f172a; letter-spacing: 6px;">${code}</span>
                            </div>
                            <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b; line-height: 1.5; text-align: left;">
                                This code will expire in 10 minutes.<br>If you did not request this code, you can safely ignore this email.
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #64748b; text-align: left;">
                                Contact <a href="mailto:support@samueltuoyo.com" style="color: #611F69; text-decoration: underline; font-weight: 500;">support@samueltuoyo.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
  }
}
