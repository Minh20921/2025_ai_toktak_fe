'use client';
import { Box, Button, Container, Divider, dividerClasses, Stack, Typography } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { loadFacebookSDK } from '@/utils/socials/facebook';
import { useRouter } from 'next/navigation';
import { googleLogin as handleGoogleLogin, loadGoogleSDK } from '@/utils/socials/google';
import { login } from '@/app/lib/store/authSlice';
import { useDispatch } from 'react-redux';
import AuthLogin from '@/app/auth/authforms/AuthLogin';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import { IS_NEW_USER_REFERRAL, REFERRAL_CODE, TIME_REFERRAL_CODE_PERIOD } from '@/utils/constant';
import moment from 'moment';
import Image from 'next/image';
import { getApiBaseUrl, getLogoText } from '../../../../function/common';
import { showCouponPopup } from '@/utils/custom/couponPopup';
import { emailPopupLogin } from '@/utils/custom/emailPopupLogin';
import { noticeInput } from '@/app/components/common/noticeInput';
import { noticeLoginBack } from '@/app/components/common/noticeLoginBack';
import { FaApple } from 'react-icons/fa';

declare global {
  interface Window {
    AppleID?: any;
    __APPLE_INITED__?: boolean;
  }
}

const APPLE_STATE_KEY = 'apple_oauth_state';
const APPLE_NONCE_KEY = 'apple_oauth_nonce';

function randHex(len = 32) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

const SOCIAL_CONNECT_URL = `${getApiBaseUrl()}/api/v1/auth/social-login`;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'production';
const LOGO_TEXT = getLogoText();

const BoxedLogin: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isIOS, setIsIOS] = useState(false);

  const referralCode = typeof window !== 'undefined' ? localStorage.getItem(REFERRAL_CODE) || '' : '';

  const [facebook_access_token, setFacebookAccessToken] = useState<string>('');
  const [person_id, setPersonId] = useState<string>('');
  const [user_email, setUserEmail] = useState<string>('');
  const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '';
  const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || '';

  // ===== iOS detection (iPhone/iPad, kể cả iPadOS desktop mode) =====
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = window.navigator.userAgent || '';
    const isiOSUA = /iPad|iPhone|iPod/.test(ua);
    const isIPadOSDesktop = navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1;
    setIsIOS(isiOSUA || isIPadOSDesktop);
  }, []);

  function loadAppleSDK(onLoad?: () => void) {
    if (typeof window === 'undefined') return;
    if (window.AppleID) { onLoad?.(); return; }

    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.onload = () => onLoad?.();
    document.body.appendChild(script);
  }

  function initApple() {
    if (typeof window === 'undefined') return;
    const AppleID = window.AppleID;
    if (!AppleID) return;
    if (window.__APPLE_INITED__) return; // tránh init nhiều lần

    // Tạo state/nonce để bảo vệ request
    const state = randHex(16);
    const nonce = randHex(16);
    sessionStorage.setItem(APPLE_STATE_KEY, state);
    sessionStorage.setItem(APPLE_NONCE_KEY, nonce);

    AppleID.auth.init({
      clientId: APPLE_CLIENT_ID,       // VD: com.toktak.ai.web
      redirectURI: APPLE_REDIRECT_URI, // VD: https://toktak.ai/auth/callback/apple
      scope: 'name email',
      usePopup: true,                  // dùng popup
      state,                           // để so khớp sau khi nhận phản hồi
      nonce,                           // bảo vệ id_token
      response_type: 'id_token',       // yêu cầu id_token để FE gửi về BE
      response_mode: 'fragment',       // phù hợp cho popup
    });

    window.__APPLE_INITED__ = true;
  }

  const handleAppleLogin = async () => {
    try {
      if (!isIOS) return;
      const AppleID = window.AppleID;
      if (!AppleID?.auth?.signIn) {
        initApple();
      }
      const res = await AppleID.auth.signIn();

      // Một số version trả state ngoài/hoặc trong authorization
      const returnedState = res?.state || res?.authorization?.state;
      const expectState = sessionStorage.getItem(APPLE_STATE_KEY);
      if (returnedState && expectState && returnedState !== expectState) {
        throw new Error('STATE_MISMATCH');
      }

      const idToken = res?.authorization?.id_token;
      if (!idToken) throw new Error('NO_ID_TOKEN');

      // Thông tin user (chỉ trả về lần đầu)
      const appleUser = res?.user || null;

      const resp = await fetch(SOCIAL_CONNECT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'APPLE',
          access_token: idToken,
          referral_code: referralCode,
          // có thể gửi thêm thông tin lần đầu (optional)
          apple_user: appleUser,
        }),
      });

      const data = await resp.json();

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
      } else if (data?.code == 203) {
        showNoticeMUI('🔔 이미 가입된 회원입니다!', '초대 수락은 신규 가입 계정만 가능해요. 😊', false, '확인', '');
      }

      dispatch(login({ token: data.data.access_token, refreshToken: data.data.refresh_token }));

      // Giữ nguyên luồng điều hướng của bạn
      const batchId = localStorage.getItem('batchId');
      if (batchId && localStorage.getItem('action') === 'register') {
        localStorage.setItem('action', 'saveDraft');
        router.push(`/analys?batchId=${batchId}`);
        router.refresh();
      } else {
        const is_new_user = data.data.is_new_user;
        if (is_new_user == 1) {
          showNoticeMUI(
            '🎉 신규 가입을 환영합니다!',
            '🎁 베이직 30일 이용권을 선물로 드렸어요! 😊',
            false,
            '확인',
            '',
            () => { },
            'success_coupon.gif',
          );
        }
        window.location.href = '/';
      }
    } catch (err: any) {
      // Một số error code phổ biến từ Apple
      // err.error === 'popup_blocked_by_browser' | 'user_cancelled_authorize' | ...
      console.error('Apple login error:', err);
      if (err?.error === 'popup_blocked_by_browser') {
        showNoticeMUI('팝업이 차단되었어요', '브라우저 팝업을 허용하고 다시 시도해주세요.', false, '확인', '');
      } else if (err?.message === 'STATE_MISMATCH') {
        showNoticeMUI('요청이 만료되었어요', '다시 시도해주세요.', false, '확인', '');
      } else if (err?.message === 'NO_ID_TOKEN') {
        showNoticeMUI('로그인 실패', 'Apple에서 토큰을 받지 못했어요. 다시 시도해주세요.', false, '확인', '');
      } else if (err?.error === 'user_cancelled_authorize') {
        // người dùng tự đóng/cancel → im lặng hoặc thông báo nhẹ
      } else {
        showNoticeMUI('로그인 실패', '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.', false, '확인', '');
      }
    } finally {
      // dọn state/nonce mỗi lần xong một lượt
      sessionStorage.removeItem(APPLE_STATE_KEY);
      sessionStorage.removeItem(APPLE_NONCE_KEY);
    }
  };


  useEffect(() => {
    loadFacebookSDK();
    loadGoogleSDK(handleGoogleCallback);

  }, []);


  useEffect(() => {
    if (facebook_access_token && person_id) {
      loginSocialAccount(facebook_access_token, person_id, referralCode, user_email);
    }
  }, [facebook_access_token, person_id]);

  function handleClosePopup() {
    noticeLoginBack(
      '🥲 회원가입이 어려울 수 있어요.',
      '이메일을 입력하지 않으면 가입이 완료되지 않아요.<br>계속 진행하시겠어요?',
      true,
      '확인',
      '취소',
      () => {
        noticeInput(
          '🎉 신규 가입을 환영합니다!',
          '페이스북 가입 시 서비스 이용을 위해 이메일을 입력이 필요해요!<br>취소 시 회원가입 진행이 어려울 수 있어요.',
          true,
          '확인',
          '취소',
          (email: string) => {
            loginSocialAccount(facebook_access_token, person_id, referralCode, email);
          },
          () => {
            handleClosePopup();
          },
        );
      },
      () => {
        router.push('/');
      },
    );
  }



  function loginSocialAccount(access_token, person_id, referralCode, user_email) {
    fetch(SOCIAL_CONNECT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'FACEBOOK',
        access_token: access_token,
        person_id: person_id,
        referral_code: referralCode,
        user_email: user_email,
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
            data?.data?.error_message_title || '🎉 신규 가입을 환영합니다!',
            data?.data?.error_message || '페이스북 가입 시 서비스 이용을 위해 이메일을 입력이 필요해요!<br>취소 시 회원가입 진행이 어려울 수 있어요.',
            false,
            '확인',
            '',
            () => router.push('/'),
          );
          return;
        } else if (data?.code == 203) {
          noticeInput(
            '🎉 신규 가입을 환영합니다!',
            '페이스북 가입 시 서비스 이용을 위해 이메일을 입력이 필요해요!<br>취소 시 회원가입 진행이 어려울 수 있어요.',
            true,
            '확인',
            '취소',
            (email: string) => {
              loginSocialAccount(facebook_access_token, person_id, referralCode, email);
            },
            () => {
              handleClosePopup();
            },
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
              router.push('/?new_user=1');
              return
            }
          }

          router.push('/');
          router.refresh();
        }

        // Xử lý đăng nhập thành công, ví dụ: lưu token vào localStorage
      })
      .catch((err) => console.error('Error:', err));
  }
  useEffect(() => {
    if (isIOS) {
      loadAppleSDK(() => {
        initApple();
      });
    }
  }, [isIOS]);

  const handleFacebookLogin = () => {
    console.log('login facebook');
    if (!window.FB) return;
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          console.log('Facebook login success!', response);
          setFacebookAccessToken(response.authResponse.accessToken);
          setPersonId(response.authResponse.userID);
          // Gửi access token về server backend để xử lý đăng nhập
          fetch(SOCIAL_CONNECT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: 'FACEBOOK',
              access_token: response.authResponse.accessToken,
              person_id: response.authResponse.userID,
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
                    () => { },
                    'success_coupon.gif',
                  );
                }

                router.push('/');
                router.refresh();
              }

              // Xử lý đăng nhập thành công, ví dụ: lưu token vào localStorage
            })
            .catch((err) => console.error('Error:', err));
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      },
      {
        scope: 'email,public_profile,pages_manage_posts'
        // scope: 'email,public_profile'
      },
    );
  };

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
        } else if (data?.code == 203) {
          showNoticeMUI('🔔 이미 가입된 회원입니다!', '초대 수락은 신규 가입 계정만 가능해요. 😊', false, '확인', '');
        }

        dispatch(login({ token: data.data.access_token, refreshToken: data.data.refresh_token }));
        window.location.href = '/';
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
      className="px-4"
    >
      {/* Logo */}
      <Typography
        onClick={() => router.push('/')}
        className="absolute top-[8px] left-[15px] md:top-[30px] md:left-[38px] font-pretendard text-[24px] lg:text-[30px] leading-[35.8px] flex gap-[5px] items-center justify-center"
        fontWeight="bold"
        color="#4776EF"
      >
        <Image src={'/images/logos/sidebar-logo.svg'} width={40} height={40} alt="logo" className="lg:hidden" />
        {LOGO_TEXT}
      </Typography>

      {/* Tiêu đề */}
      <Typography
        className="text-[21px] sm:text-4xl font-pretendard leadinng-[50px] mt-[100px] sm:mt-[50px]"
        color="#090909"
        textAlign="center"
        fontWeight="bold"
      >
        AI 콘텐츠 생성부터 배포까지 <br /> 단 한 번의 클릭으로
      </Typography>
      <Typography
        className="text-[14px] md:text-[12px] lg:text-[16px] font-pretendard mt-[15px] md:mt-[10px] lg:mt-[20px]"
        color="#686868"
        textAlign="center"
        fontWeight="medium"
      >
        회원가입 없이 간편 로그인하고 무료 체험해보세요.
      </Typography>

      {/* Nút đăng nhập */}
      <Stack spacing="20px" width="100%" className="mt-[60px] md:mt-[40px] lg:mt-[60px]">
        <Button
          variant="outlined"
          fullWidth
          startIcon={<FcGoogle size={34} />}
          onClick={handleGoogleLogin}
          className="border-[1px] lg:border-[2px] text-[16px] lg:text-[18px] h-[60px] lg:h-[69px] gap-[10px] lg:gap-[30px]"
          sx={{
            justifyContent: 'left',
            textTransform: 'none',
            fontWeight: '500',
            lineHeight: '25.06px',
            borderRadius: '10px',
            color: '#272727',
            textAlign: 'left',
            borderColor: '#EAEAEA',
            padding: '22px 30px',
          }}
        >
          Google로 계속하기
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<FaFacebook color="#1778F2" size={34} />}
          onClick={handleFacebookLogin}
          className="border-[1px] lg:border-[2px] text-[16px] lg:text-[18px] h-[60px] lg:h-[69px] gap-[10px] lg:gap-[30px]"
          sx={{
            justifyContent: 'left',
            textTransform: 'none',
            fontWeight: '500',
            lineHeight: '25.06px',
            borderRadius: '10px',
            color: '#272727',
            textAlign: 'left',
            borderColor: '#EAEAEA',
            padding: '22px 30px',
          }}
        >
          facebook 계정으로 계속하기
        </Button>
        {isIOS && (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<FaApple size={34} />}
            onClick={handleAppleLogin}
            className="border-[1px] lg:border-[2px] text-[16px] lg:text-[18px] h-[60px] lg:h-[69px] gap-[10px] lg:gap-[30px]"
            sx={{
              justifyContent: 'left',
              textTransform: 'none',
              fontWeight: '500',
              lineHeight: '25.06px',
              borderRadius: '10px',
              color: '#272727',
              textAlign: 'left',
              borderColor: '#EAEAEA',
              padding: '22px 30px',
            }}
          >
            Apple로 계속하기
          </Button>
        )}
      </Stack>
      {ENVIRONMENT == 'local' && <AuthLogin />}
      {/* Liên kết điều khoản */}
      <Box mt="180px" textAlign="center" className="flex flex-col justify-center mt-[100px] md:mt-[180px]">
        <Typography className="font-pretendard font-medium text-base" variant="caption" color="#4776EF">
          계속하면 톡탁의
          <a href="/terms" className="underline underline-offset-4">
            이용약관
          </a>
          및
        </Typography>
        <Typography className="font-pretendard font-medium text-base" variant="caption" color="#4776EF">
          <a href="/policy" className="underline underline-offset-4">
            개인정보처리방침에
          </a>
          동의하게 됩니다.
        </Typography>
      </Box>
    </Container>
  );
};

export default BoxedLogin;
