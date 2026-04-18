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
      lyricsContext: `难道我又我又初恋了
不可能我又我又初恋了`,
      earReason: '谐音：「初恋」听起来像「住院」'
    }
  },
  {
    id: 2,
    earLyric: '为什么失去了还要背乘法呢',
    options: [
      { key: 'A', content: '后青春的诗', correct: false },
      { key: 'B', content: '你不是真正的快乐', correct: true },
      { key: 'C', content: '你不是真正的学渣', correct: false },
      { key: 'D', content: '人生海海', correct: false }
    ],
    correctAnswer: {
      song: '你不是真正的快乐',
      album: '后青春期的诗',
      originalLyric: '为什么失去了还要被惩罚呢',
      lyricsContext: `为什么失去了还要被惩罚呢
能不能就让悲伤全部结束在此刻
重新开始活着`,
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
      lyricsContext: `这是全天下最完美的阵容
我和你 你和我
狂飙爱意突然变得好猛
在此刻向你 完全透露`,
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
      lyricsContext: `对 爱我的人别紧张
我的固执很善良
我的手越肮脏 眼神越是发光`,
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
      lyricsContext: `不要叫我比赛 不要再看我成绩单
不要再无奈 不要再忍耐 不要再让我伤肝
天天都火腿蛋 天天都排骨鸡腿饭
我需要扭转 我需要意外 我需要感觉存在`,
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
      lyricsContext: `不再听别人说 不在乎谁能懂
只因世界再大不过你和我
用最小回忆堆成宇宙
因为你所以我爱上那片天空
天空下我在祈求那是你牵着我`,
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
      lyricsContext: `走过的叫足迹 走不到叫憧憬
学会收拾起叛逆 学会隐藏了表情
卸下了这面具 我想说谢谢你`,
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
      lyricsContext: `我就是我自己的神 在我活的地方
我和我最后的倔强
握紧双手绝对不放
下一站是不是天堂
就算失望 不能绝望`,
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
      lyricsContext: `我要和你一起走过一千个世纪
每次诞生我都要与你相遇
每次轮回都为你`,
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
      lyricsContext: `当岁月轻飘飘飘的溜走
我们都哎呀呀呀白了头
有什么留在你我的心头 那是什么`,
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
      lyricsContext: `要不要 难道要别人帮你决定好
要不要 就让自己来决定要不要`,
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
      lyricsContext: `丢电脑 丢外套 丢掉背包 再丢唠叨
丢电视 丢电脑 丢掉大脑 再丢烦恼`,
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
      lyricsContext: `别再等待不曾降临的真理
黎明之前 只要和你 尽情嬉戏`,
      earReason: '内地演唱会版本，为了过审，将原歌词中的「尽情嬉戏」改为「等待黎明」'
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
      lyricsContext: `一生能有几次 跟世界宣战
一生能有几次 终于没人管`,
      earReason: '闽南语发音：「撞衫」在闽南语中听起来像别的词'
    }
  }
];

module.exports = earQuestions;
