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
        <span class="result-title">五月天歌词空耳猜歌大赛</span>
      </div>
      <div class="result-main-card">
        <div class="result-score-wrap">
          <span class="result-score-label">正确率</span>
          <span class="result-score-num">{{ Math.round((result.score ?? 0) / (result.questions?.length || 1) * 100) }}</span>
          <span class="result-score-sep">%</span>
        </div>
        <div class="result-image-wrap">
          <img
            v-if="result.grade?.image"
            :src="imageUrl(result.grade.image)"
            :alt="result.grade.title"
            class="result-grade-image"
          />
        </div>
        <div class="result-info">
          <h2 class="result-grade-title">{{ result.grade?.title }}</h2>
          <p class="result-grade-desc">{{ result.grade?.desc }}</p>
        </div>
      </div>

      <!-- 调侃语区：截图直接展示一道挑战题 -->
      <div class="result-roast-section" v-if="roastLyric || roastSuffix">
        <div class="roast-lyric" v-if="roastLyric">"{{ roastLyric }}"</div>
        <div class="roast-suffix" v-if="roastSuffix">{{ roastSuffix }}</div>
      </div>

      <!-- 二维码展示区：截图分享直接带二维码 -->
      <div class="result-qr-section">
        <div class="result-qr-wrap">
          <img src="/qrcode.png" alt="扫码挑战" class="result-qr-img" />
          <p class="result-qr-label">扫码挑战空耳</p>
        </div>
        <div class="result-qr-divider">|</div>
        <div class="result-qr-wrap">
          <img :src="qrcodeImg" alt="进群交流" class="result-qr-img" />
          <p class="result-qr-label">进群交流</p>
        </div>
      </div>

      <div class="result-actions">
        <div class="result-actions-row">
          <button type="button" class="btn btn-ghost" @click="goHome">
            回到首页
          </button>
          <button type="button" class="btn btn-ghost" @click="restartTest">
            再测一次
          </button>
        </div>
        <button type="button" class="btn btn-primary" @click="handleShare">
          生成分享图
        </button>
      </div>
    </section>

    <!-- 其他测试卡片 -->
    <section class="other-test-section">
      <div class="other-test-title">其他测试</div>
      <div class="other-test-card" @click="goQuiz">
        <div class="other-test-title">🥕 WMLS人设测试</div>
        <div class="other-test-desc">测测你是哪种五迷人设</div>
        <div class="other-test-count">16道题 · 约3分钟</div>
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
          <div class="question-header">
            <span class="question-num">{{ index + 1 }}</span>
            <span class="question-status">{{ q.correct ? '✅ 答对' : '❌ 答错' }}</span>
          </div>
          <div class="question-ear-lyric">{{ q.earLyric }}</div>
          <div v-if="q.correct" class="question-explanation correct">
            <div class="explanation-song">
              歌名：《{{ q.correctAnswer?.song }}》
              <span class="explanation-divider">|</span>
              专辑：{{ q.correctAnswer?.album }}
            </div>
            <div v-if="q.correctAnswer?.lyricsContext" class="explanation-lyrics">
              <pre class="lyrics-context">{{ q.correctAnswer?.lyricsContext }}</pre>
            </div>
            <div v-if="q.correctAnswer?.earReason" class="explanation-ear">
              空耳原因：{{ q.correctAnswer?.earReason }}
            </div>
          </div>
          <button class="question-share-btn" @click="shareQuestion(q)">分享求助</button>
        </article>
      </div>
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
              <div class="share-qrcode">
                <img :src="qrcodeImg" alt="交流群" class="qrcode-img" />
                <p class="qrcode-tip">扫码进群交流</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 隐藏的分享卡片 -->
    <div ref="shareCardRef" class="share-card-hidden">
      <div class="share-card">
        <div class="share-card-header">
          <span class="share-card-title">五月天歌词空耳猜歌大赛</span>
        </div>
        <div class="share-card-challenge">
          <span class="challenge-emoji">🏆</span>
          <span class="challenge-text">正确率 <b>{{ Math.round((result.score ?? 0) / (result.questions?.length || 1) * 100) }}</b>%</span>
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
          </div>
        </div>
        <div class="share-card-cta">
          <div v-if="roastLyric" class="roast-ear-lyric">"{{ roastLyric }}"</div>
          <span class="cta-text">👇 你能听出来哪首吗？扫码进来挑战一下！</span>
        </div>
        <div class="share-card-footer">
          <div class="share-card-qr-wrap">
            <img src="/qrcode.png" alt="扫码测试" class="share-card-qr-img" />
            <p class="share-card-label">扫码测试</p>
          </div>
          <div class="share-card-qr-wrap">
            <img :src="qrcodeImg" alt="交流群" class="share-card-qr-img" />
            <p class="share-card-label">进群交流</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的单题分享卡片 -->
    <div ref="questionShareCardRef" class="share-card-hidden">
      <div class="share-card question-share-card">
        <div class="share-card-header">
          <span class="share-card-badge">🎵 五月天空耳歌词大挑战</span>
        </div>
        <div class="question-share-ear-lyric">{{ sharingQuestion?.earLyric }}</div>
        <div class="question-share-subtitle">{{ getShareSubtitle(sharingQuestion) }}</div>
        <div class="question-share-result">
          <div class="question-share-accuracy">
            <span class="accuracy-label">我的正确率</span>
            <span class="accuracy-value">{{ Math.round((result.score ?? 0) / (result.questions?.length || 1) * 100) }}%</span>
          </div>
          <div class="question-share-grade">
            <img
              :src="imageUrl(result.grade?.image)"
              :alt="result.grade?.title"
              class="question-share-grade-img"
            />
            <div class="question-share-grade-info">
              <div class="question-share-grade-title">{{ result.grade?.title }}</div>
              <div class="question-share-grade-desc">{{ getShareGradeDesc() }}</div>
            </div>
          </div>
        </div>
        <div class="question-share-cta">
          <div class="question-share-cta-text">{{ getShareCTA(sharingQuestion) }}</div>
        </div>
        <div class="share-card-footer">
          <div class="share-card-qr-wrap">
            <img src="/qrcode.png" alt="扫码测试" class="share-card-qr-img" />
            <p class="share-card-label">扫码挑战空耳</p>
          </div>
          <div class="share-card-qr-wrap">
            <img :src="qrcodeImg" alt="交流群" class="share-card-qr-img" />
            <p class="share-card-label">进群交流</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiUrl, imageUrl, track } from '../api'
import html2canvas from 'html2canvas'
import qrcodeImg from '/group-qrcode.png'

const router = useRouter()
const route = useRoute()

const shareCardRef = ref(null)
const questionShareCardRef = ref(null)
const showShareModal = ref(false)
const shareImageUrl = ref('')
const isGenerating = ref(false)
const sharingQuestion = ref(null)

const CORRECT_SUBTITLES = [
  '我答对了，你知道这首歌吗？',
  '我听出来了！你猜得到是哪首吗？',
  '这首歌我答对了，你来试试？',
  '这空耳我能猜到原曲，你呢？',
  '我猜对了！来挑战一下你的听力！',
]
const WRONG_SUBTITLES = [
  '这空耳是什么歌？求助！',
  '救命，这歌词到底唱的是什么？',
  '这空耳也太离谱了吧！',
  '有没有人能听出来是哪首！',
  '五月天唱的是哪首歌啊？',
]
const CORRECT_CTAS = [
  '👇 扫码来挑战，看看你能对几道！',
  '👇 快来试试，你能全部答对吗？',
]
const WRONG_CTAS = [
  '👇 扫码来挑战，看看你的听力！',
  '👇 快来试试，看你能答对吗！',
]

const GRADE_DESCS = {
  '🎓 空耳博士': [
    '阿信在你耳边说话你都听得出来？五迷界的天花板！',
    '怕不是耳朵里住了个阿信，建议出道当空耳评委！',
    '这听力已经不是人类级别了，你是蝙蝠侠转世吗？',
    '五月天的每一句歌词你都门清，歌神膜拜！',
    '你是不是把五月天当成了背景音乐？太可怕了！',
  ],
  '🎤 空耳十级选手': [
    '听力满分的你，确定不是戴着耳机睡觉的？',
    '五月天的发音在你这里全是送分题，开班收徒吧！',
    '差一点就是博士了，但这听力已经是传说级别！',
    '你是不是把五月天歌词刻进DNA里了？',
    '全场的五迷都向你投来羡慕的目光！',
  ],
  '🎧 空耳八级选手': [
    '差一点就封神了！差一两题，把歌单循环改成永久吧！',
    '这个段位的五迷已经很少见，你真的很懂五月天！',
    '再练一练，说不定下次就能听到博士称号了！',
    '八级选手，已经打败了全国99%的五迷！',
    '听感接近完美，就差一点点就到天花板了！',
  ],
  '🎶 空耳六级选手': [
    '听感还需要多练练，快把五月天歌单循环起来！',
    '下一个空耳大师就是你，继续加油！',
    '六级选手，证明你已经是真正的五迷了！',
    '这听力不是白练的，但还能更进一步！',
    '多听几遍，你也能进化成八级选手！',
  ],
  '🔉 空耳四级选手': [
    '歌单听得还不够多，赶紧去补课！五月天的歌值得你反复听！',
    '有潜力哦！你的五迷之路才刚开始！',
    '四级选手说明你还需要多泡在五月天的歌里！',
    '别灰心，五月天的歌多听几遍就有感觉了！',
    '这个空耳段位只是暂时的，歌单刷起来！',
  ],
  '🤷 空耳小白': [
    '没关系，谁不是从听不懂开始的呢！多做几遍你也能成为空耳大师！',
    '欢迎来到五迷世界！你的空耳之旅才刚刚开始！',
    '听不懂是正常的，五月天歌词本来就玄学！',
    '多做几遍，奇迹就会发生！五迷永不言弃！',
    '没关系，这不是比谁听得多，是比谁更爱五月天！',
  ],
}

const getShareGradeDesc = () => {
  const title = result.value.grade?.title
  const pool = GRADE_DESCS[title]
  if (!pool) return result.value.grade?.desc || ''
  return pool[Math.floor(Math.random() * pool.length)]
}

const getShareCTA = (q) => {
  if (!q) return ''
  const pool = q.correct ? CORRECT_CTAS : WRONG_CTAS
  return pool[Math.floor(Math.random() * pool.length)]
}
const getShareSubtitle = (q) => {
  if (!q) return ''
  const pool = q.correct ? CORRECT_SUBTITLES : WRONG_SUBTITLES
  return pool[Math.floor(Math.random() * pool.length)]
}

const shareQuestion = async (q) => {
  sharingQuestion.value = q
  showShareModal.value = true
  shareImageUrl.value = ''
  isGenerating.value = true
  await nextTick()
  const cardEl = questionShareCardRef.value
  const canvas = await html2canvas(cardEl, {
    backgroundColor: '#e8f4fc',
    scale: 3,
    useCORS: true,
    allowTaint: true
  })
  shareImageUrl.value = canvas.toDataURL('image/png')
  isGenerating.value = false
}

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

const randomQuestion = computed(() => {
  const questions = result.value.questions || []
  if (questions.length === 0) return null
  return questions[Math.floor(Math.random() * questions.length)]
})

// 全对时从做过的12题中随机选一道用于分享卡片
const allCorrectShareQuestion = computed(() => {
  const score = result.value.score || 0
  const total = result.value.questions?.length || 12
  if (score !== total) return null
  return randomQuestion.value
})

const roastLyric = computed(() => {
  const q = wrongQuestion.value
  const score = result.value.score || 0

  if (score === (result.value.questions?.length || 12)) {
    return randomQuestion.value?.earLyric || null
  }
  return q?.earLyric || null
})

const roastSuffix = computed(() => {
  if (roastLyric.value) {
    return '你能听出来是哪首吗？进来挑战一下！'
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
  sharingQuestion.value = null
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

const goQuiz = () => {
  router.push('/quiz')
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
  border-radius: 24px;
  padding: 20px 16px;
  margin-bottom: 12px;
  box-shadow: 0 8px 32px rgba(0, 87, 174, 0.15);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.result-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0, 136, 204, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

.result-card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.result-badge {
  background: linear-gradient(135deg, #00a8e8, #0077b5);
  color: white;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 4px 12px;
  border-radius: 20px;
}

.result-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--md-blue-800);
}

.result-challenge {
  background: rgba(0, 136, 204, 0.1);
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(0, 136, 204, 0.2);
}

.challenge-emoji {
  font-size: 24px;
}

.challenge-text {
  font-size: 14px;
  color: var(--md-blue-800);
  font-weight: 600;
}

.challenge-text b {
  color: var(--md-accent);
  font-size: 18px;
}

.result-main-card {
  background: white;
  border-radius: 20px;
  padding: 16px 14px;
  margin-bottom: 12px;
  box-shadow: 0 4px 20px rgba(0, 87, 174, 0.1);
}

.result-score-wrap {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  margin-bottom: 10px;
}

.result-score-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--md-blue-500);
}

.result-score-num {
  font-size: 36px;
  font-weight: 800;
  color: var(--md-accent);
  line-height: 1;
}

.result-score-sep {
  font-size: 22px;
  font-weight: 600;
  color: var(--md-blue-500);
}

.result-image-wrap {
  width: 100%;
  margin-bottom: 10px;
}

.result-grade-image {
  width: 100%;
  max-width: 160px;
  display: block;
  margin: 0 auto;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 87, 174, 0.1);
}

.result-info {
  text-align: center;
}

.result-grade-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--md-blue-900);
  margin: 0 0 6px;
  line-height: 1.3;
}

.result-grade-desc {
  font-size: 13px;
  color: var(--md-blue-600);
  line-height: 1.5;
  margin: 0;
}

.result-roast {
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

.result-cta {
  background: linear-gradient(135deg, #00a8e8, #0077b5);
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 136, 204, 0.3);
}

.cta-text {
  display: block;
  color: white;
  font-size: 14px;
  font-weight: 700;
}

.cta-text:last-child {
  font-size: 12px;
  font-weight: 500;
  margin-top: 2px;
  opacity: 0.9;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 136, 204, 0.12);
}

.result-actions-row {
  display: flex;
  gap: 10px;
}

.result-actions-row .btn {
  flex: 1;
}

/* 调侃语区 */
.result-roast-section {
  background: rgba(0, 136, 204, 0.08);
  border: 1.5px solid rgba(0, 136, 204, 0.2);
  border-radius: 14px;
  padding: 12px 16px;
  text-align: center;
  margin-bottom: 10px;
}

.result-roast-section .roast-lyric {
  font-size: 16px;
  font-weight: 900;
  color: var(--md-blue-800);
  line-height: 1.4;
  word-break: break-all;
  margin-bottom: 6px;
}

.result-roast-section .roast-suffix {
  font-size: 12px;
  font-weight: 600;
  color: var(--md-blue-500);
  line-height: 1.4;
}

/* 二维码展示区 */
.result-qr-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
  padding: 10px 14px;
  background: rgba(0, 136, 204, 0.08);
  border-radius: 12px;
  border: none;
}

.result-qr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.result-qr-img {
  width: 66px;
  height: 66px;
  border-radius: 8px;
  background: transparent;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.result-qr-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.result-qr-divider {
  font-size: 20px;
  color: rgba(0, 136, 204, 0.25);
  font-weight: 300;
  line-height: 1;
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
  width: 100%;
  background: linear-gradient(135deg, var(--md-accent-bright), var(--md-blue-500));
  color: white;
  box-shadow: 0 4px 16px rgba(0, 170, 232, 0.3);
  font-size: 14px;
  padding: 12px 24px;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 170, 232, 0.4);
}

.btn-ghost {
  background: var(--md-blue-50);
  color: var(--md-blue-600);
  border: 1.5px solid var(--md-blue-300);
}

.btn-ghost:hover {
  background: var(--md-blue-100);
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
  background: white;
  border: 1px solid #e5e7eb;
}

.question-wrong {
  background: white;
  border: 1px solid #e5e7eb;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.question-num {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--md-blue-100);
  color: var(--md-blue-700);
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
}

.question-status {
  font-size: 12px;
  font-weight: 600;
}

.question-correct .question-status {
  color: #16a34a;
}

.question-wrong .question-status {
  color: #dc2626;
}

.question-ear-lyric {
  font-size: 18px;
  font-weight: 700;
  color: var(--md-blue-900);
  margin-bottom: 12px;
}

.question-explanation {
  margin-top: 12px;
  padding: 14px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-explanation.correct {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 1px solid #86efac;
}

.question-explanation.wrong {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fda4af;
}

.explanation-song {
  font-size: 14px;
  font-weight: 700;
  color: #1e3a5f;
  line-height: 1.5;
}

.explanation-divider {
  color: #94a3b8;
  margin: 0 6px;
}

.explanation-lyrics {
  margin-bottom: 4px;
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

/* Other Test Card */
.other-test-section {
  width: 100%;
  max-width: 480px;
  margin-bottom: 16px;
}

.other-test-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--md-blue-900);
  margin-bottom: 4px;
}

.other-test-card {
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

.other-test-card:active {
  transform: scale(0.97);
}

.other-test-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--md-blue-900);
  margin-bottom: 4px;
}

.other-test-desc {
  font-size: 12px;
  color: var(--md-blue-600);
  line-height: 1.4;
  margin-bottom: 8px;
}

.other-test-count {
  font-size: 11px;
  color: var(--md-blue-500);
  background: rgba(0, 136, 204, 0.08);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  display: inline-block;
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

.share-qrcode {
  text-align: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #e5e7eb;
}

.qrcode-img {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.qrcode-tip {
  font-size: 12px;
  color: #666;
  margin: 8px 0 0;
}

/* Hidden Share Card */
.share-card-hidden {
  position: fixed;
  left: -9999px;
  top: -9999px;
}

.share-card {
  width: 360px;
  background: linear-gradient(160deg, #ffffff 0%, #e8f5ff 60%, #dbeeff 100%);
  border-radius: 24px;
  padding: 24px 20px;
  box-shadow: 0 8px 32px rgba(0, 87, 174, 0.15);
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
  background: radial-gradient(circle, rgba(0, 136, 204, 0.1) 0%, transparent 60%);
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
  background: linear-gradient(135deg, #00a8e8, #0077b5);
  color: white;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 4px 12px;
  border-radius: 20px;
}

.share-card-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--md-blue-800);
}

.share-card-challenge {
  background: rgba(0, 136, 204, 0.1);
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(0, 136, 204, 0.2);
}

.challenge-emoji {
  font-size: 24px;
}

.challenge-text {
  font-size: 16px;
  color: var(--md-blue-800);
  font-weight: 600;
}

.challenge-text b {
  color: var(--md-accent);
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
  margin: 10px 0 0;
  background: #fff5f5;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px dashed #fda4af;
}

.roast-ear-lyric {
  font-size: 15px;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 6px;
}

.roast-text {
  font-size: 12px;
  color: #dc2626;
  line-height: 1.4;
  font-style: italic;
}

.share-card-cta {
  background: linear-gradient(135deg, #e8f5ff 0%, #dbeeff 100%);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 136, 204, 0.15);
  border: 1px solid rgba(0, 136, 204, 0.2);
}

.roast-ear-lyric {
  font-size: 16px;
  font-weight: 900;
  color: var(--md-blue-800);
  margin-bottom: 8px;
  line-height: 1.5;
  word-break: break-all;
}

.cta-text {
  display: block;
  color: var(--md-blue-600);
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
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.share-card-qr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.share-card-qr-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: white;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.share-card-label {
  font-size: 11px;
  color: var(--md-blue-500);
  margin: 6px 0 0;
}

.share-card-disclaimer {
  font-size: 11px;
  color: var(--md-blue-500);
  margin: 0;
}

.share-qrcode,
.qrcode-img,
.qrcode-tip {
  display: none;
}

/* 每道题的分享按钮 */
.question-share-btn {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 8px 16px;
  background: rgba(0, 136, 204, 0.08);
  color: var(--md-blue-600);
  border: 1px solid rgba(0, 136, 204, 0.2);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
}

.question-share-btn:hover {
  background: rgba(0, 136, 204, 0.15);
}

/* 单题分享卡片 */
.question-share-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 28px 20px 20px;
  text-align: center;
}

.question-share-ear-lyric {
  font-size: 32px;
  font-weight: 800;
  color: var(--md-blue-700);
  line-height: 1.3;
  letter-spacing: 0.02em;
  padding: 0 4px;
}

.question-share-subtitle {
  font-size: 15px;
  color: var(--md-blue-500);
  font-weight: 500;
  line-height: 1.5;
}

.question-share-result {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-share-accuracy {
  background: rgba(0, 136, 204, 0.1);
  border: 1px solid rgba(0, 136, 204, 0.2);
  border-radius: 12px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.accuracy-label {
  font-size: 13px;
  color: var(--md-blue-600);
  font-weight: 600;
}

.accuracy-value {
  font-size: 20px;
  font-weight: 800;
  color: var(--md-accent);
}

.question-share-grade {
  background: white;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.question-share-grade-img {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  flex-shrink: 0;
  object-fit: cover;
}

.question-share-grade-info {
  text-align: left;
}

.question-share-grade-title {
  font-size: 15px;
  font-weight: 800;
  color: #1e3a5f;
  margin-bottom: 4px;
}

.question-share-grade-desc {
  font-size: 12px;
  color: #4a6fa5;
  line-height: 1.4;
}

.question-share-cta {
  background: linear-gradient(135deg, #e8f5ff 0%, #dbeeff 100%);
  border-radius: 12px;
  padding: 12px 16px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 136, 204, 0.15);
  border: 1px solid rgba(0, 136, 204, 0.2);
}

.question-share-cta-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--md-blue-700);
}
</style>
