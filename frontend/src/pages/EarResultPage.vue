<template>
  <div class="ear-result">
    <div class="ear-result-bg" aria-hidden="true" />

    <div v-if="loading" class="loading-state">
      <p>加载中...</p>
    </div>

    <div v-else class="ear-result-content">

    <!-- 结果卡片 -->
    <section class="result-card" aria-label="空耳测试结果卡片">
      <div class="result-card-header">
        <span class="result-badge">WMTI</span>
        <span class="result-subtitle">🎤 空耳猜歌</span>
      </div>

      <div class="score-display">
        <span class="score-num">{{ result.score ?? 0 }}</span>
        <span class="score-sep">/</span>
        <span class="score-total">{{ result.questions ? result.questions.length : 10 }}</span>
        <span class="score-label">题答对</span>
      </div>

      <div class="grade-block">
        <div class="grade-title">{{ result.grade?.title }}</div>
        <div class="grade-desc">{{ result.grade?.desc }}</div>
      </div>

      <div class="result-actions">
        <button type="button" class="btn btn-primary" @click="restartTest">
          再测一次
        </button>
        <button type="button" class="btn btn-ghost" @click="goHome">
          回首页
        </button>
      </div>
    </section>

    <!-- 详细解析 -->
    <section class="analysis-section" aria-labelledby="analysis-heading" v-if="result.questions && result.questions.length">
      <div class="section-header">
        <h2 id="analysis-heading" class="section-title">详细解析</h2>
      </div>

      <div class="question-list">
        <article
          v-for="(q, index) in result.questions"
          :key="index"
          class="question-item"
          :class="q.correct ? 'question-correct' : 'question-wrong'"
        >
          <div class="question-index">
            <span class="question-num">{{ index + 1 }}</span>
            <span class="question-status">{{ q.correct ? '答对' : '答错' }}</span>
          </div>
          <div class="question-body">
            <div class="question-row">
              <span class="question-tag ear-tag">空耳</span>
              <span class="question-text ear-lyric">{{ q.earLyric }}</span>
            </div>
            <div class="question-row">
              <span class="question-tag answer-tag">歌曲</span>
              <span class="question-text correct-answer">{{ q.correctAnswer?.song }}</span>
            </div>
            <div class="question-row">
              <span class="question-tag album-tag">专辑</span>
              <span class="question-text album-name">{{ q.correctAnswer?.album }}</span>
            </div>
            <div class="question-row">
              <span class="question-tag original-tag">原词</span>
              <span class="question-text original-lyric">{{ q.correctAnswer?.originalLyric }}</span>
            </div>
            <div class="question-row ear-reason-row" v-if="q.correctAnswer?.earReason">
              <span class="question-tag reason-tag">原因</span>
              <span class="question-text ear-reason">{{ q.correctAnswer?.earReason }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- WMLS 导流卡片 -->
    <section class="promo-card" @click="goHome">
      <div class="promo-icon">🍎</div>
      <div class="promo-text">
        <div class="promo-title">WMTI · 五迷趣味测试</div>
        <div class="promo-sub">趣味测试 仅供娱乐</div>
      </div>
      <div class="promo-arrow">›</div>
    </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiUrl, track } from '../api'

const router = useRouter()
const route = useRoute()

const defaultResult = {
  id: '',
  score: 0,
  grade: {
    title: '🎤 空耳小白',
    desc: '空耳之路刚刚开始，继续加油！'
  },
  questions: []
}

const result = ref(defaultResult)
const loading = ref(true)

onMounted(async () => {
  try {
    const { id } = route.params
    const response = await fetch(apiUrl(`/api/ear/results/${id}`))
    if (!response.ok) throw new Error('Result not found')
    result.value = await response.json()
  } catch (e) {
    result.value = defaultResult
  } finally {
    loading.value = false
    track('page_view', { url_path: '/ear-result', quiz_type: 'ear' })
  }
})

const restartTest = () => {
  router.push('/ear-quiz')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.ear-result {
  min-height: 100dvh;
  padding: 20px 16px max(40px, calc(16px + env(safe-area-inset-bottom)));
}

.ear-result-bg {
  position: fixed;
  inset: 0;
  background: var(--md-gradient-page);
  z-index: -1;
}

/* Loading */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: var(--md-blue-700);
  font-size: 16px;
}

/* Main Content */
.ear-result-content {
  max-width: 480px;
  margin: 0 auto;
}

/* Result Card */
.result-card {
  background: linear-gradient(160deg, #ffffff 0%, #e8f5ff 60%, #dbeeff 100%);
  border-radius: 20px;
  padding: 24px 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 87, 174, 0.15);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.result-card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.result-badge {
  background: linear-gradient(135deg, #00a8e8, #0077b5);
  color: white;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 5px 12px;
  border-radius: 8px;
}

.result-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #4a6fa5;
}

.score-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 20px;
}

.score-num {
  font-size: 52px;
  font-weight: 800;
  color: var(--md-accent);
  line-height: 1;
}

.score-sep {
  font-size: 36px;
  font-weight: 300;
  color: var(--md-blue-400);
}

.score-total {
  font-size: 36px;
  font-weight: 700;
  color: var(--md-blue-500);
}

.score-label {
  font-size: 16px;
  color: var(--md-blue-600);
  font-weight: 600;
  margin-left: 4px;
}

.grade-block {
  margin-bottom: 24px;
}

.grade-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--md-blue-900);
  margin-bottom: 8px;
  line-height: 1.3;
}

.grade-desc {
  font-size: 14px;
  color: var(--md-blue-700);
  line-height: 1.6;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 136, 204, 0.12);
}

/* Buttons */
.btn {
  padding: 12px 28px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--md-accent-bright), var(--md-blue-500));
  color: white;
  box-shadow: 0 4px 16px rgba(0, 170, 232, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 170, 232, 0.4);
}

.btn-ghost {
  background: white;
  color: var(--md-blue-600);
  border: 1.5px solid var(--md-blue-300);
}

.btn-ghost:hover {
  background: var(--md-blue-50);
}

/* Analysis Section */
.analysis-section {
  background: white;
  border-radius: 28px;
  padding: 24px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 119, 179, 0.08);
}

.section-header {
  text-align: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--md-blue-900);
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Question Item */
.question-item {
  border-radius: 16px;
  padding: 16px;
  border: 1px solid transparent;
}

.question-correct {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-color: #86efac;
}

.question-wrong {
  background: linear-gradient(135deg, #fff1f2, #ffe4e6);
  border-color: #fda4af;
}

.question-index {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.question-num {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.08);
  color: inherit;
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
}

.question-correct .question-num {
  background: rgba(34, 197, 94, 0.2);
  color: #15803d;
}

.question-wrong .question-num {
  background: rgba(239, 68, 68, 0.2);
  color: #b91c1c;
}

.question-status {
  font-size: 12px;
  font-weight: 600;
}

.question-correct .question-status {
  color: #15803d;
}

.question-wrong .question-status {
  color: #b91c1c;
}

.question-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.question-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  flex-shrink: 0;
  min-width: 36px;
  text-align: center;
}

.ear-tag {
  background: rgba(0, 119, 179, 0.12);
  color: #0077b5;
}

.answer-tag {
  background: rgba(0, 136, 204, 0.12);
  color: #0077b5;
}

.album-tag {
  background: rgba(139, 92, 246, 0.12);
  color: #7c3aed;
}

.original-tag {
  background: rgba(0, 136, 204, 0.08);
  color: var(--md-blue-600);
}

.reason-tag {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

.ear-reason-row {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
}

.ear-reason {
  color: #dc2626;
  font-style: italic;
  font-size: 13px;
}

.question-text {
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
}

.ear-lyric {
  color: #0077b5;
  font-weight: 600;
}

.correct-answer {
  color: #15803d;
  font-weight: 700;
}

.album-name {
  color: #7c3aed;
  font-weight: 600;
}

.original-lyric {
  color: var(--md-blue-700);
}

/* Promo Card */
.promo-card {
  background: var(--md-surface);
  border-radius: 16px;
  padding: 16px 18px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(5, 26, 46, 0.1);
  border: 1px solid rgba(0, 136, 204, 0.12);
  transition: transform 0.15s;
}

.promo-card:active {
  transform: scale(0.98);
}

.promo-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.promo-text {
  flex: 1;
  text-align: left;
}

.promo-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--md-blue-900);
  margin-bottom: 4px;
}

.promo-sub {
  font-size: 12px;
  color: var(--md-blue-500);
}

.promo-arrow {
  font-size: 24px;
  color: var(--md-blue-400);
  font-weight: 300;
}

/* Disclaimer */
.disclaimer-bottom {
  margin: 16px 0;
  font-size: 11px;
  color: var(--md-text-on-blue-muted);
  text-align: center;
}
</style>
