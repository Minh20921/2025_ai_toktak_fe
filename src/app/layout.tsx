import { pretendard } from '@/app/lib/fonts';
import { ReduxProvider } from '@/app/lib/providers';
import customTheme from '@/utils/theme/custom-theme';
import { StyledEngineProvider } from '@mui/material';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import React from 'react';
import 'react-quill/dist/quill.snow.css';
import 'simplebar-react/dist/simplebar.min.css';
import './css/globals.css';

import MaintenanceNotice from '@/app/components/view-maintain';
import { SEO_DATA } from '@/utils/constant';
import FacebookPixel from './components/FacebookPixel';
import GoogleAnalytics from './components/GoogleAnalytics';
import GoogleTagManager from './components/GoogleTagManager';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? ''; // dùng trong SPA tracker nếu cần

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko-KR">
      <head>
        <GoogleTagManager gtmId={GTM_ID} />
        <GoogleAnalytics gaMeasurementId={GA_ID} />

        <meta name="naver-site-verification" content="762f1aaa47303e41c2a4fa3971fe1cc72259c479" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="naver:blog:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <ThemeModeScript />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: SEO_DATA.name,
              image: SEO_DATA.image,
              url: SEO_DATA.canonical,
              email: 'cs@bodaplay.ai',
              telephone: '02-2071-0716',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '서울특별시 영등포구 국제금융로6길 30',
                addressLocality: '영등포구',
                addressRegion: '서울특별시',
                postalCode: '07328',
                addressCountry: 'KR',
              },
              founder: '모영일',
              priceRange: '₩0–₩89,900',
              identifier: [
                { '@type': 'PropertyValue', name: '사업자등록번호', value: '217-88-02512' },
                { '@type': 'PropertyValue', name: '통신판매업신고번호', value: '제2023-서울영등포-2859호' },
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: SEO_DATA.ratingValue,
                reviewCount: SEO_DATA.reviewCount,
              },
            }),
          }}
        />

        <script
          src="https://cdn.socket.io/4.8.1/socket.io.min.js"
          integrity="sha384-mkQ3/7FUtcGyoppY6bz/PORYoGqOl7/aSUMn2ymDOJcapfS6PHqxhRTMh1RR0Q6+"
          crossOrigin="anonymous"
        /> 
      </head>
      <body className={pretendard.variable}>
        {/* GTM noscript fallback */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )} 
        {(GTM_ID || FB_PIXEL_ID) && <FacebookPixel pixelId={FB_PIXEL_ID} />}

        <StyledEngineProvider injectFirst>
          <ReduxProvider>
            <Flowbite theme={{ theme: customTheme }}>
              <MaintenanceNotice>{children}</MaintenanceNotice>
            </Flowbite>
          </ReduxProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
