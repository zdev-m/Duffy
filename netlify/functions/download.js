exports.handler = async (event, context) => {
  const { url } = event.queryStringParameters;
  
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL required' })
    };
  }

  try {
    // YouTube se video info nikaalne ke liye
    const videoId = extractVideoId(url);
    const info = await getVideoInfo(videoId);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        title: info.title,
        author: info.author,
        thumbnail: info.thumbnail,
        downloadUrl: info.formats[0].url
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

async function getVideoInfo(videoId) {
  // Simple fetch from YouTube oEmbed (basic info)
  const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
  const data = await response.json();
  
  return {
    title: data.title,
    author: data.author_name,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    formats: [{ url: `https://www.youtube.com/watch?v=${videoId}` }]
  };
}
