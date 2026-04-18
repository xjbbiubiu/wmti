const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const shuffledQuestions = require('../data/earQuestions');

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

// 等级称号映射（按答对数）
const gradeMap = [
  { min: 10, max: 10, level: 1, title: '🎓 空耳博士', desc: '真正的五迷听力专家，五月天在你耳边说话你都听得懂！' },
  { min: 8, max: 9, level: 2, title: '🎤 空耳十级选手', desc: '听歌听得懂但偶尔走神，真粉无疑！' },
  { min: 6, max: 7, level: 3, title: '🎧 空耳八级选手', desc: '大部分能猜到，但还差一点，继续修炼！' },
  { min: 4, max: 5, level: 4, title: '🎶 空耳六级选手', desc: '有点东西，但还不够，多听几遍吧！' },
  { min: 2, max: 3, level: 5, title: '🔉 空耳四级选手', desc: '五月天在喊你多听几遍！' },
  { min: 0, max: 1, level: 6, title: '🤷 空耳小白', desc: '欢迎来到五迷世界，从头来过！' },
];

const getGrade = (score) => {
  return gradeMap.find(g => score >= g.min && score <= g.max) || gradeMap[gradeMap.length - 1];
};

// POST /submit
router.post('/submit', (req, res) => {
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers) || answers.length !== shuffledQuestions.length) {
    return res.status(400).json({ error: 'Invalid answers format' });
  }

  // 构建每题详情
  const questionDetails = answers.map((selectedIndex, i) => {
    const q = shuffledQuestions[i];
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

  // 只返回 ID，前端拿ID后请求详情
  res.json({ id: resultId });
});

// GET /:id
router.get('/:id', (req, res) => {
  const result = resultsStorage.get(req.params.id);
  if (!result) return res.status(404).json({ error: 'Result not found' });
  res.json(result);
});

module.exports = router;
