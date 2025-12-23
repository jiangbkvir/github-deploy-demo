import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ApiResponse {
  success: boolean
  message: string
  timestamp: string
  environment: string
  version: string
  author: string
  features: string[]
}

export const useAppStore = defineStore('app', () => {
  const apiData = ref<ApiResponse | null>(null)
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

  return {
    apiData,
    loading,
    error,
    fetchApiData
  }
})
