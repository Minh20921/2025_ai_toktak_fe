'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
  }
}

interface FacebookPixelProps {
  pixelId?: string; // optional: chỉ dùng nếu muốn gọi fbq track trực tiếp
}

export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const pathname = usePathname();
  const firstRef = useRef(true);

  useEffect(() => {
    // Bỏ lần đầu: Page View initial đã do GTM bắn (và/hoặc Pixel của GTM)
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }

    // 1) Push sự kiện cho GTM (để GTM fire Pixel/GA cho SPA)
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'virtual_pageview',
        page_path: pathname || '/',
      });
    }

    // 2) (Tuỳ chọn) Nếu muốn tự fbq track luôn khi SPA:
    //    Bật đoạn dưới khi BẠN CHẮC GTM không track trùng sự kiện này.
    if (pixelId && typeof window !== 'undefined' && typeof window.fbq === 'function') {
      // Guard nhỏ: không gọi khi chưa có fbq (lúc mới chuyển route cực nhanh)
      window.fbq('track', 'PageView');
    }
  }, [pathname, pixelId]);

  return null;
}
