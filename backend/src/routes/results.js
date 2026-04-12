const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const questions = require('../data/questions');
const {
  aggregateScores,
  typesFromScores,
  typeCodeFromTypes,
  percentScores,
  posterVisualForTypeCode
} = require('../lib/scoreQuiz');

const resultsStorage = new Map();

router.post('/submit', (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid answers format' });
  }

  const scores = aggregateScores(answers, questions);
  const totalQuestions = answers.length;

  const { wType, mType, lType, sType } = typesFromScores(scores);

  const resultId = uuidv4();

  const dimensionLabels = {
    W: ['工作狂', '平衡者', '生活家'],
    M: ['梦想家', '务实派', '乐天派'],
    L: ['独行者', '追寻者', '守护者'],
    S: ['不屈者', '弹性派', '释然者']
  };

  const resultType = `${dimensionLabels.W[wType-1]} × ${dimensionLabels.M[mType-1]} × ${dimensionLabels.L[lType-1]} × ${dimensionLabels.S[sType-1]}`;

  const dimensionAnalysis = {
    W: {
      1: {
        title: '工作模式',
        summary: '你是那种把工作放在第一位的人，KPI是你心中的神明',
        detail: '在你的世界里，工作不仅是谋生手段，更是实现自我价值的途径。你愿意为项目加班到深夜，也愿意承担更多责任。对你来说，工作狂不是贬义词，而是对你敬业精神的认可。',
        trait: ['责任心爆棚', '抗压能力强', '追求成就感']
      },
      2: {
        title: '工作态度',
        summary: '你追求工作与生活的平衡，深谙「要工作也要生活」的道理',
        detail: '你既不是工作狂也不是躺平族，而是懂得在两者之间找到平衡点。该努力时努力，该放松时放松，你知道过度工作只会透支自己。',
        trait: ['懂得取舍', '效率至上', '生活质量优先']
      },
      3: {
        title: '工作哲学',
        summary: '你觉得工作只是生活的一部分，开心才是最重要的',
        detail: '在你看来，工作是为了更好的生活，而不是反过来。对你来说，「不想上班」不是抱怨而是心声，你更喜欢把时间花在让你快乐的事情上。',
        trait: ['拒绝内卷', '重视自我感受', '追求自由']
      }
    },
    M: {
      1: {
        title: '心态画像',
        summary: '你是那种有梦想就追的人，心里住着一个不肯服输的小孩',
        detail: '你的内心深处总有一团火在燃烧，那是对梦想的执着追求。即使现实再骨感，你也相信只要坚持就能看到曙光。你是那种会为了目标拼尽全力的人。',
        trait: ['意志坚定', '不服输', '有理想有抱负']
      },
      2: {
        title: '心态画像',
        summary: '你脚踏实地，深谙「一步一个脚印」的道理',
        detail: '你既有梦想也懂得现实，不会好高骛远也不会妄自菲薄。你知道成功需要积累，所以愿意一步一个脚印地往前走。你是那种靠谱的务实派。',
        trait: ['沉稳务实', '脚踏实地', '稳扎稳打']
      },
      3: {
        title: '心态画像',
        summary: '你是那种「差不多就行」的乐天派，开心最重要',
        detail: '在你看来，很多事情不用太较真，开心就好。你不会给自己太大压力，也不会被别人的期待绑架。你的人生哲学是：简单点，说话的方式简单点。',
        trait: ['知足常乐', '心态平和', '不较真']
      }
    },
    L: {
      1: {
        title: '情感模式',
        summary: '你是那种「单身也挺好」的自由灵魂',
        detail: '你享受独处的时光，不需要依赖别人来获得快乐。对你来说，感情不是必需品而是调味品。你有自己的生活节奏，也乐于沉浸在自己的小世界里。',
        trait: ['独立自主', '享受孤独', '不将就']
      },
      2: {
        title: '情感模式',
        summary: '你在寻找那个对的人，相信缘分但也主动出击',
        detail: '你相信爱情的存在，也愿意为爱付出时间和精力。但你不会为了谈恋爱而谈恋爱，你宁愿等待也不愿将就。你是那种认真对待感情的人。',
        trait: ['有追求', '认真对待', '相信缘分']
      },
      3: {
        title: '情感模式',
        summary: '你是那种「有你就够了」的陪伴型选手',
        detail: '对你来说，爱人的陪伴是最幸福的事。你愿意为在乎的人付出，也珍惜每一段感情。你是那种会用心经营关系的人，把陪伴当作最长情的告白。',
        trait: ['重感情', '愿意付出', '珍惜陪伴']
      }
    },
    S: {
      1: {
        title: '挫折应对',
        summary: '你是那种「我不转弯」的硬核派，越难越要冲',
        detail: '面对挫折，你的第一反应是正面硬刚。你相信只要坚持下去就没有过不去的坎。这种韧性是你最宝贵的品质，也是你能够一次次从低谷中爬起来的原因。',
        trait: ['意志坚强', '不服输', '愈挫愈勇']
      },
      2: {
        title: '挫折应对',
        summary: '你是那种懂得调整心态的弹性派，能屈能伸',
        detail: '你不会一根筋地蛮干，而是懂得在不同情况下调整策略。该坚持时坚持，该妥协时妥协。这种灵活性让你在复杂的环境中游刃有余。',
        trait: ['懂得变通', '能屈能伸', '适应力强']
      },
      3: {
        title: '挫折应对',
        summary: '你是那种「无所谓啦」的佛系派，很多事睡一觉就好了',
        detail: '你深谙「时间会治愈一切」的道理。面对挫折，你不会太纠结，因为你知道很多事情睡一觉就好了，醒来又是新的一天。你的豁达是你最大的武器。',
        trait: ['心态超好', '拿得起放得下', '不记仇']
      }
    }
  };

  const typeCode = typeCodeFromTypes(wType, mType, lType);

  const personalityDetails = {
    'W1M1L1': {
      label: '倔强打工人',
      desc: '白天拼命工作、晚上拼命追梦。工作是你扛KPI的责任，五月天是你灵魂的充电站。',
      trait: ['工作负责', '梦想坚持', '不轻易妥协'],
      maydaySong: '倔强',
      maydayInsight: '就像《倔强》里唱的「逆风的方向，更适合飞翔」，你骨子里那股倔强劲儿，让你在职场和追梦路上都不认输。'
    },
    'W1M1L2': {
      label: '孤勇追梦人',
      desc: '「拼命」刻进DNA。为了梦想可以拼命，为了爱情也在执着等待。',
      trait: ['意志坚定', '有理想', '耐得住寂寞'],
      maydaySong: '约翰蓝侬',
      maydayInsight: '「能不能暂时把你的勇气给我」，你就像约翰蓝侬一样相信音乐有改变世界的力量。'
    },
    'W1M1L3': {
      label: '双重战士',
      desc: '工作狂 + 爱情脑 = 你。既能搞定KPI，也能守护你爱的人。',
      trait: ['多面手', '责任心强', '感情认真'],
      maydaySong: '最重要的小事',
      maydayInsight: '对你来说，最重要的事就是和爱的人一起变老。这是《最重要的小事》唱出的人生真谛。'
    },
    'W1M2L1': {
      label: '务实梦想家',
      desc: '白天认真工作，晚上追寻精神食粮。懂生存，也懂取悦自己。',
      trait: ['务实', '有规划', '懂平衡'],
      maydaySong: '盛夏光年',
      maydayInsight: '「让盛夏去贪玩，把残酷的未来狂放到光年外」，你懂得在现实和梦想间找到平衡点。'
    },
    'W1M2L2': {
      label: '搞钱理想派',
      desc: '努力工作为了更好的生活，五月天是精神支柱。最棒打工人！',
      trait: ['目标明确', '精神丰富', '工作生活兼顾'],
      maydaySong: '人生无限公司',
      maydayInsight: '「人生有限公司，没有一天能请假」，但你把加班变成热爱，因为每一步都在靠近梦想。'
    },
    'W1M2L3': {
      label: '靠谱人生玩家',
      desc: '工作靠谱，感情也靠谱。最值得信赖的伙伴和朋友！',
      trait: ['负责任', '重感情', '可信赖'],
      maydaySong: '垃圾车',
      maydayInsight: '「有我陪伴你，你不是一个人」，你就像五月天的歌一样，总是给人最温暖的陪伴。'
    },
    'W1M3L1': {
      label: '苦中作乐达人',
      desc: '加班也能苦中作乐。五月天是快乐源泉，演唱会是精神补给站。',
      trait: ['乐观', '会找乐子', '热爱生活'],
      maydaySong: '派对动物',
      maydayInsight: '「我们都有觉悟要疯狂到日出」，你深谙苦中作乐的哲学，演唱会就是你的人生派对！'
    },
    'W1M3L2': {
      label: '享乐打工人',
      desc: '没有「工作太忙没时间」这个借口！看演唱会也是正事！',
      trait: ['会享受', '不亏待自己', '活得明白'],
      maydaySong: '任意门',
      maydayInsight: '「任意门外我们都任意的飞，是自由的滋味」，你用演唱会证明：享乐也是一种能力。'
    },
    'W1M3L3': {
      label: '温暖担当',
      desc: '工作狂 + 温暖陪伴者。工作再忙也要陪家人朋友看演出。',
      trait: ['有温度', '重陪伴', '责任感强'],
      maydaySong: '干杯',
      maydayInsight: '「会不会有一天时间真的能倒退」，你珍惜每一次和朋友看演唱会的时光，因为那就是永恒。'
    },
    'W2M1L1': {
      label: '摸鱼艺术家',
      desc: '嘴上说不想上班，身体却很诚实。演唱会绝对不能错过！',
      trait: ['机智', '懂得偷懒', '抓大放小'],
      maydaySong: '恋爱ing',
      maydayInsight: '「陪你熬夜聊天到爆肝也没关系」，你对演唱会的热情就像恋爱一样疯狂！'
    },
    'W2M1L2': {
      label: '省钱追梦人',
      desc: '工作是为了攒钱，攒钱是为了看更多演唱会。精明的五迷！',
      trait: ['会规划', '精明', '目标导向'],
      maydaySong: '星空',
      maydayInsight: '「那一年我们望着星空，有那么多的灿烂的梦」，你用每一场演唱会编织自己的星空。'
    },
    'W2M1L3': {
      label: '爱情守护者',
      desc: '追求梦想，也守护爱情。为了喜欢的人，愿意付出一切。',
      trait: ['有担当', '专一', '重感情'],
      maydaySong: '我不愿让你一个人',
      maydayInsight: '「我不愿让你一个人，一个人在人海浮沉」，你守护爱情的样子，像极了歌里的深情。'
    },
    'W2M2L1': {
      label: '不屈奋斗者',
      desc: '一步一步往上爬。不会好高骛远，也不会轻易放弃。',
      trait: ['踏实', '有耐心', '意志坚强'],
      maydaySong: '顽固',
      maydayInsight: '「走过的叫足迹，走不到叫憧憬」，你用顽固的心面对每一次挫折，终会等到潮起的那一刻。'
    },
    'W2M2L2': {
      label: '不平庸五迷',
      desc: '自认普通，内心却从不甘于平庸。最真实的五迷！',
      trait: ['真实', '认真生活', '不甘平凡'],
      maydaySong: '后青春的诗',
      maydayInsight: '「谁说不能让我此生唯一自传，如同诗一般」，你的人生值得被写成一首精彩的诗。'
    },
    'W2M3L1': {
      label: '佛系矛盾体',
      desc: '看起来正常，一进演唱会就完全变个人。反差萌！',
      trait: ['反差萌', '真实', '有层次'],
      maydaySong: '离开地球表面',
      maydayInsight: '「一二三牵着手，四五六抬起头，七八九我们私奔到月球」，演唱会的你才是最真实的你！'
    },
    'W2M3L2': {
      label: '演唱会爱好者',
      desc: '工作差不多就行，看演唱会一定要尽兴。知足常乐！',
      trait: ['知足', '会享受', '活得通透'],
      maydaySong: '知足',
      maydayInsight: '「怎么去拥有一道彩虹，怎么去拥抱一夏天的风」，你懂得欣赏生命中的每一道光。'
    },
    'W2M3L3': {
      label: '阳光陪伴使者',
      desc: '陪朋友一起看演出，创造共同回忆。最暖的陪伴者！',
      trait: ['重友情', '暖心', '乐于分享'],
      maydaySong: '干杯',
      maydayInsight: '「会不会有一天时间真的能倒退」，你珍惜和朋友一起的每一刻，这才是人生最珍贵的时刻。'
    },
    'W3M1L1': {
      label: '嘴上躺平族',
      desc: '嘴上说要躺平，抢票比谁都积极。这大概就是真爱吧！',
      trait: ['行动派', '真性情', '热爱驱动'],
      maydaySong: '倔强',
      maydayInsight: '嘴上说着躺平身体却很诚实，这就是五迷的倔强——「我不怕千万人阻挡，只怕自己投降」。'
    },
    'W3M1L2': {
      label: '精神支柱型',
      desc: '五月天不只是偶像，更是精神支柱。跨越时空的陪伴。',
      trait: ['重情感依赖', '感性', '长情'],
      maydaySong: '约翰蓝侬',
      maydayInsight: '「能不能暂时把你的勇气给我」，五月天的歌陪你度过每一个低谷，这是跨越时空的陪伴。'
    },
    'W3M1L3': {
      label: '省钱真粉',
      desc: '可以省饭钱，不能省票钱。演唱会是朝圣，值得倾尽所有！',
      trait: ['舍得投入', '执着', '真粉丝'],
      maydaySong: '玫瑰少年',
      maydayInsight: '「哪朵玫瑰没有荆棘？最好的报复是美丽」，你用行动证明：真爱值得为之疯狂。'
    },
    'W3M2L1': {
      label: '清醒享乐派',
      desc: '看透生活本质但依然热爱。工作只是手段，享乐才是目的。',
      trait: ['通透', '活得明白', '务实享乐'],
      maydaySong: '人生海海',
      maydayInsight: '「就算是整个世界把我抛弃，而至少快乐伤心我自己决定」，你活出了真正的通透。'
    },
    'W3M2L2': {
      label: '快乐五迷',
      desc: '工作只是副业，娱乐才是主业。最懂享受的五迷！',
      trait: ['真实', '会享受', '活得轻松'],
      maydaySong: '派对动物',
      maydayInsight: '「我们天生就是派对动物」，你深谙人生苦短，必须性感地活着！'
    },
    'W3M2L3': {
      label: '平衡大师',
      desc: '既能照顾家庭，也能兼顾爱好。人生平衡的艺术！',
      trait: ['会平衡', '有责任感', '懂生活'],
      maydaySong: '最重要的小事',
      maydayInsight: '「这一刻最重要的事，是属于你最小的事」，你懂得在责任和热爱间找到完美的平衡。'
    },
    'W3M3L1': {
      label: '闷声嗨派',
      desc: '平常清醒，演唱会变个人。有趣的反差五迷！',
      trait: ['有反差', '真性情', '有趣'],
      maydaySong: '盛夏光年',
      maydayInsight: '「我不转弯，我不转弯」，演唱会上那个狂放的你是最真实的你！'
    },
    'W3M3L2': {
      label: '存钱演唱会达人',
      desc: '每月工资预留「演唱会基金」。财务铁律！',
      trait: ['有规划', '自律', '目标明确'],
      maydaySong: '星空',
      maydayInsight: '「那一年我们望着星空」，每一场演唱会都是你星空里最亮的星。'
    },
    'W3M3L3': {
      label: '快乐哲学家',
      desc: '活在当下，享受每一刻。工作不是全部，开心才是！',
      trait: ['活在当下', '乐观', '享受型'],
      maydaySong: '任性',
      maydayInsight: '「就为了你为了你勇敢任性」，你活出了五月天歌里最向往的自由状态。'
    }
  };

  const personResult = personalityDetails[typeCode] || {
    label: '独一无二灵魂的五迷',
    desc: '你是独一无二的五迷，不管什么类型，有五月天陪伴的人生就是满分！',
    trait: ['独特', '真实', '有自我']
  };

  const { w: wScore, m: mScore, l: lScore, s: sScore } = percentScores(scores);

  const wAnalysis = { ...dimensionAnalysis.W[wType], type: dimensionLabels.W[wType-1] };
  const mAnalysis = { ...dimensionAnalysis.M[mType], type: dimensionLabels.M[mType-1] };
  const lAnalysis = { ...dimensionAnalysis.L[lType], type: dimensionLabels.L[lType-1] };
  const sAnalysis = { ...dimensionAnalysis.S[sType], type: dimensionLabels.S[sType-1] };

  const finalSongLyrics = {
    '倔强': '逆风的方向，更适合飞翔。我不怕千万人阻挡，只怕自己投降。',
    '顽固': '走过的叫足迹，走不到叫憧憬。一次一次吞下了泪滴，一次一次拼回破碎自己。一天一天你是否还相信，活在你心深处那顽固的自己。',
    '温柔': '天边风光身旁的你，都不在我眼中。你是所有人的世界，是我孤独的坚持。',
    '离开地球表面': '一二三牵着手，四五六抬起头，七八九我们私奔到月球！',
    '干杯': '会不会有一天时间真的能倒退，退回你的我的回不去的悠悠的岁月。',
    '最重要的事': '这一刻最重要的事，是属于你最小的事。',
    '我不愿让你一个人': '我不愿让你一个人，一个人在人海浮沉。',
    '垃圾车': '有我陪伴你，你不是一个人。',
    '洋葱': '如果你愿意一层一层一层地剥开我的心，你会鼻酸，你会流泪。',
    '人生无限公司': '人生有限公司，没有一天能请假。',
    '盛夏光年': '我骄傲的破坏，我痛恨的平凡。放弃规则，放纵去爱，我不转弯。',
    '有些事不做一辈子都不会做了': '有些事现在不做一辈子都不会做了。',
    '派对动物': '我们都有觉悟要疯狂到日出，我们天生就是派对动物。',
    '星空': '那一年我们望着星空，有那么多的灿烂的梦。以为快乐会永久，像不变星空陪着我。',
    '恋爱ing': '陪你熬夜聊天到爆肝也没关系，陪你逛街逛成扁平足也没关系。恋爱ing happy ing，心情就像是坐上一台喷射机。',
    '知足': '怎么去拥有一道彩虹，怎么去拥抱一夏天的风。天上的星星笑地上的人，总是不能懂不能觉得足够。',
    '后青春的诗': '当烟雾随晨光飘散，枕畔的湖已风干。终于我们不再为了生命狂欢为爱情狂乱，然而青春彼岸盛夏正要一天一天的灿烂。',
    '人生海海': '就算是整个世界把我抛弃，而至少快乐伤心我自己决定。所以我说就让它去，我知道潮落之后一定有潮起。',
    '一颗苹果': '总要有人来陪我咽下苦果，再尝一点美梦。',
    '约翰蓝侬': '能不能暂时把你的勇气给我，在梦想快消失的时候，让我的歌用力的穿过天空。',
    '玫瑰少年': '哪朵玫瑰没有荆棘？最好的报复是美丽，最美的盛开是反击。',
    '任意门': '任意门外我们都任意的飞，是自由的滋味。',
    '任性': '就为了你为了你勇敢任性，世界再对我再错又有何惧。'
  };

  const songSelection = {
    '倔强': (wType === 1 && mType === 1) || sType === 1,
    '顽固': (wType === 2 && mType === 1) || wType === 1,
    '温柔': lType === 3 && mType === 3,
    '离开地球表面': wType === 3 || mType === 3,
    '干杯': wType === 3 && mType === 3,
    '最重要的事': lType === 3 || (wType === 2 && lType === 2),
    '我不愿让你一个人': lType === 2 && sType === 1,
    '垃圾车': sType === 3 || mType === 3,
    '洋葱': mType === 3 && lType === 1,
    '人生无限公司': wType === 1 && mType === 2,
    '盛夏光年': mType === 1 && sType === 1,
    '有些事不做一辈子都不会做了': wType === 3 && mType === 1,
    '派对动物': wType === 3 && sType === 3,
    '星空': mType === 1 && lType === 1,
    '恋爱ing': lType === 3 && sType === 3,
    '知足': mType === 3 && sType === 3,
    '后青春的诗': wType === 2 && mType === 1,
    '人生海海': sType === 2 && mType === 3,
    '一颗苹果': sType === 1 && mType === 2,
    '约翰蓝侬': mType === 1 && sType === 2,
    '玫瑰少年': lType === 1 && sType === 1,
    '任意门': wType === 3 && lType === 3,
    '任性': wType === 3 && sType === 1
  };

  let recommendedSong = '倔强';
  for (const [song, condition] of Object.entries(songSelection)) {
    if (condition) {
      recommendedSong = song;
      break;
    }
  }

  const matchingSongs = Object.entries(songSelection)
    .filter(([_, matches]) => matches)
    .map(([song]) => ({
      name: song,
      lyric: finalSongLyrics[song] || ''
    }));

  const responseData = {
    id: resultId,
    typeCode,
    posterVisual: posterVisualForTypeCode(typeCode),
    resultType,
    label: personResult.label,
    desc: personResult.desc,
    trait: personResult.trait,
    maydaySong: personResult.maydaySong,
    maydayInsight: personResult.maydayInsight,
    scores: {
      w: wScore,
      m: mScore,
      l: lScore,
      s: sScore
    },
    analysis: {
      W: wAnalysis,
      M: mAnalysis,
      L: lAnalysis,
      S: sAnalysis
    },
    matchingSongs
  };

  resultsStorage.set(resultId, responseData);

  res.json({ id: resultId });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const result = resultsStorage.get(id);

  if (!result) {
    return res.status(404).json({ error: 'Result not found' });
  }

  res.json(result);
});

module.exports = router;