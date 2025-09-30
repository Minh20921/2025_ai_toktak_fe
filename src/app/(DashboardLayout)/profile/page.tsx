'use client';

import SNSSettingsPopup from '@/app/(DashboardLayout)/components/popup/SNSSettingsPopup';
import BillingInfo from '@/app/(DashboardLayout)/profile/component/billingInfo';
import MyPage from '@/app/(DashboardLayout)/profile/component/myPage';
import SocialConnect from '@/app/(DashboardLayout)/profile/component/socialConnect';
import SeoHead from '@/app/components/SeoHead';
import TabPanel from '@/app/components/common/TabPanel';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import { noticeWebcomeNewUser } from '@/app/components/common/noticeWebcomeNewUser';
import { User, login } from '@/app/lib/store/authSlice';
import { setSnsSettingsState } from '@/app/lib/store/snsSettingsSlice';
import { IS_NEW_USER_REFERRAL, SEO_DATA_PROFILE, TIME_REFERRAL_CODE_PERIOD, USER_SUBSCRIPTION } from '@/utils/constant';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { Icon } from '@iconify/react';
import { Box, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import API from '@service/api';
import moment from 'moment';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';


function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export interface PlatformLink {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string;
  isConnected: boolean;
  handlerConnect?: () => void;
  href?: string;
  loginHref?: string;
  handleLogin?: () => void;
  link_id?: number;
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [profile, setProfile] = useState<User>({} as User);
  const [activeTab, setActiveTab] = useState(0);
  const [openSettings, setOpenSettings] = useState(false);
  const searchParams = useSearchParams();

  // Sync tabIndex with URL param
  useEffect(() => {
    const tabIndex = parseInt(searchParams.get('tabIndex') || '0');
    setActiveTab(tabIndex);
  }, [searchParams.get('tabIndex')]);

  // Handle referral popup
  useEffect(() => {
    const authCompleted = parseInt(searchParams.get('authCompleted') || '0');
    const saved = localStorage.getItem(TIME_REFERRAL_CODE_PERIOD);
    const checkNewUserNice = localStorage.getItem(IS_NEW_USER_REFERRAL);

    if (saved && moment().isBefore(moment(saved))) {
      if (authCompleted) {
        if (checkNewUserNice === '1') {
          showNoticeMUI(
            '🎁 가입 선물 30일 + 초대 보상 7일!',
            '🎁 총 37일간 베이직 플랜을 무료로 이용할 수 있어요!<br>즐겁게 이용해 보세요! 😊',
            false,
            '확인',
          );
        } else {
          showNoticeMUI('🔔 이미 가입된 회원입니다!', '초대 수락은 신규 가입 계정만 가능해요. 😊', false, '확인');
        }
        localStorage.removeItem(TIME_REFERRAL_CODE_PERIOD);
      }
    } else {
      localStorage.removeItem(TIME_REFERRAL_CODE_PERIOD);
    }
  }, [searchParams.get('authCompleted')]);

  useEffect(() => {
    router.replace(`/profile?tabIndex=${activeTab}`);
  }, [activeTab]);

 

  const getUserInfoAPI = useRef(
    new API('/api/v1/auth/user_profile', 'GET', {
      success: (res) => {
        setProfile(res.data);
        dispatch(login({ user: res.data }));
      },
      error: (res) => {
        console.log(res);
      },
    }),
  );

  const getSNSSettingsAPI = useRef(
    new API(`/api/v1/user/get-user-link-template`, 'GET', {
      success: (res) => {
        if (res?.code === 201) {
          showNoticeError('', res?.message, false, '확인', '취소', () => { });
        } else {
          dispatch(setSnsSettingsState({ snsSettings: res?.data }));
        }
      },
    }),
  );

  const getUserInfo = () => getUserInfoAPI.current.call();

  useEffect(() => {
    getUserInfo();
    getSNSSettingsAPI.current.call();
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 8, sm: '35px' },
        px: { xs: 0, sm: 5 },
      }}
    >
      <SeoHead {...SEO_DATA_PROFILE} />
      <Box
        sx={{
          position: { xs: 'sticky', sm: 'static' },
          top: 0,
          fontWeight: 'bold',
          fontSize: { xs: 16, sm: 24, md: 30 },
          textAlign: { xs: 'center', sm: 'left' },
          lineHeight: { xs: '19px', sm: '36px' },
          py: { xs: 1, sm: 0 },
          zIndex: 50,
          backgroundColor: 'white',
        }}
        color="#090909"
      >
        마이페이지
      </Box>

      <Box
        sx={{
          position: 'sticky',
          top: { xs: 35, sm: 0 },
          zIndex: 50,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_event, value) => setActiveTab(value)}
          indicatorColor="primary"
          textColor="inherit"
          aria-label="tab-create"
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{
            mt: { xs: 0, sm: 2.5 },
            width: '100%',
            backgroundColor: 'white',
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 1, sm: 2 },
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
              fontWeight: 600,
              color: '#A4A4A4',
              textTransform: 'none',
            },
            '& .Mui-selected': {
              color: '#272727',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#272727',
            },
            '& .MuiTabs-flexContainer': {
              borderBottom: '2px solid #F1F1F1',
            },
          }}
        >
          <Tab label="내 정보" {...a11yProps(0)} />
          <Tab label="요금제" {...a11yProps(1)} />
          <Tab label="소셜 채널 관리" {...a11yProps(2)} />
        </Tabs>
        {activeTab === 2 && !isMobile && (
          <Box
            sx={{
              position: { xs: 'static', sm: 'absolute' },
              right: 0,
              bottom: 0,
              height: '100%',
              display: 'flex',
              gap: '5px',
              justifyContent: 'end',
              alignItems: 'center',
              color: '#6A6A6A',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              zIndex: 9999,
              marginTop: '10px',
              marginRight: '10px',
            }}
            onClick={() => {
              if (!USER_SUBSCRIPTION.includes(profile?.subscription || '')) {
                showNotice(
                  `🔌 무료 요금제에서는 SNS 연동이 안 돼요!`,
                  `첫 달 0원 혜택 받고 요금제 업그레이드하면 SNS 연동이 가능해요.`,
                  true,
                  '확인',
                  '취소',
                  () => {
                    router.push('/rate-plan');
                  },
                );
                return;
              }
              setOpenSettings(true);
            }}
          >
            <Icon icon="icon-park-outline:setting-two" height={20} />
            업로드 설정
          </Box>
        )}
      </Box>
      <TabPanel value={activeTab} index={0}>
        <MyPage profile={profile} getUserInfo={getUserInfo} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <BillingInfo profile={profile} getUserInfo={getUserInfo} />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        {activeTab === 2 && isMobile && (
          <Box
            sx={{
              position: { xs: 'static', sm: 'absolute' },
              right: 0,
              bottom: 0,
              height: '100%',
              display: 'flex',
              gap: '5px',
              justifyContent: 'end',
              alignItems: 'center',
              color: '#6A6A6A',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              zIndex: 9999,
              marginTop: '10px',
              marginRight: '10px',
            }}
            onClick={() => {
              if (!USER_SUBSCRIPTION.includes(profile?.subscription || '')) {
                showNotice(
                  `🔌 무료 요금제에서는 SNS 연동이 안 돼요!`,
                  `첫 달 0원 혜택 받고 요금제 업그레이드하면 SNS 연동이 가능해요.`,
                  true,
                  '확인',
                  '취소',
                  () => {
                    router.push('/rate-plan');
                  },
                );
                return;
              }
              setOpenSettings(true);
            }}
          >
            <Icon icon="icon-park-outline:setting-two" height={20} />
            업로드 설정
          </Box>
        )}

        <SocialConnect profile={profile} getUserInfo={getUserInfo} />
      </TabPanel>
      <SNSSettingsPopup
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        onSuccess={() => getSNSSettingsAPI.current.call()}
      />
    </Box>
  );
}
