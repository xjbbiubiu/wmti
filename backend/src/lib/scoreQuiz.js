/**
 * Pure scoring helpers for WMLS-style quiz (29 questions, 4 dimensions).
 * Thresholds match routes/results.js: type 1 if sum >= 2*n, else 2 if >= 1*n, else 3.
 */

function aggregateScores(answers, questions) {
  const scores = { w: 0, m: 0, l: 0, s: 0 };
  answers.forEach((answerIndex, questionIndex) => {
    const question = questions[questionIndex];
    if (question && question.options[answerIndex]) {
      const o = question.options[answerIndex].scores || {};
      scores.w += o.w || 0;
      scores.m += o.m || 0;
      scores.l += o.l || 0;
      scores.s += o.s || 0;
    }
  });
  return scores;
}

function typeFromDimensionSum(sum, totalQuestions) {
  if (sum >= totalQuestions * 2) return 1;
  if (sum >= totalQuestions * 1) return 2;
  return 3;
}

function typesFromScores(scores, totalQuestions) {
  return {
    wType: typeFromDimensionSum(scores.w, totalQuestions),
    mType: typeFromDimensionSum(scores.m, totalQuestions),
    lType: typeFromDimensionSum(scores.l, totalQuestions),
    sType: typeFromDimensionSum(scores.s, totalQuestions)
  };
}

function typeCodeFromTypes(wType, mType, lType) {
  return `W${wType}M${mType}L${lType}`;
}

function percentScores(scores, totalQuestions) {
  const max = totalQuestions * 3;
  if (max <= 0) {
    return { w: 0, m: 0, l: 0, s: 0 };
  }
  return {
    w: Math.round((scores.w / max) * 100),
    m: Math.round((scores.m / max) * 100),
    l: Math.round((scores.l / max) * 100),
    s: Math.round((scores.s / max) * 100)
  };
}

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const POSTER_TAGLINES = {
  'W1M1L1': '倔强追梦人',
  'W1M1L2': '孤勇追梦人',
  'W1M1L3': '双重战士',
  'W1M2L1': '务实梦想家',
  'W1M2L2': '搞钱理想派',
  'W1M2L3': '靠谱人生玩家',
  'W1M3L1': '苦中作乐达人',
  'W1M3L2': '享乐打工人',
  'W1M3L3': '温暖担当',
  'W2M1L1': '摸鱼艺术家',
  'W2M1L2': '省钱追梦人',
  'W2M1L3': '爱情守护者',
  'W2M2L1': '不屈奋斗者',
  'W2M2L2': '不平庸五迷',
  'W2M3L1': '佛系矛盾体',
  'W2M3L2': '演唱会爱好者',
  'W2M3L3': '阳光陪伴使者',
  'W3M1L1': '嘴上躺平族',
  'W3M1L2': '精神支柱型',
  'W3M1L3': '省钱真粉',
  'W3M2L1': '清醒享乐派',
  'W3M2L2': '快乐五迷',
  'W3M2L3': '平衡大师',
  'W3M3L1': '闷声嗨派',
  'W3M3L2': '存钱演唱会达人',
  'W3M3L3': '快乐哲学家'
};

/**
 * Stable poster visual per W*M*L combination (share/screenshot friendly).
 * Returns image URL if available, otherwise falls back to emoji with gradient.
 */
function posterVisualForTypeCode(typeCode) {
  const h = hashString(typeCode);
  const tagline = POSTER_TAGLINES[typeCode] || '今天也要好好生活';
  const imageUrl = `/posters/${tagline}.png`;

  return {
    tagline,
    imageUrl,
    typeCode
  };
}

module.exports = {
  aggregateScores,
  typesFromScores,
  typeCodeFromTypes,
  percentScores,
  posterVisualForTypeCode,
  typeFromDimensionSum,
  POSTER_TAGLINES
};
