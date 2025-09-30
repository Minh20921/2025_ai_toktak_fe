'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { IS_NEW_USER_REFERRAL, REFERRAL_CODE, TIME_REFERRAL_CODE_PERIOD } from '@/utils/constant';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import { login } from '@/app/lib/store/authSlice';
import moment from 'moment/moment';
import { getApiBaseUrl, getLogoText } from '../../../../function/common';
import { Box, CircularProgress, Container, Typography } from '@mui/material';

const LOGO_TEXT = getLogoText();
const SOCIAL_CONNECT_URL = `${getApiBaseUrl()}/api/v1/auth/social-login`;

const FacebookLoginSuccess: React.FC = () => {
  const sp = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const referralCode = typeof window !== 'undefined' ? localStorage.getItem(REFERRAL_CODE) || '' : '';

  useEffect(() => {
    const userID = sp.get('userID') as string;
    const accessToken = sp.get('accessToken') as string;
    if (userID && accessToken) {
      handleFacebookLogin(accessToken, userID);
    }
  }, [router]);

  const handleFacebookLogin = (accessToken: string, userID: string) => {
    fetch(SOCIAL_CONNECT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'FACEBOOK',
        access_token: accessToken,
        person_id: userID,
        referral_code: referralCode,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Server response:', data);
        if (data?.code == 201) {
          showNoticeMUI(
            data?.data?.error_message_title || '⚠️ 현재는 재가입할 수 없어요!',
            data?.data?.error_message || '🚫 탈퇴하신 계정은 30일간 재가입하실 수 없습니다.',
            false,
            '확인',
            '',
            () => router.push('/auth/login'),
          );
          return;
        } else if (data?.code == 202) {
          localStorage.removeItem(REFERRAL_CODE);
          showNoticeMUI(
            data?.data?.error_message_title || '⚠️ 현재는 재가입할 수 없어요!',
            data?.data?.error_message || '🚫 탈퇴하신 계정은 30일간 재가입하실 수 없습니다.',
            false,
            '확인',
            '',
            () => router.push('/'),
          );
          return;
        }

        localStorage.setItem(IS_NEW_USER_REFERRAL, data.data.new_user_referral_code);
        dispatch(login({ token: data.data.access_token, refreshToken: data.data.refresh_token }));
        if (referralCode) {
          localStorage.removeItem(REFERRAL_CODE);
          localStorage.setItem(TIME_REFERRAL_CODE_PERIOD, moment().add(7, 'days').toISOString());
          router.push('/r');
          router.refresh();
          return;
        }
        const batchId = localStorage.getItem('batchId');
        if (batchId && localStorage.getItem('action') === 'register') {
          localStorage.setItem('action', 'saveDraft');
          router.push(`/analys?batchId=${batchId}`);
          router.refresh();
        } else {
          let is_new_user = data.data.is_new_user;
          if (is_new_user == 1) {
            showNoticeMUI(
              '🎉 신규 가입을 환영합니다!',
              '🎁 베이직 30일 이용권을 선물로 드렸어요! 😊',
              false,
              '확인',
              '',
              () => {},
              'success_coupon.gif',
            );
          }

          router.push('/');
          router.refresh();
        }

        // Xử lý đăng nhập thành công, ví dụ: lưu token vào localStorage
      })
      .catch((err) => console.error('Error:', err));
  };

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
        onClick={() => router.push('/')}
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
};

export default FacebookLoginSuccess;
