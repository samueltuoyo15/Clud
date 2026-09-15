import { Injectable, BadRequestException, Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import db from '../../db'
import { integrations, workspaceMembers } from '../../db/schema'

@Injectable()
export class IntegrationsService {
  private logger = new Logger(IntegrationsService.name)

  async connectSlack(code: string, redirectUri: string, userId: string) {
    if (!code) throw new BadRequestException('Code is required')
    if (!redirectUri) throw new BadRequestException('Redirect URI is required')

    const [member] = await db
      .select({ workspace_id: workspaceMembers.workspace_id })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.user_id, userId))
      .limit(1)

    if (!member) throw new BadRequestException('User has no workspace')

    const clientId = process.env.SLACK_CLIENT_ID
    const clientSecret = process.env.SLACK_CLIENT_SECRET
    if (!clientId || !clientSecret) {
      throw new BadRequestException('Slack credentials are not configured')
    }

    try {
      const response = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
      })

      const data = await response.json()
      if (!data.ok) {
        this.logger.error(`Slack OAuth Error: ${JSON.stringify(data)}`)
        throw new BadRequestException(`Slack error: ${data.error}`)
      }

      await db.insert(integrations).values({
        workspace_id: member.workspace_id,
        provider: 'slack',
        access_token: data.access_token,
        metadata: {
          team_id: data.team?.id,
          team_name: data.team?.name,
          webhook_url: data.incoming_webhook?.url,
          channel: data.incoming_webhook?.channel,
          channel_id: data.incoming_webhook?.channel_id,
        },
      })

      return { success: true, message: 'Slack connected successfully' }
    } catch (err: any) {
      this.logger.error(`Failed to connect Slack: ${err.message}`)
      throw new BadRequestException(err.message || 'Failed to connect to Slack')
    }
  }
}
