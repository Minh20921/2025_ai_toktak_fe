import Cookies from 'js-cookie';
import { TOKEN_LOGIN } from '@/utils/constant';

export const G_getAccessHeader = (refreshToken?: string, isForm: boolean = false) => {
  let accessToken = '';

  try {
    if (refreshToken) {
      accessToken = refreshToken;
    } else {
      const accessData = Cookies.get(TOKEN_LOGIN);
      accessToken = accessData || '';
    }
  } catch {}

  const headers: Record<string, string> = {
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
  };

  // ✅ Chỉ set Content-Type nếu KHÔNG phải FormData
  if (!isForm) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};
