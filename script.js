// State management
let currentFormat = '720p';
let currentTab = 'video';
let isDownloading = false;

// DOM Elements
const inputSection = document.getElementById('inputSection');
const loadingSection = document.getElementById('loadingSection');
const videoInfo = document.getElementById('videoInfo');
const successMessage = document.getElementById('successMessage');
const toast = document.getElementById('toast');

// Paste URL from clipboard
async function pasteUrl() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('videoUrl').value = text;
        showToast('URL pasted successfully!');
    } catch (err) {
        showToast('Unable to paste. Please paste manually.');
    }
}

// Analyze video (Simulated)
async function analyzeVideo() {
    const url = document.getElementById('videoUrl').value.trim();
    
    if (!url) {
        showToast('Please enter a YouTube URL');
        return;
    }
    
    if (!isValidYouTubeUrl(url)) {
        showToast('Please enter a valid YouTube URL');
        return;
    }
    
    // Show loading
    inputSection.style.display = 'none';
    loadingSection.style.display = 'block';
    
    // Simulate API call with progress
    await simulateLoading();
    
    // Extract video ID and fetch info
    const videoId = extractVideoId(url);
    
    // For demo purposes, using a placeholder
    // In real implementation, you'd call a backend API
    const videoData = await fetchVideoInfo(videoId);
    
    // Display video info
    displayVideoInfo(videoData);
    
    loadingSection.style.display = 'none';
    videoInfo.style.display = 'block';
}

// Simulate loading animation
function simulateLoading() {
    return new Promise(resolve => {
        const progressFill = document.getElementById('progressFill');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(resolve, 500);
            }
            progressFill.style.width = progress + '%';
        }, 200);
    });
}

// Validate YouTube URL
function isValidYouTubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
}

// Extract video ID
function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Fetch video info (Simulated - replace with actual API)
async function fetchVideoInfo(videoId) {
    // In a real implementation, this would call your backend API
    // For demo, returning placeholder data
    
    return {
        id: videoId,
        title: "Sample YouTube Video Title",
        author: "Channel Name",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: "10:24",
        views: "1.2M",
        date: "2 weeks ago"
    };
}

// Display video information
function displayVideoInfo(data) {
    document.getElementById('videoThumbnail').src = data.thumbnail;
    document.getElementById('videoTitle').textContent = data.title;
    document.getElementById('videoAuthor').textContent = data.author;
    document.getElementById('durationBadge').textContent = data.duration;
    document.getElementById('viewCount').textContent = data.views;
    document.getElementById('uploadDate').textContent = data.date;
}

// Switch between Video and Audio tabs
function switchTab(tab) {
    currentTab = tab;
    
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tab-btn').classList.add('active');
    
    // Show/hide formats
    if (tab === 'video') {
        document.getElementById('videoFormats').style.display = 'grid';
        document.getElementById('audioFormats').style.display = 'none';
        currentFormat = '720p';
    } else {
        document.getElementById('videoFormats').style.display = 'none';
        document.getElementById('audioFormats').style.display = 'grid';
        currentFormat = 'mp3-320';
    }
    
    // Reset selection
    document.querySelectorAll('.format-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector('.formats-grid[style*="grid"] .format-card').classList.add('selected');
}

// Select format
function selectFormat(element, format) {
    document.querySelectorAll('.format-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
    currentFormat = format;
}

// Start download (Simulated)
async function startDownload() {
    if (isDownloading) return;
    
    isDownloading = true;
    const btn = document.querySelector('.download-btn');
    const btnText = btn.querySelector('.btn-text');
    const progressFill = document.getElementById('downloadProgressFill');
    const percentText = document.getElementById('downloadPercent');
    
    btn.classList.add('downloading');
    btnText.textContent = 'Downloading...';
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                showSuccess();
            }, 500);
        }
        
        progressFill.style.width = progress + '%';
        percentText.textContent = Math.round(progress) + '%';
    }, 200);
}

// Show success message
function showSuccess() {
    videoInfo.style.display = 'none';
    successMessage.style.display = 'block';
    isDownloading = false;
    
    // Reset button state
    const btn = document.querySelector('.download-btn');
    btn.classList.remove('downloading');
    btn.querySelector('.btn-text').textContent = 'Download Now';
    document.getElementById('downloadProgressFill').style.width = '0%';
    document.getElementById('downloadPercent').textContent = '0%';
}

// Reset app
function resetApp() {
    document.getElementById('videoUrl').value = '';
    successMessage.style.display = 'none';
    inputSection.style.display = 'block';
    currentFormat = '720p';
    currentTab = 'video';
    
    // Reset tabs
    document.querySelectorAll('.tab-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === 0);
    });
    document.getElementById('videoFormats').style.display = 'grid';
    document.getElementById('audioFormats').style.display = 'none';
}

// Show toast notification
function showToast(message) {
    const toastEl = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toastEl.classList.add('show');
    
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// Enter key support
document.getElementById('videoUrl').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        analyzeVideo();
    }
});
