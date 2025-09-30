const YOUTUBE_CLIENT_ID = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || '';
const YOUTUBE_CLIENT_SECRET = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://voda-play.com';
// Đổi Authorization Code lấy Access Token
export const fetchAccessTokenYoutube = async (code: string) => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code,
        client_id: YOUTUBE_CLIENT_ID,
        client_secret: YOUTUBE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const data = await response.json();
    return data.access_token; // Trả về access_token
  } catch (error) {
    console.error('Lỗi lấy access token:', error);
    return null;
  }
};

// Lấy thông tin kênh YouTube của người dùng
export const fetchYouTubeChannel = async (accessToken: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    if (!data.items || data.items.length === 0) return null;

    const channel = data.items[0];
    return {
      id: channel.id,
      name: channel.snippet.title,
      url: `https://www.youtube.com/${channel.snippet.customUrl}`,
      avatar: channel.snippet.thumbnails.default.url,
    };
  } catch (error) {
    console.error('Lỗi lấy thông tin kênh:', error);
    return null;
  }
};
