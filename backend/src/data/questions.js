/**
 * WMTI 趣味测试 - 16道精选题版本（歌单扩展版）
 *
 * 每题只测一个主维度，其他维度全部为0。
 * 分值设计：A=3 B=2 C=1 D=0，主维度差距3分，确保区分度。
 *
 * 维度分布：W×4  M×4  L×4  S×4 = 16题
 * 每维度满分：12分（4×3）
 * 分型阈值：type1≥8(高)  type2≥4(中)  type3<4(低)
 *
 * 题目融入五月天歌曲元素，覆盖更多歌曲，减少重复，增加多样性。
 */

const questions = [
  // ── W 工作 Work ──────────────────────────────────────────────
  {
    id: 1,
    content: '五月天要开演唱会了！你提前半年就开始蹲票，结果开票一秒售罄。此时你的反应是：',
    options: [
      { key: 'A', content: '成名在望在此一举——蹲到黄牛价也要去！', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '找找团票渠道，或者拜托五迷群的大佬帮忙', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '等一等，说不定有人转票呢', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '算了，诺亚方舟会再开的——下次一定！', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 2,
    content: '你终于抢到了演唱会门票，但票价是你工资的半个月。接下来你准备：',
    options: [
      { key: 'A', content: '吃土也要去！第二人生就是要有这种疯狂！', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '精打细算：坐绿皮火车、住青旅也无所谓', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '还是好好上班吧，把票转给更需要的朋友', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '生存以上生活以下——等以后的Live版本也行', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 3,
    content: '你精心打扮去演唱会，结果发现荧光棒忘带了。此时你的反应是：',
    options: [
      { key: 'A', content: '轧马路也要轧到便利店买一支——仪式感不能少！', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '用手机手电筒代替，灵魂的共鸣不靠荧光棒', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '找旁边的人借，或者干脆用拳头挥舞', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '无所谓，我的手就是最好的荧光棒', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 4,
    content: '演唱会上，阿信说"谢谢你们陪我们走过20多年"。那一刻你：',
    options: [
      { key: 'A', content: '眼眶湿润——干杯里都是我们的故事，眼泪忍不住', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '跟着大声唱，每一首都是青春的回忆', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '轻轻跟唱，怕打扰到身边的人', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '静静听着，让旋律流淌过心里', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },

  // ── M 心态 Mind ──────────────────────────────────────────────
  {
    id: 5,
    content: '你终于来到了演唱会现场，却发现自己的位置在"鸟巢山顶"。你的心态是：',
    options: [
      { key: 'A', content: '离心最近的地方——在心上，不在距离', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '至少我来了，有些事现在不做一辈子都不会做了', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '拿出望远镜，也要看清舞台上的每一个动作', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '无所谓，视角更开阔——全场都是我的', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 6,
    content: '散场后，你在场外听到里面还在唱《顽固》。此刻你已经走到出口了，你会：',
    options: [
      { key: 'A', content: '回头！孙悟空再厉害也逃不出五指山——这歌必须听完！', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '站在出口听完，然后带着满足离开', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '拍张鸟巢的照片发朋友圈，记录这一刻', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '任意门开启——下一场，我还要来', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 7,
    content: '你第一次听五月天是很多年前的一个下午。那首歌的前奏改变了你——那首歌是：',
    options: [
      { key: 'A', content: '时光机带我回到那个夏天，听着《恒星的恒心》想着未来', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '洗衣机转动的夜晚，《咸鱼》告诉我平凡也是答案', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '春天的呐喊在耳边，《憨人》让我知道自己不孤单', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '从《恋爱ING》开始就停不下来——终结孤单的方式就是嗨起来', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 8,
    content: '你在演唱会上听到了《一颗苹果》。这首歌让你想到的是：',
    options: [
      { key: 'A', content: '一个人独自走过深夜，《咸鱼》告诉自己再撑一下', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '一颗苹果要经过多少修炼，才能出现在你面前', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '有些等待是值得的，就像有些歌值得反复听', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '好好好——跟着节奏嗨就是了', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },

  // ── L 情感 Love ──────────────────────────────────────────────
  {
    id: 9,
    content: '你暗恋的人突然发来消息："我也在演唱会现场，你呢？"你们在同一场馆却没遇到。你会：',
    options: [
      { key: 'A', content: '听不到你的声音——马上约一个地方见面！', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '你不是真正的快乐——但还是等散场再说吧', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '说不定下一秒就遇到了呢，保持期待', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '人生海海——缘分到了自然会见面的', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 10,
    content: '你带着一个完全不了解五月天的朋友来看演唱会。散场后，他/她说："原来他们的歌不止一首！"你会：',
    options: [
      { key: 'A', content: '《好好》给你听——这是最温柔的歌', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '好高兴你入坑了！加微信，以后一起抢票！', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '默默发个歌单给他：从《温柔》开始', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '无所谓——透露一点我们的快乐就够了', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 11,
    content: '你在五迷群里看到有人讨论"谁是五月天最好听的前奏"。大家各执己见，你会：',
    options: [
      { key: 'A', content: '《雌雄同体》的前奏——没有人能代替你在我心里', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '《诺亚方舟》的前奏——那是末日里的希望', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '沉默吃瓜——每个人都有自己的星星', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '发个《步步》——让大家讨论个够', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 12,
    content: '你在演唱会上认识了一个很聊得来的五迷，分别时约定：以后每场都要一起。此时你：',
    options: [
      { key: 'A', content: '垃圾车友谊——有我陪伴你，你不是一个人！', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '就算以后不能每场都来，这份回忆也足够了', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '先加微信，万一到时候抢不到票可以互相帮忙', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '萍水相逢——走了就是走了，不强求联系', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },

  // ── S 挫折 Stress ─────────────────────────────────────────────
  {
    id: 13,
    content: '你满怀期待去看演唱会，结果当天下暴雨，你的票还是山顶区。面对"双重暴击"，你：',
    options: [
      { key: 'A', content: '能不能所有伤口都能愈合——雨中的演唱会别有一番风味！', scores: { w: 0, m: 0, l: 0, s: 3 } },
      { key: 'B', content: '逆风的方向，更适合飞翔——雨中蹦迪更嗨！', scores: { w: 0, m: 0, l: 0, s: 2 } },
      { key: 'C', content: '就算失望，不能绝望——雨衣穿好，照样嗨全场！', scores: { w: 0, m: 0, l: 0, s: 1 } },
      { key: 'D', content: '人生有限公司——终点都一样，不如开心享受', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 14,
    content: '你参加了团票，结果因为没看到消息，错过了补款时间，票被取消了。那一刻你：',
    options: [
      { key: 'A', content: '洋葱层层叠叠的情绪只有自己在消化——难受得说不出话', scores: { w: 0, m: 0, l: 0, s: 3 } },
      { key: 'B', content: '有些事现在不做一辈子都不会了——下次一定要看好手机', scores: { w: 0, m: 0, l: 0, s: 2 } },
      { key: 'C', content: '勇敢寻找其他渠道——一定要去，不能放弃！', scores: { w: 0, m: 0, l: 0, s: 1 } },
      { key: 'D', content: '不强求——也许下次缘分就到了呢', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 15,
    content: '你满怀期待去听演唱会，结果发现今天的歌单全是你不熟悉的歌。散场时你：',
    options: [
      { key: 'A', content: '伤心的人别听慢歌——但没关系，来都来了', scores: { w: 0, m: 0, l: 0, s: 3 } },
      { key: 'B', content: '第二人生就是要有新体验——回去要补课！', scores: { w: 0, m: 0, l: 0, s: 2 } },
      { key: 'C', content: '好好好——我要把今晚的歌都学会！', scores: { w: 0, m: 0, l: 0, s: 1 } },
      { key: 'D', content: '无所谓——享受的是氛围，不是歌单', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 16,
    content: '看完演唱会回家的路上，你发了条朋友圈，配文应该写：',
    options: [
      { key: 'A', content: '"我如果有梦有没有错"——今晚值了！', scores: { w: 0, m: 0, l: 0, s: 3 } },
      { key: 'B', content: '"如果我们不曾相遇"——感谢五月天，感谢五迷们', scores: { w: 0, m: 0, l: 0, s: 2 } },
      { key: 'C', content: '"自传"的下半场——继续书写属于我们的故事', scores: { w: 0, m: 0, l: 0, s: 1 } },
      { key: 'D', content: '"终于一眼就看到注定的改变"——明天继续加油', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  }
];

module.exports = questions;
