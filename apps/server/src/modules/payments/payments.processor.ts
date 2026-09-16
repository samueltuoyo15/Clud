import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { eq } from 'drizzle-orm'
import db from '../../db'
import { workspaces, subscriptions, webhookEvents } from '../../db/schema'

export interface PaymentJobData {
  eventId: string
  eventType: string
  payload: any
}

@Processor('payments', { concurrency: 2 })
export class PaymentsProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentsProcessor.name)

  async process(job: Job<PaymentJobData>): Promise<void> {
    const { eventId, eventType, payload } = job.data
    this.logger.log(`Processing payment webhook event: ${eventType} (${eventId})`)

    const [existingEvent] = await db
      .select({ id: webhookEvents.id })
      .from(webhookEvents)
      .where(eq(webhookEvents.event_id, eventId))

    if (existingEvent) {
      this.logger.log(`Event ${eventId} already processed. Skipping.`)
      return
    }

    const eventData = payload?.data || payload
    const metadata = eventData?.metadata || {}
    const workspaceId = metadata?.workspace_id
    const customerId = eventData?.customer?.customer_id || eventData?.customer_id
    const subscriptionId = eventData?.subscription_id || eventData?.id
    const productId = eventData?.product_id || eventData?.items?.[0]?.product_id

    try {
      if (
        eventType === 'subscription.active' ||
        eventType === 'payment.succeeded'
      ) {
        await this.handleSubscriptionActive(
          workspaceId,
          customerId,
          subscriptionId,
          productId,
          eventData,
        )
      } else if (eventType === 'subscription.renewed') {
        await this.handleSubscriptionRenewed(subscriptionId, eventData)
      } else if (
        eventType === 'subscription.cancelled' ||
        eventType === 'subscription.expired'
      ) {
        await this.handleSubscriptionCancelled(subscriptionId, workspaceId)
      } else if (
        eventType === 'subscription.past_due' ||
        eventType === 'payment.failed'
      ) {
        await this.handlePaymentFailed(subscriptionId, workspaceId)
      }

      await db.insert(webhookEvents).values({
        event_id: eventId,
        event_type: eventType,
        payload: payload,
        status: 'processed',
      })
    } catch (err: any) {
      this.logger.error(
        `Error handling webhook event ${eventId} (${eventType}): ${err.message}`,
      )
      throw err
    }
  }

  private async handleSubscriptionActive(
    workspaceId: string | undefined,
    customerId: string | undefined,
    subscriptionId: string | undefined,
    productId: string | undefined,
    eventData: any,
  ) {
    if (!workspaceId && subscriptionId) {
      const [existingSub] = await db
        .select({ workspace_id: subscriptions.workspace_id })
        .from(subscriptions)
        .where(eq(subscriptions.dodo_subscription_id, subscriptionId))
      if (existingSub) {
        workspaceId = existingSub.workspace_id
      }
    }

    if (!workspaceId) {
      this.logger.warn(
        `Subscription active event received without identifiable workspaceId`,
      )
      return
    }

    const periodEnd = eventData?.current_period_end
      ? new Date(eventData.current_period_end)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await db.transaction(async (tx) => {
      await tx
        .update(workspaces)
        .set({
          plan: 'pro',
          subscription_status: 'active',
          updated_at: new Date(),
        })
        .where(eq(workspaces.id, workspaceId))

      if (subscriptionId) {
        const [existing] = await tx
          .select({ id: subscriptions.id })
          .from(subscriptions)
          .where(eq(subscriptions.dodo_subscription_id, subscriptionId))

        if (existing) {
          await tx
            .update(subscriptions)
            .set({
              status: 'active',
              dodo_customer_id: customerId,
              product_id: productId,
              current_period_end: periodEnd,
              updated_at: new Date(),
            })
            .where(eq(subscriptions.id, existing.id))
        } else {
          await tx.insert(subscriptions).values({
            workspace_id: workspaceId,
            dodo_subscription_id: subscriptionId,
            dodo_customer_id: customerId,
            product_id: productId,
            status: 'active',
            current_period_end: periodEnd,
          })
        }
      }
    })

    this.logger.log(`Workspace ${workspaceId} upgraded to Pro tier.`)
  }

  private async handleSubscriptionRenewed(
    subscriptionId: string | undefined,
    eventData: any,
  ) {
    if (!subscriptionId) return
    const periodEnd = eventData?.current_period_end
      ? new Date(eventData.current_period_end)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await db
      .update(subscriptions)
      .set({
        status: 'active',
        current_period_end: periodEnd,
        updated_at: new Date(),
      })
      .where(eq(subscriptions.dodo_subscription_id, subscriptionId))
  }

  private async handleSubscriptionCancelled(
    subscriptionId: string | undefined,
    workspaceId: string | undefined,
  ) {
    if (subscriptionId) {
      const [sub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.dodo_subscription_id, subscriptionId))
      if (sub) {
        workspaceId = sub.workspace_id
        await db
          .update(subscriptions)
          .set({ status: 'cancelled', updated_at: new Date() })
          .where(eq(subscriptions.id, sub.id))
      }
    }

    if (workspaceId) {
      await db
        .update(workspaces)
        .set({
          plan: 'free',
          subscription_status: 'cancelled',
          updated_at: new Date(),
        })
        .where(eq(workspaces.id, workspaceId))
      this.logger.log(`Workspace ${workspaceId} downgraded to Free tier.`)
    }
  }

  private async handlePaymentFailed(
    subscriptionId: string | undefined,
    workspaceId: string | undefined,
  ) {
    if (subscriptionId) {
      const [sub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.dodo_subscription_id, subscriptionId))
      if (sub) {
        workspaceId = sub.workspace_id
        await db
          .update(subscriptions)
          .set({ status: 'past_due', updated_at: new Date() })
          .where(eq(subscriptions.id, sub.id))
      }
    }

    if (workspaceId) {
      await db
        .update(workspaces)
        .set({
          subscription_status: 'past_due',
          updated_at: new Date(),
        })
        .where(eq(workspaces.id, workspaceId))
    }
  }
}
