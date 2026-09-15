import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "sonner"
import { getMeApi, logoutApi } from "../api/auth"
import {
  getProjectsApi,
  createProjectApi,
  checkProjectApi,
} from "../api/projects"
import type { Project } from "../api/projects"
import { fetchApi } from "../lib/fetch"
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar"
import { DashboardHeader } from "../components/dashboard/DashboardHeader"
import type { Workspace } from "../components/dashboard/DashboardHeader"
import { ProjectList } from "../components/dashboard/ProjectList"
import { ProjectDetailPanel } from "../components/dashboard/ProjectDetailPanel"
import { AddProjectModal } from "../components/dashboard/AddProjectModal"
import { IntegrationsTab } from "../components/dashboard/IntegrationsTab"
import { SettingsTab } from "../components/dashboard/SettingsTab"
import { TeamsTab } from "../components/dashboard/TeamsTab"
import { CreateWorkspaceModal } from "../components/dashboard/CreateWorkspaceModal"
import { SignOutModal } from "../components/dashboard/SignOutModal"

interface UserProfile {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  profile_picture?: string | null
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const path = location.pathname.split("/").filter(Boolean).pop()
  let activeNav: "dashboard" | "integrations" | "settings" | "teams" = "dashboard"
  if (path === "integrations") activeNav = "integrations"
  else if (path === "settings") activeNav = "settings"
  else if (path === "teams") activeNav = "teams"

  const [user, setUser] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null)
  const [integrationsCount, setIntegrationsCount] = useState(0)
  
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false)
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [viewFilter, setViewFilter] = useState<"all" | "sync" | "drift">("all")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [checkingProjectId, setCheckingProjectId] = useState<string | null>(null)
  const [newProject, setNewProject] = useState({
    name: "",
    spec_url: "",
    check_interval_minutes: 15,
  })

  const loadDashboardData = async (workspaceIdToSet?: string) => {
    setIsLoading(true)
    try {
      const [me, projs, wsData, integData] = await Promise.all([
        getMeApi(),
        getProjectsApi(), // Normally we'd pass workspaceId if backend supported it, keeping as is for MVP
        fetchApi("/workspaces"),
        fetchApi("/integrations")
      ])
      setUser(me)
      setProjects(projs)
      setWorkspaces(wsData)
      
      const newActiveId = workspaceIdToSet || wsData[0]?.id || null
      setActiveWorkspaceId(newActiveId)
      
      if (projs.length > 0) setSelectedProjectId(projs[0].id)
        
      let count = 0
      if (integData.slack?.connected) count++
      if (integData.emails?.length > 0) count++
      setIntegrationsCount(count)
      
    } catch {
      localStorage.removeItem("accessToken")
      toast.error("Session expired. Please sign in.")
      navigate("/signin")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
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

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.email.split("@")[0] || "User"
  
  const filteredProjects = projects.filter((p) => {
    return viewFilter === "all"
      ? true
      : viewFilter === "sync"
        ? !p.drift_detected
        : !!p.drift_detected
  })
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || null

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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
    <div className="min-h-screen h-screen flex bg-white font-sans text-neutral-900 overflow-hidden select-none">
      <DashboardSidebar
        activeNav={activeNav}
        setActiveNav={(nav) => navigate(`/dashboard${nav === "dashboard" ? "" : `/${nav}`}`)}
        projects={projects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        <DashboardHeader
          viewFilter={viewFilter}
          setViewFilter={setViewFilter}
          displayName={displayName}
          email={user?.email}
          initial={displayName.charAt(0).toUpperCase()}
          profilePicture={user?.profile_picture}
          onOpenSettings={() => navigate("/dashboard/settings")}
          onLogout={() => setShowSignOutModal(true)}
          onCreateWorkspace={() => setShowCreateWorkspace(true)}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSwitchWorkspace={(id) => loadDashboardData(id)}
        />
        
        {/* Missing Integration Banner */}
        {integrationsCount === 0 && projects.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-100 px-8 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              <span className="text-sm text-amber-800 font-medium">You haven't configured any alert destinations. You will not be notified of API drift.</span>
            </div>
            <button onClick={() => navigate('/dashboard/integrations')} className="text-sm font-semibold text-amber-900 hover:opacity-80">
              Configure Now &rarr;
            </button>
          </div>
        )}

        {activeNav === "dashboard" ? (
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
            {selectedProject && (
              <ProjectDetailPanel
                project={selectedProject}
              />
            )}
          </div>
        ) : activeNav === "integrations" ? (
          <IntegrationsTab />
        ) : activeNav === "teams" ? (
          <TeamsTab activeWorkspaceId={activeWorkspaceId} />
        ) : (
          <SettingsTab displayName={displayName} email={user?.email} profilePicture={user?.profile_picture} />
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
      <CreateWorkspaceModal
        isOpen={showCreateWorkspace}
        onClose={() => setShowCreateWorkspace(false)}
        onCreated={() => loadDashboardData()}
      />
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={() => {
          setShowSignOutModal(false)
          handleLogout()
        }}
      />
    </div>
  )
}
