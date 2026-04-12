/**
 * Pure scoring helpers for WMLS-style quiz (29 questions, 4 dimensions).
 * 每维度满分：W=24 M=24 L=21 S=18
 * Thresholds: type1≥16(高)  type2≥8(中)  type3<8(低)
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

function typeFromDimensionSum(sum) {
  if (sum >= 16) return 1;  // 高
  if (sum >= 8)  return 2;  // 中
  return 3;                  // 低
}

function typesFromScores(scores) {
  return {
    wType: typeFromDimensionSum(scores.w),
    mType: typeFromDimensionSum(scores.m),
    lType: typeFromDimensionSum(scores.l),
    sType: typeFromDimensionSum(scores.s)
  };
}

function typeCodeFromTypes(wType, mType, lType) {
  return `W${wType}M${mType}L${lType}`;
}

function percentScores(scores) {
  const maxByDim = { w: 24, m: 24, l: 21, s: 18 };
  return {
    w: Math.round((scores.w / maxByDim.w) * 100),
    m: Math.round((scores.m / maxByDim.m) * 100),
    l: Math.round((scores.l / maxByDim.l) * 100),
    s: Math.round((scores.s / maxByDim.s) * 100)
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
  'W2M2L3': '清醒生活派',
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
  const imageUrl = `/posters/${tagline}.webp`;

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
