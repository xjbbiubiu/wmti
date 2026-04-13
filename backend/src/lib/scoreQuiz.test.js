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

test('16 题全选 A：聚合与分型合法', () => {
  assert.strictEqual(questions.length, 16);
  const answers = Array(16).fill(0);
  const scores = aggregateScores(answers, questions);
  const t = typesFromScores(scores);
  assert.ok(t.wType >= 1 && t.wType <= 3);
  const code = typeCodeFromTypes(t.wType, t.mType, t.lType);
  assert.match(code, /^W[123]M[123]L[123]$/);
  const pct = percentScores(scores);
  assert.ok(pct.w >= 0 && pct.w <= 100);
  const pv = posterVisualForTypeCode(code);
  assert.ok(pv.tagline);
  assert.strictEqual(pv.typeCode, code);
});

test('同一 typeCode 海报视觉稳定', () => {
  const a = posterVisualForTypeCode('W2M3L1');
  const b = posterVisualForTypeCode('W2M3L1');
  assert.strictEqual(a.emoji, b.emoji);
  assert.strictEqual(a.gradient, b.gradient);
});
