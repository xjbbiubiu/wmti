const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const questions = require('../data/questions');
const {
  aggregateScores,
  typesFromScores,
  typeCodeFromTypes,
  percentScores,
  posterVisualForTypeCode
} = require('../lib/scoreQuiz');

const RESULTS_FILE = path.join(__dirname, '..', '..', 'data', 'results.json');

// Load results from file
const loadResults = () => {
  try {
    if (fs.existsSync(RESULTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
      return new Map(Object.entries(data));
    }
  } catch (e) {
    console.error('Failed to load results:', e);
  }
  return new Map();
};

// Save results to file
const saveResults = (storage) => {
  try {
    const data = Object.fromEntries(storage);
    fs.mkdirSync(path.dirname(RESULTS_FILE), { recursive: true });
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to save results:', e);
  }
};

const resultsStorage = loadResults();

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
      desc: 'KPI是你的战场，五月天是你的加油站。白天拼命工作、晚上拼命追梦，你把平凡的日子过成了热血漫画。工作是你扛起责任的方式，而五月天是你灵魂的充电站，让你在996的间隙依然相信诗和远方。',
      trait: ['工作负责', '梦想坚持', '不轻易妥协'],
      maydaySong: '倔强',
      maydayInsight: '就像《倔强》里唱的「逆风的方向，更适合飞翔」，你骨子里那股倔强劲儿，让你在职场和追梦路上都不认输。'
    },
    'W1M1L2': {
      label: '孤勇追梦人',
      desc: '「拼命」两个字刻进DNA。为了梦想可以燃烧自己，为了爱情也愿意执着等待。你相信只要足够渴望，全世界都会为你让路。在别人眼里你或许有点傻，但你知道自己在做什么。',
      trait: ['意志坚定', '有理想', '耐得住寂寞'],
      maydaySong: '约翰蓝侬',
      maydayInsight: '「能不能暂时把你的勇气给我」，你就像约翰蓝侬一样相信音乐有改变世界的力量。'
    },
    'W1M1L3': {
      label: '双重战士',
      desc: '左手KPI、右手爱情，你活成了别人眼中的「人生赢家」。既能搞定工作指标，也能守护你爱的人。你的字典里没有「躺平」，只有全力以赴。不管是事业还是感情，你都要握在手里。',
      trait: ['多面手', '责任心强', '感情认真'],
      maydaySong: '最重要的小事',
      maydayInsight: '对你来说，最重要的事就是和爱的人一起变老。这是《最重要的小事》唱出的人生真谛。'
    },
    'W1M2L1': {
      label: '务实梦想家',
      desc: '白天认真工作搞钱，晚上追寻精神食粮。你不是那种空谈理想的人，懂得先活着再追梦。现实和远方你都要，这就是你的生存智慧——先稳住根基，再仰望星空。',
      trait: ['务实', '有规划', '懂平衡'],
      maydaySong: '盛夏光年',
      maydayInsight: '「让盛夏去贪玩，把残酷的未来狂放到光年外」，你懂得在现实和梦想间找到平衡点。'
    },
    'W1M2L2': {
      label: '搞钱理想派',
      desc: '努力工作是为了更好的生活，而五月天是你精神世界的支柱。你是同事眼里最拼的人，也是朋友圈里最会听歌的人。别人问你怎么这么能熬，你说这是热爱。',
      trait: ['目标明确', '精神丰富', '工作生活兼顾'],
      maydaySong: '人生无限公司',
      maydayInsight: '「人生有限公司，没有一天能请假」，但你把加班变成热爱，因为每一步都在靠近梦想。'
    },
    'W1M2L3': {
      label: '靠谱人生玩家',
      desc: '工作交给你放心，感情有你在安心。你是那种可以把后背交给对方的伙伴。答应朋友的事一定会做到，哪怕是陪他们看一场深夜演唱会。你的人生哲学是：靠谱才是真正的浪漫。',
      trait: ['负责任', '重感情', '可信赖'],
      maydaySong: '垃圾车',
      maydayInsight: '「有我陪伴你，你不是一个人」，你就像五月天的歌一样，总是给人最温暖的陪伴。'
    },
    'W1M3L1': {
      label: '苦中作乐达人',
      desc: '加班到深夜？没关系，有五月天就不累。你是那种把苦难化解成快乐的高手，别人眼中的压力在你这里都能变成下酒菜。演唱会是你的精神补给站，每次去都能满血复活。',
      trait: ['乐观', '会找乐子', '热爱生活'],
      maydaySong: '好好',
      maydayInsight: '「我们都要把自己照顾好」，你深谙苦中作乐的哲学，懂得在忙碌中寻找快乐。'
    },
    'W1M3L2': {
      label: '享乐打工人',
      desc: '「工作太忙没时间」？不存在的！你有一百种方法在繁忙中挤出快乐。看演唱会就是你的正事，五月天演唱会的票根比年终奖还值得炫耀。你的人生信条是：会工作的人一定也会享乐。',
      trait: ['会享受', '不亏待自己', '活得明白'],
      maydaySong: '任意门',
      maydayInsight: '「任意门外我们都任意的飞，是自由的滋味」，你用演唱会证明：享乐也是一种能力。'
    },
    'W1M3L3': {
      label: '温暖担当',
      desc: '工作狂不耽误你当暖男/暖女。哪怕加班到九点，也要抽时间陪家人朋友看场演出。你的日程表永远满当当，但每一项都是你心甘情愿的。你相信陪伴是最长情的告白，所以从不缺席。',
      trait: ['有温度', '重陪伴', '责任感强'],
      maydaySong: '干杯',
      maydayInsight: '「会不会有一天时间真的能倒退」，你珍惜每一次和朋友看演唱会的时光，因为那就是永恒。'
    },
    'W2M1L1': {
      label: '摸鱼艺术家',
      desc: '嘴上念叨着「不想上班」，抢票时却比谁都积极，手速快到让黄牛都佩服。你深谙「带薪追星」之道，在工位上也能云听完一整场演唱会。这大概就是五迷的最高境界——灵魂早已飘到现场。',
      trait: ['机智', '懂得偷懒', '抓大放小'],
      maydaySong: '恋爱ing',
      maydayInsight: '「陪你熬夜聊天到爆肝也没关系」，你对演唱会的热情就像恋爱一样疯狂！'
    },
    'W2M1L2': {
      label: '省钱追梦人',
      desc: '工作是为了攒钱，攒钱是为了看更多演唱会。你可以省下一个月的外卖钱，只为买一张前排票。你是朋友圈里的「省钱大师」，也是演唱会上最投入的那个。每一次挥舞荧光棒，都是你攒了很久的热爱。',
      trait: ['会规划', '精明', '目标导向'],
      maydaySong: '星空',
      maydayInsight: '「那一年我们望着星空，有那么多的灿烂的梦」，你用每一场演唱会编织自己的星空。'
    },
    'W2M1L3': {
      label: '爱情守护者',
      desc: '追求梦想的的路上，你也不忘守护爱情。愿意为喜欢的人付出一切，也愿意和ta一起去看人生第一场演唱会。你相信最好的爱情就是一起看遍偶像的每一场演出，然后慢慢变老。',
      trait: ['有担当', '专一', '重感情'],
      maydaySong: '我不愿让你一个人',
      maydayInsight: '「我不愿让你一个人，一个人在人海浮沉」，你守护爱情的样子，像极了歌里的深情。'
    },
    'W2M2L1': {
      label: '踏实生活派',
      desc: '一步一步往上爬，你相信时间会犒赏每一个认真的人。不会好高骛远，也不会被挫折打倒。别人觉得你慢，但你知道自己每一步都走得踏实。成功不是终点，坚持本身就是意义。',
      trait: ['踏实', '有耐心', '意志坚强'],
      maydaySong: '顽固',
      maydayInsight: '「走过的叫足迹，走不到叫憧憬」，你用顽固的心面对每一次挫折，终会等到潮起的那一刻。'
    },
    'W2M2L2': {
      label: '不平庸五迷',
      desc: '嘴上说着自己很普通，心里却从不甘于平凡。你是那种会在深夜单曲循环《后青春的诗》的人，然后第二天继续普通地活着。但你知道，每一个不甘平凡的瞬间，都是生命的闪光时刻。',
      trait: ['真实', '认真生活', '不甘平凡'],
      maydaySong: '后青春的诗',
      maydayInsight: '「谁说不能让我此生唯一自传，如同诗一般」，你的人生值得被写成一首精彩的诗。'
    },
    'W2M3L1': {
      label: '佛系矛盾体',
      desc: '日常看起来云淡风轻，进了演唱会却完全变了个人。平时说着「随便都行」，抢票时却比谁都疯。这种反差萌是你最可爱的地方——原来每个佛系青年心里都住着一个想要疯狂的你。',
      trait: ['反差萌', '真实', '有层次'],
      maydaySong: '离开地球表面',
      maydayInsight: '「一二三牵着手，四五六抬起头，七八九我们私奔到月球」，演唱会的你才是最真实的你！'
    },
    'W2M3L2': {
      label: '演唱会爱好者',
      desc: '工作做到80分就好，演唱会必须120分投入。你信奉「知足常乐」，但对五月天永远贪心。每一场演唱会都是你给自己的礼物，每一首歌都是你青春的注脚。',
      trait: ['知足', '会享受', '活得通透'],
      maydaySong: '知足',
      maydayInsight: '「怎么去拥有一道彩虹，怎么去拥抱一夏天的风」，你懂得欣赏生命中的每一道光。'
    },
    'W2M3L3': {
      label: '阳光陪伴使者',
      desc: '你最大的快乐不是自己去看演唱会，而是带着朋友一起嗨。比起一个人在前排尖叫，你更享受和朋友们一起创造共同回忆。散场后发朋友圈的合照，是你最珍视的宝藏。',
      trait: ['重友情', '暖心', '乐于分享'],
      maydaySong: '干杯',
      maydayInsight: '「会不会有一天时间真的能倒退」，你珍惜和朋友一起的每一刻，这才是人生最珍贵的时刻。'
    },
    'W3M1L1': {
      label: '嘴上躺平族',
      desc: '整天喊着要躺平，抢票却比谁都积极，手速快到让黄牛都惊叹。你是朋友圈里的「反卷达人」，也是演唱会上最投入的选手。这大概就是真正的热爱——嘴上说着无所谓，身体却无比诚实。',
      trait: ['行动派', '真性情', '热爱驱动'],
      maydaySong: '倔强',
      maydayInsight: '嘴上说着躺平身体却很诚实，这就是五迷的倔强——「我不怕千万人阻挡，只怕自己投降」。'
    },
    'W3M1L2': {
      label: '精神支柱型',
      desc: '五月天对你而言不只是偶像，而是跨越时空的精神陪伴。在你最低落的时候，是《约翰蓝侬》给了你勇气；在你最迷茫的时候，是「能不能暂时把你的勇气给我」陪你度过漫长黑夜。',
      trait: ['重情感依赖', '感性', '长情'],
      maydaySong: '约翰蓝侬',
      maydayInsight: '「能不能暂时把你的勇气给我」，五月天的歌陪你度过每一个低谷，这是跨越时空的陪伴。'
    },
    'W3M1L3': {
      label: '省钱真粉',
      desc: '可以省下饭钱，绝不能省票钱。在你眼里，演唱会是朝圣，值得倾尽所有。你是那种愿意为真爱吃土一个月的狠人。别人说你傻，你笑他人不懂。有些事，用钱买不到。',
      trait: ['舍得投入', '执着', '真粉丝'],
      maydaySong: '玫瑰少年',
      maydayInsight: '「哪朵玫瑰没有荆棘？最好的报复是美丽」，你用行动证明：真爱值得为之疯狂。'
    },
    'W3M2L1': {
      label: '清醒享乐派',
      desc: '你已经看透了生活的真相——工作只是手段，享乐才是目的。但你的享乐不是颓废，而是经历了生活洗礼后的通透选择。你是那种「人间清醒」的代言人，明白什么才是真正值得投入的。',
      trait: ['通透', '活得明白', '务实享乐'],
      maydaySong: '人生海海',
      maydayInsight: '「就算是整个世界把我抛弃，而至少快乐伤心我自己决定」，你活出了真正的通透。'
    },
    'W3M2L2': {
      label: '快乐五迷',
      desc: '工作只是副业，娱乐才是主业。你是朋友圈里的开心果，也是演唱会上最嗨的那个。五月天对你来说是快乐的代名词，每首歌都能让你忘掉烦恼。你的人生哲学：开心是一天，不开心也是一天，为何不开心？',
      trait: ['真实', '会享受', '活得轻松'],
      maydaySong: '干杯',
      maydayInsight: '「会不会有一天时间真的能倒退」，你深谙快乐哲学，珍惜每一刻的美好！'
    },
    'W3M2L3': {
      label: '平衡大师',
      desc: '你是在责任和热爱之间找到完美平衡的人生赢家。既能照顾好家庭，也能兼顾自己的爱好。你不偏激、不极端，明白人生不是非此即彼，而是可以两者兼顾。这就是成熟的人生智慧。',
      trait: ['会平衡', '有责任感', '懂生活'],
      maydaySong: '最重要的小事',
      maydayInsight: '「这一刻最重要的事，是属于你最小的事」，你懂得在责任和热爱间找到完美的平衡。'
    },
    'W3M3L1': {
      label: '闷声嗨派',
      desc: '日常生活中你看起来冷静理性，甚至有点闷。但只要进了演唱会现场，就像打开了开关，变成最狂热的那个。这种反差感让你觉得自己像双重人格，但其实这才是真实的你——表面平静，内心燃烧。',
      trait: ['有反差', '真性情', '有趣'],
      maydaySong: '盛夏光年',
      maydayInsight: '「我不转弯，我不转弯」，演唱会上那个狂放的你是最真实的你！'
    },
    'W3M3L2': {
      label: '存钱演唱会达人',
      desc: '你有一张专属的「演唱会基金」银行卡，每月工资到账第一件事就是往里面存钱。这是你的财务铁律，也是你对自己承诺的仪式感。你相信只要持续投入，总有一天能实现「演唱会自由」。',
      trait: ['有规划', '自律', '目标明确'],
      maydaySong: '星空',
      maydayInsight: '「那一年我们望着星空」，每一场演唱会都是你星空里最亮的星。'
    },
    'W3M3L3': {
      label: '快乐哲学家',
      desc: '不被世俗定义，不被KPI绑架。活在当下，享受每一刻。工作不是全部，开心才是人生的正解！你已经参透了快乐的秘诀——不是拥有多少，而是懂得珍惜当下。你是朋友圈里活得最明白的那个人。',
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
    '好好': '我们都要把自己照顾好，我们都要把自己照顾好。',
    '星空': '那一年我们望着星空，有那么多的灿烂的梦。以为快乐会永久，像不变星空陪着我。',
    '恋爱ing': '陪你熬夜聊天到爆肝也没关系，陪你逛街逛成扁平足也没关系。恋爱ing happy ing，心情就像是坐上一台喷射机。',
    '知足': '怎么去拥有一道彩虹，怎么去拥抱一夏天的风。天上的星星笑地上的人，总是不能懂不能觉得足够。',
    '后青春的诗': '当烟雾随晨光飘散，枕畔的湖已风干。终于我们不再为了生命狂欢为爱情狂乱，然而青春彼岸盛夏正要一天一天的灿烂。',
    '人生海海': '就算是整个世界把我抛弃，而至少快乐伤心我自己决定。所以我说就让它去，我知道潮落之后一定有潮起。',
    '一颗苹果': '总要有人来陪我咽下苦果，再尝一点美梦。',
    '约翰蓝侬': '能不能暂时把你的勇气给我，在梦想快消失的时候，让我的歌用力的穿过天空。',
    '玫瑰少年': '哪朵玫瑰没有荆棘？最好的报复是美丽，最美的盛开是反击。',
    '任意门': '任意门外我们都任意的飞，是自由的滋味。',
    '任性': '就为了你为了你勇敢任性，世界再对我再错又有何惧。',
    '成名在望': '那黑的终点可有光，那夜的尽头可会转弯。成名在望，不在乎有没有掌声。',
    '我心中尚未崩坏的地方': '我心中尚未崩坏的地方，其实一直都僯倷地亮着。',
    '恒星的恒心': '等你的心比行星还认真，我愿意用鲜血证明我恒温。',
    '轧马路': '轧着马路回家，连夕阳都在墙上涂鸦。',
    '雌雄同体': '也许会有一天，银河中有另一个星球。你会不会就是我的克隆。',
    '洗衣机': '洗衣机洗过多少江湖，多久多长多惨烈。',
    '有些事情你不需要知道': '有些事情你不需要知道，只需要知道我很快乐。',
    '诺亚方舟': '诺亚方舟 晚安，让音乐把你带回我身边。',
    '三个傻瓜': '三个傻瓜 追追追，追到我们都毁坏。',
    '步步': '如果我们不曾相遇，你会在哪里。如果我不曾这样用力爱过自己。',
    '后来的我们': '后来的我们，依然走着，只是不再并肩了。',
    '好好': '好好地活下来，偶尔失联络。那些纯粹的快乐，在回忆里从不曾褪色。',
    '顽固': '走过的叫足迹，走不到叫憧憬。',
    '伤心的人别听慢歌': '伤心的人别听慢歌，就算了吧，就这样吧。',
    '第二人生': '期待是一种信仰，像第二人生无法存档。每一天都值得尊重，每一秒都值得等待。',
    '如果我们不曾相遇': '如果我们不曾相遇，不存在这场诗篇。',
    '自传': '在这一张自传里，诗的开头是你。',
    '温柔': '我想你已经化成天使，张开双翅，是离开的时候了。',
    '什么歌': '什么歌能够代表我的心情，什么歌能够形容这一刻。',
    '后来的我们': '在某处另一个你留下了，在那里另一个我微笑着。'
  };

  // 精确匹配：27种W×M×L组合，每种对应一首主打歌（扩大歌单覆盖）
  const typeCodeSong = {
    'W1M1L1': '倔强',
    'W1M1L2': '约翰蓝侬',
    'W1M1L3': '最重要的事',
    'W1M2L1': '人生无限公司',
    'W1M2L2': '顽固',
    'W1M2L3': '任意门',
    'W1M3L1': '好好',
    'W1M3L2': '憨人',
    'W1M3L3': '干杯',
    'W2M1L1': '盛夏光年',
    'W2M1L2': '玫瑰少年',
    'W2M1L3': '最重要的事',
    'W2M2L1': '后青春的诗',
    'W2M2L2': '一颗苹果',
    'W2M2L3': '洋葱',
    'W2M3L1': '恋爱ing',
    'W2M3L2': '知足',
    'W2M3L3': '好好',
    'W3M1L1': '有些事不做一辈子都不会做了',
    'W3M1L2': '成名在望',
    'W3M1L3': '任性',
    'W3M2L1': '人生海海',
    'W3M2L2': '离开地球表面',
    'W3M2L3': '温柔',
    'W3M3L1': '诺亚方舟',
    'W3M3L2': '任意门',
    'W3M3L3': '顽固'
  };

  const primarySong = typeCodeSong[typeCode] || '倔强';
  const primaryLyric = finalSongLyrics[primarySong] || '';

  // 二号歌曲：根据W维度选（增加多样性）
  const wSong = { 1: '倔强', 2: '盛夏光年', 3: '离开地球表面' }[wType] || '倔强';
  const wLyric = finalSongLyrics[wSong] || '';

  const matchingSongs = primarySong !== wSong
    ? [
        { name: primarySong, lyric: primaryLyric },
        { name: wSong, lyric: wLyric }
      ]
    : [{ name: primarySong, lyric: primaryLyric }];

  const responseData = {
    id: resultId,
    typeCode,
    posterVisual: posterVisualForTypeCode(typeCode),
    resultType,
    label: personResult.label,
    desc: personResult.desc,
    trait: personResult.trait,
    maydaySong: primarySong,
    maydayInsight: finalSongLyrics[primarySong] || '',
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
  saveResults(resultsStorage);

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