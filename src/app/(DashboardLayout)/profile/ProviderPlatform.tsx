'use client';
import { LocalStorageItems } from '@/../shared/constants';
import { login } from '@/app/lib/store/authSlice';
import { setNotificationState } from '@/app/lib/store/notificationSlice';
import { PlatformState, setPlatformState } from '@/app/lib/store/platformSlice';
import { AppDispatch } from '@/app/lib/store/store';
import { PLATFORM, PLATFORM_TEXT, REFRESH_TOKEN, TOKEN_LOGIN } from '@/utils/constant';
import { showBottomPopup } from '@/utils/custom/bottomPopup';
import { showNotice } from '@/utils/custom/notice';
import { encodeUserId } from '@/utils/encrypt';
import { loadFacebookSDK } from '@/utils/socials/facebook';
import { useInvalidBrowser, useInvalidDevice } from '@/utils/useDeviceBrowser';
import API from '@service/api';
import APIV2 from '@service/api_v2';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export interface ResponseLinked {
  created_at: string;
  id: number;
  link_id: PLATFORM;
  status: number;
  updated_at: string;
  user_id: number;
  avatar: string;
  social_id: number;
  name: string;
  url: string;
}

const ProviderPlatform = ({ children }: { children: React.ReactNode }) => {
  const invalidDevice = useInvalidDevice();
  const invalidBrowser = useInvalidBrowser();
  const dispatch = useDispatch<AppDispatch>();

  const currentToken = Cookies.get(TOKEN_LOGIN);
  const currentRefreshToken = Cookies.get(REFRESH_TOKEN);

  const fetchPlatformStatus = async () => {
    const getDataAPI = new API('/api/v1/user/links', 'GET', {
      success: (response) => {
        const listConnect = response.data as ResponseLinked[];
        listConnect.forEach((connect) => {
          dispatch(
            setPlatformState({
              platform: PLATFORM_TEXT[connect.link_id] as keyof PlatformState,
              status: !!connect.status,
              token: '',
              info: connect,
            }),
          );
        });
        const batchId = localStorage.getItem('batchId');
        if (batchId && localStorage.getItem('action') === 'connectSNS' && listConnect.length === 1) {
          showNotice('내 콘텐츠에서 생성한 콘텐츠를 확인할 수 있어요', '', false, '확인', '취소', () => {});
          localStorage.removeItem('batchId');
          localStorage.removeItem('action');
        }
      },
      error: async (error) => {
        console.log('Platform status error:', error);
      },
      finally() {
        // console.log('finish');
      },
    });
    getDataAPI.call();
  };

  const Notification = new APIV2('/api/v1/notification/get_total_unread_notification', 'GET', {
    success: (response) => {
      dispatch(
        setNotificationState({
          notification: response?.data?.total_pages || 0,
        }),
      );
    },
    error() {
      console.log('error');
    },
    finally() {
      // console.log('finish');
    },
  });

  const fetchUserProfile = async () => {
    const getProfile = new API(`/api/v1/auth/me`, 'GET', {
      success: (res) => {
        const data = res?.data;
        dispatch(login({ user: data }));
        localStorage.setItem('user_level', res?.data.level);
        localStorage.setItem('can_download', res?.data.can_download);

        Notification.config.params = {
          user_id: encodeUserId(res?.data.id || 0),
          user_id_ub: res?.data.id || 0,
          not: 3,
        };
        Notification.call();
      },
      error: async (err) => {
        console.error('Failed to fetch profile:', err);
      },
      finally: () => {},
    });
    getProfile.call();
  };

  useEffect(() => {
    if (currentToken || currentRefreshToken) {
      fetchPlatformStatus();
      fetchUserProfile();
    }
  }, [currentToken, currentRefreshToken]);
  useEffect(() => {
    loadFacebookSDK();

    //const showMobilePopup = sessionStorage.getItem(LocalStorageItems.SHOW_MOBILE_POPUP);
    // if (invalidDevice && !showMobilePopup) {
    //   showBottomPopup(
    //     '현재 모바일은 베타버전입니다.',
    //     'PC 크롬에서 모든 기능을 원활히 이용하실 수 있어요!',
    //     false,
    //     '확인',
    //     '',
    //     async () => {
    //       sessionStorage.setItem(LocalStorageItems.SHOW_MOBILE_POPUP, 'false');
    //     },
    //   );
    //   return;
    // }

    // if (invalidBrowser && !showMobilePopup) {
    //   alert(
    //     'TOKTAK은 PC 크롬에서 최적화 되어있습니다. PC 크롬을 사용해주세요.\n일부 기능이 정상적으로 작동하지 않을 수도 있습니다.',
    //   );
    //   return;
    // }

    // return () => {
    //   sessionStorage.removeItem(LocalStorageItems.SHOW_MOBILE_POPUP);
    // };
  }, []);

  return <>{children}</>;
};

export default ProviderPlatform;
