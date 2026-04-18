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
        <img
          v-if="result.grade?.image"
          :src="imageUrl(result.grade.image)"
          :alt="result.grade.title"
          class="grade-image"
        />
        <div class="grade-title">{{ result.grade?.title }}</div>
        <div class="grade-desc">{{ result.grade?.desc }}</div>
      </div>

      <div class="result-actions">
        <button type="button" class="btn btn-primary" @click="handleShare">
          分享结果
        </button>
        <button type="button" class="btn btn-ghost" @click="restartTest">
          再测一次
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

    <p class="disclaimer-bottom">趣味测试 仅供娱乐</p>

    </div>

    <!-- 分享弹窗 -->
    <Teleport to="body">
      <div v-if="showShareModal" class="share-overlay" @click.self="closeShareModal">
        <div class="share-modal">
          <div class="modal-header">
            <button class="modal-close" @click="closeShareModal" aria-label="关闭">×</button>
          </div>
          <div class="modal-body">
            <div v-if="isGenerating" class="share-loading">
              <p>生成中...</p>
            </div>
            <div v-else-if="shareImageUrl" class="share-image-preview">
              <img :src="shareImageUrl" alt="分享图片" class="share-result-img" />
              <p class="share-tip">长按图片保存到相册<br/>或发送给朋友</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 隐藏的分享卡片 -->
    <div ref="shareCardRef" class="share-card-hidden">
      <div class="share-card">
        <div class="share-card-header">
          <span class="share-card-badge">🎤 空耳猜歌</span>
          <span class="share-card-title">五月天</span>
        </div>
        <div class="share-card-challenge">
          <span class="challenge-emoji">🏆</span>
          <span class="challenge-text">我得了 <b>{{ result.score }}</b> 分！不服来战？</span>
        </div>
        <div class="share-card-main">
          <div class="share-card-image-wrap">
            <img
              :src="imageUrl(result.grade?.image)"
              :alt="result.grade?.title"
              class="share-card-image"
            />
          </div>
          <div class="share-card-info">
            <h2 class="share-card-label">{{ result.grade?.title }}</h2>
            <p class="share-card-desc">{{ result.grade?.desc }}</p>
            <p class="share-card-roast">💢 {{ roastText }}</p>
          </div>
        </div>
        <div class="share-card-cta">
          <span class="cta-text">👇 扫码进来挑战</span>
          <span class="cta-text">看看你能答对几道题</span>
        </div>
        <div class="share-card-footer">
          <img src="/qrcode.png" alt="扫码测试" class="share-card-qr-img" />
          <p class="share-card-disclaimer">趣味测试 仅供娱乐</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiUrl, imageUrl, track } from '../api'
import html2canvas from 'html2canvas'

const router = useRouter()
const route = useRoute()

const shareCardRef = ref(null)
const showShareModal = ref(false)
const shareImageUrl = ref('')
const isGenerating = ref(false)

const defaultResult = {
  id: '',
  score: 0,
  grade: {
    title: '🎤 空耳小白',
    desc: '空耳之路刚刚开始，继续加油！',
    image: ''
  },
  questions: []
}

const result = ref(defaultResult)
const loading = ref(true)

const wrongQuestion = computed(() => {
  const wrong = result.value.questions?.filter(q => !q.correct) || []
  if (wrong.length === 0) return null
  return wrong[Math.floor(Math.random() * wrong.length)]
})

const roastText = computed(() => {
  const q = wrongQuestion.value
  const score = result.value.score || 0
  const total = result.value.questions?.length || 14

  if (score === total) {
    return '太强了！你是空耳界的天花板，阿信都得给你鼓掌！'
  }

  if (q) {
    return `"${q.earLyric}" 你能听出来是哪首吗？进来挑战一下！`
  }

  return '来试试你能答对几道？'
})

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

const handleShare = async () => {
  showShareModal.value = true
  shareImageUrl.value = ''
  isGenerating.value = true
  try {
    const cardEl = shareCardRef.value
    const canvas = await html2canvas(cardEl, {
      backgroundColor: '#e8f4fc',
      scale: 3,
      useCORS: true,
      allowTaint: true
    })
    shareImageUrl.value = canvas.toDataURL('image/png')
  } catch (err) {
    console.error('生成图片失败:', err)
    alert('生成图片失败，请重试')
    showShareModal.value = false
  } finally {
    isGenerating.value = false
  }
}

const closeShareModal = () => {
  showShareModal.value = false
  shareImageUrl.value = ''
  isGenerating.value = false
}

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

.grade-image {
  width: 100%;
  max-width: 280px;
  margin: 0 auto 16px;
  display: block;
  border-radius: 16px;
}

.grade-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--md-blue-900);
  margin-bottom: 8px;
  line-height: 1.3;
  text-align: center;
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

/* Share Modal */
.share-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.share-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 360px;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 0 20px 24px;
}

.share-loading {
  text-align: center;
  padding: 40px 0;
  color: var(--md-blue-600);
}

.share-image-preview {
  text-align: center;
}

.share-result-img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.share-tip {
  margin-top: 16px;
  font-size: 13px;
  color: var(--md-blue-600);
  line-height: 1.5;
}

/* Hidden Share Card */
.share-card-hidden {
  position: fixed;
  left: -9999px;
  top: -9999px;
}

.share-card {
  width: 360px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 24px 20px;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.share-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
  pointer-events: none;
}

.share-card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.share-card-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 4px 12px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.share-card-title {
  font-size: 16px;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.share-card-challenge {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.challenge-emoji {
  font-size: 24px;
}

.challenge-text {
  font-size: 16px;
  color: white;
  font-weight: 600;
}

.challenge-text b {
  color: #ffd700;
  font-size: 20px;
}

.share-card-main {
  background: white;
  border-radius: 20px;
  padding: 20px 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.share-card-image-wrap {
  width: 100%;
  margin-bottom: 12px;
}

.share-card-image {
  width: 100%;
  max-width: 180px;
  display: block;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.share-card-info {
  text-align: center;
}

.share-card-label {
  font-size: 20px;
  font-weight: 800;
  color: #1e3a5f;
  margin: 0 0 8px;
  line-height: 1.3;
}

.share-card-desc {
  font-size: 13px;
  color: #4a6fa5;
  line-height: 1.5;
  margin: 0;
}

.share-card-roast {
  font-size: 12px;
  color: #dc2626;
  line-height: 1.4;
  margin: 10px 0 0;
  font-style: italic;
  background: #fff5f5;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px dashed #fda4af;
}

.share-card-cta {
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(255, 170, 0, 0.3);
}

.cta-text {
  display: block;
  color: #5c4d00;
  font-size: 14px;
  font-weight: 700;
}

.cta-text:last-child {
  font-size: 12px;
  font-weight: 500;
  margin-top: 2px;
  opacity: 0.8;
}

.share-card-footer {
  text-align: center;
}

.share-card-qr-img {
  width: 70px;
  height: 70px;
  margin-bottom: 6px;
  border-radius: 8px;
  background: white;
  padding: 4px;
}

.share-card-disclaimer {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}
</style>
