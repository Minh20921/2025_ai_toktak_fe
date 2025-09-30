import { getURLGoogle } from "../../../function/common";

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const REDIRECT_URI = getURLGoogle();


// Load Google SDK khi ứng dụng khởi động
export const loadGoogleSDK = (callback: (response: { credential: string }) => void): void => {
  const scriptId = 'google-sdk';

  if (document.getElementById(scriptId)) {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback,
      });
    }
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.id = scriptId;
  document.body.appendChild(script);

  script.onload = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback,
      });
    }
  };
};

// Hàm mở popup Google Login nếu `prompt()` bị lỗi
const openGoogleLoginPopup = (callback: (response: { credential: string }) => void) => {
  // Use Google's OAuth endpoint with the correct parameters for ID token
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=id_token&scope=email profile`;
  window.location.href = googleAuthUrl;
};

// Add a helper function to generate a nonce for security
const generateNonce = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

// Hàm xử lý đăng nhập Google
export const googleLogin = (callback: (response: { credential: string }) => void): void => {
  try {
    openGoogleLoginPopup(callback);
  } catch (error) {
    console.error('Lỗi khi gọi Google Login:', error);
    openGoogleLoginPopup(callback);
  }
};
