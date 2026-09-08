import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home01Icon,
  Settings01Icon,
  Search01Icon,
  PlusSignIcon,
  Cancel01Icon,
  Clock01Icon,
  Notification01Icon,
  FilterHorizontalIcon,
  ArrowDown01Icon,
  FoldersIcon,
  Activity01Icon,
  Calendar01Icon,
  CheckmarkCircle01Icon,
  PuzzleIcon,
} from "hugeicons-react";
import { toast } from "sonner";
import { getMeApi, logoutApi } from "../api/auth";
import { getProjectsApi, createProjectApi, checkProjectApi } from "../api/projects";
import type { Project } from "../api/projects";
import { Button } from "../components/ui/button";

interface UserProfile {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  country?: string | null;
  profile_picture?: string | null;
}

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<"dashboard" | "apis" | "integrations" | "settings">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [viewFilter, setViewFilter] = useState<"all" | "sync" | "drift">("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // New Project Form
  const [newProject, setNewProject] = useState({
    name: "",
    spec_url: "",
    check_interval_minutes: 15,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [checkingProjectId, setCheckingProjectId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meData, projData] = await Promise.all([getMeApi(), getProjectsApi()]);
        setUser(meData);
        setProjects(projData);
        if (projData.length > 0) {
          setSelectedProjectId(projData[0].id);
        }
      } catch (err: any) {
        toast.error("Session expired. Please sign in.");
        navigate("/signin");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("accessToken");
      navigate("/signin");
    } catch {
      localStorage.removeItem("accessToken");
      navigate("/signin");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const created = await createProjectApi(newProject);
      setProjects([created, ...projects]);
      setSelectedProjectId(created.id);
      setShowAddModal(false);
      setNewProject({ name: "", spec_url: "", check_interval_minutes: 15 });
      toast.success("Monitor created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create API monitor");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCheckProject = async (id: string, name: string) => {
    setCheckingProjectId(id);
    try {
      const res = await checkProjectApi(id);
      if (res.diff?.breakingChangesFound) {
        toast.error(`Drift detected in ${name}!`);
      } else {
        toast.success(`${name} is in sync.`);
      }
      const updated = await getProjectsApi();
      setProjects(updated);
    } catch (err: any) {
      toast.error(err.message || "Failed to poll spec");
    } finally {
      setCheckingProjectId(null);
    }
  };

  const handleAuditAll = async () => {
    if (projects.length === 0) return;
    setIsAuditing(true);
    try {
      for (const p of projects) {
        await checkProjectApi(p.id);
      }
      toast.success("Full schema audit completed!");
      const updated = await getProjectsApi();
      setProjects(updated);
    } catch (err: any) {
      toast.error(err.message || "Failed to complete audit");
    } finally {
      setIsAuditing(false);
    }
  };

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.email.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.spec_url.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (viewFilter === "sync") return !p.drift_detected;
    if (viewFilter === "drift") return !!p.drift_detected;
    return true;
  });

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F8]">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium text-neutral-500">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen flex bg-[#FAFAFA] font-sans text-neutral-900 overflow-hidden select-none">
      {/* Sidebar - Inspired by Obsidian's clean, light aesthetic */}
      <aside className="w-64 h-full bg-[#F4F3EF] border-r border-[#EBEBE8] py-6 px-4 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="flex items-center gap-2.5 px-3 mb-8">
            <img src="/favicon.svg" alt="Clud" className="h-5 w-5 object-contain" />
            <span className="font-heading font-bold text-sm tracking-wide text-neutral-900 uppercase">
              Clud
            </span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveNav("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeNav === "dashboard"
                  ? "bg-white text-neutral-900  border border-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-black/5"
              }`}
            >
              <Home01Icon size={16} className={activeNav === "dashboard" ? "text-neutral-800" : "text-neutral-400"} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveNav("apis")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeNav === "apis"
                  ? "bg-white text-neutral-900  border border-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-black/5"
              }`}
            >
              <FoldersIcon size={16} className={activeNav === "apis" ? "text-neutral-800" : "text-neutral-400"} />
              <span>Projects</span>
            </button>

            <button
              onClick={() => setActiveNav("integrations")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeNav === "integrations"
                  ? "bg-white text-neutral-900  border border-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-black/5"
              }`}
            >
              <PuzzleIcon size={16} className={activeNav === "integrations" ? "text-neutral-800" : "text-neutral-400"} />
              <span>Integrations</span>
            </button>

            <button
              onClick={() => setActiveNav("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeNav === "settings"
                  ? "bg-white text-neutral-900  border border-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-black/5"
              }`}
            >
              <Settings01Icon size={16} className={activeNav === "settings" ? "text-neutral-800" : "text-neutral-400"} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Pinned APIs Section */}
          <div className="mt-8 px-1">
            <p className="text-[11px] font-semibold text-neutral-400 mb-3 px-2">Pinned</p>
            {projects.length === 0 ? (
              <p className="text-xs text-neutral-400 px-2">No projects yet.</p>
            ) : (
              <div className="space-y-0.5">
                {projects.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setActiveNav("dashboard");
                    }}
                    className={`w-full flex items-center gap-2 text-xs py-1.5 px-2 rounded-md transition-colors cursor-pointer text-left truncate ${
                      selectedProjectId === p.id && activeNav === "dashboard"
                        ? "text-neutral-900 font-medium bg-black/5"
                        : "text-neutral-500 hover:bg-black/5 hover:text-neutral-800"
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Minimal Bottom CTA */}
        <div className="px-2">
          <div className="p-3 flex flex-col items-start gap-1">
            <span className="text-xs font-semibold text-neutral-800">Clud AI</span>
            <span className="text-[10px] text-neutral-500">Auto-Polling Active</span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAFA]">
        {/* Top Header */}
        <header className="h-[72px] px-8 border-b border-neutral-200/60 flex items-center justify-between shrink-0 bg-[#FAFAFA]">
          {/* Header Actions - Search, Filter, Notifications, Profile */}
          <div className="flex-1 flex items-center justify-between">
            {/* Search Input */}
            <div className="relative">
              <Search01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-56 pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200/80 bg-white hover:border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition-colors "
              />
            </div>

            {/* Right Side Actions Group */}
            <div className="flex items-center gap-4">
              {/* Filter & Notifications */}
              <div className="flex items-center gap-1.5">
              <button
                title="Filter options"
                onClick={() => setViewFilter(viewFilter === "all" ? "drift" : viewFilter === "drift" ? "sync" : "all")}
                className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-black/5 transition-colors cursor-pointer"
              >
                <FilterHorizontalIcon size={16} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  title="Notifications"
                  className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-black/5 transition-colors cursor-pointer relative"
                >
                  <Notification01Icon size={16} />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-neutral-200 shadow-lg p-3 z-50">
                    <div className="pb-2 border-b border-neutral-100 flex items-center justify-between">
                      <p className="text-xs font-semibold text-neutral-900">Notifications</p>
                    </div>
                    <div className="py-6 text-center">
                      <p className="text-xs text-neutral-400">No new notifications.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Profile Chip */}
            <div className="relative border-l border-neutral-200 pl-4">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 rounded-md hover:bg-black/5 px-1.5 py-1 transition-colors cursor-pointer"
              >
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt={displayName} className="w-6 h-6 rounded-md object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-md bg-neutral-800 text-white text-[10px] font-bold flex items-center justify-center">
                    {initial}
                  </div>
                )}
                <span className="text-xs font-medium text-neutral-700 max-w-24 truncate hidden sm:block">{displayName}</span>
                <ArrowDown01Icon size={12} className="text-neutral-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-neutral-200 shadow-lg p-1.5 z-50">
                  <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{displayName}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveNav("settings");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-black/5 rounded-md transition-colors cursor-pointer"
                  >
                    Workspace Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        {activeNav === "dashboard" || activeNav === "apis" ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Center Area: Filter Bar + Card Columns */}
            <div className="flex-1 flex flex-col p-8 overflow-hidden">
              {/* Top View Filter & Action */}
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-1 bg-white border border-neutral-200/80 p-0.5 rounded-lg ">
                  <button
                    onClick={() => setViewFilter("all")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      viewFilter === "all"
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                    }`}
                  >
                    Board
                  </button>
                  <button
                    onClick={() => setViewFilter("sync")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      viewFilter === "sync"
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                    }`}
                  >
                    In Sync
                  </button>
                  <button
                    onClick={() => setViewFilter("drift")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      viewFilter === "drift"
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                    }`}
                  >
                    Drift Detected
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 rounded-lg "
                  >
                    <span>+ Add API</span>
                  </Button>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto pr-2 pb-8">
                {filteredProjects.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-medium text-neutral-900 mb-1">No Projects Found</p>
                    <p className="text-xs text-neutral-500 mb-4">You have no matching projects or APIs.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredProjects.map((p) => {
                      const isSelected = selectedProjectId === p.id;
                      const isChecking = checkingProjectId === p.id;

                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedProjectId(p.id)}
                          className={`bg-white rounded-xl p-5 transition-all cursor-pointer ${
                            isSelected
                              ? "border-neutral-800 border"
                              : "border-neutral-200  border hover:border-neutral-300"
                          }`}
                        >
                          {/* Top Row */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                                <Calendar01Icon size={12} />
                                {new Date(p.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                p.drift_detected 
                                  ? "bg-rose-50 text-rose-600" 
                                  : "bg-amber-50 text-amber-700"
                              }`}>
                                • {p.drift_detected ? "High Priority" : "Medium"}
                              </span>
                            </div>
                            
                            {/* Three dots menu stand-in */}
                            <span className="text-neutral-300 leading-none tracking-widest text-lg h-4 flex items-center">
                              ···
                            </span>
                          </div>

                          {/* Body */}
                          <h4 className="text-[15px] font-bold text-neutral-900 mb-1">
                            {p.name}
                          </h4>
                          <p className="text-xs text-neutral-500 truncate mb-4 font-mono leading-relaxed">
                            {p.spec_url}
                          </p>

                          {/* Bottom Row */}
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-[11px] font-medium text-neutral-500 flex items-center gap-1.5">
                              <Clock01Icon size={12} /> Interval: {p.check_interval_minutes}m
                            </span>

                            <Button
                              variant="light"
                              size="sm"
                              isLoading={isChecking}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckProject(p.id, p.name);
                              }}
                              className="text-[11px] px-3 py-1 h-auto rounded-md !bg-[#3902FF]/5 !text-[#3902FF] !border-[#3902FF]/20 hover:!bg-[#3902FF]/10"
                            >
                              Poll Now
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Detail Panel */}
            <div className="w-80 shrink-0 bg-white border-l border-neutral-200 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                {selectedProject ? (
                  <>
                    <h3 className="text-base font-bold text-neutral-900 mb-1">
                      {selectedProject.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mb-6 font-mono truncate">
                      {selectedProject.spec_url}
                    </p>

                    {/* True Real Stats Boxes */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <div>
                        <p className="text-[11px] font-medium text-neutral-500 mb-1">Status</p>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[13px] font-bold ${selectedProject.drift_detected ? 'text-rose-600' : 'text-neutral-900'}`}>
                            {selectedProject.drift_detected ? "Drifted" : "In Sync"}
                          </span>
                          {!selectedProject.drift_detected && (
                            <CheckmarkCircle01Icon size={14} className="text-emerald-500" />
                          )}
                        </div>
                        <div className="w-full h-1 bg-neutral-100 rounded-full mt-2">
                          <div className={`h-full rounded-full ${selectedProject.drift_detected ? "bg-rose-500 w-full" : "bg-emerald-500 w-full"}`} />
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] font-medium text-neutral-500 mb-1">Interval</p>
                        <p className="text-[13px] font-bold text-neutral-900">{selectedProject.check_interval_minutes} mins</p>
                        <div className="w-full h-1 bg-neutral-100 rounded-full mt-2">
                          <div className="h-full rounded-full bg-blue-500 w-[50%]" />
                        </div>
                      </div>
                    </div>

                    {/* Real Last Activity */}
                    <div className="mb-6">
                      <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-wide mb-4">Project Details</p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-md bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
                            <Clock01Icon size={12} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-neutral-900">Last Polled</p>
                            <p className="text-[11px] text-neutral-500">
                              {selectedProject.last_polled_at 
                                ? new Date(selectedProject.last_polled_at).toLocaleString() 
                                : "Never polled"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-md bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
                            <Calendar01Icon size={12} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-neutral-900">Created At</p>
                            <p className="text-[11px] text-neutral-500">
                              {new Date(selectedProject.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Activity01Icon size={24} className="mx-auto text-neutral-300 mb-2" />
                    <p className="text-xs font-medium text-neutral-500">Select a project</p>
                  </div>
                )}
              </div>

              {/* Bottom Action */}
              <div className="pt-6 border-t border-neutral-100 mt-6">
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isAuditing}
                  onClick={handleAuditAll}
                  className="w-full text-xs font-semibold rounded-lg"
                >
                  Run Full Audit
                </Button>
              </div>
            </div>
          </div>
        ) : activeNav === "integrations" ? (
          <div className="p-8 max-w-4xl overflow-y-auto">
            <h2 className="text-lg font-bold text-neutral-900 mb-1">Integrations & Alert Channels</h2>
            <p className="text-xs text-neutral-500 mb-8">
              Connect external services to receive instant alerts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center font-bold text-neutral-700 text-sm border border-neutral-200">
                    #
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">Slack Webhook</h3>
                    <p className="text-[11px] text-neutral-500">Post diff alerts to your channel</p>
                  </div>
                </div>
                <input
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full px-3 py-1.5 rounded-md border border-neutral-200 text-xs font-mono mb-3 outline-none focus:border-neutral-400"
                />
                <Button size="sm" variant="light" className="w-full rounded-md shadow-xs text-xs" onClick={() => toast.success("Slack webhook saved!")}>
                  Save Slack Channel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 max-w-2xl overflow-y-auto">
            <h2 className="text-lg font-bold text-neutral-900 mb-1">Workspace Settings</h2>
            <p className="text-xs text-neutral-500 mb-8">Manage your account and workspace configurations.</p>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">User Name</label>
                <input
                  type="text"
                  disabled
                  value={displayName}
                  className="w-full px-3 py-1.5 rounded-md border border-neutral-200 text-xs bg-neutral-50 text-neutral-600 mb-4"
                />

                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-3 py-1.5 rounded-md border border-neutral-200 text-xs bg-neutral-50 text-neutral-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connect New OpenAPI Spec Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-neutral-900">Connect New Spec</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">API Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Payment Gateway"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-neutral-400 outline-none text-xs text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">OpenAPI Spec URL (JSON or YAML)</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.example.com/openapi.json"
                  value={newProject.spec_url}
                  onChange={(e) => setNewProject({ ...newProject, spec_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-neutral-400 outline-none text-xs font-mono text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Check Interval</label>
                <select
                  value={newProject.check_interval_minutes}
                  onChange={(e) =>
                    setNewProject({ ...newProject, check_interval_minutes: parseInt(e.target.value, 10) })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-neutral-400 outline-none text-xs bg-white text-neutral-900"
                >
                  <option value={5}>Every 5 minutes</option>
                  <option value={15}>Every 15 minutes</option>
                  <option value={60}>Every 1 hour</option>
                  <option value={1440}>Once a day</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
                <Button type="button" variant="light" size="sm" onClick={() => setShowAddModal(false)} className="rounded-lg shadow-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isCreating} className="rounded-lg shadow-xs flex items-center gap-1.5">
                  <span>Connect Spec</span>
                  {!isCreating && <PlusSignIcon size={14} />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
