/**
 * 每题只测一个主维度，其他维度全部为0。
 * 分值设计：A=3 B=2 C=1 D=0，主维度差距3分，确保区分度。
 *
 * 维度分布：W×8  M×8  L×7  S×6 = 29题
 * 每维度满分：W=24  M=24  L=21  S=18
 * 分型阈值：type1≥16  type2≥8  type3<8
 */
const questions = [
  // ── W 工作 Work ──────────────────────────────────────────────
  {
    id: 1,
    content: '老板突然甩来加班通知，周五晚上你会？',
    options: [
      { key: 'A', content: '发完疯深呼吸，然后默默去加班', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '准时下班，后果自负吧', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '象征性抗议一下，然后还是去', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '直接躺平，反正工资照发就行', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 2,
    content: '周末只有一天休息，你会选择？',
    options: [
      { key: 'A', content: '加班搞钱，演唱会经费自己挣', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '给自己充电，学点新东西', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '在家看演唱会视频，躺平休息', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '约朋友出去玩，放松最重要', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 3,
    content: '对于"内卷"这件事，你是什么态度？',
    options: [
      { key: 'A', content: '卷！要卷到金字塔顶端！', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '被迫加入，但心里很抵触', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '走自己的路，让别人卷去吧', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '无所谓，反正我只想看演唱会', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 4,
    content: '你现在的工作状态最接近？',
    options: [
      { key: 'A', content: '拼命三郎，工作就是我的命', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '高效精英，完成任务就下班', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '差不多先生，认真就输了', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '摸鱼大师，带薪上厕所是强项', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 5,
    content: '生活中最看重什么？',
    options: [
      { key: 'A', content: '事业成功，得到认可和成就感', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '内心平静，活得自在舒心', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '身边有人陪伴和爱', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '忠于自我，不被外界定义', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 6,
    content: '5年前的自己，想对ta说什么？',
    options: [
      { key: 'A', content: '"继续坚持梦想，别放弃"', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '"想做什么就去做，别留遗憾"', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '"珍惜身边人，别等失去才后悔"', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '"别那么拼命，多爱惜身体"', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 7,
    content: '演唱会当天发现要上班，你会？',
    options: [
      { key: 'A', content: '请假！演唱会不能没有我', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '想办法调班，实在不行看晚场', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '算了下次再去，工作要紧', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '工作第一位，网上看视频也香', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 8,
    content: '你买专辑/周边的频率是？',
    options: [
      { key: 'A', content: '出新必买，支持正版是原则', scores: { w: 3, m: 0, l: 0, s: 0 } },
      { key: 'B', content: '遇到喜欢的才买，不强制', scores: { w: 2, m: 0, l: 0, s: 0 } },
      { key: 'C', content: '网上听听就算了，不花钱', scores: { w: 1, m: 0, l: 0, s: 0 } },
      { key: 'D', content: '只买演唱会周边，其他不考虑', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },

  // ── M 心态 Mind ──────────────────────────────────────────────
  {
    id: 9,
    content: '面对"看不到结果"的事，你通常会？',
    options: [
      { key: 'A', content: '管它呢，过程开心就行！', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '先观望，看情况再决定', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '没有结果就不做，及时止损', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '先设定小目标，边走边看', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 10,
    content: '五月天官宣演唱会，你的反应是？',
    options: [
      { key: 'A', content: '立刻设闹钟蹲守，抢不到不罢休！', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '随缘，抢到就去，抢不到看直播', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '等朋友抢到一起去，一个人太孤单', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '有没有票无所谓，听歌心情好就行', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 11,
    content: '听到"人生有限公司"这句歌词，你的感受是？',
    options: [
      { key: 'A', content: '太真实了，人生就是要及时行乐！', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '有点丧，但好像说得也没错', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '无所谓，该干嘛干嘛', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '只要活着就有无限可能！', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 12,
    content: '遇到挫折时，《倔强》里哪句最戳你？',
    options: [
      { key: 'A', content: '"我不怕千万人阻挡，只怕自己投降"', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '"逆风的方向，更适合飞翔"', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '"如果对自己如果有太多疑问"', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '"就算失望，不能绝望"', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 13,
    content: '看完一场演唱会后，你通常会？',
    options: [
      { key: 'A', content: '激动好几天，见人就想分享！', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '安静地回味，心里暖暖的', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '期待下一场，继续攒钱', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '该干嘛干嘛，生活继续', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 14,
    content: '对于"活在当下"，你认同几分？',
    options: [
      { key: 'A', content: '10分！明天的事明天再说！', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '7分认同，但也要有规划', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '5分，活在当下也要有底线', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '3分，未来规划更重要', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 15,
    content: '朋友问你怎么还在听五月天，你会说？',
    options: [
      { key: 'A', content: '他们的歌陪我度过了人生所有低谷', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '就是喜欢，不需要理由啊！', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '因为他们的歌真的很好听', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '习惯了，像老朋友一样离不开', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 16,
    content: '"加入五月天，永远不会太迟"你怎么看？',
    options: [
      { key: 'A', content: '太对了！有梦什么时候开始都不晚', scores: { w: 0, m: 3, l: 0, s: 0 } },
      { key: 'B', content: '有道理，但也要面对现实', scores: { w: 0, m: 2, l: 0, s: 0 } },
      { key: 'C', content: '哈哈，我早就加入了，资深五迷！', scores: { w: 0, m: 1, l: 0, s: 0 } },
      { key: 'D', content: '能听进去就是缘分吧', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },

  // ── L 情感 Love ──────────────────────────────────────────────
  {
    id: 17,
    content: '你想和谁一起看五月天？',
    options: [
      { key: 'A', content: '和朋友们一起，氛围感拉满！', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '和另一半，一起创造美好回忆', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '自己去，一个人更自在', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '无所谓，有票就去，人多人少都行', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 18,
    content: '朋友临时有事不能一起看演唱会，你会？',
    options: [
      { key: 'A', content: '自己去！不能浪费票一个人也要嗨', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '转让或改期，下次再一起去', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '算了不去了，没人陪没意思', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '找其他朋友一起去', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 19,
    content: '五月天对你来说意味着什么？',
    options: [
      { key: 'A', content: '青春回忆，每首歌都是一段故事', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '陪伴，无论何时都在的温暖存在', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '信仰，照亮前路的精神支柱', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '就是偶像，听歌娱乐而已', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 20,
    content: '"不打扰是我的温柔"，你认同吗？',
    options: [
      { key: 'A', content: '认同，有时候放手才是真正的爱', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '一半吧，有时候需要打扰一下', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '不认同，有爱就要大声说出来', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '管它呢，听歌开心就好', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 21,
    content: '你最想和谁分享一首五月天的歌？',
    options: [
      { key: 'A', content: '在最重要的人面前唱给他们听', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '分享给朋友，一起感动', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '自己听，不想分享', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '安利给更多人，让他们也入坑', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 22,
    content: '"你不孤单，因为你是我最想留住的幸运"——感受是？',
    options: [
      { key: 'A', content: '戳心！我也有很多想留住的人', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '有点感动，但没那么强烈', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '听歌就好，不要想太多', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '单身也挺好，不需要留谁', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 23,
    content: '遇到困难时，你最需要谁的支持？',
    options: [
      { key: 'A', content: '家人，他们永远是我的后盾', scores: { w: 0, m: 0, l: 3, s: 0 } },
      { key: 'B', content: '朋友们，有他们在就够了', scores: { w: 0, m: 0, l: 2, s: 0 } },
      { key: 'C', content: '一个人消化，习惯了', scores: { w: 0, m: 0, l: 1, s: 0 } },
      { key: 'D', content: '五月天的歌，它们就是我的支撑', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },

  // ── S 挫折 Stress ─────────────────────────────────────────────
  {
    id: 24,
    content: '遇到挫折时，你通常怎么应对？',
    options: [
      { key: 'A', content: '越难越要冲，不信过不去', scores: { w: 0, m: 0, l: 0, s: 3 } },
      { key: 'B', content: '先停下来想想，再找办法解决', scores: { w: 0, m: 0, l: 0, s: 2 } },
      { key: 'C', content: '给自己一点时间，慢慢释怀', scores: { w: 0, m: 0, l: 0, s: 1 } },
      { key: 'D', content: '睡一觉就好了，第二天满血复活', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 25,
    content: '你最近一次情绪低落，是因为什么？',
    options: [
      { key: 'A', content: '工作/学业压力，KPI让我喘不过气', scores: { w: 0, m: 0, l: 0, s: 3 } },
      { key: 'B', content: '感情问题，心里堵得慌', scores: { w: 0, m: 0, l: 0, s: 2 } },
      { key: 'C', content: '生活琐事累积，莫名就emo了', scores: { w: 0, m: 0, l: 0, s: 1 } },
      { key: 'D', content: '很少情绪低落，我心态超好', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 26,
    content: '当别人对你说"加油"的时候，你的反应是？',
    options: [
      { key: 'A', content: '谢谢！我会更努力的！', scores: { w: 0, m: 0, l: 0, s: 3 } },
      { key: 'B', content: '心里暖暖的，有被鼓励到', scores: { w: 0, m: 0, l: 0, s: 2 } },
      { key: 'C', content: '谢谢……但我其实还好', scores: { w: 0, m: 0, l: 0, s: 1 } },
      { key: 'D', content: '该咋咋地，我自己能调整', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 27,
    content: '面对"成年人的崩溃"，你的态度是？',
    options: [
      { key: 'A', content: '咬咬牙就过去了，没有过不去的坎', scores: { w: 0, m: 0, l: 0, s: 3 } },
      { key: 'B', content: '允许自己崩溃一下，然后重新出发', scores: { w: 0, m: 0, l: 0, s: 2 } },
      { key: 'C', content: '人之常情，找个方式发泄就好', scores: { w: 0, m: 0, l: 0, s: 1 } },
      { key: 'D', content: '无所谓，睡一觉世界依然美好', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 28,
    content: '你每个月愿意为看演出花多少钱？',
    options: [
      { key: 'A', content: '只要能去看，攒多久钱都愿意', scores: { w: 0, m: 0, l: 0, s: 3 } },
      { key: 'B', content: '量力而行，工资的一部分刚好够用', scores: { w: 0, m: 0, l: 0, s: 2 } },
      { key: 'C', content: '有免费活动就去，收费就算了', scores: { w: 0, m: 0, l: 0, s: 1 } },
      { key: 'D', content: '基本不花钱，网上看看视频就行', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  },
  {
    id: 29,
    content: '如果可以成为五月天MV里的角色，你想成为？',
    options: [
      { key: 'A', content: '《倔强》里逆风飞翔的主角', scores: { w: 0, m: 0, l: 0, s: 3 } },
      { key: 'B', content: '《干杯》里和朋友们畅饮的快乐路人', scores: { w: 0, m: 0, l: 0, s: 2 } },
      { key: 'C', content: '《温柔》里默默守护的深情角色', scores: { w: 0, m: 0, l: 0, s: 1 } },
      { key: 'D', content: '《离开地球表面》里在月球漫步的梦想家', scores: { w: 0, m: 0, l: 0, s: 0 } }
    ]
  }
];

module.exports = questions;
