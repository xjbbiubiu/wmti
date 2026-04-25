<template>
  <div class="ear-card-page">
    <div class="ear-card-bg" aria-hidden="true" />

    <div v-if="loading" class="loading-state">
      <p>加载中...</p>
    </div>

    <div v-else-if="question" class="card-content">

      <!-- 顶部标题 -->
      <div class="card-header">
        <span class="card-badge">🎵 五月天歌词空耳大挑战</span>
      </div>

      <!-- 空耳歌词 -->
      <div class="ear-lyric-card">
        <div class="ear-lyric-label">你听到的是</div>
        <div class="ear-lyric-text">"{{ question.earLyric }}"</div>
      </div>

      <!-- 答案揭晓 -->
      <div class="answer-card">
        <div class="answer-reveal">
          <span class="answer-song">《{{ question.correctAnswer.song }}》</span>
          <span class="answer-album">{{ question.correctAnswer.album }}</span>
        </div>

        <div class="answer-divider" />

        <!-- 原歌词 -->
        <div class="original-lyric-section">
          <div class="section-label">原歌词</div>
          <pre class="original-lyric">{{ question.correctAnswer.originalLyric }}</pre>
          <pre v-if="question.correctAnswer.lyricsContext" class="lyrics-context">{{ question.correctAnswer.lyricsContext }}</pre>
        </div>

        <!-- 空耳原因 -->
        <div class="ear-reason-section">
          <div class="ear-reason-badge">空耳解析</div>
          <div class="ear-reason-text">{{ question.correctAnswer.earReason }}</div>
        </div>
      </div>

      <!-- 挑战按钮 -->
      <button class="btn-listen" @click="goQuiz">
        🎤 我也要挑战空耳测试
      </button>

      <!-- 二维码区 -->
      <div class="qr-bottom-section">
        <div class="qr-wrap">
          <img src="/qrcode.png" alt="扫码测试" class="qr-img" />
          <p class="qr-label">扫码挑战空耳</p>
        </div>
        <div class="qr-divider">|</div>
        <div class="qr-wrap">
          <img :src="qrcodeImg" alt="进群交流" class="qr-img" />
          <p class="qr-label">进群交流</p>
        </div>
      </div>

      <p class="disclaimer-bottom">趣味测试 仅供娱乐</p>
    </div>

    <div v-else class="not-found">
      <p>题目不存在</p>
      <button @click="goHome" class="btn-home">回到首页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiUrl, track } from '../api'
import qrcodeImg from '/group-qrcode.png'

const router = useRouter()
const route = useRoute()

const question = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await fetch(apiUrl(`/api/ear/questions/${id}`))
    if (!response.ok) throw new Error('Question not found')
    question.value = await response.json()
    track('page_view', { url_path: '/ear-card', quiz_type: 'ear', card_id: id })
  } catch (e) {
    question.value = null
  } finally {
    loading.value = false
  }
})

const goQuiz = () => {
  router.push('/ear-quiz')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.ear-card-page {
  min-height: 100dvh;
  padding: 20px 16px max(40px, calc(16px + env(safe-area-inset-bottom)));
  position: relative;
}

.ear-card-bg {
  position: fixed;
  inset: 0;
  background: var(--md-gradient-page);
  z-index: -1;
}

.ear-card-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 100% 70% at 50% -15%, rgba(255, 255, 255, 0.22) 0%, transparent 52%),
    radial-gradient(ellipse 80% 50% at 100% 30%, rgba(51, 192, 240, 0.25) 0%, transparent 45%);
}

/* Loading */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: rgba(255,255,255,0.7);
  font-size: 16px;
}

/* Content */
.card-content {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Header */
.card-header {
  text-align: center;
}

.card-badge {
  background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.12));
  color: white;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 6px 16px;
  border-radius: 20px;
  border: 1.5px solid rgba(255,255,255,0.35);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

/* Ear lyric card */
.ear-lyric-card {
  background: rgba(255,255,255,0.92);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 87, 174, 0.12);
}

.ear-lyric-label {
  font-size: 11px;
  color: var(--md-blue-400);
  margin-bottom: 6px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.ear-lyric-text {
  font-size: 19px;
  font-weight: 900;
  color: var(--md-blue-800);
  line-height: 1.4;
}

/* 答案卡 */
.answer-card {
  background: white;
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: 0 4px 16px rgba(0, 87, 174, 0.1);
}

.answer-reveal {
  text-align: center;
  margin-bottom: 8px;
}

.answer-label {
  display: block;
  font-size: 11px;
  color: var(--md-blue-400);
  margin-bottom: 4px;
  font-weight: 600;
}

.answer-song {
  display: block;
  font-size: 20px;
  font-weight: 900;
  color: var(--md-blue-800);
  margin-bottom: 4px;
  line-height: 1.2;
}

.answer-album {
  display: block;
  font-size: 12px;
  color: var(--md-blue-400);
  font-weight: 500;
}

.answer-divider {
  height: 1px;
  background: var(--md-blue-100);
  margin: 8px 0;
}

/* 原歌词 */
.original-lyric-section {
  margin-bottom: 8px;
}

.section-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--md-blue-400);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.original-lyric {
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: var(--md-blue-700);
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0 0 4px;
}

.lyrics-context {
  font-family: inherit;
  font-size: 12px;
  color: var(--md-blue-600);
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0;
  padding: 8px;
  background: var(--md-blue-50);
  border-radius: 8px;
  border-left: 3px solid var(--md-blue-300);
}

/* 空耳原因 */
.ear-reason-section {
  background: #fff5f7;
  border: 1px solid #fda4af;
  border-radius: 10px;
  padding: 10px 12px;
}

.ear-reason-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  color: #be185d;
  background: rgba(219,39,119,0.1);
  padding: 2px 8px;
  border-radius: 8px;
  margin-bottom: 4px;
}

.ear-reason-text {
  font-size: 12px;
  color: #831843;
  line-height: 1.5;
  font-weight: 600;
}

/* 挑战按钮 */
.btn-listen {
  width: 100%;
  background: linear-gradient(135deg, var(--md-accent-bright), var(--md-blue-500));
  color: white;
  border: none;
  border-radius: 14px;
  padding: 13px 24px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 136, 204, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
}

.btn-listen:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(0, 136, 204, 0.45);
}

.btn-listen:active {
  transform: translateY(0);
}

/* 二维码区 */
.qr-bottom-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px 14px;
  background: rgba(0, 136, 204, 0.08);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 87, 174, 0.08);
}

.qr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.qr-img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  background: white;
  padding: 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.qr-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.qr-divider {
  font-size: 20px;
  color: rgba(0, 136, 204, 0.25);
  font-weight: 300;
  line-height: 1;
}

/* Disclaimer */
.disclaimer-bottom {
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  text-align: center;
  margin: 0;
}

/* Not found */
.not-found {
  text-align: center;
  padding: 60px 20px;
}

.not-found p {
  margin-bottom: 20px;
  font-size: 16px;
  color: white;
}

.btn-home {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
}
</style>
