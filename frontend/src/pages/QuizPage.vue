<template>
  <div class="quiz">
    <div class="progress-bar">
      <div class="progress" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div class="container">
      <div class="question-counter">
        {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
      </div>

      <div class="question-card" v-if="currentQuestion">
        <div class="question-content">
          {{ currentQuestion.content }}
        </div>

        <div class="options">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-btn"
            :class="{ selected: selectedAnswer === index }"
            @click="selectAnswer(index)"
          >
            {{ option.content }}
          </button>
        </div>
      </div>

      <div class="nav-buttons">
        <button
          class="nav-btn prev"
          :disabled="currentQuestionIndex === 0"
          @click="prevQuestion"
        >
          上一题
        </button>
        <button
          class="nav-btn next"
          :disabled="selectedAnswer === null"
          @click="nextQuestion"
        >
          {{ currentQuestionIndex === totalQuestions - 1 ? '查看结果' : '下一题' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiUrl, track } from '../api'

const router = useRouter()

const questions = ref([])
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const answers = ref([])

const totalQuestions = computed(() => questions.value.length)
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const progressPercent = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)

onMounted(async () => {
  try {
    const response = await fetch(apiUrl('/api/questions'))
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    questions.value = await response.json()
  } catch (error) {
    console.error('Failed to load questions:', error)
  }
})

const selectAnswer = (index) => {
  selectedAnswer.value = index
}

const nextQuestion = () => {
  answers.value[currentQuestionIndex.value] = selectedAnswer.value

  if (currentQuestionIndex.value === totalQuestions.value - 1) {
    submitTest()
  } else {
    currentQuestionIndex.value++
    selectedAnswer.value = answers.value[currentQuestionIndex.value] ?? null
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = answers.value[currentQuestionIndex.value] ?? null
  }
}

const submitTest = async () => {
  try {
    const response = await fetch(apiUrl('/api/results/submit'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answers.value })
    })
    const result = await response.json()
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
  padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px));
}

.progress-bar {
  position: fixed;
  top: env(safe-area-inset-top, 0px);
  left: 0;
  right: 0;
  height: 6px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.28);
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, var(--md-blue-100) 0%, white 100%);
  transition: width 0.25s ease;
}

.container {
  max-width: min(100%, var(--wmti-content-max));
  margin: 0 auto;
  padding: calc(60px + env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) 20px
    max(16px, env(safe-area-inset-left, 0px));
}

.question-counter {
  text-align: center;
  color: var(--md-text-on-blue-muted);
  font-size: 14px;
  margin-bottom: 20px;
  letter-spacing: 0.06em;
}

.question-card {
  background: var(--md-surface);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 12px 40px rgba(5, 26, 46, 0.16);
  margin-bottom: 30px;
}

.question-content {
  font-size: 18px;
  color: var(--md-blue-900);
  line-height: 1.65;
  margin-bottom: 30px;
  text-align: center;
  word-break: break-word;
  overflow-wrap: break-word;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  background: var(--md-blue-50);
  border: 2px solid transparent;
  border-radius: 12px;
  min-height: 48px;
  padding: 14px 18px;
  font-size: 16px;
  touch-action: manipulation;
  color: var(--md-blue-900);
  text-align: left;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.option-btn:hover {
  background: var(--md-blue-100);
  border-color: rgba(0, 136, 204, 0.35);
}

.option-btn:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.9);
  outline-offset: 2px;
}

.option-btn.selected {
  background: linear-gradient(135deg, var(--md-blue-500) 0%, var(--md-blue-600) 100%);
  color: white;
  border-color: var(--md-blue-600);
}

.nav-buttons {
  display: flex;
  gap: 15px;
}

.nav-btn {
  flex: 1;
  min-height: 48px;
  padding: 14px 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  touch-action: manipulation;
  transition: all 0.2s ease;
}

.nav-btn.prev {
  background: rgba(255, 255, 255, 0.22);
  color: var(--md-text-on-blue);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.nav-btn.prev:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn.next {
  background: var(--md-surface);
  color: var(--md-blue-600);
  border: 2px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 6px 20px rgba(5, 26, 46, 0.15);
}

.nav-btn:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.85);
  outline-offset: 2px;
}

.nav-btn.next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
