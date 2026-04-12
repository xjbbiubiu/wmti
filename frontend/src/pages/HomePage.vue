<template>
  <div class="home">
    <div class="container">
      <div class="header">
        <div class="logo">WMTI</div>
        <div class="subtitle">五迷老师趣味测试</div>
      </div>

      <div class="intro-card">
        <div class="intro-text">
          <p>测测你是哪种「五迷老师」人设</p>
          <p class="note">共 29 道题，约 5 分钟</p>
        </div>
      </div>

      <div class="dimension-preview">
        <div class="dimension-title">测试维度</div>
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
      </div>

      <button class="start-btn" @click="startTest">
        开始测试
      </button>

      <div class="footer">
        <p>© 2026 WMTI · 个人项目仅供娱乐</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const startTest = () => {
  router.push('/quiz')
}
</script>

<style scoped>
.home {
  min-height: 100dvh;
  box-sizing: border-box;
  background: var(--md-gradient-page);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(16px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px))
    calc(20px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px));
}

.container {
  max-width: min(100%, var(--wmti-content-max));
  width: 100%;
  text-align: center;
}

.header {
  margin-bottom: 40px;
}

.logo {
  font-size: 64px;
  font-weight: 900;
  color: var(--md-text-on-blue);
  letter-spacing: 4px;
  text-shadow: 0 2px 16px rgba(5, 26, 46, 0.35);
}

.subtitle {
  font-size: 18px;
  color: var(--md-text-on-blue-muted);
  margin-top: 8px;
  letter-spacing: 0.15em;
}

.intro-card {
  background: var(--md-surface);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 12px 40px rgba(5, 26, 46, 0.18);
}

.intro-text p {
  margin: 0;
  font-size: 16px;
  color: var(--md-blue-900);
  line-height: 1.6;
}

.intro-text .note {
  margin-top: 10px;
  font-size: 14px;
  color: var(--md-blue-700);
  opacity: 0.85;
}

.dimension-preview {
  margin-bottom: 40px;
}

.dimension-title {
  color: var(--md-text-on-blue-muted);
  font-size: 14px;
  margin-bottom: 15px;
  letter-spacing: 0.08em;
}

.dimensions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.dimension-item {
  background: var(--md-surface);
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 6px 20px rgba(5, 26, 46, 0.12);
  border: 1px solid rgba(0, 136, 204, 0.12);
  min-width: 70px;
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
  font-size: 10px;
  color: var(--md-blue-600);
  font-weight: 500;
}

.dim-icon {
  font-size: 20px;
  margin: 2px 0;
}

.dim-name {
  font-size: 12px;
  color: var(--md-blue-900);
  font-weight: 600;
}

.start-btn {
  background: var(--md-surface);
  color: var(--md-blue-600);
  border: 2px solid rgba(255, 255, 255, 0.65);
  min-height: 48px;
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  touch-action: manipulation;
  box-shadow: 0 8px 28px rgba(5, 26, 46, 0.2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(5, 26, 46, 0.28);
}

.start-btn:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.85);
  outline-offset: 3px;
}

.footer {
  margin-top: 40px;
}

.footer p {
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  letter-spacing: 0.06em;
}
</style>