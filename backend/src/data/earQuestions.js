/**
 * 五月天空耳歌词猜歌题
 *
 * 14道精选空耳歌词题目，测试用户对五月天歌词的熟悉程度。
 * 每道题展示空耳歌词（空耳效果），用户需从四个选项中选出对应的歌曲名。
 *
 * 空耳：一种文字游戏，用谐音或相似发音的汉字来"翻译"外语或方言歌词。
 */

const earQuestions = [
  {
    id: 1,
    earLyric: '难道我又我又住院了',
    options: [
      { key: 'A', content: '倔强', correct: false },
      { key: 'B', content: '我又初恋了', correct: true },
      { key: 'C', content: '恋爱ing', correct: false },
      { key: 'D', content: '离开地球表面', correct: false }
    ],
    correctAnswer: {
      song: '我又初恋了',
      album: '为爱而生',
      originalLyric: '难道我又我又初恋了',
      earReason: '谐音：「初恋」听起来像「住院」'
    }
  },
  {
    id: 2,
    earLyric: '为什么失去了还要背乘法呢',
    options: [
      { key: 'A', content: '后青春的诗', correct: false },
      { key: 'B', content: '你不是真正的快乐', correct: true },
      { key: 'C', content: '你不是真正的学渣', correct: true },
      { key: 'D', content: '人生海海', correct: false }
    ],
    correctAnswer: {
      song: '你不是真正的快乐',
      album: '后青春期的诗',
      originalLyric: '为什么失去了还要被惩罚呢',
      earReason: '谐音：「被惩罚」→「背乘法」'
    }
  },
  {
    id: 3,
    earLyric: '这是全天下最完蛋的阵容',
    options: [
      { key: 'A', content: '干杯', correct: false },
      { key: 'B', content: '倔强', correct: false },
      { key: 'C', content: '透露', correct: true },
      { key: 'D', content: '爱情万岁', correct: false }
    ],
    correctAnswer: {
      song: '透露',
      album: '第一张创作专辑',
      originalLyric: '这是全天下最完美的阵容',
      earReason: '谐音：「完美」→「完蛋」（而且意思刚好相反！）'
    }
  },
  {
    id: 4,
    earLyric: '我的手越肮脏，眼神越是放荡',
    options: [
      { key: 'A', content: '盛夏光年', correct: false },
      { key: 'B', content: '任意门', correct: false },
      { key: 'C', content: '顽固', correct: false },
      { key: 'D', content: '倔强', correct: true }
    ],
    correctAnswer: {
      song: '倔强',
      album: '神的孩子都在跳舞',
      originalLyric: '我的手越肮脏，眼神越是放荡',
      earReason: '闽南语发音：「放荡」(pàng-tōng) 听起来像「发光」(pàng-kuāng)'
    }
  },
  {
    id: 5,
    earLyric: '不要叫我瘪三不要再看我称鸡蛋',
    options: [
      { key: 'A', content: '诺亚方舟', correct: false },
      { key: 'B', content: '离开地球表面', correct: false },
      { key: 'C', content: '盛夏光年', correct: false },
      { key: 'D', content: '春天的呐喊', correct: true }
    ],
    correctAnswer: {
      song: '春天的呐喊',
      album: '后青春期的诗',
      originalLyric: '不要叫我比赛不要再看我成绩单',
      earReason: '咬字不清+连读：「比赛」→「瘪三」，「成绩单」→「称鸡蛋」'
    }
  },
  {
    id: 6,
    earLyric: '用最小回忆对峙宇宙',
    options: [
      { key: 'A', content: '星空', correct: false },
      { key: 'B', content: '顽固', correct: false },
      { key: 'C', content: '因为你所以我', correct: true },
      { key: 'D', content: '后青春的诗', correct: false }
    ],
    correctAnswer: {
      song: '因为你所以我',
      album: '2020单曲',
      originalLyric: '用最小回忆堆成宇宙',
      earReason: '谐音：「堆成」→「对峙」'
    }
  },
  {
    id: 7,
    earLyric: '走过的叫风景走不到脚抽筋',
    options: [
      { key: 'A', content: '倔强', correct: false },
      { key: 'B', content: '干杯', correct: false },
      { key: 'C', content: '憨人', correct: false },
      { key: 'D', content: '顽固', correct: true }
    ],
    correctAnswer: {
      song: '顽固',
      album: '自传',
      originalLyric: '走过的叫足迹走不到叫憧憬',
      earReason: '连读+谐音：「足迹」→「风景」，「憧憬」→「脚抽筋」'
    }
  },
  {
    id: 8,
    earLyric: '我和我最后的绝望',
    options: [
      { key: 'A', content: '倔强', correct: true },
      { key: 'B', content: '成名在望', correct: false },
      { key: 'C', content: '顽固', correct: false },
      { key: 'D', content: '盛夏光年', correct: false }
    ],
    correctAnswer: {
      song: '倔强',
      album: '神的孩子都在跳舞',
      originalLyric: '我和我最后的倔强',
      earReason: '谐音：「倔强」→「绝望」（发音相似但意思完全相反！）'
    }
  },
  {
    id: 9,
    earLyric: '每次单身我都要与你相遇',
    options: [
      { key: 'A', content: '恋爱ing', correct: false },
      { key: 'B', content: '最重要的小事', correct: false },
      { key: 'C', content: '我不愿让你一个人', correct: false },
      { key: 'D', content: '一千个世纪', correct: true }
    ],
    correctAnswer: {
      song: '一千个世纪',
      album: '为爱而生',
      originalLyric: '每次诞生我都要与你相遇',
      earReason: '谐音：「诞生」→「单身」'
    }
  },
  {
    id: 10,
    earLyric: '我们都哎呀呀呀白了头',
    options: [
      { key: 'A', content: '倔强', correct: false },
      { key: 'B', content: '什么歌', correct: true },
      { key: 'C', content: '后青春的诗', correct: false },
      { key: 'D', content: '干杯', correct: false }
    ],
    correctAnswer: {
      song: '什么歌',
      album: '捉妖记2主题曲',
      originalLyric: '我们都哎呀呀呀白了头',
      earReason: '这句本来就是原歌词，歌名就是《什么歌》，属于自我空耳'
    }
  },
  {
    id: 11,
    earLyric: '要不要麦当劳别人帮你决定好',
    options: [
      { key: 'A', content: '派对动物', correct: false },
      { key: 'B', content: '恋爱ing', correct: false },
      { key: 'C', content: 'DNA', correct: true },
      { key: 'D', content: '离开地球表面', correct: false }
    ],
    correctAnswer: {
      song: 'DNA',
      album: 'DNA巡演主题曲',
      originalLyric: '要不要难道要别人帮你决定好',
      earReason: '连读：「难道要」→「麦当劳」（快读连起来很像）'
    }
  },
  {
    id: 12,
    earLyric: '丢这个丢那个的',
    options: [
      { key: 'A', content: '派对动物', correct: false },
      { key: 'B', content: '倔强', correct: false },
      { key: 'C', content: '任意门', correct: false },
      { key: 'D', content: '离开地球表面', correct: true }
    ],
    correctAnswer: {
      song: '离开地球表面',
      album: '神的孩子都在跳舞',
      originalLyric: '丢电脑丢外套丢手表...',
      earReason: '省略+连读：原歌词是「丢电脑丢外套丢手表」，空耳版简化了'
    }
  },
  {
    id: 13,
    earLyric: '黎明之前只要和你等待黎明',
    options: [
      { key: 'A', content: '最重要的小事', correct: false },
      { key: 'B', content: '志明与春娇', correct: false },
      { key: 'C', content: '温柔', correct: false },
      { key: 'D', content: '爱情万岁', correct: true }
    ],
    correctAnswer: {
      song: '爱情万岁',
      album: '爱情万岁',
      originalLyric: '黎明之前只要和你尽情嬉戏',
      earReason: '谐音：「尽情嬉戏」→「等待黎明」'
    }
  },
  {
    id: 14,
    earLyric: '一生能有几次跟世界撞衫',
    options: [
      { key: 'A', content: '倔强', correct: false },
      { key: 'B', content: '离开地球表面', correct: false },
      { key: 'C', content: '盛夏光年', correct: false },
      { key: 'D', content: '春天的呐喊', correct: true }
    ],
    correctAnswer: {
      song: '春天的呐喊',
      album: '后青春期的诗',
      originalLyric: '一生能有几次 跟世界撞衫',
      earReason: '闽南语发音：「撞衫」在闽南语中听起来像别的词'
    }
  }
];

module.exports = earQuestions;
