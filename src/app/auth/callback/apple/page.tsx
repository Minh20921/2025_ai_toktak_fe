'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SOCIAL_CONNECT_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/v1/auth/social-login`;
const REFERRAL_CODE = 'referral_code';

export default function AppleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    try {
    alert('Apple callback page loaded');
      // Apple trả về qua fragment: #id_token=...&state=...
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const idToken = params.get('id_token');
      const state = params.get('state');

      // (Optional) Kiểm tra state vs sessionStorage nếu muốn
      const expectState = sessionStorage.getItem('apple_oauth_state');
      if (expectState && state && state !== expectState) {
        throw new Error('STATE_MISMATCH');
      }

      if (!idToken) throw new Error('NO_ID_TOKEN');

      const referralCode = typeof window !== 'undefined' ? localStorage.getItem(REFERRAL_CODE) || '' : '';

      fetch(SOCIAL_CONNECT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'APPLE',
          access_token: idToken,
          referral_code: referralCode,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          // điều hướng đơn giản về trang chủ (hoặc ghép lại logic nâng cao như ở login page)
          if (data?.data?.access_token) {
            // bạn có thể dispatch redux nếu muốn, ở page client này thường dùng window.location
            window.location.href = '/';
          } else {
            router.push('/auth/login');
          }
        })
        .catch(() => router.push('/auth/login'))
        .finally(() => {
          sessionStorage.removeItem('apple_oauth_state');
          sessionStorage.removeItem('apple_oauth_nonce');
        });
    } catch (e) {
      router.push('/auth/login');
    }
  }, [router]);

  return null;
}
