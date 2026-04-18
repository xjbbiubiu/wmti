# 五月天空耳猜歌测试 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 WMTI 项目中添加独立的空耳猜歌测试，包含10道题、即时反馈、等级称号和详细解析，并在两个测试结果页互相导流。

**Architecture:** 复用现有 Express + Vue3 技术栈，新建两套独立路由和数据（`/api/ear/*`），前端新建两个页面组件，首页和结果页各加一个导流入口。

**Tech Stack:** Express.js, Vue3, Vite, 现有 mayday-blue CSS 变量

---

## 文件清单

| 文件 | 操作 |
|------|------|
| `backend/src/data/earQuestions.js` | 新建 |
| `backend/src/routes/earQuestions.js` | 新建 |
| `backend/src/routes/earResults.js` | 新建 |
| `backend/src/app.js` | 修改 |
| `frontend/src/pages/EarQuizPage.vue` | 新建 |
| `frontend/src/pages/EarResultPage.vue` | 新建 |
| `frontend/src/router/index.js` | 修改 |
| `frontend/src/pages/HomePage.vue` | 修改 |
| `frontend/src/pages/ResultPage.vue` | 修改 |

---

## Task 1: 空耳题目数据

**Files:**
- Create: `backend/src/data/earQuestions.js`

- [ ] **Step 1: 创建题目数据文件**

```javascript
/**
 * 五月天空耳猜歌测试 - 10道精选题
 *
 * 每题结构：
 * - earLyric: 空耳歌词（展示给用户）
 * - options: 4个选项，correct=true 为正确答案
 * - correctAnswer: 选完后的详细展示
 */

const earQuestions = [
  {
    id: 1,
    earLyric: '难道我又我又住院了',
    options: [
      { key: 'A', content: '我又初恋了', correct: true },
      { key: 'B', content: '恋爱ing', correct: false },
      { key: 'C', content: '离开地球表面', correct: false },
      { key: 'D', content: '倔强', correct: false },
    ],
    correctAnswer: {
      song: '我又初恋了',
      album: '为爱而生',
      originalLyric: '难道我又我又初恋了',
    },
  },
  {
    id: 2,
    earLyric: '为什么失去了还要背乘法呢',
    options: [
      { key: 'A', content: '你不是真正的快乐', correct: true },
      { key: 'B', content: '顽固', correct: false },
      { key: 'C', content: '后青春的诗', correct: false },
      { key: 'D', content: '人生海海', correct: false },
    ],
    correctAnswer: {
      song: '你不是真正的快乐',
      album: '后青春期的诗',
      originalLyric: '为什么失去了还要被惩罚呢',
    },
  },
  {
    id: 3,
    earLyric: '这是全天下最完蛋的阵容',
    options: [
      { key: 'A', content: '爱情万岁', correct: true },
      { key: 'B', content: '人生有限公司', correct: false },
      { key: 'C', content: '倔强', correct: false },
      { key: 'D', content: '干杯', correct: false },
    ],
    correctAnswer: {
      song: '爱情万岁',
      album: '爱情万岁',
      originalLyric: '这是全天下最完美的阵容',
    },
  },
  {
    id: 4,
    earLyric: '我的手越肮脏，眼神越是放荡',
    options: [
      { key: 'A', content: '倔强', correct: true },
      { key: 'B', content: '顽固', correct: false },
      { key: 'C', content: '盛夏光年', correct: false },
      { key: 'D', content: '任意门', correct: false },
    ],
    correctAnswer: {
      song: '倔强',
      album: '神的孩子都在跳舞',
      originalLyric: '我的手越肮脏，眼神越是放荡',
    },
  },
  {
    id: 5,
    earLyric: '那年我们冲出了阳界',
    options: [
      { key: 'A', content: '任意门', correct: true },
      { key: 'B', content: '诺亚方舟', correct: false },
      { key: 'C', content: '盛夏光年', correct: false },
      { key: 'D', content: '离开地球表面', correct: false },
    ],
    correctAnswer: {
      song: '任意门',
      album: '自传',
      originalLyric: '那年我们都冲出南阳街',
    },
  },
  {
    id: 6,
    earLyric: '任意门通向了阴乐',
    options: [
      { key: 'A', content: '任意门', correct: true },
      { key: 'B', content: '顽固', correct: false },
      { key: 'C', content: '人生有限公司', correct: false },
      { key: 'D', content: '憨人', correct: false },
    ],
    correctAnswer: {
      song: '任意门',
      album: '自传',
      originalLyric: '任意门通向了音乐',
    },
  },
  {
    id: 7,
    earLyric: '我和我最后的绝望',
    options: [
      { key: 'A', content: '倔强', correct: true },
      { key: 'B', content: '顽固', correct: false },
      { key: 'C', content: '盛夏光年', correct: false },
      { key: 'D', content: '成名在望', correct: false },
    ],
    correctAnswer: {
      song: '倔强',
      album: '神的孩子都在跳舞',
      originalLyric: '我和我最后的倔强',
    },
  },
  {
    id: 8,
    earLyric: '每次单身我都要与你相遇',
    options: [
      { key: 'A', content: '一千个世纪', correct: true },
      { key: 'B', content: '我不愿让你一个人', correct: false },
      { key: 'C', content: '最重要的小事', correct: false },
      { key: 'D', content: '恋爱ing', correct: false },
    ],
    correctAnswer: {
      song: '一千个世纪',
      album: '为爱而生',
      originalLyric: '每次诞生我都要与你相遇',
    },
  },
  {
    id: 9,
    earLyric: '要不要麦当劳别人帮你决定好',
    options: [
      { key: 'A', content: 'DNA', correct: true },
      { key: 'B', content: '离开地球表面', correct: false },
      { key: 'C', content: '恋爱ing', correct: false },
      { key: 'D', content: '派对动物', correct: false },
    ],
    correctAnswer: {
      song: 'DNA',
      album: 'DNA巡演主题曲',
      originalLyric: '要不要难道要别人帮你决定好',
    },
  },
  {
    id: 10,
    earLyric: '出事的那个公园',
    options: [
      { key: 'A', content: '诺亚方舟', correct: true },
      { key: 'B', content: '任意门', correct: false },
      { key: 'C', content: '顽固', correct: false },
      { key: 'D', content: '人生海海', correct: false },
    ],
    correctAnswer: {
      song: '诺亚方舟',
      album: '第二人生',
      originalLyric: '我们初识的那个公园',
    },
  },
];

// 随机打乱选项顺序
const shuffleOptions = (questions) => {
  return questions.map((q) => {
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    return { ...q, options: shuffled };
  });
};

module.exports = { earQuestions: shuffleOptions(earQuestions) };
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/data/earQuestions.js
git commit -m "feat: add ear lyric quiz question data (10 questions)"
```

---

## Task 2: 空耳题目路由

**Files:**
- Create: `backend/src/routes/earQuestions.js`

- [ ] **Step 1: 创建题目路由**

```javascript
const express = require('express');
const router = express.Router();
const { earQuestions } = require('../data/earQuestions');

router.get('/', (req, res) => {
  // 返回题目（不含正确答案，避免泄露）
  const sanitizedQuestions = earQuestions.map((q) => ({
    id: q.id,
    earLyric: q.earLyric,
    options: q.options.map((opt) => ({
      key: opt.key,
      content: opt.content,
    })),
  }));
  res.json(sanitizedQuestions);
});

module.exports = router;
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/routes/earQuestions.js
git commit -m "feat: add /api/ear/questions route"
```

---

## Task 3: 空耳结果路由

**Files:**
- Create: `backend/src/routes/earResults.js`

- [ ] **Step 1: 创建结果路由（含等级称号逻辑）**

```javascript
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { earQuestions } = require('../data/earQuestions');

const RESULTS_FILE = path.join(__dirname, '..', '..', 'data', 'earResults.json');

const loadResults = () => {
  try {
    if (fs.existsSync(RESULTS_FILE)) {
      return new Map(Object.entries(JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'))));
    }
  } catch (e) {
    console.error('Failed to load ear results:', e);
  }
  return new Map();
};

const saveResults = (storage) => {
  try {
    fs.mkdirSync(path.dirname(RESULTS_FILE), { recursive: true });
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(Object.fromEntries(storage), null, 2));
  } catch (e) {
    console.error('Failed to save ear results:', e);
  }
};

const resultsStorage = loadResults();

// 等级称号映射
const gradeMap = [
  { min: 10, max: 10, level: 1, title: '🎓 空耳博士', desc: '真正的五迷听力专家，五月天在你耳边说话你都听得懂！' },
  { min: 8, max: 9, level: 2, title: '🎤 空耳十级选手', desc: '听歌听得懂但偶尔走神，真粉无疑！' },
  { min: 6, max: 7, level: 3, title: '🎧 空耳八级选手', desc: '大部分能猜到，但还差一点，继续修炼！' },
  { min: 4, max: 5, level: 4, title: '🎶 空耳六级选手', desc: '有点东西，但还不够，多听几遍吧！' },
  { min: 2, max: 3, level: 5, title: '🔉 空耳四级选手', desc: '五月天在喊你多听几遍！' },
  { min: 0, max: 1, level: 6, title: '🤷 空耳小白', desc: '欢迎来到五迷世界，从头来过！' },
];

const getGrade = (score) => {
  return gradeMap.find((g) => score >= g.min && score <= g.max) || gradeMap[gradeMap.length - 1];
};

router.post('/submit', (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length !== earQuestions.length) {
    return res.status(400).json({ error: 'Invalid answers format' });
  }

  // 计算得分并构建详细结果
  const questionDetails = answers.map((selectedIndex, i) => {
    const q = earQuestions[i];
    const selectedOption = q.options[selectedIndex];
    const correct = selectedOption?.correct === true;
    return {
      earLyric: q.earLyric,
      selected: selectedIndex,
      selectedContent: selectedOption?.content || '',
      correct,
      correctAnswer: q.correctAnswer,
    };
  });

  const score = questionDetails.filter((q) => q.correct).length;
  const grade = getGrade(score);

  const resultId = uuidv4();
  const resultData = {
    id: resultId,
    score,
    grade,
    questions: questionDetails,
  };

  resultsStorage.set(resultId, resultData);
  saveResults(resultsStorage);

  // 只返回 ID，前端拿到 ID 后再请求结果详情
  res.json({ id: resultId });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const result = resultsStorage.get(id);

  if (!result) {
    return res.status(404).json({ error: 'Result not found' });
  }

  res.json(result);
});

module.exports = router;
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/routes/earResults.js
git commit -m "feat: add /api/ear/submit and /api/ear/result/:id routes"
```

---

## Task 4: 注册空耳路由

**Files:**
- Modify: `backend/src/app.js`

- [ ] **Step 1: 添加路由引入和注册**

在 `backend/src/app.js` 的路由引入部分添加：

```javascript
const earQuestionRoutes = require('./routes/earQuestions');
const earResultRoutes = require('./routes/earResults');
```

在 API 路由注册部分添加：

```javascript
app.use('/api/ear/questions', earQuestionRoutes);
app.use('/api/ear/results', earResultRoutes);
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/app.js
git commit -m "feat: register /api/ear/* routes"
```

---

## Task 5: 空耳答题页

**Files:**
- Create: `frontend/src/pages/EarQuizPage.vue`

- [ ] **Step 1: 创建空耳答题页**

参考 `QuizPage.vue` 风格，大字展示空耳歌词，4个选项，选完即时弹出反馈卡片。

```vue
<template>
  <div class="ear-quiz" ref="quizRef">
    <div class="progress-bar">
      <div class="progress" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div class="container">
      <div class="question-counter">
        {{ currentIndex + 1 }} / {{ totalQuestions }}
      </div>

      <!-- 空耳歌词大字展示 -->
      <div class="ear-lyric-card">
        <div class="ear-lyric-text">"{{ currentQuestion.earLyric }}"</div>
      </div>

      <!-- 选项 -->
      <div class="options">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="option-btn"
          :class="{
            selected: selectedIndex === index,
            correct: showFeedback && option.correct,
            wrong: showFeedback && selectedIndex === index && !option.correct,
            disabled: showFeedback
          }"
          :disabled="showFeedback"
          @click="selectOption(index)"
        >
          <span class="option-key">{{ option.key }}</span>
          <span class="option-text">{{ option.content }}</span>
          <span v-if="showFeedback && option.correct" class="option-icon">✓</span>
          <span v-if="showFeedback && selectedIndex === index && !option.correct" class="option-icon">✗</span>
        </button>
      </div>

      <!-- 即时反馈卡片 -->
      <Transition name="feedback">
        <div v-if="showFeedback" class="feedback-card" :class="isCorrect ? 'correct' : 'wrong'">
          <div class="feedback-icon">{{ isCorrect ? '✓' : '✗' }}</div>
          <div class="feedback-song">
            <span class="feedback-label">这首歌是：</span>
            <span class="feedback-song-name">《{{ currentQuestion.correctAnswer.song }}》</span>
          </div>
          <div class="feedback-album">专辑：{{ currentQuestion.correctAnswer.album }}</div>
          <div class="feedback-lyric">
            <span class="feedback-label">原歌词：</span>
            <span class="feedback-lyric-text">"{{ currentQuestion.correctAnswer.originalLyric }}"</span>
          </div>
        </div>
      </Transition>
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
const showFeedback = ref(false)
const isCorrect = ref(false)
const isTransitioning = ref(false)

const totalQuestions = computed(() => questions.value.length)
const currentQuestion = computed(() => questions.value[currentIndex.value])
const progressPercent = computed(() => ((currentIndex.value + 1) / totalQuestions.value) * 100)

onMounted(async () => {
  try {
    const response = await fetch(apiUrl('/api/ear/questions'))
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    questions.value = await response.json()
  } catch (error) {
    console.error('Failed to load questions:', error)
  }
  track('page_view', { url_path: '/ear-quiz', quiz_type: 'ear' })
})

const selectOption = (index) => {
  if (showFeedback.value || isTransitioning.value) return
  answers.value[currentIndex.value] = index

  const q = currentQuestion.value
  isCorrect.value = q.options[index].correct === true
  showFeedback.value = true
  isTransitioning.value = true

  // 反馈停留 1.5s 后自动进入下一题
  setTimeout(() => {
    showFeedback.value = false
    isTransitioning.value = false
    if (currentIndex.value < totalQuestions.value - 1) {
      currentIndex.value++
    } else {
      submitTest()
    }
  }, 1500)
}

const submitTest = async () => {
  try {
    const response = await fetch(apiUrl('/api/ear/results/submit'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answers.value }),
    })
    const result = await response.json()
    track('quiz_submit', { url_path: '/ear-quiz', quiz_result_id: result.id })
    router.push({ name: 'ear-result', params: { id: result.id } })
  } catch (error) {
    console.error('Failed to submit test:', error)
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

.progress-bar {
  position: fixed;
  top: env(safe-area-inset-top, 0px);
  left: 0;
  right: 0;
  height: 5px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.28);
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
  justify-content: center;
  max-width: min(100%, var(--wmti-content-max));
  margin: 0 auto;
  padding: calc(52px + env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) 24px
    max(16px, env(safe-area-inset-left, 0px));
  width: 100%;
  box-sizing: border-box;
  gap: 16px;
}

.question-counter {
  text-align: center;
  color: var(--md-text-on-blue-muted);
  font-size: 13px;
  letter-spacing: 0.06em;
}

.ear-lyric-card {
  background: var(--md-surface);
  border-radius: 20px;
  padding: 28px 20px;
  box-shadow: 0 8px 32px rgba(5, 26, 46, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.45);
  text-align: center;
}

.ear-lyric-text {
  font-size: 22px;
  font-weight: 700;
  color: var(--md-blue-900);
  line-height: 1.5;
  word-break: break-word;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-btn {
  background: var(--md-blue-50);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: var(--md-blue-900);
  font-family: inherit;
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.option-btn:active:not(.disabled) {
  transform: scale(0.98);
}

.option-btn.selected {
  background: var(--md-blue-200);
  border-color: var(--md-accent);
}

.option-btn.correct {
  background: #d4edda;
  border-color: #28a745;
  color: #155724;
}

.option-btn.wrong {
  background: #f8d7da;
  border-color: #dc3545;
  color: #721c24;
}

.option-btn.disabled {
  cursor: default;
  opacity: 0.85;
}

.option-key {
  width: 26px;
  height: 26px;
  background: rgba(0, 136, 204, 0.15);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--md-accent);
  flex-shrink: 0;
}

.option-text {
  flex: 1;
}

.option-icon {
  font-size: 18px;
  font-weight: 700;
}

/* 反馈卡片 */
.feedback-card {
  border-radius: 16px;
  padding: 16px;
  margin-top: 4px;
}

.feedback-card.correct {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border: 1.5px solid #28a745;
}

.feedback-card.wrong {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border: 1.5px solid #dc3545;
}

.feedback-icon {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.feedback-card.correct .feedback-icon { color: #28a745; }
.feedback-card.wrong .feedback-icon { color: #dc3545; }

.feedback-song {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.feedback-album {
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
}

.feedback-lyric {
  font-size: 13px;
  color: #555;
}

.feedback-label {
  font-weight: 600;
}

.feedback-song-name {
  color: var(--md-accent);
}

.feedback-lyric-text {
  font-style: italic;
  color: #333;
}

/* 动画 */
.feedback-enter-active {
  animation: feedbackIn 0.3s ease;
}

@keyframes feedbackIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add frontend/src/pages/EarQuizPage.vue
git commit -m "feat: add EarQuizPage.vue for ear lyric quiz"
```

---

## Task 6: 空耳结果页

**Files:**
- Create: `frontend/src/pages/EarResultPage.vue`

- [ ] **Step 1: 创建空耳结果页**

```vue
<template>
  <div class="ear-result">
    <div class="ear-result-bg" aria-hidden="true" />

    <div v-if="loading" class="loading-state">
      <p>加载中...</p>
    </div>

    <div v-else class="ear-result-content">

      <!-- 等级称号卡片 -->
      <section class="grade-card">
        <div class="grade-header">
          <span class="grade-badge">🎤 空耳猜歌</span>
          <span class="grade-title">空耳实力测试</span>
        </div>

        <div class="grade-score">
          <span class="score-num">{{ result.score }}</span>
          <span class="score-divider">/</span>
          <span class="score-total">{{ result.questions.length }}</span>
          <span class="score-label">题答对</span>
        </div>

        <div class="grade-title-big">{{ result.grade.title }}</div>
        <div class="grade-desc">{{ result.grade.desc }}</div>

        <div class="grade-actions">
          <button class="btn btn-primary" @click="restartTest">再测一次</button>
          <button class="btn btn-ghost" @click="goHome">回首页</button>
        </div>
      </section>

      <!-- 详细解析 -->
      <section class="analysis-section">
        <div class="section-header">
          <h2 class="section-title">📝 题目解析</h2>
        </div>

        <div class="question-list">
          <div
            v-for="(q, i) in result.questions"
            :key="i"
            class="question-item"
            :class="q.correct ? 'correct' : 'wrong'"
          >
            <div class="item-header">
              <span class="item-index">第{{ i + 1 }}题</span>
              <span class="item-result">{{ q.correct ? '✓ 答对' : '✗ 答错' }}</span>
            </div>
            <div class="item-ear">{{ q.earLyric }}</div>
            <div class="item-answer">
              <span class="item-answer-label">正确答案：</span>
              <span class="item-song">《{{ q.correctAnswer.song }}》</span>
              <span class="item-album">· {{ q.correctAnswer.album }}</span>
            </div>
            <div class="item-lyric">
              <span class="item-answer-label">原歌词：</span>
              <span class="item-lyric-text">"{{ q.correctAnswer.originalLyric }}"</span>
            </div>
          </div>
        </div>
      </section>

      <!-- WMLS 导流卡片 -->
      <section class="promo-card" @click="goWmls">
        <div class="promo-icon">🥕</div>
        <div class="promo-text">
          <div class="promo-title">还没玩够？来测测你的人设！</div>
          <div class="promo-sub">《WMLS 五迷人设测试》16道题 →</div>
        </div>
        <div class="promo-arrow">›</div>
      </section>

      <p class="disclaimer-bottom">趣味测试 仅供娱乐</p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiUrl, track } from '../api'

const router = useRouter()
const route = useRoute()

const result = ref({
  score: 0,
  grade: { title: '', desc: '' },
  questions: [],
})
const loading = ref(true)

onMounted(async () => {
  try {
    const { id } = route.params
    const response = await fetch(apiUrl(`/api/ear/results/${id}`))
    if (!response.ok) throw new Error('Result not found')
    result.value = await response.json()
  } catch (e) {
    console.error('Failed to load result:', e)
    result.value = { score: 0, grade: { title: '', desc: '' }, questions: [] }
  } finally {
    loading.value = false
  }
  track('page_view', { url_path: '/ear-result', quiz_type: 'ear' })
})

const restartTest = () => {
  router.push('/ear-quiz')
}

const goHome = () => {
  router.push('/')
}

const goWmls = () => {
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

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: var(--md-blue-700);
  font-size: 16px;
}

.ear-result-content {
  max-width: 480px;
  margin: 0 auto;
}

/* 等级卡片 */
.grade-card {
  background: linear-gradient(160deg, #ffffff 0%, #e8f5ff 60%, #dbeeff 100%);
  border-radius: 20px;
  padding: 24px 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 87, 174, 0.15);
  text-align: center;
}

.grade-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.grade-badge {
  background: linear-gradient(135deg, #00a8e8, #0077b5);
  color: white;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 5px 12px;
  border-radius: 8px;
}

.grade-title {
  font-size: 14px;
  font-weight: 600;
  color: #4a6fa5;
}

.grade-score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 12px;
}

.score-num {
  font-size: 52px;
  font-weight: 900;
  color: var(--md-accent);
  line-height: 1;
}

.score-divider {
  font-size: 32px;
  font-weight: 300;
  color: var(--md-blue-400);
}

.score-total {
  font-size: 28px;
  font-weight: 700;
  color: var(--md-blue-400);
}

.score-label {
  font-size: 14px;
  color: var(--md-blue-500);
  margin-left: 4px;
}

.grade-title-big {
  font-size: 26px;
  font-weight: 900;
  color: var(--md-blue-900);
  margin-bottom: 8px;
}

.grade-desc {
  font-size: 14px;
  color: var(--md-blue-700);
  line-height: 1.6;
  margin-bottom: 20px;
}

.grade-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 136, 204, 0.12);
}

/* 解析区域 */
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

.question-item {
  border-radius: 12px;
  padding: 14px;
  border: 1.5px solid;
}

.question-item.correct {
  background: #f0fff4;
  border-color: #28a745;
}

.question-item.wrong {
  background: #fff5f5;
  border-color: #dc3545;
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.item-index {
  font-size: 12px;
  font-weight: 700;
  color: var(--md-blue-600);
}

.item-result {
  font-size: 12px;
  font-weight: 700;
}

.question-item.correct .item-result { color: #28a745; }
.question-item.wrong .item-result { color: #dc3545; }

.item-ear {
  font-size: 14px;
  font-weight: 700;
  color: var(--md-blue-900);
  margin-bottom: 6px;
  font-style: italic;
}

.item-answer {
  font-size: 13px;
  color: #555;
  margin-bottom: 4px;
}

.item-song {
  font-weight: 700;
  color: var(--md-accent);
}

.item-album {
  color: #888;
}

.item-lyric {
  font-size: 12px;
  color: #888;
}

.item-lyric-text {
  font-style: italic;
}

/* 导流卡片 */
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

/* 底部 */
.disclaimer-bottom {
  margin: 16px 0;
  font-size: 11px;
  color: var(--md-text-on-blue-muted);
  text-align: center;
}

/* 按钮 */
.btn {
  padding: 12px 28px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, var(--md-accent-bright), var(--md-blue-500));
  color: white;
  box-shadow: 0 4px 16px rgba(0, 170, 232, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
}

.btn-ghost {
  background: white;
  color: var(--md-blue-600);
  border: 1.5px solid var(--md-blue-300);
}

.btn-ghost:hover {
  background: var(--md-blue-50);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add frontend/src/pages/EarResultPage.vue
git commit -m "feat: add EarResultPage.vue for ear quiz result display"
```

---

## Task 7: 注册前端路由

**Files:**
- Modify: `frontend/src/router/index.js`

- [ ] **Step 1: 添加路由**

在 import 和 routes 中添加空耳相关路由：

```javascript
import EarQuizPage from '../pages/EarQuizPage.vue'
import EarResultPage from '../pages/EarResultPage.vue'

const routes = [
  // ... 现有路由保持不变 ...
  {
    path: '/ear-quiz',
    name: 'ear-quiz',
    component: EarQuizPage
  },
  {
    path: '/ear-result/:id',
    name: 'ear-result',
    component: EarResultPage
  }
]
```

- [ ] **Step 2: 提交**

```bash
git add frontend/src/router/index.js
git commit -m "feat: add /ear-quiz and /ear-result routes"
```

---

## Task 8: 首页添加空耳测试入口

**Files:**
- Modify: `frontend/src/pages/HomePage.vue`

- [ ] **Step 1: 在 `start-btn` 按钮下方添加空耳入口卡片**

在 `<button class="start-btn" @click="startTest">` 下方、`cached-result` 上方添加：

```vue
      <!-- 空耳测试入口卡片 -->
      <div class="ear-entry-card" @click="startEarTest">
        <div class="ear-entry-icon">🎤</div>
        <div class="ear-entry-text">
          <div class="ear-entry-title">空耳猜歌</div>
          <div class="ear-entry-desc">10道空耳歌词，测测你是不是真正的五迷听力王！</div>
        </div>
        <div class="ear-entry-arrow">›</div>
      </div>
```

- [ ] **Step 2: 添加跳转方法**

在 `startTest` 下方添加：

```javascript
const startEarTest = () => {
  track('quiz_start', { quiz_type: 'ear' })
  router.push('/ear-quiz')
}
```

- [ ] **Step 3: 添加空耳入口卡片样式**

在 `.footer` 样式后添加：

```css
/* 空耳测试入口卡片 */
.ear-entry-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 16px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(5, 26, 46, 0.1);
  border: 1.5px solid rgba(0, 136, 204, 0.18);
  transition: transform 0.15s, box-shadow 0.15s;
  width: 100%;
  max-width: 380px;
  box-sizing: border-box;
}

.ear-entry-card:active {
  transform: scale(0.98);
}

.ear-entry-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.ear-entry-text {
  flex: 1;
  text-align: left;
}

.ear-entry-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--md-blue-900);
  margin-bottom: 3px;
}

.ear-entry-desc {
  font-size: 12px;
  color: var(--md-blue-600);
  line-height: 1.4;
}

.ear-entry-arrow {
  font-size: 22px;
  color: var(--md-blue-400);
  font-weight: 300;
  flex-shrink: 0;
}
```

- [ ] **Step 4: 提交**

```bash
git add frontend/src/pages/HomePage.vue
git commit -m "feat: add ear quiz entry card to homepage"
```

---

## Task 9: WMLS 结果页添加空耳导流卡片

**Files:**
- Modify: `frontend/src/pages/ResultPage.vue`

- [ ] **Step 1: 在 `disclaimer-bottom` 前添加空耳导流卡片**

在 `<p class="disclaimer-bottom">` 前添加：

```vue
    <!-- 空耳测试导流卡片 -->
    <section class="promo-card" @click="goEarQuiz">
      <div class="promo-icon">🎤</div>
      <div class="promo-text">
        <div class="promo-title">还没玩够？再来测测你的空耳实力！</div>
        <div class="promo-sub">《空耳猜歌测试》10道题 →</div>
      </div>
      <div class="promo-arrow">›</div>
    </section>
```

- [ ] **Step 2: 添加跳转方法**

在 `restartTest` 方法下方添加：

```javascript
const goEarQuiz = () => {
  router.push('/ear-quiz')
}
```

- [ ] **Step 3: 添加导流卡片样式**

在 `.disclaimer-bottom` 样式后添加：

```css
/* 空耳导流卡片 */
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
```

- [ ] **Step 4: 提交**

```bash
git add frontend/src/pages/ResultPage.vue
git commit -m "feat: add ear quiz cross-promotion card to WMLS result page"
```

---

## Task 10: 测试验证

- [ ] **Step 1: 重启后端**

```bash
# kill 并重启 backend
```

- [ ] **Step 2: 验证 API**

```bash
curl http://localhost:3000/api/ear/questions | head -c 500
curl -X POST http://localhost:3000/api/ear/results/submit \
  -H "Content-Type: application/json" \
  -d '{"answers":[0,0,0,0,0,0,0,0,0,0]}'
```

- [ ] **Step 3: 启动前端并测试**

访问 `http://localhost:5173/wmti/` 验证首页入口、答题流程、结果页及导流卡片。

---

**Plan complete.** Saved to `docs/superpowers/plans/2026-04-18-mayday-ear-test.md`.
