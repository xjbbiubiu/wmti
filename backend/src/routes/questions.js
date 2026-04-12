const express = require('express');
const router = express.Router();
const questions = require('../data/questions');

router.get('/', (req, res) => {
  const sanitizedQuestions = questions.map(q => ({
    id: q.id,
    content: q.content,
    options: q.options.map(opt => ({
      key: opt.key,
      content: opt.content
    }))
  }));
  res.json(sanitizedQuestions);
});

router.get('/:id', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json(question);
});

module.exports = router;
