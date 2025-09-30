'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { REFERRAL_CODE, TOKEN_LOGIN } from '@/utils/constant';
import Cookies from 'js-cookie';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Icon } from '@iconify/react';
import API from '@service/api';
import { showNoticeError } from '@/utils/custom/notice_error';

// Styled components
const BlueBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#4169e1',
  color: 'white',
  padding: theme.spacing(4, 0),
  textAlign: 'center',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: '15px 0 22px',
  },
}));

const CouponBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '300px', // default (xs)
  maxWidth: '100%',
  height: 'auto',
  margin: '0 auto',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    width: '220px',
  },
  [theme.breakpoints.up('md')]: {
    width: '365px',
  },
}));
const StepBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'start',
  marginBottom: theme.spacing(2),
}));

const StepLabel = styled(Box)(({ theme }) => ({
  flex: 'none',
  color: '#4776EF',
  borderRadius: 99,
  padding: '3px 6px',
  marginRight: theme.spacing(2),
  marginTop: -2,
  fontWeight: '700',
  lineHeight: '19px',
  border: '2px solid #4776EF',
  width: '70px',
  textAlign: 'center',
  fontSize: '13.55px',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    width: '60px',
    marginTop: -8,
  },
}));

const StepContent = styled(Typography)(({ theme }) => ({
  color: '#272727',
  fontWeight: '500',
  lineHeight: '21px',
  fontFamily: 'var(--font-pretendard)',
  fontSize: '18px',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    lineHeight: '16px',
    whiteSpace: 'normal',
  },
}));

const NumberCircle = styled(Box)(({ theme }) => ({
  backgroundColor: '#0045FF',
  color: 'white',
  borderRadius: '4px',
  width: 19,
  height: 19,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1),
  fontSize: '12px',
}));

const LightBlueBackground = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  zIndex: 1200,
  padding: theme.spacing(2),
  backgroundColor: 'white ',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    position: 'static',
    backgroundColor: '#EFF5FF',
    padding: theme.spacing(4, 2),
    marginTop: theme.spacing(4),
  },
}));

const ReferralPage = ({ params }: { params: { referral_code: string } }) => {
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [tokenAuth, setTokenAuth] = useState<string | undefined>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState<boolean>(true);

  const checkReferalApi = useRef(
    new API(`/api/v1/user/check_refer_code`, 'GET', {
      success: (res) => {
        if (res?.code === 201) {
          showNoticeError(res?.data.error_message_title, res?.data.error_message, false, '확인', '취소', () => {
            setLoading(false);
            router.push('/');
          });
        } else if (res?.code === 202) {
          router.push('/');
        } else if (res?.code === 203) {
          showNoticeError(res?.data.error_message_title, res?.data.error_message, false, '확인', '취소', () => {
            setLoading(false);
            router.push('/');
          });
        } else {
          if (!tokenAuth) {
            router.push('/auth/login');
          }
        }
      },
      error: (err) => {
        showNoticeError('Failed to check refer code', '', false, '확인', '취소', () => {
          // setLoading(false);
        });
      },
      finally: () => {
      },
    }),
  );

  useEffect(() => {
    setIsMounted(true);
    setTokenAuth(Cookies.get(TOKEN_LOGIN));
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (params.referral_code) {
      localStorage.setItem(REFERRAL_CODE, params.referral_code);
      checkReferalApi.current.config.params = {
        referral_code: params.referral_code.toString(),
      };
      checkReferalApi.current.call();
    }

    if (!tokenAuth) {
      // router.push('/auth/login');
      //router.push('/auth/login');
    }
  }, [isMounted, params.referral_code, tokenAuth]);

  if (!isMounted) return null;

  const handleVerify = () => {
    router.push(`/auth/verification/nice_auth?redirect=${pathname}`);
  };

  // if (!tokenAuth) return <CircularProgress />;
  // if (!tokenAuth) return <CircularProgress />;

  return (
    <>
      {/* Blue Header */}
      <BlueBackground>
        <IconButton
          sx={{ position: 'absolute', top: { xs: 12, sm: 32 }, left: { xs: 18, sm: 32 } }}
          onClick={() => router.push('/')}
        >
          <Icon icon={'material-symbols:home-outline-rounded'} color="white" width={26} height={26} />
        </IconButton>
        <Typography
          color="#FFFFFF"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '24px', sm: '20px', md: '30px' },
            lineHeight: { xs: '32px', sm: '42px', md: '42px' },
            mb: { xs: '22px', sm: '16px', md: '40px' },
            whiteSpace: { xs: 'pre-line', sm: 'nowrap', md: 'pre-line' },
          }}
        >
          {'친구에게 톡탁 소개하고 \n 이용권 받기!'}
        </Typography>

        {/* Coupon */}
        <Box sx={{ mt: 0, mb: { xs: -12.5, sm: -9, md: -9 }, mx: 2 }}>
          <CouponBox className="shadow-lg">
            <Box
              component="img"
              src={'/images/referral/coupon-tag.png'}
              sx={{ width: { xs: '300px', sm: '220px', md: '365px' } }}
              alt="coupon-tag"
            />

            <Box
              sx={{
                position: 'absolute',
                textAlign: 'center',
                zIndex: '10',
                top: { xs: '28.86px', sm: '20.43px', md: '49px' },
                left: 0,
                right: 0,
              }}
            >
              <Typography
                variant="body2"
                color="#494949"
                sx={{
                  fontWeight: 'normal',
                  fontSize: { xs: '16px', sm: '12.64px ', md: '21px' },
                  mb: { xs: '16px', sm: '12px', md: '19px' },
                  fontFamily: 'GmarketSans, sans-serif',
                  lineHeight: { xs: '11px', sm: '9px', md: '15px' },
                }}
              >
                7일 무료 이용
              </Typography>
              <Typography
                color="#2B2B2B"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '32px', sm: '24.08px', md: '40px' },
                  letterSpacing: { xs: '-1.18px', sm: '-0.86px', md: '-1.43px' },
                  lineHeight: { xs: '23px', sm: '17px', md: '28px' },
                  fontFamily: 'GmarketSans, sans-serif',
                }}
              >
                Basic 쿠폰
              </Typography>
            </Box>
          </CouponBox>
        </Box>
      </BlueBackground>

      {/* 초대 수락 방법 */}
      <Box sx={{ mx: 2, my: { xs: 4, sm: 5 }, justifySelf: 'center' }}>
        <Typography
          align="center"
          color="#4776EF"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '16px', md: '24px' },
            lineHeight: '24px',
            fontFamily: 'GmarketSans, sans-serif',
            mb: { xs: 1, md: 5 },
          }}
        >
          초대 수락 방법
        </Typography>

        {/* Steps */}
        <StepBox>
          <StepLabel>STEP 1</StepLabel>
          <StepContent>친구는 초대 링크를 통해 톡탁에 접속해야 합니다.</StepContent>
        </StepBox>

        <StepBox>
          <StepLabel>STEP 2</StepLabel>
          <StepContent>초대링크를 통해 접속한 친구는 다음 2가지를 완료 합니다.</StepContent>
        </StepBox>

        <Box sx={{ ml: { xs: 10, md: 11 }, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <NumberCircle>1</NumberCircle>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: '12px', md: '18px' },
                lineHeight: { xs: '16x', md: '21px' },
                color: '#0045FF',
                fontFamily: 'var(--font-pretendard)',
              }}
            >
              회원가입
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NumberCircle>2</NumberCircle>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: '12px', md: '18px' },
                lineHeight: { xs: '16x', md: '21px' },
                color: '#0045FF',
                fontFamily: 'var(--font-pretendard)',
              }}
            >
              연락처 등록 및 본인 인증
            </Typography>
          </Box>
        </Box>

        <StepBox>
          <StepLabel>STEP 3</StepLabel>
          <StepContent>
            회원가입과 연락처 본인 인증이 완료되면 <br />
            초대한 친구와 초대 받은 친구에게 보상이 자동 적용됩니다.
          </StepContent>
        </StepBox>
      </Box>

      <Divider sx={{ height: '2px', bgcolor: '#F1F1F1' }} />

      {/* 쿠폰 안내 */}
      <Box sx={{ mx: 2, my: { xs: 4, sm: 5 }, justifySelf: 'center' }}>
        <Typography
          align="center"
          color="#686868"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '16px', md: '24px' },
            lineHeight: '24px',
            fontFamily: 'GmarketSans, sans-serif',
            mb: { xs: 1, md: 5 },
          }}
        >
          쿠폰 안내
        </Typography>

        {[
          '마이페이지에서 초대 보상을 확인할 수 있습니다.',
          '보상은 최대 90일까지 누적할 수 있습니다.',
          '친구를 초대하고 더 많은 보상을 받을 수 있습니다.',
          '초대링크로 접속 한 후 7일 이내에 본인 인증을 완 \n 료 보상을 받을 수 있습니다.',
        ].map((text, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.2 }}>
            <Typography sx={{ mr: 1 }}>•</Typography>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: { xs: '12px', md: '18px' },
                lineHeight: { xs: '16px', md: '24px' },
                color: '#686868',
                fontFamily: 'var(--font-pretendard)',
                whiteSpace: 'pre-line',
              }}
            >
              {text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 본인 인증 */}
      <LightBlueBackground>
        {/* Ẩn tiêu đề khi sticky (mobile) */}
        <Typography
          align="center"
          color="#272727"
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: { xs: '16px', md: '24px' },
            lineHeight: '24px',
            fontFamily: 'var(--font-pretendard)',
            mb: { xs: 1, md: 5 },
            display: {
              xs: 'none', // ❌ ẩn trên mobile
              sm: 'block',
            },
          })}
        >
          보상 받기
        </Typography>

        {/* Nút 본인 인증 */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={!loading}
            color="primary"
            sx={{
              borderRadius: { xs: '6px', sm: '9999px' },
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              fontWeight: 'semibold',
              lineHeight: '21px',
              bgcolor: '#4169e1',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {isMobile ? '본인 인증하고 보상 받기' : '본인 인증'}
          </Button>
        </Box>
      </LightBlueBackground>
    </>
  );
};

export default ReferralPage;

