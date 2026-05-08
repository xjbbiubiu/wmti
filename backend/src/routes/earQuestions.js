const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const allQuestions = require('../data/earQuestions');

const REQUIRED_QUESTION_IDS = [2, 3, 7];

function getImageUrl(questionId) {
  const cardsDir = path.join(__dirname, '..', '..', 'public', 'cards');
  try {
    const files = fs.readdirSync(cardsDir).filter(f => f.startsWith(`${questionId}_`) && f.endsWith('_mobile.webp'));
    return files.length > 0 ? `/cards/${files[0]}` : null;
  } catch {
    return null;
  }
}
const TOTAL_QUESTIONS = 12;

// 返回12道随机题：3道必出 + 9道随机，sanitized（含 correct 字段，前端展示用）
router.get('/', (req, res) => {
  const required = allQuestions.filter(q => REQUIRED_QUESTION_IDS.includes(q.id));
  const remaining = allQuestions.filter(q => !REQUIRED_QUESTION_IDS.includes(q.id));
  const shuffled = [...remaining].sort(() => Math.random() - 0.5);
  const selected = [...required, ...shuffled.slice(0, TOTAL_QUESTIONS - required.length)];
  const questions = selected.sort((a, b) => a.id - b.id);

  const sanitizedQuestions = questions.map(q => ({
    id: q.id,
    earLyric: q.earLyric,
    options: q.options.map(opt => ({
      key: opt.key,
      content: opt.content,
      correct: opt.correct,
    })),
    correctAnswer: {
      song: q.correctAnswer.song,
      album: q.correctAnswer.album,
      originalLyric: q.correctAnswer.originalLyric,
      lyricsContext: q.correctAnswer.lyricsContext,
      earReason: q.correctAnswer.earReason,
    },
    imageUrl: getImageUrl(q.id)
  }));
  res.json(sanitizedQuestions);
});

// 返回指定ID的题目（用于卡片扫码页）
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const question = allQuestions.find(q => q.id === id);
  if (!question) {
    return res.status(404).json({ error: '题目不存在' });
  }
  res.json({
    id: question.id,
    earLyric: question.earLyric,
    correctAnswer: {
      song: question.correctAnswer.song,
      album: question.correctAnswer.album,
      originalLyric: question.correctAnswer.originalLyric,
      lyricsContext: question.correctAnswer.lyricsContext,
      earReason: question.correctAnswer.earReason,
    },
    imageUrl: getImageUrl(question.id)
  });
});

module.exports = router;
