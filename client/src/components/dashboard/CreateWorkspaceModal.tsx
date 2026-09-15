import React, { useState } from "react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { fetchApi } from "../../lib/fetch"

interface CreateWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

export const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsCreating(true)
    try {
      await fetchApi("/workspaces", {
        method: "POST",
        data: { name: name.trim() }
      })
      toast.success(`Workspace "${name}" created!`)
      setName("")
      onCreated?.()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to create workspace")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl  w-full max-w-md relative z-10 overflow-hidden flex flex-col border border-neutral-200">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-neutral-900">
            Create Workspace
          </h2>
        </div>

        <div className="p-6">
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Workspace Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Corp"
            className="w-full px-4 py-2 rounded-lg border border-neutral-200 text-sm bg-white text-neutral-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            autoFocus
            required
          />
        </div>

        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3">
          <Button type="button" variant="light" onClick={onClose} disabled={isCreating} className="px-5">
            Cancel
          </Button>
          <Button type="submit" className="px-6" isLoading={isCreating}>
            Create
          </Button>
        </div>
      </form>
    </div>
  )
}
