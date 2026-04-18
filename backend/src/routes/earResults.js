const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { trackEvent } = require('../middleware/analytics');
const shuffledQuestions = require('../data/earQuestions');

const REQUIRED_QUESTION_IDS = [2, 3, 7];
const TOTAL_QUESTIONS = 12;

const getRandomQuestions = () => {
  const required = shuffledQuestions.filter(q => REQUIRED_QUESTION_IDS.includes(q.id));
  const remaining = shuffledQuestions.filter(q => !REQUIRED_QUESTION_IDS.includes(q.id));

  const shuffled = [...remaining].sort(() => Math.random() - 0.5);
  const selected = [...required, ...shuffled.slice(0, TOTAL_QUESTIONS - required.length)];

  return selected.sort((a, b) => a.id - b.id);
};

const testQuestions = getRandomQuestions();

// 数据持久化到 data/earResults.json（参考 results.js 的模式）
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

// 等级称号映射（按答对数，12题版本）
const gradeMap = [
  { min: 12, max: 12, level: 1, title: '🎓 空耳博士', image: '/ear-posters/空耳博士.webp', desc: '阿信在你耳边唱歌你都听得出来？五迷界的天花板，怕不是耳朵里住了个阿信！建议出道当空耳评委！' },
  { min: 10, max: 11, level: 2, title: '🎤 空耳十级选手', image: '/ear-posters/空耳十级选手.webp', desc: '听力满分的你，确定不是戴着耳机睡觉的？五月天的发音在你这里全是送分题，可以开班收徒了！' },
  { min: 8, max: 9, level: 3, title: '🎧 空耳八级选手', image: '/ear-posters/空耳八级选手.webp', desc: '差一点就封神了！就差那么一两题，是时候把歌单循环模式改成永久了！' },
  { min: 6, max: 7, level: 4, title: '🎶 空耳六级选手', image: '/ear-posters/空耳六级选手.webp', desc: '不错不错！听感还需要多练练，快去把五月天歌单循环起来，下一个空耳大师就是你！' },
  { min: 4, max: 5, level: 5, title: '🔉 空耳四级选手', image: '/ear-posters/空耳四级选手.webp', desc: '有潜力哦！歌单听得还不够多，赶紧去补课！相信我，五月天的歌值得你反复听！' },
  { min: 0, max: 3, level: 6, title: '🤷 空耳小白', image: '/ear-posters/空耳小白.webp', desc: '没关系，谁不是从听不懂开始的呢！多做几遍你也能成为空耳大师！' },
];

const getGrade = (score) => {
  return gradeMap.find(g => score >= g.min && score <= g.max) || gradeMap[gradeMap.length - 1];
};

// POST /submit
router.post('/submit', (req, res) => {
  const { answers, questionIds } = req.body;
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid answers format' });
  }

  const questionMap = new Map(shuffledQuestions.map(q => [q.id, q]));
  const userQuestions = (questionIds || [])
    .map(id => questionMap.get(id))
    .filter(Boolean);

  const questionCount = userQuestions.length || testQuestions.length;
  if (answers.length !== questionCount) {
    return res.status(400).json({ error: 'Invalid answers format' });
  }

  const questionsToUse = userQuestions.length > 0 ? userQuestions : testQuestions;

  // 构建每题详情
  const questionDetails = answers.map((selectedIndex, i) => {
    const q = questionsToUse[i];
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

  const score = questionDetails.filter(q => q.correct).length;
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

  // 异步埋点，不阻塞响应
  trackEvent({
    event_type: 'result_submitted',
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim()
      || req.headers['x-real-ip']
      || req.ip
      || '',
    user_agent: req.headers['user-agent'] || '',
    quiz_type: 'ear',
    quiz_type_code: grade.title,  // 如 "🎓 空耳博士"
  });

  res.json({ id: resultId, score, grade, questions: questionDetails });
});

// GET /stats
router.get('/stats', (req, res) => {
  const totalSubmissions = resultsStorage.size;
  res.json({ totalSubmissions });
});

// GET /questions - 获取随机12道题（包含必出题）
router.get('/questions', (req, res) => {
  const questions = getRandomQuestions();
  const simplified = questions.map(q => ({
    id: q.id,
    earLyric: q.earLyric,
    options: q.options.map(o => ({ key: o.key, content: o.content }))
  }));
  res.json(simplified);
});

// GET /:id
router.get('/:id', (req, res) => {
  const result = resultsStorage.get(req.params.id);
  if (!result) return res.status(404).json({ error: 'Result not found' });
  res.json(result);
});

module.exports = router;
