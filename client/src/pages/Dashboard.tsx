import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { getMeApi, logoutApi } from "../api/auth"
import {
  getProjectsApi,
  createProjectApi,
  checkProjectApi,
} from "../api/projects"
import type { Project } from "../api/projects"
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar"
import { DashboardHeader } from "../components/dashboard/DashboardHeader"
import { ProjectList } from "../components/dashboard/ProjectList"
import { ProjectDetailPanel } from "../components/dashboard/ProjectDetailPanel"
import { AddProjectModal } from "../components/dashboard/AddProjectModal"
import { IntegrationsTab } from "../components/dashboard/IntegrationsTab"
import { SettingsTab } from "../components/dashboard/SettingsTab"

interface UserProfile {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  profile_picture?: string | null
}

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeNav, setActiveNav] = useState<
    "dashboard" | "apis" | "integrations" | "settings"
  >("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewFilter, setViewFilter] = useState<"all" | "sync" | "drift">("all")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  )
  const [isAuditing, setIsAuditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [checkingProjectId, setCheckingProjectId] = useState<string | null>(
    null,
  )
  const [newProject, setNewProject] = useState({
    name: "",
    spec_url: "",
    check_interval_minutes: 15,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [me, projs] = await Promise.all([getMeApi(), getProjectsApi()])
        setUser(me)
        setProjects(projs)
        if (projs.length > 0) setSelectedProjectId(projs[0].id)
      } catch {
        toast.error("Session expired. Please sign in.")
        navigate("/signin")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await logoutApi()
    } finally {
      localStorage.removeItem("accessToken")
      navigate("/signin")
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const created = await createProjectApi(newProject)
      setProjects([created, ...projects])
      setSelectedProjectId(created.id)
      setShowAddModal(false)
      setNewProject({ name: "", spec_url: "", check_interval_minutes: 15 })
      toast.success("Monitor created!")
    } catch (err: any) {
      toast.error(err.message || "Failed to create monitor")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCheck = async (id: string, name: string) => {
    setCheckingProjectId(id)
    try {
      const res = await checkProjectApi(id)
      if (res.diff?.breakingChangesFound)
        toast.error(`Drift detected in ${name}!`)
      else toast.success(`${name} is in sync.`)
      setProjects(await getProjectsApi())
    } catch (err: any) {
      toast.error(err.message || "Failed to poll spec")
    } finally {
      setCheckingProjectId(null)
    }
  }

  const handleAuditAll = async () => {
    if (projects.length === 0) return
    setIsAuditing(true)
    try {
      for (const p of projects) await checkProjectApi(p.id)
      toast.success("Full schema audit completed!")
      setProjects(await getProjectsApi())
    } catch (err: any) {
      toast.error(err.message || "Failed to complete audit")
    } finally {
      setIsAuditing(false)
    }
  }

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.email.split("@")[0] || "User"
  const filteredProjects = projects.filter((p) => {
    const match =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.spec_url.toLowerCase().includes(searchQuery.toLowerCase())
    return (
      match &&
      (viewFilter === "all"
        ? true
        : viewFilter === "sync"
          ? !p.drift_detected
          : !!p.drift_detected)
    )
  })
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || null

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F8]">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-neutral-400 border-t-transparent rounded-full" />
          <span className="text-sm font-medium text-neutral-500">
            Loading workspace...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-screen flex bg-[#FAFAFA] font-sans text-neutral-900 overflow-hidden select-none">
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        projects={projects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAFA]">
        <DashboardHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewFilter={viewFilter}
          setViewFilter={setViewFilter}
          displayName={displayName}
          email={user?.email}
          initial={displayName.charAt(0).toUpperCase()}
          profilePicture={user?.profile_picture}
          onOpenSettings={() => setActiveNav("settings")}
          onLogout={handleLogout}
        />
        {activeNav === "dashboard" || activeNav === "apis" ? (
          <div className="flex-1 flex overflow-hidden">
            <ProjectList
              projects={filteredProjects}
              selectedProjectId={selectedProjectId}
              checkingProjectId={checkingProjectId}
              viewFilter={viewFilter}
              setViewFilter={setViewFilter}
              onSelectProject={setSelectedProjectId}
              onCheckProject={handleCheck}
              onOpenAddModal={() => setShowAddModal(true)}
            />
            <ProjectDetailPanel
              project={selectedProject}
              isAuditing={isAuditing}
              onAuditAll={handleAuditAll}
            />
          </div>
        ) : activeNav === "integrations" ? (
          <IntegrationsTab />
        ) : (
          <SettingsTab displayName={displayName} email={user?.email} />
        )}
      </div>
      <AddProjectModal
        isOpen={showAddModal}
        isCreating={isCreating}
        newProject={newProject}
        setNewProject={setNewProject}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
