const questions = [
  {
    id: 1,
    content: '《生存以上 生活以下》唱「活着只会呼吸吃饭喝水」——老板突然甩来加班通知，你会？',
    options: [
      { key: 'A', content: '发完疯深呼吸，然后默默去加班（工作要紧）', scores: { w: 3, m: 1, l: 1, s: 1 } },
      { key: 'B', content: '准时下班，"不约不约"后果自负', scores: { w: 1, m: 2, l: 1, s: 2 } },
      { key: 'C', content: '躺平任嘲，反正工资照发就行', scores: { w: 1, m: 3, l: 1, s: 3 } },
      { key: 'D', content: '假装没看到，继续刷演唱会视频', scores: { w: 1, m: 2, l: 2, s: 2 } }
    ]
  },
  {
    id: 2,
    content: '五月天官宣演唱会，抢票键还没亮，你已经？',
    options: [
      { key: 'A', content: '立刻设闹钟蹲守，抢不到不罢休', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '随缘，抢到就去，抢不到看直播', scores: { w: 1, m: 2, l: 2, s: 2 } },
      { key: 'C', content: '找朋友帮忙，人多力量大', scores: { w: 2, m: 2, l: 3, s: 1 } },
      { key: 'D', content: '等朋友抢到一起去，一个人太孤单', scores: { w: 1, m: 2, l: 1, s: 2 } }
    ]
  },
  {
    id: 3,
    content: '《温柔》现场版：对方说「不打扰是我的温柔」，你内心 OS 是？',
    options: [
      { key: 'A', content: '倔强追问到底，"为什么不让我打扰"', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '默默关注朋友圈，假装释怀', scores: { w: 1, m: 2, l: 1, s: 2 } },
      { key: 'C', content: '乖乖放手，还对方自由', scores: { w: 2, m: 2, l: 1, s: 3 } },
      { key: 'D', content: '唱一首《洋葱》，给自己一个交代', scores: { w: 1, m: 3, l: 2, s: 2 } }
    ]
  },
  {
    id: 4,
    content: '周末你只有一天休息时间，你会选择？',
    options: [
      { key: 'A', content: '加班搞钱，演唱会经费不会从天上掉', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '去咖啡厅/图书馆给自己充电', scores: { w: 2, m: 2, l: 1, s: 2 } },
      { key: 'C', content: '睡到自然醒，在家看演唱会视频', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'D', content: '约朋友出去玩，不能浪费好天气', scores: { w: 2, m: 2, l: 1, s: 2 } }
    ]
  },
  {
    id: 5,
    content: '看到"人生就像打电话，重要的不是结果，而是过程"这句话，你认同吗？',
    options: [
      { key: 'A', content: '结果很重要！没有结果的付出有什么意义？', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '一半一半，有些事看结果有些事享受过程', scores: { w: 2, m: 2, l: 2, s: 2 } },
      { key: 'C', content: '非常认同！过程才是最美的风景', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'D', content: '管它呢，开心就好！', scores: { w: 1, m: 3, l: 3, s: 2 } }
    ]
  },
  {
    id: 6,
    content: '你最近遇到了一件很挫折的事，你的第一反应是？',
    options: [
      { key: 'A', content: '"我不转弯"——困难算什么，冲过去！', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '"一步一步往上爬"——冷静分析重新出发', scores: { w: 3, m: 2, l: 1, s: 1 } },
      { key: 'C', content: '"有些事根本不用怕"——放宽心睡一觉', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'D', content: '"人生有限公司"——先让我emo一下', scores: { w: 1, m: 2, l: 1, s: 2 } }
    ]
  },
  {
    id: 7,
    content: '你的朋友向你吐槽感情问题，你会？',
    options: [
      { key: 'A', content: '直接给结论，"分手，下一个更香"', scores: { w: 1, m: 1, l: 1, s: 1 } },
      { key: 'B', content: '安静倾听，适时递纸巾和建议', scores: { w: 2, m: 2, l: 3, s: 2 } },
      { key: 'C', content: '陪他/她一起骂，义愤填膺站队', scores: { w: 1, m: 3, l: 2, s: 2 } },
      { key: 'D', content: '唱一首《垃圾车》，有我陪伴你', scores: { w: 2, m: 2, l: 3, s: 2 } }
    ]
  },
  {
    id: 8,
    content: '在KTV里，你一定会点哪首歌？',
    options: [
      { key: 'A', content: '《倔强》——坚持对我来说就是以刚克刚', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '《憨人》——我的梦不是从现在开始做的', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'C', content: '《离开地球表面》——就要蹦就要嗨！', scores: { w: 1, m: 3, l: 2, s: 2 } },
      { key: 'D', content: '《温柔》——情到深处自然唱', scores: { w: 1, m: 2, l: 1, s: 2 } }
    ]
  },
  {
    id: 9,
    content: '你现在的存款能支撑你说走就走的旅行吗？',
    options: [
      { key: 'A', content: '说走就走？我还要攒钱买演唱会票呢！', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '有积蓄才有安全感，穷游也不想', scores: { w: 2, m: 1, l: 2, s: 2 } },
      { key: 'C', content: '想走就走，大不了吃泡面！', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'D', content: '钱不是问题，问题是假！工作不允许', scores: { w: 3, m: 2, l: 2, s: 1 } }
    ]
  },
  {
    id: 10,
    content: '对于"内卷"这件事，你的态度是？',
    options: [
      { key: 'A', content: '卷！要卷到金字塔顶端！', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '被迫加入，卷不过就躺不平太难了', scores: { w: 2, m: 2, l: 1, s: 2 } },
      { key: 'C', content: '我不卷，走自己的路让别人说去', scores: { w: 1, m: 3, l: 2, s: 2 } },
      { key: 'D', content: '无所谓，反正我只想看演唱会', scores: { w: 1, m: 3, l: 2, s: 3 } }
    ]
  },
  {
    id: 11,
    content: '如果有机会见到五月天任何一个成员，你最想说的是？',
    options: [
      { key: 'A', content: '"再开一百场演唱会吧！"——贪心请求', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '什么都不说，让我多看两眼就好', scores: { w: 1, m: 3, l: 1, s: 3 } },
      { key: 'C', content: '"你们就是我的青春，谢谢你们还在"', scores: { w: 1, m: 2, l: 3, s: 2 } },
      { key: 'D', content: '"谢谢你们陪我走过难熬的日子"', scores: { w: 1, m: 2, l: 3, s: 2 } }
    ]
  },
  {
    id: 12,
    content: '你现在的爱情观最接近哪句歌词？',
    options: [
      { key: 'A', content: '"爱情不是你想要，想就能就能爱"', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '"单身也挺好的，自由自在"', scores: { w: 1, m: 3, l: 1, s: 3 } },
      { key: 'C', content: '"恋爱ing，完美结局正在靠近"', scores: { w: 1, m: 3, l: 1, s: 2 } },
      { key: 'D', content: '"我不愿让你一个人"——陪伴', scores: { w: 2, m: 2, l: 1, s: 2 } }
    ]
  },
  {
    id: 13,
    content: '你通常如何度过人生低谷期？',
    options: [
      { key: 'A', content: '闷头想办法，越难越要撑过去', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '睡一觉就好了，明天又是新的一天', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'C', content: '听五月天的歌，从歌词里汲取力量', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'D', content: '找朋友倾诉，不能一个人扛', scores: { w: 1, m: 2, l: 1, s: 2 } }
    ]
  },
  {
    id: 14,
    content: '如果可以重来，你最想改变什么？',
    options: [
      { key: 'A', content: '重新选择职业道路，追求自己的梦想', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '不后悔，往前看就好，无所谓', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'C', content: '珍惜身边的人，别忽略爱你的人', scores: { w: 2, m: 2, l: 1, s: 2 } },
      { key: 'D', content: '希望能更勇敢一点，不要错过机会', scores: { w: 2, m: 1, l: 1, s: 1 } }
    ]
  },
  {
    id: 15,
    content: '你觉得存钱最好的理由是？',
    options: [
      { key: 'A', content: '为了下一次演唱会！这是信仰！', scores: { w: 3, m: 2, l: 2, s: 1 } },
      { key: 'B', content: '为了以后能过得更好，梦想还是要有的', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'C', content: '及时行乐！存什么钱！', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'D', content: '为了不时之需，安全感很重要', scores: { w: 2, m: 1, l: 2, s: 2 } }
    ]
  },
  {
    id: 16,
    content: '"你心中尚未崩坏的地方"是哪里？',
    options: [
      { key: 'A', content: '对未来的希望，相信自己会更好的信念', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '我的心灵净土，谁都不能触碰', scores: { w: 1, m: 3, l: 2, s: 2 } },
      { key: 'C', content: '对家人的爱，这是不变的依靠', scores: { w: 2, m: 2, l: 1, s: 2 } },
      { key: 'D', content: '对音乐的热爱，对五月天的信仰', scores: { w: 1, m: 1, l: 3, s: 1 } }
    ]
  },
  {
    id: 17,
    content: '朋友突然约你但你有其他计划，你会？',
    options: [
      { key: 'A', content: '坚持原有计划，我已经安排了', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '看情况，不重要就改期', scores: { w: 2, m: 2, l: 2, s: 2 } },
      { key: 'C', content: '取消计划赴约，朋友比什么都重要', scores: { w: 1, m: 2, l: 1, s: 2 } },
      { key: 'D', content: '一起去呗，多一个人更热闹', scores: { w: 1, m: 3, l: 1, s: 2 } }
    ]
  },
  {
    id: 18,
    content: '你更认同以下哪种人生态度？',
    options: [
      { key: 'A', content: '"逆风的方向，更适合飞翔"——越难越冲', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '"最重要的事，就是和你一起慢慢变老"', scores: { w: 1, m: 3, l: 1, s: 2 } },
      { key: 'C', content: '"人生有限公司，你要学会保护自己"', scores: { w: 2, m: 2, l: 2, s: 1 } },
      { key: 'D', content: '"有些事我不说，不代表我不在乎"', scores: { w: 2, m: 2, l: 3, s: 2 } }
    ]
  },
  {
    id: 19,
    content: '如果你是《人生有限公司》的员工，你觉得自己是什么类型？',
    options: [
      { key: 'A', content: '拼命三郎型——工作就是我的命', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '高效精英型——工作是为了更好生活', scores: { w: 2, m: 2, l: 2, s: 2 } },
      { key: 'C', content: '差不多先生型——认真就输了', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'D', content: '摸鱼大师型——带薪上厕所是我的强项', scores: { w: 1, m: 3, l: 2, s: 3 } }
    ]
  },
  {
    id: 20,
    content: '对你来说，五月天在你生命中扮演着什么角色？',
    options: [
      { key: 'A', content: '信仰——他们是我想成为的那种人', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '生活背景音——陪伴我度过每一天', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'C', content: '青春记忆——每一首歌都是一段回忆', scores: { w: 1, m: 2, l: 3, s: 2 } },
      { key: 'D', content: '精神支柱——每次听歌都能满血复活', scores: { w: 2, m: 1, l: 3, s: 1 } }
    ]
  },
  {
    id: 21,
    content: '当你听到《倔强》这首歌时，你最想做什么？',
    options: [
      { key: 'A', content: '跟着大声唱，"我不怕千万人阻挡"', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '想起那些坚持的日子，默默流泪', scores: { w: 1, m: 2, l: 3, s: 2 } },
      { key: 'C', content: '分享给正在低谷的朋友', scores: { w: 2, m: 2, l: 1, s: 1 } },
      { key: 'D', content: '算了，换一首更嗨的歌吧', scores: { w: 1, m: 3, l: 2, s: 3 } }
    ]
  },
  {
    id: 22,
    content: '你和朋友约好了一起看演唱会，但朋友临时有事，你会？',
    options: [
      { key: 'A', content: '自己去！不能浪费票一个人也要嗨', scores: { w: 2, m: 2, l: 1, s: 1 } },
      { key: 'B', content: '算了不去了，没人陪没意思', scores: { w: 1, m: 3, l: 1, s: 3 } },
      { key: 'C', content: '找其他朋友一起去', scores: { w: 2, m: 2, l: 2, s: 2 } },
      { key: 'D', content: '转让给别人，和朋友下次再去', scores: { w: 1, m: 2, l: 1, s: 2 } }
    ]
  },
  {
    id: 23,
    content: '你每个月愿意为看演出或相关活动花多少钱？',
    options: [
      { key: 'A', content: '只要能去看，攒多久钱都愿意', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '很少花钱，有免费视频看就够了', scores: { w: 1, m: 2, l: 2, s: 2 } },
      { key: 'C', content: '有免费活动就去，收费就算了', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'D', content: '量力而行，工资的一部分刚好够用', scores: { w: 2, m: 2, l: 2, s: 2 } }
    ]
  },
  {
    id: 24,
    content: '如果可以，你想对5年前的自己说什么？',
    options: [
      { key: 'A', content: '"继续坚持你的梦想，别放弃"', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '"想做什么就去做，别留遗憾"', scores: { w: 2, m: 3, l: 2, s: 1 } },
      { key: 'C', content: '"珍惜身边的人，别等失去了才后悔"', scores: { w: 1, m: 2, l: 1, s: 2 } },
      { key: 'D', content: '"别那么拼命，多爱惜身体"', scores: { w: 2, m: 2, l: 3, s: 2 } }
    ]
  },
  {
    id: 25,
    content: '你更喜欢用什么方式支持五月天？',
    options: [
      { key: 'A', content: '买专辑和周边，支持正版是基本原则', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '默默听歌，不打扰是我的温柔', scores: { w: 1, m: 2, l: 1, s: 3 } },
      { key: 'C', content: '安利给朋友，让他们也入坑', scores: { w: 1, m: 3, l: 2, s: 2 } },
      { key: 'D', content: '演唱会现场，用力挥舞荧光棒到手臂酸', scores: { w: 2, m: 2, l: 1, s: 1 } }
    ]
  },
  {
    id: 26,
    content: '当你一个人加班到深夜时，你会？',
    options: [
      { key: 'A', content: '戴上耳机，让五月天陪你加班', scores: { w: 3, m: 2, l: 2, s: 1 } },
      { key: 'B', content: '不干了明天再说！工作不是人生全部', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'C', content: '默默忍受，反正习惯了', scores: { w: 2, m: 1, l: 2, s: 2 } },
      { key: 'D', content: '边听《倔强》边给自己打气', scores: { w: 2, m: 1, l: 2, s: 1 } }
    ]
  },
  {
    id: 27,
    content: '"加入五月天，永远不会太迟"——你对这句话的理解是？',
    options: [
      { key: 'A', content: '只要开始就不晚，人生随时可以重启', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '哈哈，我早就加入了！资深五迷在此', scores: { w: 1, m: 2, l: 1, s: 3 } },
      { key: 'C', content: '只要心里有梦，什么时候加入都可以', scores: { w: 2, m: 3, l: 2, s: 1 } },
      { key: 'D', content: '五月天的歌什么时候听都有道理', scores: { w: 1, m: 2, l: 3, s: 2 } }
    ]
  },
  {
    id: 28,
    content: '你在生活中最看重的是什么？',
    options: [
      { key: 'A', content: '事业成功，得到认可和成就感', scores: { w: 3, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '内心平静，活得自在舒心', scores: { w: 1, m: 3, l: 1, s: 3 } },
      { key: 'C', content: '身边有人陪伴和爱', scores: { w: 1, m: 2, l: 3, s: 2 } },
      { key: 'D', content: '不断挑战自我突破极限', scores: { w: 2, m: 1, l: 1, s: 1 } }
    ]
  },
  {
    id: 29,
    content: '如果可以，你想成为五月天MV里的哪个角色？',
    options: [
      { key: 'A', content: '《倔强》里逆风飞翔的主角', scores: { w: 2, m: 1, l: 2, s: 1 } },
      { key: 'B', content: '《干杯》里和朋友们畅饮的快乐路人', scores: { w: 1, m: 3, l: 2, s: 3 } },
      { key: 'C', content: '《温柔》里默默守护的深情角色', scores: { w: 1, m: 2, l: 1, s: 2 } },
      { key: 'D', content: '《离开地球表面》里在月球漫步的梦想家', scores: { w: 1, m: 3, l: 2, s: 2 } }
    ]
  }
];

module.exports = questions;
