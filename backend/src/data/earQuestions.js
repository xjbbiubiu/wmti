/**
 * 五月天空耳歌词猜歌题
 *
 * 10道精选空耳歌词题目，测试用户对五月天歌词的熟悉程度。
 * 每道题展示空耳歌词（空耳效果），用户需从四个选项中选出对应的歌曲名。
 *
 * 空耳：一种文字游戏，用谐音或相似发音的汉字来"翻译"外语或方言歌词。
 */

/**
 * Fisher-Yates 洗牌算法，打乱数组顺序
 * @param {Array} array - 待打乱数组
 * @returns {Array} 打乱后的新数组
 */
function shuffleOptions(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const earQuestions = [
  {
    id: 1,
    earLyric: '难道我又我又住院了',
    options: [
      { key: 'A', content: '我又初恋了', correct: true },
      { key: 'B', content: '恋爱ing', correct: false },
      { key: 'C', content: '离开地球表面', correct: false },
      { key: 'D', content: '倔强', correct: false }
    ],
    correctAnswer: {
      song: '我又初恋了',
      album: '为爱而生',
      originalLyric: '难道我又我又初恋了'
    }
  },
  {
    id: 2,
    earLyric: '为什么失去了还要背乘法呢',
    options: [
      { key: 'A', content: '你不是真正的快乐', correct: true },
      { key: 'B', content: '顽固', correct: false },
      { key: 'C', content: '后青春的诗', correct: false },
      { key: 'D', content: '人生海海', correct: false }
    ],
    correctAnswer: {
      song: '你不是真正的快乐',
      album: '后青春期的诗',
      originalLyric: '为什么失去了还要被惩罚呢'
    }
  },
  {
    id: 3,
    earLyric: '这是全天下最完蛋的阵容',
    options: [
      { key: 'A', content: '爱情万岁', correct: true },
      { key: 'B', content: '人生有限公司', correct: false },
      { key: 'C', content: '倔强', correct: false },
      { key: 'D', content: '干杯', correct: false }
    ],
    correctAnswer: {
      song: '透露',
      album: '人生‧万岁',
      originalLyric: '这是全天下最完美的阵容'
    }
  },
  {
    id: 4,
    earLyric: '我的手越肮脏，眼神越是放荡',
    options: [
      { key: 'A', content: '倔强', correct: true },
      { key: 'B', content: '顽固', correct: false },
      { key: 'C', content: '盛夏光年', correct: false },
      { key: 'D', content: '任意门', correct: false }
    ],
    correctAnswer: {
      song: '倔强',
      album: '神的孩子都在跳舞',
      originalLyric: '我的手越肮脏，眼神越是放荡'
    }
  },
  {
    id: 5,
    earLyric: '不要叫我瘪三不要再看我称鸡蛋',
    options: [
      { key: 'A', content: '春天的呐喊', correct: true },
      { key: 'B', content: '诺亚方舟', correct: false },
      { key: 'C', content: '盛夏光年', correct: false },
      { key: 'D', content: '离开地球表面', correct: false }
    ],
    correctAnswer: {
      song: '春天的呐喊',
      album: '后青春期的诗',
      originalLyric: '不要叫我比赛不要再看我成绩单'
    }
  },
  {
    id: 6,
    earLyric: '任意门通向了阴乐',
    options: [
      { key: 'A', content: '任意门', correct: true },
      { key: 'B', content: '顽固', correct: false },
      { key: 'C', content: '人生有限公司', correct: false },
      { key: 'D', content: '憨人', correct: false }
    ],
    correctAnswer: {
      song: '任意门',
      album: '自传',
      originalLyric: '任意门通向了音乐'
    }
  },
  {
    id: 7,
    earLyric: '我和我最后的绝望',
    options: [
      { key: 'A', content: '倔强', correct: true },
      { key: 'B', content: '顽固', correct: false },
      { key: 'C', content: '盛夏光年', correct: false },
      { key: 'D', content: '成名在望', correct: false }
    ],
    correctAnswer: {
      song: '倔强',
      album: '神的孩子都在跳舞',
      originalLyric: '我和我最后的倔强'
    }
  },
  {
    id: 8,
    earLyric: '每次单身我都要与你相遇',
    options: [
      { key: 'A', content: '一千个世纪', correct: true },
      { key: 'B', content: '我不愿让你一个人', correct: false },
      { key: 'C', content: '最重要的小事', correct: false },
      { key: 'D', content: '恋爱ing', correct: false }
    ],
    correctAnswer: {
      song: '一千个世纪',
      album: '为爱而生',
      originalLyric: '每次诞生我都要与你相遇'
    }
  },
  {
    id: 9,
    earLyric: '要不要麦当劳别人帮你决定好',
    options: [
      { key: 'A', content: 'DNA', correct: true },
      { key: 'B', content: '离开地球表面', correct: false },
      { key: 'C', content: '恋爱ing', correct: false },
      { key: 'D', content: '派对动物', correct: false }
    ],
    correctAnswer: {
      song: 'DNA',
      album: 'DNA巡演主题曲',
      originalLyric: '要不要难道要别人帮你决定好'
    }
  },
  {
    id: 10,
    earLyric: '出事的那个公园',
    options: [
      { key: 'A', content: '诺亚方舟', correct: true },
      { key: 'B', content: '任意门', correct: false },
      { key: 'C', content: '顽固', correct: false },
      { key: 'D', content: '人生海海', correct: false }
    ],
    correctAnswer: {
      song: '诺亚方舟',
      album: '第二人生',
      originalLyric: '我们初识的那个公园'
    }
  }
];

const shuffledQuestions = earQuestions.map(q => {
  const shuffled = shuffleOptions([...q.options]);
  return {
    ...q,
    options: shuffled.map((opt, idx) => ({
      ...opt,
      key: String.fromCharCode(65 + idx)
    }))
  };
});

module.exports = shuffledQuestions;
