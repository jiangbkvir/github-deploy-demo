<template>
  <div class="home">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">GitHub Actions</span>
          <br>
          <span class="title-white">自动部署演示</span>
        </h1>
        <p class="hero-subtitle">前后端分离架构 | Vue 3 + TypeScript + Node.js + Docker + Nginx</p>
        <div class="status-badge" :class="statusClass">
          {{ statusText }}
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-if="statsData" class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ statsData.requests.total }}</div>
            <div class="stat-label">总请求数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ statsData.requests.successRate }}</div>
            <div class="stat-label">成功率</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🚀</div>
          <div class="stat-content">
            <div class="stat-value">{{ statsData.deployment.totalDeploys }}</div>
            <div class="stat-label">部署次数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-content">
            <div class="stat-value">{{ statsData.performance.avgResponseTime }}</div>
            <div class="stat-label">平均响应</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-section">
      <div class="grid-layout">
        <!-- API Response Card -->
        <div class="card">
          <div class="card-header">
            <h2>后端响应</h2>
            <button class="refresh-btn" @click="appStore.fetchAllData()" :disabled="appStore.loading">
              <span v-if="appStore.loading">⏳</span>
              <span v-else>🔄</span>
            </button>
          </div>
          <div v-if="appStore.apiData" class="card-body">
            <p class="message">{{ appStore.apiData.message }}</p>
            <div class="info-list">
              <div class="info-item">
                <span class="label">版本</span>
                <span class="value">{{ appStore.apiData.version }}</span>
              </div>
              <div class="info-item">
                <span class="label">架构</span>
                <span class="value">{{ appStore.apiData.architecture }}</span>
              </div>
              <div class="info-item">
                <span class="label">环境</span>
                <span class="value">{{ appStore.apiData.environment }}</span>
              </div>
              <div class="info-item">
                <span class="label">更新时间</span>
                <span class="value">{{ appStore.apiData.timestamp }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tech Stack Card -->
        <div v-if="techStackData" class="card">
          <div class="card-header">
            <h2>技术栈</h2>
          </div>
          <div class="card-body">
            <div class="tech-section">
              <h3>前端</h3>
              <div class="tech-grid">
                <div v-for="tech in techStackData.frontend" :key="tech.name" class="tech-item">
                  <span class="tech-icon">{{ tech.icon }}</span>
                  <div class="tech-info">
                    <div class="tech-name">{{ tech.name }}</div>
                    <div class="tech-desc">{{ tech.description }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tech-section">
              <h3>后端</h3>
              <div class="tech-grid">
                <div v-for="tech in techStackData.backend" :key="tech.name" class="tech-item">
                  <span class="tech-icon">{{ tech.icon }}</span>
                  <div class="tech-info">
                    <div class="tech-name">{{ tech.name }}</div>
                    <div class="tech-desc">{{ tech.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Deployments Card -->
        <div v-if="deploymentsData" class="card full-width">
          <div class="card-header">
            <h2>部署历史</h2>
          </div>
          <div class="card-body">
            <div class="deployments-list">
              <div v-for="dep in deploymentsData" :key="dep.id" class="deployment-item">
                <div class="dep-status" :class="dep.status">{{ dep.status === 'success' ? '✓' : '✗' }}</div>
                <div class="dep-info">
                  <div class="dep-version">v{{ dep.version }}</div>
                  <div class="dep-message">{{ dep.message }}</div>
                </div>
                <div class="dep-meta">
                  <div class="dep-date">{{ dep.date }}</div>
                  <div class="dep-commit">{{ dep.commit.slice(0, 7) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Info Card -->
        <div v-if="systemData" class="card">
          <div class="card-header">
            <h2>系统信息</h2>
          </div>
          <div class="card-body">
            <div class="system-grid">
              <div class="system-item">
                <span class="system-icon">💻</span>
                <span class="system-text">{{ systemData.platform }} {{ systemData.arch }}</span>
              </div>
              <div class="system-item">
                <span class="system-icon">🟢</span>
                <span class="system-text">{{ systemData.nodeVersion }}</span>
              </div>
              <div class="system-item">
                <span class="system-icon">🔧</span>
                <span class="system-text">{{ systemData.cpus }} 核心</span>
              </div>
              <div class="system-item">
                <span class="system-icon">💾</span>
                <span class="system-text">{{ systemData.totalMemory }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()

const statusClass = computed(() => {
  if (appStore.loading) return 'status-loading'
  if (appStore.error) return 'status-error'
  if (appStore.apiData) return 'status-success'
  return 'status-loading'
})

const statusText = computed(() => {
  if (appStore.loading) return '正在加载...'
  if (appStore.error) return '连接失败'
  if (appStore.apiData) return '系统运行正常'
  return '连接中...'
})

onMounted(() => {
  appStore.fetchAllData()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-white {
  color: white;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.status-loading {
  background: rgba(255, 193, 7, 0.3);
}

.status-success {
  background: rgba(40, 167, 69, 0.3);
}

.status-error {
  background: rgba(220, 53, 69, 0.3);
}

/* Stats Section */
.stats-section {
  max-width: 1200px;
  margin: -2rem auto 2rem;
  padding: 0 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

/* Content Section */
.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

/* Cards */
.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.refresh-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-body {
  padding: 1.5rem;
}

.message {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.label {
  color: #6c757d;
  font-size: 0.9rem;
}

.value {
  color: #495057;
  font-weight: 500;
}

/* Tech Stack */
.tech-section {
  margin-bottom: 1.5rem;
}

.tech-section:last-child {
  margin-bottom: 0;
}

.tech-section h3 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tech-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  transition: background 0.3s;
}

.tech-item:hover {
  background: #e9ecef;
}

.tech-icon {
  font-size: 1.5rem;
}

.tech-info {
  flex: 1;
}

.tech-name {
  font-weight: 500;
  color: #333;
}

.tech-desc {
  font-size: 0.8rem;
  color: #666;
}

/* Deployments */
.deployments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.deployment-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  transition: background 0.3s;
}

.deployment-item:hover {
  background: #e9ecef;
}

.dep-status {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.dep-status.success {
  background: #28a745;
  color: white;
}

.dep-status.failed {
  background: #dc3545;
  color: white;
}

.dep-version {
  font-weight: 600;
  color: #333;
}

.dep-message {
  font-size: 0.85rem;
  color: #666;
}

.dep-meta {
  text-align: right;
}

.dep-date {
  font-size: 0.85rem;
  color: #666;
}

.dep-commit {
  font-family: monospace;
  font-size: 0.8rem;
  color: #667eea;
}

/* System Info */
.system-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.system-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.system-icon {
  font-size: 1.25rem;
}

.system-text {
  font-size: 0.9rem;
  color: #495057;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .grid-layout {
    grid-template-columns: 1fr;
  }

  .deployment-item {
    grid-template-columns: auto 1fr;
  }

  .dep-meta {
    grid-column: 2;
  }
}
</style>
