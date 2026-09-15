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
}
