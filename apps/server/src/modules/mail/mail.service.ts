import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { getOtpEmailTemplate } from './templates/otp-email.template'
import { getWelcomeEmailTemplate } from './templates/welcome-email.template'
import { getDriftAlertEmailTemplate } from './templates/drift-alert-email.template'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private readonly apiUrl = 'https://sendlib.samueltuoyo.com/api/send'
  private readonly apiKey = process.env.SENDLIB_API_KEY
  private readonly from = process.env.SENDLIB_FROM

  async sendOtp(to: string, code: string): Promise<void> {
    const apiKey = this.apiKey || process.env.SENDLIB_API_KEY
    if (!apiKey) {
      this.logger.error('SENDLIB_API_KEY is missing in environment variables')
      throw new InternalServerErrorException('Email service is not configured')
    }

    const { subject, text, html } = getOtpEmailTemplate(code)
    const body: Record<string, any> = { to, subject, text, html }
    if (this.from?.trim()) body.from = this.from

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const err = await response.text()
        this.logger.error(
          `Sendlib dispatch failed [${response.status}]: ${err}`,
        )
        throw new InternalServerErrorException(
          'Failed to send verification email',
        )
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error
      this.logger.error(`Sendlib request failed: ${(error as Error).message}`)
      throw new InternalServerErrorException(
        'Failed to send verification email',
      )
    }
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
    const apiKey = this.apiKey || process.env.SENDLIB_API_KEY
    if (!apiKey) return

    const html = getWelcomeEmailTemplate(firstName)
    const body: Record<string, any> = {
      to,
      subject: 'Welcome to Clud',
      html,
    }
    if (this.from?.trim()) body.from = this.from

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        this.logger.error(`Sendlib dispatch failed for welcome email: ${await response.text()}`)
      }
    } catch (error) {
      this.logger.error(`Sendlib welcome request failed: ${(error as Error).message}`)
    }
  }

  async sendDriftAlert(toEmails: string[], projectName: string, diffStr: string): Promise<void> {
    const apiKey = this.apiKey || process.env.SENDLIB_API_KEY
    if (!apiKey || !toEmails.length) return

    const { subject, html } = getDriftAlertEmailTemplate(projectName, diffStr)

    // Send to each email
    await Promise.allSettled(toEmails.map(async (to) => {
      const body: Record<string, any> = { to, subject, html }
      if (this.from?.trim()) body.from = this.from

      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
        })
        if (!response.ok) {
          this.logger.error(`Failed to send drift alert to ${to}: ${await response.text()}`)
        }
      } catch (err: any) {
        this.logger.error(`Failed request for drift alert to ${to}: ${err.message}`)
      }
    }))
  }

  async sendWorkspaceInviteEmail(
    to: string,
    workspaceName: string,
    inviterName: string,
  ): Promise<void> {
    const apiKey = this.apiKey || process.env.SENDLIB_API_KEY
    if (!apiKey) return

    const html = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; background-color: #FAFAFA; margin: 0; padding: 0;">
        <tr>
          <td align="center" style="padding: 32px 16px; text-align: center;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width: 540px; width: 100%; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E5E5; border-radius: 16px; overflow: hidden; text-align: left; border-collapse: separate;">
              <tr>
                <td style="background-color: #611F69; padding: 22px 28px; text-align: left;">
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
                <td style="padding: 32px 28px; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #171717;">
                  <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; text-align: left; color: #111827;">You've been invited to ${workspaceName}</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #525252; margin: 0 0 24px 0; text-align: left;">
                    ${inviterName} has added you as a team member to the <strong>${workspaceName}</strong> workspace on Clud.
                  </p>
                  <div style="margin: 24px 0; text-align: left;">
                    <a href="https://clud.samueltuoyo.com/signin" style="background-color: #611F69; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
                      Open Dashboard
                    </a>
                  </div>
                  <p style="font-size: 12px; color: #a3a3a3; margin: 32px 0 0 0; text-align: left;">
                    Clud &bull; Automated API Contract Drift Detection
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    const body: Record<string, any> = {
      to,
      subject: `You've been invited to ${workspaceName} on Clud`,
      html,
    }
    if (this.from?.trim()) body.from = this.from

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        this.logger.error(`Failed to send invite email: ${await response.text()}`)
      }
    } catch (err: any) {
      this.logger.error(`Sendlib invite request failed: ${err.message}`)
    }
  }

  async sendContactMessage(
    senderEmail: string,
    senderName: string,
    company: string,
    message: string,
  ): Promise<void> {
    const apiKey = this.apiKey || process.env.SENDLIB_API_KEY
    if (!apiKey) {
      this.logger.error('SENDLIB_API_KEY is missing in environment variables')
      throw new InternalServerErrorException('Email service is not configured')
    }

    const html = `
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
                <td style="padding: 32px 28px; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; text-align: left; color: #0f172a;">New Contact / Sales Inquiry</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 16px 0; text-align: left;">
                    <strong>Name:</strong> ${senderName}<br>
                    <strong>Email:</strong> ${senderEmail}<br>
                    <strong>Company:</strong> ${company || 'N/A'}
                  </p>
                  <div style="margin: 20px 0; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #1f2937; text-align: left;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                  <p style="font-size: 12px; color: #6b7280; margin: 24px 0 0 0; text-align: left;">
                    Sent from Clud Contact Sales Form
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `

    const body: Record<string, any> = {
      to: 'support@samueltuoyo.com',
      subject: `[Clud Inquiry] New message from ${senderName} (${company || senderEmail})`,
      html,
    }
    if (this.from?.trim()) body.from = this.from

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const err = await response.text()
        this.logger.error(`Sendlib contact inquiry failed [${response.status}]: ${err}`)
        throw new InternalServerErrorException('Failed to deliver inquiry email')
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error
      this.logger.error(`Sendlib contact inquiry error: ${(error as Error).message}`)
      throw new InternalServerErrorException('Failed to deliver inquiry email')
    }
  }

  async sendNewReviewAlert(review: {
    name: string
    handle?: string | null
    role?: string | null
    company?: string | null
    rating?: number
    quote: string
  }): Promise<void> {
    const apiKey = this.apiKey || process.env.SENDLIB_API_KEY
    if (!apiKey) return

    const html = `
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
                <td style="padding: 32px 28px; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; text-align: left; color: #0f172a;">New Testimonial Submitted</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 16px 0; text-align: left;">
                    <strong>Name:</strong> ${review.name}<br>
                    <strong>Handle:</strong> ${review.handle || 'N/A'}<br>
                    <strong>Role / Company:</strong> ${review.role || ''} ${review.company ? `@ ${review.company}` : ''}<br>
                    <strong>Rating:</strong> ${'★'.repeat(review.rating || 5)} (${review.rating || 5}/5)
                  </p>
                  <div style="margin: 20px 0; padding: 16px; background-color: #fff0f6; border: 1px solid #fbcfe8; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #1f2937; text-align: left;">
                    "${review.quote.replace(/\n/g, '<br>')}"
                  </div>
                  <p style="font-size: 12px; color: #6b7280; margin: 24px 0 0 0; text-align: left;">
                    This review is saved with <code>is_approved = false</code>. To make it visible on the landing page, update <code>is_approved = true</code> in the database.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `

    const body: Record<string, any> = {
      to: 'support@samueltuoyo.com',
      subject: `[Clud Review] New ${review.rating || 5}-star testimonial from ${review.name}`,
      html,
    }
    if (this.from?.trim()) body.from = this.from

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        this.logger.error(`Failed to dispatch review alert email: ${await response.text()}`)
      }
    } catch (err: any) {
      this.logger.error(`Sendlib review alert error: ${err.message}`)
    }
  }
}
