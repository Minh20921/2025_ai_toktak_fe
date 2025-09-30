const TWITTER_CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || '';
const TWITTER_CLIENT_SECRET = process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://voda-play.com';
// Đổi Authorization Code lấy Access Token từ Twitter
export const fetchAccessTokenX = async (code: string) => {
  try {
    const response = await fetch('/api/auth/x', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    return data.access_token; // Trả về access_token
  } catch (error) {
    console.error('Lỗi lấy access token từ Twitter:', error);
    return null;
  }
};

// Lấy thông tin người dùng từ Twitter API
export const fetchTwitterUserX = async (accessToken: string) => {
  try {
    const response = await fetch('https://x.com/i/oauth2/users/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    if (!data || !data.data) return null;

    return {
      id: data.data.id,
      name: data.data.name,
      username: data.data.username,
      avatar: data.data.profile_image_url,
    };
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng từ Twitter:', error);
    return null;
  }
};
export const exchangeCodeForUser = async (code: string) => {
  try {
    const response = await fetch('/auth/api/x', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('Lỗi từ API server:', data);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Lỗi gọi API Next.js:', error);
    return null;
  }
};
