const fs = require('fs');
const path = require('path');
const posterPrompts = require('./posterPrompts');

const API_DASHSCOPE = 'https://dashscope.aliyuncs.com/api/v1/services/a2t2i/image-synthesis';
const API_DOUBAO = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';

async function generateImageWithDashScope(prompt, outputPath) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY not set');
  }

  const response = await fetch(API_DASHSCOPE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'wanx2.1-imageplus',
      input: {
        prompt: prompt
      },
      parameters: {
        size: '1024*1024',
        n: 1
      }
    })
  });

  if (!response.ok) {
    throw new Error(`DashScope API error: ${response.status}`);
  }

  const data = await response.json();
  const imageUrl = data.output?.image_url;

  if (imageUrl) {
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.buffer();
    fs.writeFileSync(outputPath, buffer);
    return true;
  }
  return false;
}

async function generateImageWithDoubao(prompt, outputPath) {
  const apiKey = process.env.DOUBAO_API_KEY;
  const baseURL = process.env.DOUBAO_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
  
  if (!apiKey) {
    throw new Error('DOUBAO_API_KEY not set');
  }

  const response = await fetch(`${baseURL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'doubao-img-240614/generate-image',
      prompt: prompt,
      size: '1024x1024',
      n: 1
    })
  });

  if (!response.ok) {
    throw new Error(`Doubao API error: ${response.status}`);
  }

  const data = await response.json();
  const imageUrl = data.data?.[0]?.url;

  if (imageUrl) {
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.buffer();
    fs.writeFileSync(outputPath, buffer);
    return true;
  }
  return false;
}

async function generateAllPosters() {
  const outputDir = path.join(__dirname, '../public/posters');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = { success: [], failed: [] };
  const provider = process.env.IMAGE_PROVIDER || 'doubao';

  console.log(`Generating posters using ${provider}...`);
  console.log('='.repeat(50));

  for (const [typeCode, data] of Object.entries(posterPrompts)) {
    const outputPath = path.join(outputDir, `${typeCode}.png`);
    const prompt = `${data.prompt}, anime chibi mascot character, Mayday 五月天 fan art, sticker style, clean white background`;

    console.log(`\n[${typeCode}] ${data.tagline}`);
    console.log(`Prompt: ${prompt.substring(0, 80)}...`);

    try {
      let success = false;
      
      if (provider === 'dashscope') {
        success = await generateImageWithDashScope(prompt, outputPath);
      } else {
        success = await generateImageWithDoubao(prompt, outputPath);
      }

      if (success) {
        console.log(`✓ Saved: ${typeCode}.png`);
        results.success.push(typeCode);
      } else {
        console.log(`✗ Failed to get image URL`);
        results.failed.push(typeCode);
      }
    } catch (error) {
      console.log(`✗ Error: ${error.message}`);
      results.failed.push(typeCode);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\nSummary:`);
  console.log(`  Success: ${results.success.length}/27`);
  console.log(`  Failed: ${results.failed.length}/27`);
  
  if (results.failed.length > 0) {
    console.log(`  Failed types: ${results.failed.join(', ')}`);
  }

  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify({ provider, generated: new Date().toISOString() }, null, 2)
  );

  console.log(`\nAll posters saved to: ${outputDir}`);
}

if (require.main === module) {
  generateAllPosters().catch(console.error);
}

module.exports = { generateAllPosters, posterPrompts };
