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
  },
  {
    id: 15,
    earLyric: '狂飙阿姨突然变得好猛 噢噢噢噢~',
    options: [
      { key: 'A', content: '透露', correct: true },
      { key: 'B', content: '恋爱ing', correct: false },
      { key: 'C', content: '派对动物', correct: false },
      { key: 'D', content: '离开地球表面', correct: false }
    ],
    correctAnswer: {
      song: '透露',
      album: '第一张创作专辑',
      originalLyric: '狂飙爱意突然变得好猛 噢噢噢噢~',
      lyricsContext: `这是全天下最完美的阵容
我和你 你和我
狂飙爱意突然变得好猛
在此刻向你 完全透露`,
      earReason: '谐音：「爱意」→「阿姨」'
    }
  },
  {
    id: 16,
    earLyric: '再见 我们出事的那个公园',
    options: [
      { key: 'A', content: '诺亚方舟', correct: true },
      { key: 'B', content: '人生海海', correct: false },
      { key: 'C', content: '任意门', correct: false },
      { key: 'D', content: '憨人', correct: false }
    ],
    correctAnswer: {
      song: '诺亚方舟',
      album: '第二人生',
      originalLyric: '再见 我们初识的那个公园',
      lyricsContext: `再见 草莓甜甜圈
街角咖啡店 落下雨点
再见 我们初识的那个公园`,
      earReason: '谐音：「初识」→「出事」'
    }
  },
  {
    id: 17,
    earLyric: '昨天太近，明天太原',
    options: [
      { key: 'A', content: '拥抱', correct: true },
      { key: 'B', content: '温柔', correct: false },
      { key: 'C', content: '恋爱ing', correct: false },
      { key: 'D', content: '垃圾车', correct: false }
    ],
    correctAnswer: {
      song: '拥抱',
      album: '第一张创作专辑',
      originalLyric: '昨天太近 明天太远',
      lyricsContext: `昨天太近 明天太远
默默聆听那黑夜`,
      earReason: '谐音：「太远」→「太原」'
    }
  },
  {
    id: 18,
    earLyric: '你就是太阳，绽放了膀胱',
    options: [
      { key: 'A', content: '小太阳', correct: true },
      { key: 'B', content: '倔强', correct: false },
      { key: 'C', content: '派对动物', correct: false },
      { key: 'D', content: '离开地球表面', correct: false }
    ],
    correctAnswer: {
      song: '小太阳',
      album: '小太阳单曲',
      originalLyric: '你就是太阳 蒸发了彷徨',
      lyricsContext: `你就是太阳 蒸发了彷徨
所以挖开土壤 种下希望`,
      earReason: '谐音恶搞：「蒸发了彷徨」→「绽放了膀胱」（粉丝圈经典空耳梗）'
    }
  },
  {
    id: 19,
    earLyric: '你听到闹钟声 你推开了包拯',
    options: [
      { key: 'A', content: '派对动物', correct: false },
      { key: 'B', content: '第二人生', correct: true },
      { key: 'C', content: '倔强', correct: false },
      { key: 'D', content: '离开地球表面', correct: false }
    ],
    correctAnswer: {
      song: '第二人生',
      album: '第二人生',
      originalLyric: '你听到闹钟声 你推开了抱枕',
      lyricsContext: `你听到闹钟声 你推开了抱枕
你醒在 无尽的 疲倦的人生`,
      earReason: '谐音：「抱枕」→「包拯」'
    }
  },
  {
    id: 20,
    earLyric: '我站着你坐着像隔着银河',
    options: [
      { key: 'A', content: '你不是真正的快乐', correct: true },
      { key: 'B', content: '最重要的小事', correct: false },
      { key: 'C', content: '我不愿让你一个人', correct: false },
      { key: 'D', content: '垃圾车', correct: false }
    ],
    correctAnswer: {
      song: '你不是真正的快乐',
      album: '后青春期的诗',
      originalLyric: '我站在你左侧 却像隔着银河',
      lyricsContext: `你不是真正的快乐
你的伤从不肯完全的愈合
我站在你左侧 却像隔着银河`,
      earReason: '空耳改编，原句描述距离感'
    }
  },
  {
    id: 21,
    earLyric: '你把孤单削面，都削面，全刀削面',
    options: [
      { key: 'A', content: '哄我入睡', correct: true },
      { key: 'B', content: '顽固', correct: false },
      { key: 'C', content: '温柔', correct: false },
      { key: 'D', content: '垃圾车', correct: false }
    ],
    correctAnswer: {
      song: '哄我入睡',
      album: '品冠《爱到无可救药》',
      originalLyric: '你把孤单消灭 都消灭 全都消灭',
      lyricsContext: `你把孤单消灭 都消灭 全都消灭
给我安慰 抱着我 哄我入睡`,
      earReason: '谐音：「消灭」→「削面」'
    }
  },
  {
    id: 22,
    earLyric: '新的冷笑话 找个礼堂 开始为你收藏',
    options: [
      { key: 'A', content: '让我照顾你', correct: true },
      { key: 'B', content: '最重要的小事', correct: false },
      { key: 'C', content: '我不愿让你一个人', correct: false },
      { key: 'D', content: '恋爱ing', correct: false }
    ],
    correctAnswer: {
      song: '让我照顾你',
      album: '神的孩子都在跳舞',
      originalLyric: '新的冷笑话 巧克力糖 开始为你收藏',
      lyricsContext: `新的冷笑话 巧克力糖
开始为你收藏`,
      earReason: '谐音：「巧克力糖」→「找个礼堂」'
    }
  },
  {
    id: 23,
    earLyric: '如果命运注定你的单身',
    options: [
      { key: 'A', content: '派对动物', correct: false },
      { key: 'B', content: '第二人生', correct: true },
      { key: 'C', content: '倔强', correct: false },
      { key: 'D', content: '顽固', correct: false }
    ],
    correctAnswer: {
      song: '第二人生',
      album: '第二人生',
      originalLyric: '如果命运注定你的诞生',
      lyricsContext: `如果命运注定你的诞生
如果末日始终没有发生`,
      earReason: '谐音：「诞生」→「单身」（意思完全相反但发音相似）'
    }
  },
  {
    id: 24,
    earLyric: '士杰如果被残酷攻击',
    options: [
      { key: 'A', content: '超人', correct: true },
      { key: 'B', content: '倔强', correct: false },
      { key: 'C', content: '派对动物', correct: false },
      { key: 'D', content: '离开地球表面', correct: false }
    ],
    correctAnswer: {
      song: '超人',
      album: '神的孩子都在跳舞',
      originalLyric: '世界如果被残酷攻击',
      lyricsContext: `世界如果被残酷攻击
只要给我一个电话亭`,
      earReason: '谐音：「世界」→「士杰」（五月天和声/技师，粉丝内部梗）'
    }
  },
  {
    id: 25,
    earLyric: '每次单身我都要芋泥香芋',
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
      earReason: '谐音：「诞生」→「单身」，「与你相遇」→「芋泥香芋」'
    }
  },
  {
    id: 26,
    earLyric: '我是鱼虾在你身上',
    options: [
      { key: 'A', content: '爱情的模样', correct: true },
      { key: 'B', content: '志明与春娇', correct: false },
      { key: 'C', content: '恋爱ing', correct: false },
      { key: 'D', content: '我不愿让你一个人', correct: false }
    ],
    correctAnswer: {
      song: '爱情的模样',
      album: '爱情万岁',
      originalLyric: '我是雨还是你眼眶',
      lyricsContext: `我是雨还是你眼眶
我是浪还是你胸膛
爱情的模样 谁能看穿`,
      earReason: '谐音：「我是雨还是你眼眶」→「我是鱼虾在你身上」'
    }
  },
  {
    id: 27,
    earLyric: '人群烟火香槟和啤酒',
    options: [
      { key: 'A', content: '派对动物', correct: false },
      { key: 'B', content: '因为你 所以我', correct: true },
      { key: 'C', content: '离开地球表面', correct: false },
      { key: 'D', content: '恋爱ing', correct: false }
    ],
    correctAnswer: {
      song: '因为你 所以我',
      album: '因为你 所以我（2020 单曲）',
      originalLyric: '人群烟火香槟和气球',
      lyricsContext: `人群烟火香槟和气球
是你 带我 从派对逃走
逃离 人间 耳语和骚动
因为你我 拥有宇宙`,
      earReason: '谐音：「气球」→「啤酒」'
    }
  }
];

module.exports = earQuestions;
