// pages/api/twitter.ts
import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_X_REDIRECT_URI!;
// Hàm đổi Authorization Code lấy Access Token
const fetchAccessToken = async (code: string) => {
  try {
    const clientCredentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const encodedCredentials = Buffer.from(clientCredentials).toString('base64');

    const response = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        code_verifier: 'challenge',
      }).toString(),
    });
    const data = await response.json();
    return data.access_token ? data.access_token : null;
  } catch (error) {
    console.error('Lỗi lấy access token từ Twitter:', error);
    return null;
  }
};

// Hàm lấy thông tin User từ Twitter API
const fetchTwitterUser = async (accessToken: string) => {
  try {
    const response = await fetch('https://api.x.com/2/users/me?user.fields=profile_image_url', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    return data.data
      ? {
          id: data.data.id,
          name: data.data.name,
          username: data.data.username,
          avatar: data.data.profile_image_url,
          profile_url: `https://x.com/${data.data.username}`,
        }
      : null;
  } catch (error) {
    console.error('Lỗi lấy thông tin User từ Twitter:', error);
    return null;
  }
};

// Xử lý OAuth Twitter (App Router)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  // Bước 1: Đổi code lấy access_token
  const accessToken = await fetchAccessToken(code);
  if (!accessToken) {
    return NextResponse.json({ error: 'Failed to fetch access token' }, { status: 500 });
  }

  // Bước 2: Lấy thông tin User từ Twitter API
  const userData = await fetchTwitterUser(accessToken);
  if (!userData) {
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }

  // Bước 3: Chuyển hướng về frontend với dữ liệu user
  const redirectURL = new URL('/auth/platform', url.origin);
  redirectURL.searchParams.set('state', 'X');
  redirectURL.searchParams.set('code', code);
  redirectURL.searchParams.set('id', userData.id);
  redirectURL.searchParams.set('name', userData.name);
  redirectURL.searchParams.set('username', userData.username);
  redirectURL.searchParams.set('avatar', userData.avatar);
  redirectURL.searchParams.set('profile_url', userData.profile_url);

  return NextResponse.redirect(redirectURL);
}
