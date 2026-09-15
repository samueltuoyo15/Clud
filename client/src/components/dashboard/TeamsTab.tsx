import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { fetchApi } from "../../lib/fetch"

interface Member {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  created_at: string
}

interface TeamsTabProps {
  activeWorkspaceId: string | null
}

export const TeamsTab: React.FC<TeamsTabProps> = ({ activeWorkspaceId }) => {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    const loadMembers = async () => {
      if (!activeWorkspaceId) return
      setIsLoading(true)
      try {
        const data = await fetchApi(`/workspaces/${activeWorkspaceId}/members`)
        setMembers(data)
      } catch (err: any) {
        toast.error("Failed to load team members")
      } finally {
        setIsLoading(false)
      }
    }
    loadMembers()
  }, [activeWorkspaceId])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim() || !activeWorkspaceId) return
    setIsInviting(true)
    try {
      await fetchApi(`/workspaces/${activeWorkspaceId}/members`, {
        method: "POST",
        data: { email: inviteEmail.trim() }
      })
      toast.success("Member added successfully!")
      setInviteEmail("")
      // Reload members
      const data = await fetchApi(`/workspaces/${activeWorkspaceId}/members`)
      setMembers(data)
    } catch (err: any) {
      toast.error(err.message || "Failed to invite member")
    } finally {
      setIsInviting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 w-full max-w-4xl flex justify-center">
        <div className="animate-spin h-5 w-5 border-2 border-neutral-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8 w-full max-w-4xl mx-auto overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-heading font-semibold text-neutral-900 mb-1">
            Teams & Collaboration
          </h2>
          <p className="text-sm text-neutral-500">
            Manage who has access to this workspace.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-neutral-100 overflow-hidden mb-8">
        <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
          <h3 className="text-sm font-semibold text-neutral-900 mb-1">Invite Member</h3>
          <p className="text-xs text-neutral-500 mb-4">Add someone to your workspace by email. They must have a Clud account first.</p>
          <form onSubmit={handleInvite} className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@acme.com"
              className="flex-1 px-4 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:border-primary"
              required
            />
            <Button type="submit" isLoading={isInviting}>Invite</Button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-neutral-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold text-neutral-500">
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {members.map((member) => (
              <tr key={member.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {(member.first_name?.[0] || member.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">
                        {member.first_name ? `${member.first_name} ${member.last_name || ''}` : member.email}
                      </div>
                      <div className="text-xs text-neutral-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="capitalize text-neutral-700 bg-neutral-100 px-2 py-1 rounded text-xs font-medium">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-500 text-xs">
                  {new Date(member.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
