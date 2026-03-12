# TubeGrab - YouTube Downloader

A modern, beautiful YouTube video downloader with smooth animations and intuitive UI.

## ⚠️ Important Notice

This is a **frontend demo** for educational purposes. To make it fully functional, you need to connect it to a backend API that handles YouTube downloads (due to CORS restrictions).

## Features

- 🎨 Modern glassmorphism design
- ✨ Smooth animations and transitions
- 📱 Fully responsive
- 🎬 Video & Audio download options
- 📊 Download progress animation
- 🎯 Quality selection (1080p, 720p, 480p, 360p, MP3)

## How to Use

1. Paste YouTube URL
2. Click "Analyze Video"
3. Select format (Video/Audio)
4. Choose quality
5. Click Download

## Deployment

### GitHub Pages

1. Create a new repository on GitHub
2. Upload these files
3. Go to Settings → Pages
4. Select source: Deploy from a branch
5. Select branch: main
6. Your site will be live at `https://yourusername.github.io/repo-name`

## Making It Functional

To actually download videos, you need a backend server. Popular options:

- **Node.js**: Use `ytdl-core` or `yt-dlp-wrap`
- **Python**: Use `yt-dlp` with Flask/FastAPI
- **External API**: Use RapidAPI's YouTube download services

### Example Backend (Node.js)

```javascript
const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

app.get('/download', async (req, res) => {
    const url = req.query.url;
    const format = req.query.format;
    
    const info = await ytdl.getInfo(url);
    // Process and return download link
});
