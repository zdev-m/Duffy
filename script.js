// Netlify Backend URL
const API_URL = '/api/download';

// State
let currentVideoInfo = null;

// DOM Elements
const inputSection = document.getElementById('inputSection');
const loadingSection = document.getElementById('loadingSection');
const videoInfo = document.getElementById('videoInfo');
const successMessage = document.getElementById('successMessage');

// Paste URL
async function pasteUrl() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById('videoUrl').value = text;
    showToast('URL pasted!');
  } catch (err) {
    showToast('Paste manually');
  }
}

// Analyze Video
async function analyzeVideo() {
  const url = document.getElementById('videoUrl').value.trim();
  
  if (!url || !isValidYouTubeUrl(url)) {
    showToast('Valid YouTube URL dalen');
    return;
  }

  // Show loading
  inputSection.style.display = 'none';
  loadingSection.style.display = 'block';

  try {
    // Call Netlify Function
    const response = await fetch(`${API_URL}?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    const data = await response.json();
    currentVideoInfo = data;
    
    // Display info
    displayVideoInfo(data);
    
    loadingSection.style.display = 'none';
    videoInfo.style.display = 'block';

  } catch (error) {
    console.error('Error:', error);
    showToast('Error! Try again.');
    loadingSection.style.display = 'none';
    inputSection.style.display = 'block';
  }
}

// Validate URL
function isValidYouTubeUrl(url) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
}

// Display Video Info
function displayVideoInfo(data) {
  document.getElementById('videoThumbnail').src = data.thumbnail;
  document.getElementById('videoTitle').textContent = data.title;
  document.getElementById('videoAuthor').textContent = data.author;
  document.getElementById('durationBadge').textContent = '00:00';
  document.getElementById('viewCount').textContent = '0';
  document.getElementById('uploadDate').textContent = 'Recently';
}

// Tab switch
function switchTab(tab) {
  const videoBtn = document.querySelectorAll('.tab-btn')[0];
  const audioBtn = document.querySelectorAll('.tab-btn')[1];
  
  if (tab === 'video') {
    videoBtn.classList.add('active');
    audioBtn.classList.remove('active');
    document.getElementById('videoFormats').style.display = 'grid';
    document.getElementById('audioFormats').style.display = 'none';
  } else {
    videoBtn.classList.remove('active');
    audioBtn.classList.add('active');
    document.getElementById('videoFormats').style.display = 'none';
    document.getElementById('audioFormats').style.display = 'grid';
  }
}

// Select format
function selectFormat(element, format) {
  document.querySelectorAll('.format-card').forEach(c => c.classList.remove('selected'));
  element.classList.add('selected');
}

// Download
async function startDownload() {
  if (!currentVideoInfo || !currentVideoInfo.downloadUrl) {
    showToast('No download link available');
    return;
  }
  
  // Open download in new tab
  window.open(currentVideoInfo.downloadUrl, '_blank');
  showSuccess();
}

// Show success
function showSuccess() {
  videoInfo.style.display = 'none';
  successMessage.style.display = 'block';
}

// Reset
function resetApp() {
  document.getElementById('videoUrl').value = '';
  successMessage.style.display = 'none';
  inputSection.style.display = 'block';
  currentVideoInfo = null;
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMessage').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Enter key
document.getElementById('videoUrl').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') analyzeVideo();
});
