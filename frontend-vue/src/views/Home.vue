<template>
  <div class="home">
    <div class="container">
      <div class="card">
        <h2 class="title">前端 + Node.js 后端 | Vue 3 + TypeScript</h2>
        <p class="subtitle">版本 3.0 | 自动部署已启用</p>

        <div class="status" :class="statusClass">
          {{ statusText }}
        </div>

        <button class="btn-refresh" @click="appStore.fetchApiData()">
          {{ appStore.loading ? '加载中...' : '刷新数据' }}
        </button>

        <div v-if="appStore.apiData" class="data-card">
          <h3>后端响应</h3>
          <p class="message">{{ appStore.apiData.message }}</p>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">版本</span>
              <span class="value">{{ appStore.apiData.version }}</span>
            </div>
            <div class="info-item">
              <span class="label">作者</span>
              <span class="value">{{ appStore.apiData.author }}</span>
            </div>
            <div class="info-item">
              <span class="label">环境</span>
              <span class="value">{{ appStore.apiData.environment }}</span>
            </div>
            <div class="info-item">
              <span class="label">服务器时间</span>
              <span class="value">{{ appStore.apiData.timestamp }}</span>
            </div>
          </div>
          <div class="features">
            <h4>特性</h4>
            <ul>
              <li v-for="feature in appStore.apiData.features" :key="feature">
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>

        <div v-if="appStore.error" class="error-card">
          <p>错误: {{ appStore.error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()

const statusClass = computed(() => {
  if (appStore.loading) return 'status-loading'
  if (appStore.error) return 'status-error'
  if (appStore.apiData) return 'status-success'
  return 'status-loading'
})

const statusText = computed(() => {
  if (appStore.loading) return '正在请求后端...'
  if (appStore.error) return '连接失败'
  if (appStore.apiData) return '连接成功'
  return '正在连接后端服务...'
})
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.container {
  width: 100%;
  max-width: 600px;
}

.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2rem;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.subtitle {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.status {
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
}

.status-loading {
  background: #fff3cd;
  color: #856404;
}

.status-success {
  background: #d4edda;
  color: #155724;
}

.status-error {
  background: #f8d7da;
  color: #721c24;
}

.btn-refresh {
  width: 100%;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 1.5rem;
}

.btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-refresh:active {
  transform: translateY(0);
}

.data-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
}

.data-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #495057;
}

.message {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.value {
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
}

.features h4 {
  margin-bottom: 0.5rem;
  color: #495057;
}

.features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  padding: 0.5rem 0;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
}

.features li:last-child {
  border-bottom: none;
}

.features li::before {
  content: '✓ ';
  color: #28a745;
  font-weight: bold;
  margin-right: 0.5rem;
}

.error-card {
  background: #f8d7da;
  border-radius: 10px;
  padding: 1rem;
  color: #721c24;
}
</style>
