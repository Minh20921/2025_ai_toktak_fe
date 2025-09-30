import API from '@service/api';
import { getApiBaseUrl } from '../../../function/common';
import { REFRESH_TOKEN, TOKEN_LOGIN } from '@/utils/constant';
import Cookies from 'js-cookie';

const BASE_URL = getApiBaseUrl();

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    type: string;
    expires_in: number;
  };
  message?: string;
}

export const refreshTokenService = async (refreshToken: string): Promise<RefreshTokenResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const refreshTokenAPI = fetch(`${BASE_URL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      refreshTokenAPI.then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            resolve(data as RefreshTokenResponse);
          });
        } else {
          reject(new Error('Refresh token error'));
        }
      });
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

export const getStoredRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Try localStorage first
  const fromLocalStorage = localStorage.getItem(REFRESH_TOKEN);
  if (fromLocalStorage) return fromLocalStorage;

  // Try cookies as fallback
  const fromCookies = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${REFRESH_TOKEN}=`))
    ?.split('=')[1];

  return fromCookies || null;
};

export const isTokenExpired = (token: string | undefined): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Assume expired if we can't parse
  }
};
