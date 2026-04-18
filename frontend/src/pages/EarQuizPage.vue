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

        <div class="question-card" ref="cardRef" :key="currentIndex">
          <div class="ear-lyric-wrap">
            <div class="ear-lyric-icon">&#x1F3A7;</div>
            <div class="ear-lyric" ref="earLyricRef">{{ currentQuestion.earLyric }}</div>
            <div class="ear-lyric-hint">是什么歌？</div>
          </div>

          <div class="options" ref="optionsRef" :key="currentIndex">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="option-btn"
              :class="{
                selected: selectedAnswer === index && !showExplanation,
                correct: showExplanation && isCorrect && option.correct,
                wrong: showExplanation && !isCorrect && selectedAnswer === index && !option.correct
              }"
              :disabled="showExplanation"
              @click="selectAnswer(index)"
            >
              <span class="option-content">{{ option.content }}</span>
            </button>

            <div v-if="showExplanation && selectedAnswer !== null" class="option-nav">
              <button
                class="option-nav-btn next"
                @click="nextQuestion"
              >
                {{ isLastQuestion ? '查看结果' : '下一题' }} →
              </button>
            </div>

            <div v-if="showExplanation && selectedAnswer !== null && isCorrect" class="option-explanation correct">
              <div class="explanation-icon">✅</div>
              <div class="explanation-content">
                <div class="explanation-song">
                  歌名：《{{ currentQuestion.correctAnswer.song }}》
                  <span class="explanation-divider">|</span>
                  专辑：{{ currentQuestion.correctAnswer.album }}
                </div>
                <div v-if="currentQuestion.correctAnswer.lyricsContext" class="explanation-lyrics">
                  <pre class="lyrics-context">{{ currentQuestion.correctAnswer.lyricsContext }}</pre>
                </div>
                <div v-else class="explanation-lyric">
                  原歌词：{{ currentQuestion.correctAnswer.originalLyric }}
                </div>
                <div v-if="currentQuestion.correctAnswer.earReason" class="explanation-ear">
                  空耳原因：{{ currentQuestion.correctAnswer.earReason }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="nav-buttons">
          <button class="nav-btn home" @click="goHome">
            回首页
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiUrl, track } from '../api'

const router = useRouter()

const questions = ref([])
const currentIndex = ref(0)
const answers = ref([])
const showExplanation = ref(false)
const isCorrect = ref(false)
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
const isLastQuestion = computed(() => currentIndex.value === totalQuestions.value - 1)

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
  }
}

onMounted(async () => {
  await loadQuestions()
})

const selectAnswer = (index) => {
  if (showExplanation.value) return
  answers.value[currentIndex.value] = index

  const selectedOption = currentQuestion.value.options[index]
  isCorrect.value = selectedOption?.correct === true
  showExplanation.value = true
}

const nextQuestion = () => {
  showExplanation.value = false
  if (currentIndex.value === totalQuestions.value - 1) {
    submitTest()
  } else {
    currentIndex.value++
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
      body: JSON.stringify({
        answers: answers.value,
        questionIds: questions.value.map(q => q.id)
      })
    })
    const result = await response.json()
    const posterUrl = result.grade?.image 
      ? `${window.location.origin}/wmti${result.grade.image}`
      : ''
    localStorage.setItem('ear_result', JSON.stringify({
      id: result.id,
      label: result.grade?.title || '空耳达人',
      posterUrl,
      type: 'ear'
    }))
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
  padding: 20px 16px max(40px, calc(16px + env(safe-area-inset-bottom)));
  background: var(--md-gradient-page);
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 136, 204, 0.12);
  z-index: 100;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, var(--md-accent-bright), var(--md-blue-500));
  transition: width 0.3s ease;
}

.container {
  max-width: 480px;
  margin: 0 auto;
}

/* Loading */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: var(--md-blue-700);
  font-size: 16px;
}

.retry-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: var(--md-accent-bright);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

/* Question Counter */
.question-counter {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--md-blue-500);
  margin-bottom: 12px;
}

/* Question Card */
.question-card {
  background: white;
  border-radius: 24px;
  padding: 24px 20px;
  box-shadow: 0 8px 32px rgba(0, 87, 174, 0.12);
  margin-bottom: 16px;
}

/* Ear Lyric */
.ear-lyric-wrap {
  text-align: center;
  margin-bottom: 28px;
}

.ear-lyric-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.ear-lyric {
  font-size: 26px;
  font-weight: 800;
  color: var(--md-blue-900);
  line-height: 1.4;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 87, 174, 0.1);
}

.ear-lyric-hint {
  font-size: 14px;
  color: var(--md-blue-500);
  font-weight: 500;
}

/* Options */
.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--md-blue-50);
  border: 2px solid var(--md-blue-200);
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  color: var(--md-blue-800);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.option-btn:hover:not(:disabled) {
  background: var(--md-blue-100);
  transform: translateY(-1px);
}

.option-btn:active:not(:disabled) {
  transform: translateY(0);
}

.option-btn.selected {
  background: linear-gradient(135deg, var(--md-blue-500) 0%, var(--md-blue-600) 100%);
  color: white;
  border-color: var(--md-blue-600);
}

.option-btn.correct {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border-color: #16a34a;
  animation: popIn 0.25s ease;
}

.option-btn.wrong {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-color: #dc2626;
  animation: shake 0.3s ease;
}

.option-btn:disabled {
  cursor: default;
}

.option-content {
  flex: 1;
}

/* 解释展开区域 */
.option-explanation {
  margin-top: 12px;
  padding: 14px;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  animation: slideDown 0.3s ease;
}

.option-explanation.correct {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 1px solid #86efac;
}

.option-explanation.wrong {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fda4af;
}

.explanation-icon {
  font-size: 22px;
  flex-shrink: 0;
  margin-top: 2px;
}

.explanation-content {
  flex: 1;
}

.explanation-song {
  font-size: 14px;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 6px;
  line-height: 1.5;
}

.explanation-divider {
  color: #94a3b8;
  margin: 0 6px;
}

.explanation-lyric {
  font-size: 13px;
  color: #4a6fa5;
  margin-bottom: 6px;
}

.explanation-lyrics {
  margin-bottom: 8px;
}

.lyrics-context {
  font-family: inherit;
  font-size: 13px;
  color: #4a6fa5;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: 0;
}

.explanation-ear {
  font-size: 12px;
  color: #dc2626;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.08);
  padding: 6px 10px;
  border-radius: 6px;
  display: inline-block;
}

.option-nav {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.option-nav-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-nav-btn.prev {
  background: #f1f5f9;
  color: #64748b;
}

.option-nav-btn.prev:hover {
  background: #e2e8f0;
}

.option-nav-btn.next {
  background: linear-gradient(135deg, var(--md-accent-bright), var(--md-blue-500));
  color: white;
  box-shadow: 0 2px 8px rgba(0, 170, 232, 0.3);
}

.option-nav-btn.next:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 170, 232, 0.4);
}

/* 导航按钮 */
.nav-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-shrink: 0;
  flex-wrap: wrap;
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
  flex: 2;
  background: rgba(255, 255, 255, 0.22);
  color: var(--md-text-on-blue);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.nav-btn.next {
  flex: 2;
}

.nav-btn.next.primary {
  background: linear-gradient(135deg, var(--md-accent-bright), var(--md-blue-500));
  color: white;
  box-shadow: 0 4px 12px rgba(0, 170, 232, 0.3);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
