import { Injectable, BadRequestException } from '@nestjs/common'
import { eq, and } from 'drizzle-orm'
import db from '../../db'
import { workspaces, workspaceMembers, users } from '../../db/schema'

@Injectable()
export class WorkspacesService {
  async getWorkspaces(userId: string) {
    const memberRecords = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        role: workspaceMembers.role,
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspace_id))
      .where(eq(workspaceMembers.user_id, userId))

    return memberRecords
  }

  async getWorkspaceMembers(workspaceId: string, userId: string) {
    // Verify user is in this workspace
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspace_id, workspaceId),
          eq(workspaceMembers.user_id, userId)
        )
      )

    if (!membership) {
      throw new BadRequestException('You do not have access to this workspace')
    }

    const members = await db
      .select({
        id: users.id,
        email: users.email,
        first_name: users.first_name,
        last_name: users.last_name,
        role: workspaceMembers.role,
        created_at: workspaceMembers.created_at,
      })
      .from(workspaceMembers)
      .innerJoin(users, eq(users.id, workspaceMembers.user_id))
      .where(eq(workspaceMembers.workspace_id, workspaceId))

    return members
  }

  async addMember(workspaceId: string, emailInput: string, userId: string) {
    const email = emailInput.toLowerCase()
    
    // Check if the inviter is owner/admin
    const [inviter] = await db
      .select({ role: workspaceMembers.role })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspace_id, workspaceId),
          eq(workspaceMembers.user_id, userId)
        )
      )

    if (!inviter || (inviter.role !== 'owner' && inviter.role !== 'admin')) {
      throw new BadRequestException('Only workspace admins can invite members')
    }

    // Find the user to invite
    const [targetUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))

    if (!targetUser) {
      throw new BadRequestException('User must create a Clud account first before they can be invited')
    }

    // Check if already in workspace
    const [existingMember] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspace_id, workspaceId),
          eq(workspaceMembers.user_id, targetUser.id)
        )
      )

    if (existingMember) {
      throw new BadRequestException('User is already a member of this workspace')
    }

    // Add them
    await db.insert(workspaceMembers).values({
      workspace_id: workspaceId,
      user_id: targetUser.id,
      role: 'member',
    })

    return { success: true, message: 'Member added successfully' }
  }

  async createWorkspace(name: string, userId: string) {
    if (!name?.trim()) {
      throw new BadRequestException('Workspace name is required')
    }

    const result = await db.transaction(async (tx) => {
      const [workspace] = await tx
        .insert(workspaces)
        .values({ name: name.trim() })
        .returning({ id: workspaces.id, name: workspaces.name })

      await tx.insert(workspaceMembers).values({
        workspace_id: workspace.id,
        user_id: userId,
        role: 'owner',
      })

      return workspace
    })

    return result
  }
}
