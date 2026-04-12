<template>
  <div class="result">
    <div class="result-bg" aria-hidden="true" />

    <div v-if="loading" class="loading-state">
      <p>加载中...</p>
    </div>

    <div v-else class="result-content">

    <section class="hero-card" aria-label="测试结果卡片">
      <div class="hero-glow" aria-hidden="true" />

      <header class="hero-header">
        <span class="hero-badge">WMTI</span>
        <h1 class="hero-title">五迷老师趣味测试</h1>
      </header>

      <div class="hero-main">
        <div class="hero-image-wrap">
          <img
            :src="imageUrl(result.posterVisual.imageUrl)"
            :alt="result.posterVisual.tagline"
            class="hero-image"
          />
        </div>

        <div class="hero-info">
          <h2 class="hero-label">{{ result.label }}</h2>
          <p class="hero-type">{{ result.resultType }}</p>

          <div class="hero-traits">
            <span v-for="trait in result.trait" :key="trait" class="trait-tag">{{ trait }}</span>
          </div>

          <p class="hero-desc">{{ result.desc }}</p>
          <p class="hero-insight">{{ result.maydayInsight || '' }}</p>
        </div>
      </div>

      <div class="hero-song">
        <span class="song-label">🎵 你的五迷之歌</span>
        <p class="song-quote">{{ result.matchingSongs[0]?.lyric || '' }}</p>
        <p class="song-name">——《 {{ result.matchingSongs[0]?.name || '' }} 》</p>
      </div>
    </section>

    <section class="analysis-section" aria-labelledby="deep-analysis-heading">
      <div class="section-header">
        <h2 id="deep-analysis-heading" class="section-title">深度解析</h2>
      </div>

      <div class="dimension-grid">
        <article
          v-for="block in dimensionBlocks"
          :key="block.key"
          class="dimension-card"
          :class="`card-${block.key.toLowerCase()}`"
        >
          <div class="card-header">
            <span class="card-letter">{{ block.key }}</span>
            <div class="card-title-wrap">
              <span class="card-name">{{ block.label }}</span>
              <span class="card-type">{{ block.type }}</span>
            </div>
            <div class="card-score">
              <span class="score-num">{{ block.score }}</span>
              <span class="score-unit">%</span>
            </div>
          </div>

          <div class="card-body">
            <p class="card-summary">{{ block.summary }}</p>
            <p class="card-detail">{{ block.detail }}</p>

            <div class="card-keywords">
              <span class="kw-label">关键词</span>
              <span v-for="t in block.traits" :key="t" class="kw-tag">{{ t }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <footer class="result-footer">
      <p class="disclaimer">个人项目 · 仅供娱乐</p>

      <div class="action-buttons">
        <button type="button" class="btn btn-primary" @click="openShareModal">
          分享结果
        </button>
        <button type="button" class="btn btn-ghost" @click="restartTest">
          再测一次
        </button>
      </div>
    </footer>

    </div>
  </div>

  <!-- 分享弹窗 -->
  <Teleport to="body">
    <div v-if="showShareModal" class="share-overlay" @click.self="closeShareModal">
      <div class="share-modal">
        <div class="modal-header">
          <h3>分享你的结果</h3>
          <button class="modal-close" @click="closeShareModal" aria-label="关闭">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-label">复制文案，发到朋友圈/微博/小红书：</p>
          <div class="share-text-box">
            <p class="share-text">{{ shareText }}</p>
          </div>
          <button class="copy-btn" :class="{ copied: copyDone }" @click="copyShareText">
            {{ copyDone ? '已复制！去粘贴分享吧～' : '复制文案' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiUrl, imageUrl, track } from '../api'

const router = useRouter()
const route = useRoute()

const defaultResult = {
  label: '快乐五迷',
  resultType: '生活家 × 乐天派 × 追寻者 × 弹性派',
  desc: '你是独一无二的五迷，不管什么类型，有五月天陪伴的人生就是满分！',
  trait: ['独特', '真实', '有自我'],
  scores: { w: 50, m: 50, l: 50, s: 50 },
  analysis: {
    W: {
      title: '工作态度',
      summary: '你追求工作与生活的平衡',
      detail: '你既不是只拼工作，也不是完全躺平，更在意长期可持续的节奏。',
      trait: ['懂得取舍', '效率至上', '生活质量优先'],
      type: '平衡者'
    },
    M: {
      title: '心态画像',
      summary: '你是那种差不多就行的乐天派',
      detail: '你不会被「必须怎样」绑死，更愿意用轻松一点的方式面对生活。',
      trait: ['知足常乐', '心态平和', '不较真'],
      type: '乐天派'
    },
    L: {
      title: '情感模式',
      summary: '你在寻找那个对的人',
      detail: '你认真对待关系，但不会为了「有个伴」而将就。',
      trait: ['有追求', '认真对待', '相信缘分'],
      type: '追寻者'
    },
    S: {
      title: '挫折应对',
      summary: '你是懂得调整心态的弹性派',
      detail: '遇到坎儿时，你会先稳住自己，再决定是硬扛、迂回还是暂时放下。',
      trait: ['懂得变通', '能屈能伸', '适应力强'],
      type: '弹性派'
    }
  },
  summarySong: '会不会有一天时间真的能倒退，退回你的我的回不去的悠悠的岁月。',
  summarySongName: '干杯',
  maydaySong: '任意门',
  maydayInsight: '「任意门外我们都任意的飞，是自由的滋味」。',
  matchingSongs: [
    { name: '干杯', lyric: '会不会有一天时间真的能倒退，退回你的我的回不去的悠悠的岁月。' },
    { name: '任意门', lyric: '任意门外我们都任意的飞，是自由的滋味。' }
  ],
  posterVisual: { tagline: '快乐五迷', imageUrl: '/posters/快乐五迷.webp' }
}

const result = ref(defaultResult)
const loading = ref(true)
const error = ref(null)
const showShareModal = ref(false)
const copyDone = ref(false)

const shareText = computed(() => {
  const r = result.value
  const lines = [
    `🎵 我的 WMTI 测试结果`,
    ``,
    `【${r.label}】`,
    ``,
    `📊 四维分型`,
    `  工作 W：${r.scores?.w ?? 0}%  ${r.analysis?.W?.type ?? ''}`,
    `  心态 M：${r.scores?.m ?? 0}%  ${r.analysis?.M?.type ?? ''}`,
    `  情感 L：${r.scores?.l ?? 0}%  ${r.analysis?.L?.type ?? ''}`,
    `  挫折 S：${r.scores?.s ?? 0}%  ${r.analysis?.S?.type ?? ''}`,
    ``,
    `🎤 ${r.maydaySong} · ${r.maydayInsight}`,
    ``,
    `${r.label}！快来看看你的wmls趣味测试结果吧~~`,
    `http://buluinfo.cn/wmti/`
  ]
  return lines.join('\n')
})

onMounted(async () => {
  try {
    const { id } = route.params
    const response = await fetch(apiUrl(`/api/results/${id}`))
    if (!response.ok) throw new Error('Result not found')
    result.value = await response.json()
    // 缓存到本地
    localStorage.setItem('wmti_last_result', JSON.stringify({
      id,
      label: result.value.label,
      typeCode: result.value.typeCode,
      posterUrl: imageUrl(result.value.posterVisual?.imageUrl || '/posters/快乐五迷.webp')
    }))
  } catch (e) {
    error.value = e.message
    result.value = defaultResult
  } finally {
    loading.value = false
  }
})

const dimensionBlocks = computed(() => {
  const r = result.value
  const a = r.analysis || {}
  const s = r.scores || {}
  const defs = [
    { key: 'W', label: '工作 Work', scoreKey: 'w' },
    { key: 'M', label: '心态 Mind', scoreKey: 'm' },
    { key: 'L', label: '情感 Love', scoreKey: 'l' },
    { key: 'S', label: '挫折 Stress', scoreKey: 's' }
  ]
  return defs.map(def => {
    const analysis = a[def.key] || {}
    const score = s[def.scoreKey] || 50
    return {
      key: def.key,
      label: def.label,
      summary: analysis.summary || '',
      detail: analysis.detail || '',
      traits: analysis.trait || [],
      type: analysis.type || '',
      score
    }
  })
})

const openShareModal = () => {
  showShareModal.value = true
  copyDone.value = false
}

const closeShareModal = () => {
  showShareModal.value = false
}

const copyShareText = () => {
  const text = shareText.value
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;width:1px;height:1px;'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  let success = false
  try {
    success = document.execCommand('copy')
  } catch {
    success = false
  }
  document.body.removeChild(textarea)
  if (success) {
    copyDone.value = true
    setTimeout(() => { copyDone.value = false }, 2500)
  } else {
    // 降级：弹窗显示文案让用户手动复制
    alert('请长按下方文案区域，全选复制哦～')
  }
  track('result_share', {
    quiz_type: result.value.label,
    quiz_type_code: result.value.typeCode
  })
}

const restartTest = () => {
  router.push('/')
}
</script>

<style scoped>
.result {
  min-height: 100dvh;
  padding: 20px 16px max(40px, calc(16px + env(safe-area-inset-bottom)));
}

.result-bg {
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
.result-content {
  max-width: 480px;
  margin: 0 auto;
}

/* Hero Card */
.hero-card {
  background: white;
  border-radius: 28px;
  padding: 28px 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 119, 179, 0.12);
  position: relative;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 170, 232, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.hero-header {
  text-align: center;
  margin-bottom: 24px;
}

.hero-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--md-accent-bright), var(--md-blue-500));
  color: white;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 12px;
  margin-bottom: 8px;
}

.hero-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--md-blue-700);
  letter-spacing: 0.05em;
}

.hero-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.hero-image-wrap {
  width: 160px;
  height: 160px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 119, 179, 0.2);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-info {
  text-align: center;
  width: 100%;
}

.hero-label {
  margin: 0 0 6px;
  font-size: 26px;
  font-weight: 800;
  color: var(--md-blue-900);
  line-height: 1.2;
}

.hero-type {
  margin: 0 0 14px;
  font-size: 12px;
  color: var(--md-accent);
  letter-spacing: 0.05em;
}

.hero-traits {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.trait-tag {
  background: var(--md-blue-50);
  color: var(--md-blue-600);
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 16px;
  border: 1px solid var(--md-blue-200);
}

.hero-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--md-blue-700);
}

.hero-insight {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--md-accent);
  font-style: italic;
  word-break: break-word;
}

.hero-song {
  background: linear-gradient(135deg, var(--md-blue-50) 0%, white 100%);
  border-radius: 16px;
  padding: 18px 20px;
  text-align: center;
  border: 1px solid var(--md-blue-200);
}

.song-label {
  display: inline-block;
  font-size: 11px;
  color: var(--md-blue-600);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.song-quote {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--md-blue-900);
}

.song-name {
  margin: 0;
  font-size: 12px;
  color: var(--md-accent);
  font-weight: 500;
}

.song-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.song-tag {
  background: var(--md-blue-100);
  color: var(--md-blue-600);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 10px;
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

.dimension-grid {
  display: grid;
  gap: 16px;
}

.dimension-card {
  background: var(--md-blue-50);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--md-blue-100);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--md-blue-100);
}

.card-letter {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--md-accent-bright), var(--md-blue-500));
  color: white;
  font-size: 16px;
  font-weight: 700;
  border-radius: 10px;
  flex-shrink: 0;
}

.card-title-wrap {
  flex: 1;
  min-width: 0;
}

.card-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--md-blue-900);
  margin-bottom: 2px;
}

.card-type {
  display: block;
  font-size: 11px;
  color: var(--md-blue-600);
}

.card-score {
  text-align: right;
  flex-shrink: 0;
}

.score-num {
  font-size: 22px;
  font-weight: 700;
  color: var(--md-accent);
}

.score-unit {
  font-size: 12px;
  color: var(--md-blue-500);
}

.card-body {
  padding: 0 4px;
}

.card-summary {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--md-blue-900);
  line-height: 1.5;
}

.card-detail {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--md-blue-700);
}

.card-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.kw-label {
  font-size: 11px;
  color: var(--md-blue-500);
  margin-right: 4px;
}

.kw-tag {
  background: white;
  color: var(--md-blue-600);
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 8px;
  border: 1px solid var(--md-blue-200);
}

/* Footer */
.result-footer {
  text-align: center;
  padding: 0 20px;
}

.disclaimer {
  margin: 0 0 20px;
  font-size: 11px;
  color: var(--md-text-on-blue-muted);
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

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

/* Responsive */
@media (min-width: 400px) {
  .hero-main {
    flex-direction: row;
    align-items: flex-start;
  }

  .hero-info {
    text-align: left;
  }

  .hero-traits {
    justify-content: flex-start;
  }
}

@media (max-width: 399px) {
  .hero-image-wrap {
    width: 120px !important;
    height: 120px !important;
  }

  .hero-label {
    font-size: 22px;
  }

  .dimension-card {
    padding: 12px;
  }

  .card-header {
    gap: 8px;
  }

  .card-letter {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }

  .score-num {
    font-size: 18px;
  }

  .btn {
    padding: 12px 20px;
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
}

/* 分享弹窗 */
.share-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 26, 46, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.share-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 60px rgba(5, 26, 46, 0.3);
  overflow: hidden;
  animation: modalIn 0.2s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--md-blue-100, #e8f6fc);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--md-blue-900, #062d4a);
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--md-blue-50, #e8f6fc);
  color: var(--md-blue-600, #0077b5);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background 0.15s;
}

.modal-close:hover {
  background: var(--md-blue-100, #d0eefa);
}

.modal-body {
  padding: 20px 24px 24px;
}

.modal-label {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--md-blue-700, #035a86);
}

.share-text-box {
  background: var(--md-blue-50, #e8f6fc);
  border: 1.5px solid var(--md-blue-200, #b8dff5);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
  user-select: text;
  -webkit-user-select: text;
}

.share-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--md-blue-900, #062d4a);
  white-space: pre-wrap;
  word-break: break-word;
}

.copy-btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, #0088cc, #0099d9);
  color: white;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(0, 136, 204, 0.3);
}

.copy-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 136, 204, 0.4);
}

.copy-btn.copied {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  box-shadow: 0 4px 16px rgba(39, 174, 96, 0.3);
}
</style>
