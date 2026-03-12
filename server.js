const express = require('express');
const cors = require('cors');
const axios = require('axios');
const YTDlpWrap = require('yt-dlp-wrap').default;

const app = express();
const PORT = process.env.PORT || 3000;

// CORS enable karein (frontend se connect karne ke liye)
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'YouTube Downloader API is running!',
    status: 'active',
    endpoints: {
      info: '/api/info?url=YOUTUBE_URL',
      download: '/api/download?url=YOUTUBE_URL&format=mp4&quality=720'
    }
  });
});

// Video info nikalne ka endpoint
app.get('/api/info', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    const ytDlp = new YTDlpWrap();
    
    // Video info lo
    const videoInfo = await ytDlp.getVideoInfo(url);
    
    // Formats filter karein (MP4 + MP3)
    const formats = videoInfo.formats
      .filter(f => f.ext === 'mp4' || f.ext === 'm4a')
      .map(f => ({
        quality: f.qualityLabel || f.formatNote || 'audio',
        ext: f.ext,
        url: f.url,
        size: f.filesize || 'unknown'
      }));

    res.json({
      title: videoInfo.title,
      author: videoInfo.uploader,
      thumbnail: videoInfo.thumbnail,
      duration: videoInfo.duration_string,
      views: videoInfo.view_count,
      formats: formats
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch video info',
      details: error.message 
    });
  }
});

// Direct download link ka endpoint
app.get('/api/download', async (req, res) => {
  try {
    const { url, format, quality } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    const ytDlp = new YTDlpWrap();
    
    // Best format select karein
    let formatSelector;
    if (format === 'mp3') {
      formatSelector = 'bestaudio[ext=m4a]/bestaudio';
    } else {
      formatSelector = `bestvideo[height<=${quality || 720}][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best`;
    }

    // Direct URL lo
    const videoInfo = await ytDlp.getVideoInfo(url);
    const selectedFormat = videoInfo.formats.find(f => {
      if (format === 'mp3') return f.ext === 'm4a';
      return f.qualityLabel === `${quality}p` && f.ext === 'mp4';
    });

    if (!selectedFormat) {
      return res.status(404).json({ error: 'Format not found' });
    }

    res.json({
      downloadUrl: selectedFormat.url,
      title: videoInfo.title,
      format: format || 'mp4',
      quality: quality || '720p'
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to get download link',
      details: error.message 
    });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
