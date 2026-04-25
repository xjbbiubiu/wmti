/**
 * WMLS 空耳歌词互换卡片生成脚本
 *
 * 为每道空耳题生成一张可打印的 14×8cm 卡片（正反两面）。
 *
 * 使用方式：
 *   1. 修改 BASE_URL 为你的网站域名
 *   2. 运行：node scripts/generatePrintCards.js
 *   3. 在生成的 cards/ 文件夹中，把 {{AI_IMAGE_PLACEHOLDER}} 替换为 AI 生成的图片
 *      （建议尺寸：800×450px，PNG 格式，透明背景效果最佳）
 *   4. 用浏览器打开 front-BATCH.html 和 back-BATCH.html
 *   5. 浏览器打印 → 另存为 PDF → 发打印店
 *
 * 打印店备注：
 *   - 尺寸：140×80mm（正面）+ 140×80mm（背面）
 *   - 四边扩 3mm 出血
 *   - 亮膜覆膜
 *   - CMYK 色彩（设计为 RGB，印刷厂会转换）
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const earQuestions = require('../src/data/earQuestions');

// ═══════════════════════════════════════════════════
// ⚙️  修改这里：填入你的网站地址（卡片扫码后打开的页面）
// ═══════════════════════════════════════════════════
const BASE_URL = 'https://your-domain.com/wmti';

// ═══════════════════════════════════════════════════
//  每张卡背面要展示的歌词金句（从各题的原歌词中精选）
// ═══════════════════════════════════════════════════
const BACK_QUOTES = {
  // id: { quote, source }
  1:  { quote: '难道我又我又初恋了', source: '我又初恋了' },
  2:  { quote: '能不能就让悲伤全部结束在此刻', source: '你不是真正的快乐' },
  3:  { quote: '我和你 你和我 狂飙爱意突然变得好猛', source: '透露' },
  4:  { quote: '我的手越肮脏 眼神越是发光', source: '倔强' },
  5:  { quote: '我需要扭转 我需要意外 我需要感觉存在', source: '春天的呐喊' },
  6:  { quote: '只因世界再大不过你和我', source: '因为你所以我' },
  7:  { quote: '卸下了这面具 我想说谢谢你', source: '顽固' },
  8:  { quote: '就算失望 不能绝望', source: '倔强' },
  9:  { quote: '我要和你一起走过一千个世纪', source: '一千个世纪' },
  10: { quote: '有什么留在你我的心头 那是什么', source: '什么歌' },
  11: { quote: '要不要 就让自己来决定要不要', source: 'DNA' },
  12: { quote: '丢电视丢电脑 丢掉大脑再丢烦恼', source: '离开地球表面' },
  13: { quote: '黎明之前 只要和你 尽情嬉戏', source: '爱情万岁' },
  14: { quote: '一生能有几次 跟世界宣战', source: '春天的呐喊' },
  15: { quote: '在此刻向你 完全透露', source: '透露' },
  16: { quote: '再见 初识的那个公园', source: '诺亚方舟' },
  17: { quote: '默默聆听那黑夜', source: '拥抱' },
  18: { quote: '所以挖开土壤 种下希望', source: '小太阳' },
  19: { quote: '你醒在 无尽的 疲倦的人生', source: '第二人生' },
  20: { quote: '我站在你左侧 却像隔着银河', source: '你不是真正的快乐' },
  21: { quote: '给我安慰 抱着我 哄我入睡', source: '哄我入睡' },
  22: { quote: '开始为你收藏', source: '让我照顾你' },
  23: { quote: '如果末日始终没有发生', source: '第二人生' },
  24: { quote: '只要给我一个电话亭', source: '超人' },
  25: { quote: '每次轮回都为你', source: '一千个世纪' },
  26: { quote: '爱情的模样 谁能看穿', source: '爱情的模样' },
  27: { quote: '是你 带我 从派对逃走', source: '因为你 所以我' },
};

// 输出目录
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'print-cards');

// 卡片尺寸（mm）
const CARD_W = 140;   // mm
const CARD_H = 80;    // mm
const BLEED = 3;      // mm
const DPMM = 11.811;  // 300 DPI ≈ 11.811 dots per mm

async function generateCards() {
  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const total = earQuestions.length;
  console.log(`\n🎵 开始生成 ${total} 张 WMLS 空耳歌词卡片...`);
  console.log(`📁 输出目录: ${OUTPUT_DIR}`);
  console.log(`🔗 卡片URL基础: ${BASE_URL}/ear-card/{id}`);
  console.log('');

  const frontPages = [];
  const backPages = [];

  for (const q of earQuestions) {
    const cardUrl = `${BASE_URL}/ear-card/${q.id}`;
    const qrDataUrl = await QRCode.toDataURL(cardUrl, {
      width: 180,
      margin: 1,
      color: { dark: '#1a1a2e', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });

    const back = BACK_QUOTES[q.id] || { quote: q.correctAnswer.originalLyric, source: q.correctAnswer.song };

    const cardHtml = buildCardHtml(q, qrDataUrl, back, cardUrl);

    const filename = `card-${String(q.id).padStart(2, '0')}.html`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, cardHtml, 'utf8');

    frontPages.push({ id: q.id, earLyric: q.earLyric, song: q.correctAnswer.song });
    backPages.push({ id: q.id, quote: back.quote, source: back.source, song: q.correctAnswer.song });

    console.log(`  ✅ 卡片 ${q.id}/${total}: ${q.earLyric} → ${q.correctAnswer.song}`);
  }

  // 生成汇总 HTML（含正面和背面两个大页面，每页 3×9 或自定义排列）
  await generateBatchHtml(frontPages, backPages);

  console.log(`\n✨ 完成！共生成 ${total} 张卡片。`);
  console.log('');
  console.log('📋 下一步：');
  console.log('  1. 用 AI 工具生成左侧图案，替换 HTML 中的 {{AI_IMAGE}} 占位图');
  console.log('     （推荐：Midjourney / DALL·E，风格参考 prompt 见 README.md');
  console.log('  2. 打开 front-BATCH.html 和 back-BATCH.html');
  console.log('  3. 浏览器打印 → 目标：另存为 PDF');
  console.log('  4. 送打印店：140×80mm，亮膜覆膜，四边扩3mm出血');
  console.log('');
}

function buildCardHtml(question, qrDataUrl, back, cardUrl) {
  // 正面 HTML
  const front = buildFrontHtml(question, qrDataUrl);
  // 背面 HTML
  const backHtml = buildBackHtml(back, question);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>空耳卡片 #${question.id} - ${question.earLyric}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #111;
    font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 40px;
  }

  .page-label {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.5;
  }

  /* ─── 卡片尺寸：140×80mm（300 DPI ≈ 1654×945 px）─── */
  .card {
    width: 140mm;
    height: 80mm;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    /* 出血保护：出血区域仅供打印店裁切，不含重要内容 */
    background: #1a1a2e;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }

  /* ════════════════════════════════════════
     正面
  ════════════════════════════════════════ */
  .card-front {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    display: flex;
  }

  /* 背景装饰光效 */
  .card-front::before {
    content: '';
    position: absolute;
    width: 60%;
    height: 100%;
    left: 0;
    top: 0;
    background:
      radial-gradient(ellipse at 0% 50%, rgba(255,105,180,0.25) 0%, transparent 55%),
      radial-gradient(ellipse at 0% 80%, rgba(0,150,255,0.2) 0%, transparent 50%);
    pointer-events: none;
  }

  /* 左侧 AI 图片区 */
  .card-image-zone {
    width: 42%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .card-image-zone img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* AI 图片占位符（黄色虚线边框提示） */
  .ai-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(255,200,50,0.6);
    background: rgba(255,200,50,0.05);
    gap: 8px;
  }

  .ai-placeholder-icon {
    font-size: 28px;
    opacity: 0.7;
  }

  .ai-placeholder-text {
    font-size: 8px;
    color: rgba(255,200,50,0.8);
    text-align: center;
    line-height: 1.5;
    padding: 0 10px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  /* 右侧文字区 */
  .card-text-zone {
    width: 58%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10mm 8mm 8mm 6mm;
    position: relative;
    z-index: 1;
  }

  .ear-lyric-label {
    font-size: 7px;
    font-weight: 700;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .ear-lyric-text {
    font-size: 13.5mm;
    font-weight: 900;
    color: #fff;
    line-height: 1.25;
    text-shadow: 0 0 16px rgba(255,105,180,0.5), 0 2px 8px rgba(0,0,0,0.5);
    margin-bottom: auto;
    padding-top: 2mm;
    letter-spacing: 0.02em;
  }

  /* 底部信息栏 */
  .card-bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 4mm;
  }

  .scan-hint {
    font-size: 7px;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.05em;
    line-height: 1.6;
  }

  .qr-wrap {
    width: 18mm;
    height: 18mm;
    flex-shrink: 0;
    border-radius: 3mm;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.15);
    background: #fff;
    padding: 1.5mm;
  }

  .qr-wrap img {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* 荧光棒装饰条 */
  .glow-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #ff69b4, #00a8e8);
    opacity: 0.8;
  }

  /* ════════════════════════════════════════
     背面
  ════════════════════════════════════════ */
  .card-back {
    width: 100%;
    height: 100%;
    background: linear-gradient(160deg, #1a1a2e 0%, #0f3460 60%, #1a1a2e 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8mm 10mm;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  /* 背景光效 */
  .card-back::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 30%, rgba(255,105,180,0.12) 0%, transparent 55%),
      radial-gradient(ellipse at 50% 80%, rgba(0,150,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  /* 歌词金句 */
  .back-quote-mark {
    font-size: 28px;
    color: rgba(255,105,180,0.4);
    font-family: Georgia, serif;
    line-height: 1;
    margin-bottom: 2mm;
    font-style: italic;
  }

  .back-quote {
    font-size: 10.5mm;
    font-weight: 900;
    color: #fff;
    line-height: 1.4;
    text-shadow: 0 0 20px rgba(255,105,180,0.3);
    margin-bottom: 4mm;
    letter-spacing: 0.03em;
  }

  .back-source {
    font-size: 7px;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: auto;
  }

  .back-song-name {
    font-size: 8px;
    font-weight: 800;
    color: rgba(0,168,232,0.9);
    letter-spacing: 0.08em;
    margin-bottom: 1mm;
  }

  .back-divider {
    width: 20mm;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,105,180,0.5), transparent);
    margin-bottom: 1mm;
  }

  .back-wmls {
    font-size: 6.5px;
    font-weight: 700;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .back-glow-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #00a8e8, #ff69b4);
    opacity: 0.8;
  }

  /* 打印样式 */
  @media print {
    body {
      background: white;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .page-label {
      display: none;
    }
    .card {
      width: 146mm;   /* 含出血：140 + 3×2 */
      height: 86mm;   /* 含出血：80 + 3×2 */
      box-shadow: none;
      border-radius: 0;
      page-break-after: always;
    }
    .card:last-child {
      page-break-after: auto;
    }
  }

  @page {
    size: 146mm 86mm landscape;
    margin: 0;
  }
</style>
</head>
<body>

<!-- ════════════════════════════════════════
     正面：空耳歌词挑战卡
     左图（用户自行添加AI图）+ 右歌词 + 右下角QR码
════════════════════════════════════════ -->
<div class="page-label">正面 — 空耳挑战 #${question.id}</div>
<div class="card">
  <div class="card-front">
    <!-- 左侧：AI生成图案区（请替换 {{AI_IMAGE}} 为实际图片）-->
    <div class="card-image-zone">
      <!-- ⚠️  将下方占位符替换为你的 AI 生成图  -->
      <!-- 替换方式：删除 .ai-placeholder div，把下方的注释取消 -->
      <!-- <img src="{{AI_IMAGE}}" alt="五月天元素图" /> -->
      <div class="ai-placeholder">
        <div class="ai-placeholder-icon">🎵</div>
        <div class="ai-placeholder-text">
          替换此处为<br>AI 生成图案<br>
          <span style="font-size:7px;opacity:0.6;">建议 800×450px PNG</span>
        </div>
      </div>
    </div>

    <!-- 右侧：空耳歌词 + 二维码 -->
    <div class="card-text-zone">
      <div class="ear-lyric-label">你听到的是</div>
      <div class="ear-lyric-text">${escapeHtml(question.earLyric)}</div>

      <div class="card-bottom">
        <div class="scan-hint">
          扫码听歌<br>揭晓答案 →
        </div>
        <div class="qr-wrap">
          <img src="${qrDataUrl}" alt="QR码" />
        </div>
      </div>
    </div>
  </div>
  <div class="glow-bar"></div>
</div>

<!-- ════════════════════════════════════════
     背面：歌词金句卡
════════════════════════════════════════ -->
<div class="page-label">背面 — 歌词金句 #${question.id}</div>
<div class="card">
  <div class="card-back">
    <div class="back-glow-bar"></div>
    <div class="back-quote-mark">"</div>
    <div class="back-quote">${escapeHtml(back.quote)}</div>
    <div class="back-source">— ${escapeHtml(back.source)}</div>
    <div class="back-song-name">🎤 ${escapeHtml(question.correctAnswer.song)}</div>
    <div class="back-divider"></div>
    <div class="back-wmls">WMLS · 五月天 · 互换物料</div>
  </div>
</div>

</body>
</html>`;
}

function buildFrontHtml(question, qrDataUrl) {
  return ''; // embedded in buildCardHtml
}

function buildBackHtml(back, question) {
  return ''; // embedded in buildCardHtml
}

async function generateBatchHtml(frontPages, backPages) {
  // 生成分组汇总页（每页6张并排，方便预览和打印）
  const CARDS_PER_PAGE = 6;
  const cols = 3, rows = 2;

  const frontBatch = buildBatchPage(frontPages, 'front', cols, rows);
  const backBatch = buildBatchPage(backPages, 'back', cols, rows);

  fs.writeFileSync(path.join(OUTPUT_DIR, 'front-BATCH.html'), frontBatch, 'utf8');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'back-BATCH.html'), backBatch, 'utf8');
  console.log(`  📄 生成分组预览页: front-BATCH.html, back-BATCH.html`);
}

function buildBatchPage(items, side, cols, rows) {
  const cardsPerPage = cols * rows;
  const pages = [];
  for (let i = 0; i < items.length; i += cardsPerPage) {
    pages.push(items.slice(i, i + cardsPerPage));
  }

  let pagesHtml = '';
  for (let p = 0; p < pages.length; p++) {
    const pageItems = pages[p];
    let gridHtml = '';
    for (const item of pageItems) {
      if (side === 'front') {
        gridHtml += `
        <div class="batch-card batch-front">
          <div class="batch-card-num">#${item.id}</div>
          <div class="batch-ear-lyric">"${escapeHtml(item.earLyric)}"</div>
          <div class="batch-song">${escapeHtml(item.song)}</div>
          <div class="batch-hint">← 替换AI图 →</div>
        </div>`;
      } else {
        gridHtml += `
        <div class="batch-card batch-back">
          <div class="batch-card-num">#${item.id}</div>
          <div class="batch-quote">"${escapeHtml(item.quote)}"</div>
          <div class="batch-source">— ${escapeHtml(item.source)}</div>
        </div>`;
      }
    }
    // 填充空白格子
    const emptyCount = cardsPerPage - pageItems.length;
    for (let e = 0; e < emptyCount; e++) {
      gridHtml += `<div class="batch-card batch-empty"></div>`;
    }

    pagesHtml += `<div class="print-page">${gridHtml}<div class="page-footer">${side === 'front' ? '正面' : '背面'} · 第 ${p + 1}/${pages.length} 页 · WMLS空耳歌词互换卡片</div></div>`;
  }

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>WMLS 空耳卡片 — ${side === 'front' ? '正面' : '背面'}汇总</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #1a1a2e; padding: 20px; font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; }
  .page-title { color: #fff; font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 20px; }
  .print-page {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
    page-break-after: always;
  }
  .batch-card {
    background: #16213e;
    border-radius: 12px;
    padding: 16px;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .batch-front { border: 2px solid rgba(255,105,180,0.3); }
  .batch-back { border: 2px solid rgba(0,168,232,0.3); }
  .batch-empty { background: transparent; border: 2px dashed rgba(255,255,255,0.1); }
  .batch-card-num { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.4); letter-spacing: 0.1em; }
  .batch-ear-lyric { font-size: 13px; font-weight: 900; color: #fff; line-height: 1.4; flex: 1; }
  .batch-song { font-size: 11px; color: rgba(255,105,180,0.8); font-weight: 600; }
  .batch-hint { font-size: 9px; color: rgba(255,200,50,0.7); text-align: center; }
  .batch-quote { font-size: 12px; font-weight: 700; color: #fff; line-height: 1.5; flex: 1; }
  .batch-source { font-size: 10px; color: rgba(0,168,232,0.8); font-weight: 600; }
  .page-footer { grid-column: 1/-1; text-align: center; font-size: 11px; color: rgba(255,255,255,0.3); padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); }
  @media print {
    body { background: white; padding: 0; }
    .print-page { gap: 0; }
    .batch-card { background: #f8f9fa; border-radius: 0; min-height: 80px; }
    .batch-card-num { color: #666; }
    .batch-ear-lyric, .batch-quote { color: #111; }
    .batch-song, .batch-source { color: #555; }
    .page-title { color: #111; }
  }
  @page { size: A4 landscape; margin: 10mm; }
</style>
</head>
<body>
<h1 class="page-title">WMLS 空耳歌词互换卡片 — ${side === 'front' ? '正面（需替换AI图）' : '背面'}</h1>
${pagesHtml}
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

generateCards().catch(console.error);
