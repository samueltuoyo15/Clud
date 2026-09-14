import { fetchApi } from "../lib/fetch"

export interface Project {
  id: string
  name: string
  spec_url: string
  check_interval_minutes: number
  last_checked_at?: string
  last_polled_at?: string
  drift_detected?: boolean
  is_paused?: boolean
  created_at: string
}

export async function getProjectsApi(): Promise<Project[]> {
  return fetchApi("/projects", {
    method: "GET",
  })
}

export async function createProjectApi(data: {
  name: string
  spec_url: string
  check_interval_minutes?: number
}) {
  return fetchApi("/projects", {
    method: "POST",
    data,
  })
}

export async function checkProjectApi(id: string) {
  return fetchApi(`/projects/${id}/check`, {
    method: "POST",
  })
}
