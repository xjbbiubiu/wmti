<template>
  <div class="home">
    <div class="container">
      <div class="header">
        <div class="logo">WMTI</div>
        <div class="subtitle">五迷老师趣味测试</div>
      </div>

      <div class="intro-card">
        <div class="intro-text">
          <p>🥕 测测你是哪种「五迷老师」人设</p>
          <p class="note">共 16 道题，约 3 分钟</p>
        </div>
      </div>

      <div class="dimensions">
        <div class="dimension-item">
          <div class="dim-letter">W</div>
          <div class="dim-full">Work</div>
          <div class="dim-icon">💼</div>
          <div class="dim-name">工作</div>
        </div>
        <div class="dimension-item">
          <div class="dim-letter">M</div>
          <div class="dim-full">Mindset</div>
          <div class="dim-icon">🧠</div>
          <div class="dim-name">心态</div>
        </div>
        <div class="dimension-item">
          <div class="dim-letter">L</div>
          <div class="dim-full">Love</div>
          <div class="dim-icon">❤️</div>
          <div class="dim-name">情感</div>
        </div>
        <div class="dimension-item">
          <div class="dim-letter">S</div>
          <div class="dim-full">Struggle</div>
          <div class="dim-icon">💪</div>
          <div class="dim-name">挫折</div>
        </div>
      </div>

      <button class="start-btn" @click="startTest">
        开始测试
      </button>

      <div v-if="cachedResult" class="cached-result" @click="goToResult">
        <img :src="cachedResult.posterUrl" class="cached-poster" :alt="cachedResult.label" />
        <div class="cached-info">
          <span class="cached-label">{{ cachedResult.label }}</span>
          <span class="cached-tip">查看上次结果 →</span>
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
const cachedResult = ref(null)

onMounted(() => {
  const stored = localStorage.getItem('wmti_last_result')
  if (stored) {
    try {
      cachedResult.value = JSON.parse(stored)
    } catch {
      localStorage.removeItem('wmti_last_result')
    }
  }
  track('page_view', { url_path: '/', quiz_type: 'home' })
})

const startTest = () => {
  track('quiz_start')
  router.push('/quiz')
}

const goToResult = () => {
  if (cachedResult.value) {
    router.push(`/result/${cachedResult.value.id}`)
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
  max-width: min(100%, 420px);
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
  font-size: 15px;
  color: var(--md-text-on-blue-muted);
  margin-top: 6px;
  letter-spacing: 0.15em;
}

.intro-card {
  background: var(--md-surface);
  border-radius: 18px;
  padding: 22px 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 28px rgba(5, 26, 46, 0.15);
  width: 100%;
  box-sizing: border-box;
}

.intro-text p {
  margin: 0;
  font-size: 15px;
  color: var(--md-blue-900);
  line-height: 1.6;
}

.intro-text .note {
  margin-top: 6px;
  font-size: 13px;
  color: var(--md-blue-700);
  opacity: 0.85;
}

.dimensions {
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 380px;
  margin: 0 auto 24px;
  box-sizing: border-box;
}

.dimension-item {
  background: var(--md-surface);
  border-radius: 16px;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 6px 20px rgba(5, 26, 46, 0.12);
  border: 1px solid rgba(0, 136, 204, 0.12);
  flex: 1;
  min-width: 0;
}

.dim-letter {
  width: 40px;
  height: 40px;
  background: linear-gradient(145deg, var(--md-accent-bright) 0%, var(--md-blue-500) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  color: white;
}

.dim-full {
  font-size: 9px;
  color: var(--md-blue-600);
  font-weight: 500;
}

.dim-icon {
  font-size: 18px;
  margin: 2px 0;
}

.dim-name {
  font-size: 11px;
  color: var(--md-blue-900);
  font-weight: 600;
}

.start-btn {
  background: var(--md-blue-50);
  color: var(--md-blue-600);
  border: 2px solid var(--md-blue-200);
  min-height: 52px;
  padding: 0 32px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.08em;
  border-radius: 14px;
  cursor: pointer;
  touch-action: manipulation;
  box-shadow: 0 4px 16px rgba(0, 136, 204, 0.15);
  transition: transform 0.15s, box-shadow 0.15s;
  width: 50%;
  margin: 0 auto 16px;
  display: block;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 136, 204, 0.25);
  background: var(--md-blue-100);
}

.start-btn:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.85);
  outline-offset: 3px;
}

.footer {
  margin-top: 20px;
}

.footer p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  letter-spacing: 0.06em;
}

/* 缓存结果卡片 */
.cached-result {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  padding: 12px 16px;
  margin-bottom: 16px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(5, 26, 46, 0.12);
  transition: transform 0.15s, box-shadow 0.15s;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
}

.cached-result:active {
  transform: scale(0.98);
}

.cached-poster {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
}

.cached-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}

.cached-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--md-blue-900);
}

.cached-tip {
  font-size: 12px;
  color: var(--md-blue-500);
}
</style>