<template>
  <div class="home">
    <div class="container">
      <div class="header">
        <div class="logo">WMTI</div>
        <div class="subtitle">五迷趣味测试</div>
        <div v-if="totalTests > 0" class="total-tests">已有 {{ totalTests }} 人测试</div>
      </div>

      <div class="entry-cards">
        <div class="entry-card primary" @click="startEarTest">
          <div class="entry-card-title">🎤 五月天空耳猜歌测试</div>
          <div class="entry-card-desc">你是不是真正的听力王</div>
          <div class="entry-card-count">14道题 · 约3分钟</div>
        </div>
        <div class="entry-card" @click="startTest">
          <div class="entry-card-title">🥕 wmls人设测试</div>
          <div class="entry-card-desc">测测你是哪种五迷人设</div>
          <div class="entry-card-subtitle">
            <div class="wmls-dims">
              <span class="dim-item"><b>W</b>ork 工作</span>
              <span class="dim-item"><b>M</b>indset 心态</span>
              <span class="dim-item"><b>L</b>ove 情感</span>
              <span class="dim-item"><b>S</b>truggle 挫折</span>
            </div>
          </div>
          <div class="entry-card-count">16道题 · 约3分钟</div>
        </div>
      </div>

      <div v-if="cachedEarResult || cachedWmtiResult" class="cached-section">
        <div class="cached-title">测试结果</div>
        <div v-if="cachedEarResult" class="cached-result" @click="goToEarResult">
          <img :src="cachedEarResult.posterUrl" class="cached-poster" :alt="cachedEarResult.label" />
          <div class="cached-info">
            <span class="cached-label">{{ cachedEarResult.label }}</span>
            <span class="cached-tip">🎤 上次五月天空耳猜歌测试结果</span>
          </div>
        </div>
        <div v-if="cachedWmtiResult" class="cached-result" @click="goToWmtiResult">
          <img :src="cachedWmtiResult.posterUrl" class="cached-poster" :alt="cachedWmtiResult.label" />
          <div class="cached-info">
            <span class="cached-label">{{ cachedWmtiResult.label }}</span>
            <span class="cached-tip">🥕 上次WMLS人设测试结果</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>© 2026 WMTI · 个人项目仅供娱乐</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { track } from '../api'

const router = useRouter()
const cachedEarResult = ref(null)
const cachedWmtiResult = ref(null)

onMounted(() => {
  const earStored = localStorage.getItem('ear_result')
  if (earStored) {
    try {
      cachedEarResult.value = JSON.parse(earStored)
    } catch {
      localStorage.removeItem('ear_result')
    }
  }
  const wmtiStored = localStorage.getItem('wmti_result')
  if (wmtiStored) {
    try {
      cachedWmtiResult.value = JSON.parse(wmtiStored)
    } catch {
      localStorage.removeItem('wmti_result')
    }
  }
  loadStats()
  track('page_view', { url_path: '/', quiz_type: 'home' })
})

const startTest = () => {
  track('quiz_start')
  router.push('/quiz')
}

const startEarTest = () => {
  track('quiz_start', { quiz_type: 'ear' })
  router.push('/ear-quiz')
}

const goToEarResult = () => {
  if (cachedEarResult.value) {
    router.push(`/ear-result/${cachedEarResult.value.id}`)
  }
}

const goToWmtiResult = () => {
  if (cachedWmtiResult.value) {
    router.push(`/result/${cachedWmtiResult.value.id}`)
  }
}

const totalTests = ref(0)
const loadStats = async () => {
  try {
    const [earRes, wmtiRes] = await Promise.all([
      fetch(apiUrl('/api/ear/results/stats')),
      fetch(apiUrl('/api/stats'))
    ])
    const earStats = await earRes.json()
    const wmtiStats = await wmtiRes.json()
    totalTests.value = (earStats.totalSubmissions || 0) + (wmtiStats.totalSubmissions || 0)
  } catch (e) {
    console.error('Failed to load stats:', e)
  }
}
</script>

<style scoped>
.home {
  min-height: 100dvh;
  box-sizing: border-box;
  background: var(--md-gradient-page);
  padding: max(48px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px))
    calc(32px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px));
  display: flex;
  justify-content: center;
}

.container {
  max-width: min(100%, 480px);
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  margin-bottom: 28px;
}

.logo {
  font-size: 56px;
  font-weight: 900;
  color: var(--md-text-on-blue);
  letter-spacing: 3px;
  text-shadow: 0 2px 16px rgba(5, 26, 46, 0.3);
}

.subtitle {
  font-size: 16px;
  font-weight: 500;
  color: var(--md-text-on-blue);
  opacity: 0.85;
  margin-top: 6px;
}

.total-tests {
  font-size: 12px;
  color: var(--md-text-on-blue);
  opacity: 0.7;
  margin-top: 8px;
}

.entry-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 16px;
}

.cached-section {
  width: 100%;
  max-width: 320px;
  margin-bottom: 16px;
}

.cached-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--md-blue-900);
  text-align: left;
  margin-bottom: 10px;
  padding-left: 4px;
}

.cached-result {
  display: flex;
  align-items: center;
  gap: 14px;
  background: white;
  border-radius: 16px;
  padding: 12px 8px;
  margin-bottom: 12px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(5, 26, 46, 0.08);
  border: 1px solid rgba(0, 136, 204, 0.1);
  transition: transform 0.15s;
  width: 100%;
  box-sizing: border-box;
}

.entry-card {
  background: white;
  border-radius: 20px;
  padding: 16px 8px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 87, 174, 0.12);
  border: 1.5px solid rgba(0, 136, 204, 0.12);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.entry-card:active {
  transform: scale(0.97);
}

.entry-card.primary {
  background: linear-gradient(160deg, #ffffff 0%, #e8f5ff 100%);
  border-color: rgba(0, 136, 204, 0.25);
}

.entry-card-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.entry-card-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--md-blue-900);
  margin-bottom: 4px;
}

.entry-card-subtitle {
  margin-bottom: 6px;
}

.wmls-dims {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.dim-item {
  display: flex;
  align-items: center;
  gap: 0;
  font-size: 10px;
  white-space: nowrap;
}

.dim-ltr {
  font-weight: 800;
  color: var(--md-blue-800);
}

.dim-txt {
  color: var(--md-blue-500);
}

.entry-card-desc {
  font-size: 12px;
  color: var(--md-blue-600);
  line-height: 1.4;
  margin-bottom: 8px;
}

.entry-card-count {
  font-size: 11px;
  color: var(--md-blue-500);
  background: rgba(0, 136, 204, 0.08);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.cached-poster {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cached-info {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cached-label {
  font-size: 15px;
  font-weight: 700;
  color: var(--md-blue-900);
}

.cached-tip {
  font-size: 12px;
  color: var(--md-blue-500);
}

.footer {
  margin-top: auto;
  padding-top: 20px;
}

.footer p {
  margin: 0;
  font-size: 11px;
  color: var(--md-text-on-blue);
  opacity: 0.6;
}
</style>
