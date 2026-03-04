// Vercel 云函数：TTS 代理
// 完全免费，不需要备案

export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const text = req.query.text || req.body?.text || '';
    
    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少 text 参数' 
      });
    }
    
    // 调用有道词典 TTS
    const youdaoUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
    
    const response = await fetch(youdaoUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    // 获取音频数据
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 转换为 Base64
    const audioBase64 = buffer.toString('base64');
    
    return res.status(200).json({ 
      success: true, 
      audio: audioBase64 
    });
    
  } catch (error) {
    console.error('TTS Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
