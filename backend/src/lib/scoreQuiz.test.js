const { test } = require('node:test');
const assert = require('assert');
const questions = require('../data/questions');
const {
  aggregateScores,
  typesFromScores,
  typeCodeFromTypes,
  percentScores,
  posterVisualForTypeCode
} = require('./scoreQuiz');

test('29 题全选 A：聚合与分型合法', () => {
  assert.strictEqual(questions.length, 29);
  const answers = Array(29).fill(0);
  const scores = aggregateScores(answers, questions);
  const t = typesFromScores(scores, 29);
  assert.ok(t.wType >= 1 && t.wType <= 3);
  const code = typeCodeFromTypes(t.wType, t.mType, t.lType);
  assert.match(code, /^W[123]M[123]L[123]$/);
  const pct = percentScores(scores, 29);
  assert.ok(pct.w >= 0 && pct.w <= 100);
  const pv = posterVisualForTypeCode(code);
  assert.ok(pv.emoji);
  assert.ok(pv.gradient.includes('linear-gradient'));
  assert.strictEqual(pv.typeCode, code);
});

test('同一 typeCode 海报视觉稳定', () => {
  const a = posterVisualForTypeCode('W2M3L1');
  const b = posterVisualForTypeCode('W2M3L1');
  assert.strictEqual(a.emoji, b.emoji);
  assert.strictEqual(a.gradient, b.gradient);
});
