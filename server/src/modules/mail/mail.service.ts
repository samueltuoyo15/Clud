import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common"

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name)
    private readonly apiUrl = "https://sendlib.samueltuoyo.com/api/send"
    private readonly apiKey = process.env.SENDLIB_API_KEY
    private readonly from = process.env.SENDLIB_FROM

    async sendOtp(to: string, code: string): Promise<void> {
        const apiKey = this.apiKey || process.env.SENDLIB_API_KEY
        if (!apiKey) {
            this.logger.error("SENDLIB_API_KEY is missing in environment variables")
            throw new InternalServerErrorException("Email service is not configured")
        }

        const body: Record<string, any> = {
            to,
            subject: `${code} is your Clud verification code`,
            text: `Let's get this done\n\nYou're just one step away from verifying your email. Use the code below to proceed:\n\n${code}\n\nThis code will expire in 10 minutes.\nIf you did not request this code, you can safely ignore this email.\n\nContact support@clud.dev`,
            html: `
<!DOCTYPE html>
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
            .card-wrapper {
                width: 100% !important;
                border-radius: 12px !important;
            }
            .header-cell {
                padding: 18px 20px !important;
            }
            .body-cell {
                padding: 24px 18px 28px 18px !important;
            }
            .main-heading {
                font-size: 19px !important;
            }
            .sub-text {
                font-size: 14px !important;
                margin-bottom: 20px !important;
            }
            .code-cell {
                padding: 18px 12px !important;
            }
            .code-text {
                font-size: 28px !important;
                letter-spacing: 5px !important;
            }
            .footer-notice {
                font-size: 12px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 32px 12px; background-color: #ffffff; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <table class="card-wrapper" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 460px; background-color: #ffffff; border: 1px solid #ebebeb; border-radius: 16px; overflow: hidden;">
                    <!-- Dark Green Header -->
                    <tr>
                        <td class="header-cell" style="background-color: #0b1a0e; padding: 22px 28px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 10px;">
                                        <div style="width: 16px; height: 16px; border: 2px solid #ffffff; border-radius: 4px; box-sizing: border-box;"></div>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <span style="font-family: 'Geist', sans-serif; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.4px;">clud</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Card Body -->
                    <tr>
                        <td class="body-cell" style="padding: 32px 28px 36px 28px;">
                            <h1 class="main-heading" style="margin: 0 0 10px 0; font-size: 22px; font-weight: 700; color: #111111; letter-spacing: -0.3px; line-height: 1.3;">
                                Let's get this done
                            </h1>
                            <p class="sub-text" style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.5;">
                                You're just one step away from verifying your email. Use the code below to proceed.
                            </p>

                            <!-- OTP Box -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef3e2; border-radius: 12px; margin-bottom: 24px;">
                                <tr>
                                    <td class="code-cell" align="center" style="padding: 24px 16px;">
                                        <span class="code-text" style="font-family: 'Geist', monospace, sans-serif; font-size: 36px; font-weight: 600; color: #111111; letter-spacing: 7px; display: inline-block;">
                                            ${code}
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Notice -->
                            <p class="footer-notice" style="margin: 0 0 16px 0; font-size: 13px; color: #4b5563; line-height: 1.5;">
                                This code will expire in 10 minutes.<br>If you did not request this code, you can safely ignore this email.
                            </p>

                            <!-- Contact -->
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
</html>
            `,
        }

        if (this.from && this.from.trim().length > 0) {
            body.from = this.from
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                const errResponse = await response.text()
                this.logger.error(`Sendlib dispatch failed [${response.status}]: ${errResponse}`)
                throw new InternalServerErrorException("Failed to send verification email")
            }
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error
            }
            this.logger.error(`Sendlib request failed: ${(error as Error).message}`)
            throw new InternalServerErrorException("Failed to send verification email")
        }
    }
}
