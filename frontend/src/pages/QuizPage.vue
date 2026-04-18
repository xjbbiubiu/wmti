<template>
  <div class="quiz" ref="quizRef">
    <div class="progress-bar">
      <div class="progress" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div class="container" ref="containerRef">
      <div class="question-counter">
        {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
      </div>

      <div class="question-card" ref="cardRef" :key="currentQuestionIndex" :class="{ transitioning: isTransitioning }">
        <div class="question-content" ref="questionRef">
          {{ currentQuestion.content }}
        </div>

        <div class="options" ref="optionsRef" :key="currentQuestionIndex">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-btn"
            :style="selectedAnswer !== index ? defaultStyle : null"
            :class="{ selected: selectedAnswer === index }"
            @click="selectAnswer(index)"
          >
            {{ option.content }}
          </button>
        </div>
      </div>

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
          :disabled="currentQuestionIndex === 0 || isTransitioning"
          @click="prevQuestion"
        >
          上一题
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { apiUrl, track } from '../api'

const router = useRouter()

const questions = ref([])
const currentQuestionIndex = ref(0)
const answers = ref([])
const isTransitioning = ref(false)

// selectedAnswer 由当前题目的 answers 数组直接派生，不再单独维护状态
const selectedAnswer = computed(() => answers.value[currentQuestionIndex.value] ?? null)

// 用 inline style 控制未选中状态的背景，避免移动端渲染延迟
const defaultStyle = {
  background: 'var(--md-blue-50)',
  borderColor: 'transparent',
  color: 'var(--md-blue-900)',
}

const quizRef = ref(null)
const containerRef = ref(null)
const cardRef = ref(null)
const questionRef = ref(null)
const optionsRef = ref(null)

const totalQuestions = computed(() => questions.value.length)
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const progressPercent = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)

// 自适应字体大小
const fitFontSize = async () => {
  await nextTick()
  if (!cardRef.value) return

  const el = cardRef.value
  el.style.fontSize = '16px'

  while (el.scrollHeight > el.clientHeight && parseFloat(el.style.fontSize) > 12) {
    el.style.fontSize = (parseFloat(el.style.fontSize) - 0.5) + 'px'
  }
}

let resizeObserver = null

onMounted(async () => {
  try {
    const response = await fetch(apiUrl('/api/questions'))
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    questions.value = await response.json()
    await nextTick()
    fitFontSize()
  } catch (error) {
    console.error('Failed to load questions:', error)
  }

  resizeObserver = new ResizeObserver(() => fitFontSize())
  if (quizRef.value) resizeObserver.observe(quizRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

const selectAnswer = (index) => {
  if (isTransitioning.value) return
  // 先立即清除旧选中状态，强制 DOM 立即更新
  answers.value[currentQuestionIndex.value] = index
  isTransitioning.value = true
  setTimeout(() => {
    nextQuestion()
    isTransitioning.value = false
  }, 150)
}

const nextQuestion = () => {
  if (currentQuestionIndex.value === totalQuestions.value - 1) {
    submitTest()
  } else {
    currentQuestionIndex.value++
    queueMicrotask(() => fitFontSize())
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    queueMicrotask(() => fitFontSize())
  }
}

const goHome = () => {
  router.push({ name: 'home' })
}

const submitTest = async () => {
  try {
    const response = await fetch(apiUrl('/api/results/submit'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answers.value })
    })
    const result = await response.json()
    localStorage.setItem('wmti_result', JSON.stringify({
      id: result.id,
      label: result.label,
      posterUrl: result.posterUrl,
      type: 'wmti'
    }))
    track('quiz_submit', { url_path: '/quiz', quiz_result_id: result.id })
    router.push({ name: 'result', params: { id: result.id } })
  } catch (error) {
    console.error('Failed to submit test:', error)
  }
}
</script>

<style scoped>
.quiz {
  min-height: 100dvh;
  box-sizing: border-box;
  background: var(--md-gradient-page);
  display: flex;
  flex-direction: column;
}

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

.question-counter {
  text-align: center;
  color: var(--md-text-on-blue-muted);
  font-size: 13px;
  margin-bottom: 12px;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}

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

.question-content {
  color: var(--md-blue-900);
  line-height: 1.55;
  margin-bottom: 16px;
  text-align: center;
  word-break: break-word;
  overflow-wrap: break-word;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.question-card.transitioning .option-btn {
  pointer-events: none;
  background: var(--md-blue-50) !important;
  border-color: transparent !important;
  color: var(--md-blue-900) !important;
  box-shadow: none !important;
  outline: none !important;
  -webkit-tap-highlight-color: transparent !important;
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

.question-card.transitioning .option-btn::before {
  background: var(--md-blue-400) !important;
}

.question-card.transitioning .option-btn.selected {
  background: var(--md-blue-50) !important;
}

.question-card.transitioning .nav-btn {
  pointer-events: none;
}

.question-card.transitioning .option-btn.selected,
.question-card.transitioning .option-btn:active {
  background: var(--md-blue-50) !important;
  color: var(--md-blue-900) !important;
  border-color: transparent !important;
}

.option-btn {
  border-radius: 12px;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  outline: none;
  border: 2px solid transparent;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.option-btn::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--md-blue-400);
  margin-right: 10px;
  flex-shrink: 0;
  transition: background 0.2s;
}

.option-btn:hover {
  background: var(--md-blue-100);
  border-color: rgba(0, 136, 204, 0.3);
}

.option-btn.selected {
  background: linear-gradient(135deg, var(--md-blue-500) 0%, var(--md-blue-600) 100%);
  color: white;
  border-color: var(--md-blue-600);
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.option-btn.selected::before {
  background: rgba(255, 255, 255, 0.8);
}

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

.nav-btn.prev:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-btn.home:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
