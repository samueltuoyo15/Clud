import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import DodoPayments from 'dodopayments'
import db from '../../db'
import { workspaces, subscriptions } from '../../db/schema'
import { eq, desc } from 'drizzle-orm'

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)
  private readonly client: DodoPayments

  constructor() {
    this.client = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY || '',
      environment:
        process.env.DODO_PAYMENTS_ENVIRONMENT === 'test_mode'
          ? 'test_mode'
          : 'live_mode',
    })
  }

  async createCheckoutSession(
    workspaceId: string,
    userId: string,
    userEmail: string,
    customReturnUrl?: string,
  ) {
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))

    if (!workspace) {
      throw new NotFoundException('Workspace not found')
    }

    const productId = process.env.DODO_PAYMENTS_PRODUCT_ID
    if (!productId) {
      throw new BadRequestException('Dodo Payments Product ID is not configured')
    }

    const clientUrl = process.env.CLIENT_URL || 'https://clud.samueltuoyo.com'
    const returnUrl =
      customReturnUrl || `${clientUrl}/dashboard?billing=success`

    try {
      const session = await this.client.checkoutSessions.create({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: {
          email: userEmail,
        },
        metadata: {
          workspace_id: workspaceId,
          user_id: userId,
        },
        return_url: returnUrl,
      })

      return {
        checkout_url: session.checkout_url,
        session_id: session.session_id,
      }
    } catch (err: any) {
      this.logger.error(`Failed to create Dodo checkout session: ${err.message}`)
      throw new BadRequestException(
        err.message || 'Could not initiate checkout session',
      )
    }
  }

  async getWorkspaceBilling(workspaceId: string) {
    const [workspace] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        plan: workspaces.plan,
        subscription_status: workspaces.subscription_status,
      })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))

    if (!workspace) {
      throw new NotFoundException('Workspace not found')
    }

    const [activeSub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.workspace_id, workspaceId))
      .orderBy(desc(subscriptions.created_at))
      .limit(1)

    return {
      workspace_id: workspace.id,
      plan: workspace.plan,
      subscription_status: workspace.subscription_status,
      subscription: activeSub || null,
    }
  }
}
