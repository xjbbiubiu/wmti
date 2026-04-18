<template>
  <div class="ear-quiz" ref="quizRef">
    <div class="progress-bar">
      <div class="progress" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div class="container" ref="containerRef">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <p>加载中...</p>
      </div>

      <!-- 加载失败 -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button class="retry-btn" @click="loadQuestions">重新加载</button>
      </div>

      <!-- 答题界面 -->
      <template v-else>
        <div class="question-counter">
          {{ currentIndex + 1 }} / {{ totalQuestions }}
        </div>

        <div class="question-card" ref="cardRef" :key="currentIndex" :class="{ transitioning: isTransitioning }">
          <!-- 空耳歌词大字卡片 -->
          <div class="ear-lyric-wrap">
            <div class="ear-lyric-icon">&#x1F3A7;</div>
            <div class="ear-lyric" ref="earLyricRef">{{ currentQuestion.earLyric }}</div>
            <div class="ear-lyric-hint">听成了哪首歌？</div>
          </div>

          <!-- 选项按钮 -->
          <div class="options" ref="optionsRef" :key="currentIndex">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="option-btn"
              :class="{
                selected: selectedAnswer === index,
                correct: showFeedback && option.correct,
                wrong: showFeedback && selectedAnswer === index && !option.correct
              }"
              :disabled="showFeedback || isTransitioning"
              @click="selectAnswer(index)"
            >
              <span class="option-key">{{ option.key }}</span>
              <span class="option-content">{{ option.content }}</span>
            </button>
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="nav-buttons">
          <button
            class="nav-btn home"
            :disabled="isTransitioning"
            @click="goHome"
          >
            回首页
          </button>
          <button
            class="nav-btn prev"
            :disabled="currentIndex === 0 || isTransitioning"
            @click="prevQuestion"
          >
            上一题
          </button>
        </div>
      </template>
    </div>

    <!-- 反馈卡片 -->
    <Transition name="feedback">
      <div v-if="showFeedback" class="feedback-overlay" @click.prevent="handleFeedbackClick">
        <div class="feedback-card" :class="isCorrect ? 'correct' : 'wrong'">
          <div class="feedback-icon">{{ isCorrect ? '&#x2705;' : '&#x274C;' }}</div>
          <div class="feedback-title">{{ isCorrect ? '回答正确！' : '回答错误！' }}</div>
          <div class="feedback-song">
            《{{ currentQuestion.correctAnswer.song }}》· {{ currentQuestion.correctAnswer.album }}
          </div>
          <div class="feedback-lyric">
            <span class="feedback-lyric-label">原歌词：</span>
            <span class="feedback-lyric-text">{{ currentQuestion.correctAnswer.originalLyric }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { apiUrl, track } from '../api'

const router = useRouter()

const questions = ref([])
const currentIndex = ref(0)
const answers = ref([])
const showFeedback = ref(false)
const isCorrect = ref(false)
const isTransitioning = ref(false)
const loading = ref(true)
const error = ref(null)

const quizRef = ref(null)
const cardRef = ref(null)
const earLyricRef = ref(null)
const optionsRef = ref(null)

const totalQuestions = computed(() => questions.value.length)
const currentQuestion = computed(() => questions.value[currentIndex.value])
const progressPercent = computed(() => totalQuestions.value ? ((currentIndex.value + 1) / totalQuestions.value) * 100 : 0)
const selectedAnswer = computed(() => answers.value[currentIndex.value] ?? null)

// 自适应字体大小
const fitFontSize = async () => {
  await nextTick()
  if (!earLyricRef.value) return
  const el = earLyricRef.value
  el.style.fontSize = '28px'
  while (el.scrollHeight > el.clientHeight && parseFloat(el.style.fontSize) > 14) {
    el.style.fontSize = (parseFloat(el.style.fontSize) - 0.5) + 'px'
  }
}

let resizeObserver = null

const loadQuestions = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(apiUrl('/api/ear/questions'))
    if (!response.ok) throw new Error(`加载失败 (HTTP ${response.status})`)
    questions.value = await response.json()
    track('page_view', { url_path: '/ear-quiz', quiz_type: 'ear' })
  } catch (e) {
    error.value = e.message || '加载题目失败，请检查网络后重试。'
  } finally {
    loading.value = false
    await nextTick()
    fitFontSize()
  }
}

onMounted(async () => {
  await loadQuestions()

  resizeObserver = new ResizeObserver(() => fitFontSize())
  if (quizRef.value) resizeObserver.observe(quizRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

const selectAnswer = (index) => {
  if (isTransitioning.value || showFeedback.value) return
  answers.value[currentIndex.value] = index
  isTransitioning.value = true

  const selectedOption = currentQuestion.value.options[index]
  isCorrect.value = selectedOption?.correct === true
  showFeedback.value = true

  setTimeout(() => {
    showFeedback.value = false
    nextQuestion()
    isTransitioning.value = false
  }, 1500)
}

const handleFeedbackClick = () => {
  // 点击反馈卡片可提前进入下一题（移动端友好）
  if (showFeedback.value) {
    showFeedback.value = false
    nextQuestion()
    isTransitioning.value = false
  }
}

const nextQuestion = () => {
  if (currentIndex.value === totalQuestions.value - 1) {
    submitTest()
  } else {
    currentIndex.value++
    queueMicrotask(() => fitFontSize())
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    queueMicrotask(() => fitFontSize())
  }
}

const goHome = () => {
  router.push({ name: 'home' })
}

const submitTest = async () => {
  try {
    const response = await fetch(apiUrl('/api/ear/results/submit'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answers.value })
    })
    const result = await response.json()
    track('quiz_submit', { url_path: '/ear-quiz', quiz_result_id: result.id })
    router.push({ name: 'ear-result', params: { id: result.id } })
  } catch (e) {
    console.error('提交失败:', e)
    error.value = '提交答案失败，请重试。'
  }
}
</script>

<style scoped>
.ear-quiz {
  min-height: 100dvh;
  box-sizing: border-box;
  background: var(--md-gradient-page);
  display: flex;
  flex-direction: column;
}

/* 进度条 */
.progress-bar {
  position: fixed;
  top: env(safe-area-inset-top, 0px);
  left: 0;
  right: 0;
  height: 5px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.28);
  flex-shrink: 0;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, var(--md-blue-100) 0%, white 100%);
  transition: width 0.25s ease;
}

/* 容器 */
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: min(100%, var(--wmti-content-max));
  margin: 0 auto;
  padding: calc(52px + env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) 16px
    max(16px, env(safe-area-inset-left, 0px));
  width: 100%;
  box-sizing: border-box;
}

/* 题号 */
.question-counter {
  text-align: center;
  color: var(--md-text-on-blue-muted);
  font-size: 13px;
  margin-bottom: 12px;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}

/* 加载 / 错误状态 */
.loading-state,
.error-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--md-text-on-blue-muted);
  font-size: 15px;
}

.retry-btn {
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.2);
  color: var(--md-text-on-blue);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
}

/* 答题卡片 */
.question-card {
  background: var(--md-surface);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 8px 32px rgba(5, 26, 46, 0.14);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 空耳歌词区域 */
.ear-lyric-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  min-height: 120px;
}

.ear-lyric-icon {
  font-size: 28px;
  margin-bottom: 4px;
}

.ear-lyric {
  color: var(--md-blue-900);
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  line-height: 1.4;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

.ear-lyric-hint {
  color: var(--md-blue-400);
  font-size: 13px;
  margin-top: 4px;
  letter-spacing: 0.05em;
}

/* 选项列表 */
.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}

/* 选项按钮 */
.option-btn {
  border-radius: 12px;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  outline: none;
  border: 2px solid transparent;
  background: var(--md-blue-50);
  color: var(--md-blue-900);
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  min-height: 52px;
}

.option-btn .option-key {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--md-blue-200);
  color: var(--md-blue-700);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}

.option-btn .option-content {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.option-btn:hover:not(:disabled) {
  background: var(--md-blue-100);
  border-color: rgba(0, 136, 204, 0.3);
}

.option-btn.selected {
  background: linear-gradient(135deg, var(--md-blue-500) 0%, var(--md-blue-600) 100%);
  color: white;
  border-color: var(--md-blue-600);
}

.option-btn.selected .option-key {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.option-btn.correct {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border-color: #16a34a;
  animation: popIn 0.25s ease;
}

.option-btn.correct .option-key {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.option-btn.wrong {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-color: #dc2626;
  animation: shake 0.3s ease;
}

.option-btn.wrong .option-key {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.option-btn:disabled {
  cursor: default;
}

/* 导航按钮 */
.nav-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-shrink: 0;
}

.nav-btn {
  min-height: 44px;
  padding: 10px 12px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn.home {
  flex: 1;
  background: rgba(255, 255, 255, 0.18);
  color: var(--md-text-on-blue);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.nav-btn.prev {
  flex: 3;
  background: rgba(255, 255, 255, 0.22);
  color: var(--md-text-on-blue);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 反馈卡片 */
.feedback-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 26, 46, 0.55);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  cursor: pointer;
}

.feedback-card {
  width: 100%;
  max-width: 380px;
  border-radius: 24px;
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 16px 48px rgba(5, 26, 46, 0.25);
  animation: cardPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feedback-card.correct {
  background: linear-gradient(160deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.feedback-card.wrong {
  background: linear-gradient(160deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.feedback-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.feedback-title {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 12px;
}

.feedback-song {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  opacity: 0.95;
}

.feedback-lyric {
  font-size: 13px;
  opacity: 0.8;
}

.feedback-lyric-label {
  font-weight: 600;
}

/* 动画 */
@keyframes popIn {
  0% { transform: scale(0.95); }
  60% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

@keyframes cardPopIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 反馈过渡动画 */
.feedback-enter-active,
.feedback-leave-active {
  transition: opacity 0.2s ease;
}

.feedback-enter-from,
.feedback-leave-to {
  opacity: 0;
}
</style>
