const express = require('express');
const router = express.Router();
const shuffledQuestions = require('../data/earQuestions');

// GET /api/ear/questions
// 返回10道题，sanitized（不含 correct 字段，防止泄露答案）
router.get('/', (req, res) => {
  const sanitizedQuestions = shuffledQuestions.map(q => ({
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
