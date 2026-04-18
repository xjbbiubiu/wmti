const express = require('express');
const router = express.Router();
const allQuestions = require('../data/earQuestions');

const REQUIRED_QUESTION_IDS = [2, 3, 7];
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
    }
  }));
  res.json(sanitizedQuestions);
});

module.exports = router;
