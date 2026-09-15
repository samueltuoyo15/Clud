export function getOtpEmailTemplate(code: string): {
  subject: string
  text: string
  html: string
} {
  return {
    subject: `${code} is your Clud verification code`,
    text: `Let's get this done\n\nYou're just one step away from verifying your email. Use the code below to proceed:\n\n${code}\n\nThis code will expire in 10 minutes.\nIf you did not request this code, you can safely ignore this email.\n\nContact support@clud.dev`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your Clud account</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @media only screen and (max-width: 520px) {
            .card-wrapper { width: 100% !important; border-radius: 12px !important; }
            .header-cell { padding: 18px 20px !important; }
            .body-cell { padding: 24px 18px 28px 18px !important; }
            .main-heading { font-size: 19px !important; }
            .sub-text { font-size: 14px !important; margin-bottom: 20px !important; }
            .code-cell { padding: 18px 12px !important; }
            .code-text { font-size: 28px !important; letter-spacing: 5px !important; }
            .footer-notice { font-size: 12px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 32px 12px; background-color: #ffffff; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <table class="card-wrapper" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 460px; background-color: #ffffff; border: 1px solid #ebebeb; border-radius: 16px; overflow: hidden;">
                    <tr>
                        <td class="header-cell" style="padding: 24px 28px; background-color: #611F69; border-top-left-radius: 16px; border-top-right-radius: 16px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 10px;">
                                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDU2IDQwIiBmaWxsPSJub25lIiBpZD0iTG9nbyI+IDxnIGlkPSJsb2dvZ3JhbSI+IDxwYXRoIGQ9Ik00MyAwQzUwLjE3OTcgNi40NDI3N2UtMDcgNTYgNS44MjAzIDU2IDEzQzU2IDIwLjE3OTcgNTAuMTc5NyAyNiA0MyAyNkgzNC40ODQ0TDQ4LjQ4NDQgNDBIMzEuNTE1NkwxNS43NTc4IDI0LjI0MjJDMTQuNjcyIDIzLjE1NjQgMTQgMjEuNjU2OSAxNCAyMEMxNCAxNi42ODYzIDE2LjY4NjMgMTQgMjAgMTRINDNDNDMuNTUyMyAxNCA0NCAxMy41NTIz NDQgMTNDNDQgMTIuNDQ3NyA0My41NTIzIDEyIDQzIDEySDIwQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyMi4zOTAxIDEzLjA0ODIgMjQuNTM0NyAxNC43MSAyNkgxNC42ODc1TDI4LjY4NzUgNDBIMjBDOC45NTQzMSA0MCAwIDMxLjA0NTcgMCAyMEMwIDguOTU0MzEgOC45NTQzIDAgMjAgMEg0M1oiIGZpbGw9IiNGRkZGRkYiLz4gPHBhdGggZD0iTTU2IDI4VjQwSDUxLjMxMjVMMzkuMzEyNSAyOEg1NloiIGZpbGw9IiNGRkZGRkYiLz4gPC9nPiA8L3N2Zz4=" alt="Clud" width="28" height="20" style="display: block;" />
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <span style="font-family: 'Geist', sans-serif; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.4px;">Clud</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="body-cell" style="padding: 32px 28px 36px 28px;">
                            <h1 class="main-heading" style="margin: 0 0 10px 0; font-size: 22px; font-weight: 700; color: #111111; letter-spacing: -0.3px; line-height: 1.3;">
                                Let's get this done
                            </h1>
                            <p class="sub-text" style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.5;">
                                You're just one step away from verifying your email. Use the code below to proceed.
                            </p>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef3e2; border-radius: 12px; margin-bottom: 24px;">
                                <tr>
                                    <td class="code-cell" align="center" style="padding: 24px 16px;">
                                        <span class="code-text" style="font-family: 'Geist', monospace, sans-serif; font-size: 36px; font-weight: 600; color: #111111; letter-spacing: 7px; display: inline-block;">
                                            ${code}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            <p class="footer-notice" style="margin: 0 0 16px 0; font-size: 13px; color: #4b5563; line-height: 1.5;">
                                This code will expire in 10 minutes.<br>If you did not request this code, you can safely ignore this email.
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #4b5563;">
                                Contact <a href="mailto:support@clud.dev" style="color: #d97706; text-decoration: underline; font-weight: 500;">support@clud.dev</a>
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
