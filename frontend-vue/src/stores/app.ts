import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ApiResponse {
  success: boolean
  message: string
  timestamp: string
  environment: string
  version: string
  author: string
  architecture?: string
  features: string[]
}

export interface StatsData {
  requests: {
    total: number
    today: number
    successRate: string
  }
  deployment: {
    lastDeploy: string
    totalDeploys: number
    uptime: string
  }
  performance: {
    avgResponseTime: string
    p95ResponseTime: string
    errorRate: string
  }
}

export interface TechItem {
  name: string
  version?: string
  icon: string
  description: string
}

export interface TechStackData {
  frontend: TechItem[]
  backend: TechItem[]
  deployment: TechItem[]
}

export interface Deployment {
  id: number
  version: string
  status: string
  date: string
  commit: string
  message: string
}

export interface SystemInfo {
  platform: string
  arch: string
  nodeVersion: string
  cpus: number
  totalMemory: string
  freeMemory: string
  uptime: string
}

export const useAppStore = defineStore('app', () => {
  const apiData = ref<ApiResponse | null>(null)
  const statsData = ref<StatsData | null>(null)
  const techStackData = ref<TechStackData | null>(null)
  const deploymentsData = ref<Deployment[] | null>(null)
  const systemData = ref<SystemInfo | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchApiData() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api')
      const data = await response.json()
      if (data.success) {
        apiData.value = data
      } else {
        throw new Error(data.error || '请求失败')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
    } finally {
      loading.value = false
    }
  }

  async function fetchStatsData() {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      if (data.success) {
        statsData.value = data.data
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  async function fetchTechStackData() {
    try {
      const response = await fetch('/api/techstack')
      const data = await response.json()
      if (data.success) {
        techStackData.value = data.data
      }
    } catch (err) {
      console.error('Failed to fetch tech stack:', err)
    }
  }

  async function fetchDeploymentsData() {
    try {
      const response = await fetch('/api/deployments')
      const data = await response.json()
      if (data.success) {
        deploymentsData.value = data.data
      }
    } catch (err) {
      console.error('Failed to fetch deployments:', err)
    }
  }

  async function fetchSystemData() {
    try {
      const response = await fetch('/api/system')
      const data = await response.json()
      if (data.success) {
        systemData.value = data.data
      }
    } catch (err) {
      console.error('Failed to fetch system info:', err)
    }
  }

  async function fetchAllData() {
    await Promise.all([
      fetchApiData(),
      fetchStatsData(),
      fetchTechStackData(),
      fetchDeploymentsData(),
      fetchSystemData()
    ])
  }

  return {
    apiData,
    statsData,
    techStackData,
    deploymentsData,
    systemData,
    loading,
    error,
    fetchApiData,
    fetchStatsData,
    fetchTechStackData,
    fetchDeploymentsData,
    fetchSystemData,
    fetchAllData
  }
})
