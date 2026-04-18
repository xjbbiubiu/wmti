<template>
  <div class="result">
    <div class="result-bg" aria-hidden="true" />

    <div v-if="loading" class="loading-state">
      <p>加载中...</p>
    </div>

    <div v-else class="result-content">

    <section class="hero-card" aria-label="测试结果卡片">
      <div class="hero-header">
        <span class="hero-badge">WMTI</span>
        <span class="hero-title">🥕五迷老师趣味测试</span>
      </div>
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
          <div class="hero-traits">
            <span v-for="trait in result.trait" :key="trait" class="hero-trait">{{ trait }}</span>
          </div>
          <p class="hero-quote">"{{ result.matchingSongs[0]?.lyric || '' }}"</p>
          <p class="hero-song-name">——《 {{ result.matchingSongs[0]?.name || '' }} 》</p>
        </div>
      </div>
      <div class="hero-desc">{{ result.desc }}</div>
      <div class="hero-dimensions">
        <div class="hero-dim-badge" v-for="block in dimensionBlocks" :key="block.key">
          <div class="hero-dim-label">
            <span class="hero-dim-w">{{ block.key }}</span><span class="hero-dim-rest">{{ getDimRest(block.key) }}</span>
          </div>
          <span class="hero-dim-type">{{ block.type }}</span>
          <div class="hero-dim-traits">
            <span v-for="trait in block.traits.slice(0, 1)" :key="trait" class="hero-dim-trait">{{ trait }}</span>
          </div>
        </div>
      </div>
      <div class="hero-actions">
        <div class="hero-actions-row">
          <button type="button" class="btn btn-ghost" @click="goHome">
            回到首页
          </button>
          <button type="button" class="btn btn-ghost" @click="restartTest">
            再测一次
          </button>
        </div>
        <button type="button" class="btn btn-primary" @click="handleShare">
          分享结果
        </button>
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

    <!-- 其他测试卡片 -->
    <section class="other-test-section">
      <div class="other-test-title">其他测试</div>
      <div class="other-test-card" @click="goEarQuiz">
        <div class="other-test-title">🎤 五月天空耳猜歌测试</div>
        <div class="other-test-desc">你是不是真正的听力王</div>
        <div class="other-test-count">14道题 · 约3分钟</div>
      </div>
    </section>

    <p class="disclaimer-bottom">趣味测试 仅供娱乐</p>

    </div>
  </div>

  <!-- 分享弹窗 -->
  <Teleport to="body">
    <div v-if="showShareModal" class="share-overlay" @click.self="closeShareModal">
      <div class="share-modal">
        <div class="modal-header">
          <button class="modal-close" @click="closeShareModal" aria-label="关闭">×</button>
        </div>
        <div class="modal-body">
          <!-- 生成中 -->
          <div v-if="isGenerating" class="share-loading">
            <p>生成中...</p>
          </div>
          <!-- 图片预览 -->
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

  <!-- 隐藏的分享卡片（用于生成图片） -->
  <div ref="shareCardRef" class="share-card-hidden">
    <div class="share-card">
      <div class="share-card-header">
        <span class="share-card-badge">WMTI</span>
        <span class="share-card-title">🥕五迷老师趣味测试</span>
      </div>
      <div class="share-card-main">
        <div class="share-card-image-wrap">
          <img
            :src="imageUrl(result.posterVisual.imageUrl)"
            :alt="result.posterVisual.tagline"
            class="share-card-image"
          />
        </div>
        <div class="share-card-info">
          <h2 class="share-card-label">{{ result.label }}</h2>
          <div class="share-card-traits">
            <span v-for="trait in result.trait" :key="trait" class="share-card-trait">{{ trait }}</span>
          </div>
          <p class="share-card-quote">"{{ result.matchingSongs[0]?.lyric || '' }}"</p>
          <p class="share-card-song">——《 {{ result.matchingSongs[0]?.name || '' }} 》</p>
        </div>
      </div>
      <div class="share-card-desc">{{ result.desc }}</div>
      <div class="share-card-dimensions">
        <div class="share-dim-badge" v-for="block in dimensionBlocks" :key="block.key">
          <div class="share-dim-label">
            <span class="share-dim-w">{{ block.key }}</span><span class="share-dim-rest">{{ getDimRest(block.key) }}</span>
          </div>
          <span class="share-dim-type">{{ block.type }}</span>
          <div class="share-dim-traits">
            <span v-for="trait in block.traits.slice(0, 1)" :key="trait" class="share-dim-trait">{{ trait }}</span>
          </div>
        </div>
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiUrl, imageUrl, track } from '../api'
import html2canvas from 'html2canvas'
import qrcodeImg from '/group-qrcode.png'

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
const shareCardRef = ref(null)
const shareImageUrl = ref('')
const isGenerating = ref(false)

onMounted(async () => {
  try {
    const { id } = route.params
    const response = await fetch(apiUrl(`/api/results/${id}`))
    if (!response.ok) throw new Error('Result not found')
    result.value = await response.json()
    // 缓存到本地
    localStorage.setItem('wmti_result', JSON.stringify({
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

const getDimRest = (key) => {
  const map = { W: 'ork', M: 'ind', L: 'ove', S: 'tress' }
  return map[key] || ''
}

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
  router.push('/quiz')
}

const goHome = () => {
  router.push('/')
}

const goEarQuiz = () => {
  router.push('/ear-quiz')
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

/* Hero Card - 复用分享卡片样式 */
.hero-card {
  background: linear-gradient(160deg, #ffffff 0%, #e8f5ff 60%, #dbeeff 100%);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 87, 174, 0.15);
  position: relative;
  overflow: hidden;
}

.hero-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.hero-badge {
  background: linear-gradient(135deg, #00a8e8, #0077b5);
  color: white;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 5px 12px;
  border-radius: 8px;
}

.hero-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #4a6fa5;
}

.hero-main {
  display: flex;
  gap: 16px;
  margin-bottom: 14px;
  align-items: flex-start;
}

.hero-image-wrap {
  width: 100px;
  height: 100px;
  border-radius: 14px;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 119, 179, 0.2);
  flex-shrink: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-label {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 800;
  color: #0077b5;
  line-height: 1.2;
}

.hero-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.hero-trait {
  font-size: 10px;
  color: #0077b5;
  background: rgba(0, 119, 179, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.hero-quote {
  font-size: 13px;
  line-height: 1.5;
  color: #2c5282;
  margin: 0 0 4px;
  font-style: italic;
}

.hero-song-name {
  font-size: 11px;
  color: #00a8e8;
  margin: 0;
  font-weight: 600;
}

.hero-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #2c5282;
  margin-bottom: 14px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

.hero-dimensions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 0;
  margin-bottom: 12px;
  border-top: 1px solid rgba(0, 136, 204, 0.12);
  border-bottom: 1px solid rgba(0, 136, 204, 0.12);
}

.hero-dim-badge {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 6px;
  background: rgba(0, 136, 204, 0.06);
  border-radius: 10px;
  border: 1px solid rgba(0, 136, 204, 0.12);
}

.hero-dim-label {
  display: flex;
  align-items: baseline;
  line-height: 1;
}

.hero-dim-w {
  font-size: 20px;
  font-weight: 700;
  color: #0077b5;
}

.hero-dim-rest {
  font-size: 11px;
  font-weight: 600;
  color: #7ba3c4;
}

.hero-dim-type {
  font-size: 11px;
  color: #2c5282;
  text-align: center;
  line-height: 1.3;
  font-weight: 600;
}

.hero-dim-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
  margin-top: 2px;
}

.hero-dim-trait {
  font-size: 9px;
  color: #5a8ab8;
  background: rgba(0, 119, 179, 0.08);
  padding: 2px 5px;
  border-radius: 4px;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 136, 204, 0.12);
}

.hero-actions-row {
  display: flex;
  gap: 10px;
}

.hero-actions-row .btn {
  flex: 1;
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

.disclaimer-bottom {
  margin: 16px 0;
  font-size: 11px;
  color: var(--md-text-on-blue-muted);
  text-align: center;
}

/* 空耳导流卡片 */
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

.share-card-hidden {
  position: fixed;
  left: -9999px;
  top: -9999px;
  width: 400px;
  z-index: -1;
}

.share-preview-wrap {
  margin-bottom: 16px;
  overflow: hidden;
  border-radius: 16px;
  width: 100%;
  box-sizing: border-box;
}

.share-card-preview {
  background: linear-gradient(160deg, #ffffff 0%, #e8f5ff 60%, #dbeeff 100%);
  border-radius: 20px;
  padding: 20px;
  color: #2c5282;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 87, 174, 0.15);
}

.share-card-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #2c5282;
  margin-bottom: 14px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  word-break: break-all;
}

.share-card-dimensions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 0;
  margin-bottom: 12px;
  border-top: 1px solid rgba(0, 136, 204, 0.12);
  border-bottom: 1px solid rgba(0, 136, 204, 0.12);
}

.share-dim-badge {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 6px;
  background: rgba(0, 136, 204, 0.06);
  border-radius: 10px;
  border: 1px solid rgba(0, 136, 204, 0.12);
}

.share-dim-label {
  display: flex;
  align-items: baseline;
  line-height: 1;
}

.share-dim-w {
  font-size: 20px;
  font-weight: 700;
  color: #0077b5;
}

.share-dim-rest {
  font-size: 11px;
  font-weight: 600;
  color: #7ba3c4;
}

.share-dim-type {
  font-size: 11px;
  color: #2c5282;
  text-align: center;
  line-height: 1.3;
  font-weight: 600;
}

.share-dim-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
  margin-top: 2px;
}

.share-dim-trait {
  font-size: 9px;
  color: #5a8ab8;
  background: rgba(0, 119, 179, 0.08);
  padding: 2px 5px;
  border-radius: 4px;
}

.share-card-footer {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 136, 204, 0.15);
}

.share-card-qr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.share-card-qr-img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 87, 174, 0.15);
}

.share-card-label {
  font-size: 11px;
  color: #0077b5;
  margin: 6px 0 0;
  font-weight: 500;
}

.share-qrcode,
.qrcode-img,
.qrcode-tip {
  display: none;
}

.share-card-qr-text {
  font-size: 12px;
  color: #0077b5;
  margin: 0;
  font-weight: 600;
}

.share-card-disclaimer {
  font-size: 11px;
  color: #7ba3c4;
  margin: 0;
  text-align: center;
}

.share-card {
  background: linear-gradient(160deg, #ffffff 0%, #e8f5ff 60%, #dbeeff 100%);
  border-radius: 20px;
  padding: 20px;
  color: #2c5282;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 87, 174, 0.15);
}

.share-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.share-card-badge {
  background: linear-gradient(135deg, #00a8e8, #0077b5);
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.05em;
}

.share-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #4a6fa5;
}

.share-card-main {
  display: flex;
  gap: 16px;
  margin-bottom: 14px;
  align-items: flex-start;
}

.share-card-image-wrap {
  width: 100px;
  height: 100px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 119, 179, 0.2);
}

.share-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.share-card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.share-card-label {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 4px;
  color: #0077b5;
}

.share-card-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.share-card-trait {
  font-size: 10px;
  color: #0077b5;
  background: rgba(0, 119, 179, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.share-card-type {
  font-size: 12px;
  color: #6b8ba4;
  margin: 0 0 10px;
  font-weight: 500;
}

.share-card-quote {
  font-size: 13px;
  line-height: 1.5;
  color: #2c5282;
  margin: 0 0 6px;
  font-style: italic;
  word-break: break-all;
}

.share-card-song {
  font-size: 11px;
  color: #00a8e8;
  margin: 0;
  font-weight: 600;
}

.share-card-footer {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 136, 204, 0.15);
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
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.share-card-label {
  font-size: 11px;
  color: #0088cc;
  margin: 6px 0 0;
  font-weight: 500;
}

.share-qrcode,
.qrcode-img,
.qrcode-tip {
  display: none;
}

.share-card-qr-text {
  font-size: 11px;
  color: #0088cc;
  margin: 0;
  font-weight: 500;
}

.share-card-disclaimer {
  font-size: 10px;
  color: #6b8ba4;
  margin: 0;
}

.share-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
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
  justify-content: flex-end;
  padding: 16px 20px;
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
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.modal-label {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--md-blue-700, #035a86);
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

.generate-img-btn {
  margin-top: 12px;
  background: linear-gradient(135deg, #00a8e8, #0077b5);
  box-shadow: 0 4px 16px rgba(0, 119, 179, 0.3);
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 15px;
}

.generate-img-btn:hover {
  box-shadow: 0 6px 20px rgba(0, 119, 179, 0.4);
}

.generate-img-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.share-image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.share-result-img {
  width: 100%;
  max-height: 480px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.share-tip {
  font-size: 13px;
  color: #666;
  text-align: center;
  line-height: 1.6;
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

.share-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: var(--md-blue-600);
  font-size: 15px;
}
</style>
