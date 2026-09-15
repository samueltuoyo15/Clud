import { Injectable } from '@nestjs/common'
import { eq, desc, and } from 'drizzle-orm'
import db from '../../db'
import { notifications, workspaceMembers } from '../../db/schema'

@Injectable()
export class NotificationsService {
  async getNotifications(userId: string) {
    const userWorkspaces = await db
      .select({ workspace_id: workspaceMembers.workspace_id })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.user_id, userId))

    if (!userWorkspaces.length) return []

    const workspaceIds = userWorkspaces.map((w) => w.workspace_id)

    const list = await db
      .select()
      .from(notifications)
      .where(eq(notifications.workspace_id, workspaceIds[0]))
      .orderBy(desc(notifications.created_at))
      .limit(20)

    return list
  }

  async markAsRead(id: string, userId: string) {
    const userWorkspaces = await db
      .select({ workspace_id: workspaceMembers.workspace_id })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.user_id, userId))

    if (!userWorkspaces.length) return { success: false }

    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))

    return { success: true }
  }

  async createNotification(
    workspaceId: string,
    projectId: string | null,
    title: string,
    message: string,
    type = 'drift',
  ) {
    const [inserted] = await db
      .insert(notifications)
      .values({
        workspace_id: workspaceId,
        project_id: projectId || undefined,
        title,
        message,
        type,
      })
      .returning()

    return inserted
  }
}
