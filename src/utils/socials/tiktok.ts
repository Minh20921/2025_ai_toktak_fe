export const fetchTikTokUser = async (accessToken: string) => {
  try {
    const response = await fetch('/api/auth/x/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken }),
    });

    const data = await response.json();
    if (data.error) {
      console.error('Lỗi từ API server:', data);
      return null;
    }

    return {
      id: data.data.id,
      name: data.data.name,
      username: data.data.username,
      avatar: data.data.profile_image_url,
      profile_url: `https://twitter.com/${data.data.username}`,
    };
  } catch (error) {
    console.error('Lỗi lấy thông tin User từ TikTok:', error);
    return null;
  }
};
