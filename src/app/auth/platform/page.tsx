'use client';
import { PLATFORM } from '@/utils/constant';
import { showNotice } from '@/utils/custom/notice';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import API from '@service/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getLogoText } from '../../../../function/common';

const LOGO_TEXT = getLogoText();

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get('state');
  const code = searchParams.get('code');
  const access_token = searchParams.get('access_token');
  const [loading, setLoading] = useState(true);
  const saveAuthCode = useRef(
    new API(`/api/v1/user/new-link`, 'POST', {
      success: (res) => {
        if (res?.code === 201) {
          showNotice(res?.message, '', false, '확인', '');
        } else {
        }
      },
      error: (err) => console.error('Set link fail', err),
      finally: () => {},
    }),
  );

  useEffect(() => {
    if (state && (code || access_token)) {
      let platform;

      let isApp = false;
      switch (state) {
        case 'X':
          platform = PLATFORM.Twitter;
          break;
        case 'X_app':
          isApp = true;
          platform = PLATFORM.Twitter;
          break;
        case 'facebook':
          platform = PLATFORM.Facebook;
          break;
        case 'facebook_app':
          isApp = true;
          platform = PLATFORM.Facebook;
          break;
        case 'instagram':
          platform = PLATFORM.Instagram;
          break;
        case 'instagram_app':
          isApp = true;
          platform = PLATFORM.Instagram;
          break;
        case 'tiktok':
          platform = PLATFORM.Tiktok;
          break;
        case 'tiktok_app':
          isApp = true;
          platform = PLATFORM.Tiktok;
          break;
        case 'threads':
          platform = PLATFORM.Thread;
          break;
        case 'threads_app':
          isApp = true;
          platform = PLATFORM.Thread;
          break;
        case 'blog':
          platform = PLATFORM.Blog;
          break;
        case 'youtube':
          platform = PLATFORM.Youtube;
          break;
        case 'youtube_app':
          isApp = true;
          platform = PLATFORM.Youtube;
          break;
        default:
          platform = 0;
      }
      saveAuthCode.current.config.data = {
        link_id: platform,
        Code: code,
        AccessToken: access_token,
      };
      saveAuthCode.current.call().then(() => {
        setLoading(false);
        if (isApp) {
          window.location.href = 'toktakapp://oauthredirect';
        } else {
          router.push('/profile?tabIndex=2');
        }
      });
    }
  }, [state, code, router]);

  if (loading) {
    return (
      <Container
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
        className="px-[5px]"
      >
        {/* Logo */}
        <Typography
          className="absolute top-[30px] left-[38px] font-pretendard text-[30px] leading-[35.8px]"
          fontWeight="bold"
          color="#4776EF"
        >
          {LOGO_TEXT}
        </Typography>
        <Box>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return null;
}
