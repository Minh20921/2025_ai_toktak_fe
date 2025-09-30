'use client';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import { login } from '@/app/lib/store/authSlice';
import { IS_NEW_USER_REFERRAL, REFERRAL_CODE, TIME_REFERRAL_CODE_PERIOD } from '@/utils/constant';
import { loadGoogleSDK } from '@/utils/socials/google';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import moment from 'moment/moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getApiBaseUrl, getLogoText } from '../../../../function/common';

const SOCIAL_CONNECT_URL = `${getApiBaseUrl()}/api/v1/auth/social-login`;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'production';
const LOGO_TEXT = getLogoText();


const GooglePageSuccess: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const referralCode = typeof window !== 'undefined' ? localStorage.getItem(REFERRAL_CODE) || '' : '';
  useEffect(() => {
    loadGoogleSDK(handleGoogleCallback);
  }, []);
  useEffect(() => {
    // Extract ID token from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    if (idToken) {
      handleGoogleCallback({ credential: idToken });
    } else {
      console.error('No ID token found in redirect URL');
    }
  }, [router]);

  const handleGoogleCallback = (response: { credential: string }) => {
    fetch(SOCIAL_CONNECT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'GOOGLE',
        access_token: response.credential,
        referral_code: referralCode,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
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

        localStorage.setItem('user_level', JSON.stringify({ token: data.data.level }));
        localStorage.setItem(IS_NEW_USER_REFERRAL, data.data.new_user_referral_code);
        dispatch(login({ token: data.data.access_token, refreshToken: data.data.refresh_token }));

        // Chuyển hướng sau khi đăng ký thành công
        if (referralCode) {
          let referrer_user_id = data.data.referrer_user_id;
          let new_user_referral_code = data.data.new_user_referral_code;
          let is_auth_nice = data.data.is_auth_nice;
          // User đã tồn tại nhưng nhập mã mời thì về trang chủ
          if (referrer_user_id > 0 && new_user_referral_code == 0 && is_auth_nice == 1) {
            showNoticeMUI(
              '🔔 이미 가입된 회원입니다!',
              '초대 수락은 신규 가입 계정만 가능해요. 😊',
              false,
              '확인',
              '',
              () => router.push('/'),
            );
            // localStorage.removeItem(REFERRAL_CODE);
            // localStorage.removeItem(TIME_REFERRAL_CODE_PERIOD);
            // localStorage.removeItem(IS_NEW_USER_REFERRAL);
            return;
          }

          localStorage.removeItem(REFERRAL_CODE);
          localStorage.setItem(TIME_REFERRAL_CODE_PERIOD, moment().add(7, 'days').toISOString());
          router.push('/r');
          router.refresh();
          return;
        }
        //
        const batchId = localStorage.getItem('batchId');
        if (batchId && localStorage.getItem('action') === 'register') {
          router.push(`/analys?batchId=${batchId}`);
          localStorage.setItem('action', 'saveDraft');
        } else {
          let is_new_user = data.data.is_new_user;
          let subscription = data.data.subscription;
          if (is_new_user == 1) {
            if (subscription == 'NEW_USER') {
              showNoticeMUI(
                '🎉 신규 가입을 환영합니다!',
                '🎁 베이직 30일 이용권을 선물로 드렸어요! 😊',
                false,
                '확인',
                '',
                () => { },
                'success_coupon.gif',
              );
            } else {
              // setOpenBuyPackagePopup(true);
              router.push('/?new_user=1');
              return
              // showNoticeMUI('🎉 신규 가입을 환영합니다!', '', false, '확인', '', () => { }, 'success_coupon.gif');
            }
          }

          router.push('/');
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

export default GooglePageSuccess;
