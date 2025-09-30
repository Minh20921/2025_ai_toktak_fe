'use client';

import SeoHead from '@/app/components/SeoHead';
import { getConfig } from '@/app/lib/config-api';
import { SEO_DATA_HOME } from '@/utils/constant';
import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { getLogoText } from '../../../function/common';
import { showNoticeMUI } from './common/noticeMui';

interface NotificationDetail {
  country: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  icon_url: string;
  redirect_type: string;
  ask_again: number;
  repeat_duration: number;
  button_oke: string;
  button_cancel: string;
  popup_type: string;
  toasts_color: string;
}

interface Config {
  IS_MAINTANCE: string;
  MAINTANCE_DESCRIPTION: string;
  notification_detail: NotificationDetail;
}

interface MaintenanceNoticeProps {
  children: ReactNode;
}

const LOGO_TEXT = getLogoText();
const NOTIFICATION_STORAGE_KEY = 'notification_hide_until';

const MaintenanceNotice: FC<MaintenanceNoticeProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [config, setConfig] = useState<Config>();
  const [isOpenNotice, setIsOpenNotice] = useState(false);

  // Memoized styles for better performance
  const containerStyles = useMemo(
    () => ({
      minHeight: isMobile ? '100vh' : 'auto',
      height: isMobile ? '100vh' : '100vh',
      width: '100%',
      overflow: isMobile ? 'hidden' : 'visible',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      px: isMobile ? 1 : 2,
      pb: isMobile ? 4 : 10,
      boxSizing: 'border-box' as const,
    }),
    [isMobile],
  );

  const logoStyles = useMemo(
    () => ({
      mb: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      fontSize: isMobile ? '28px' : '41.42px',
      fontWeight: 'bold',
      color: '#4776EF',
    }),
    [isMobile],
  );

  const paperStyles = useMemo(
    () => ({
      p: isMobile ? 2 : '28px',
      borderRadius: isMobile ? 2 : '10px',
      maxWidth: isMobile ? '100%' : 760,
      width: '100%',
      textAlign: 'center' as const,
      mx: 'auto',
    }),
    [isMobile],
  );

  // Utility functions
  const getNotificationHideUntil = useCallback(() => {
    try {
      const value = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (!value) return null;

      const data = JSON.parse(value);
      if (data.expires > Date.now()) return data.expires;

      localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
      return null;
    } catch {
      localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
      return null;
    }
  }, []);

  const setNotificationHideUntil = useCallback((ms: number) => {
    const expires = Date.now() + ms;
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify({ expires }));
  }, []);

  const deleteNotificationHideUntil = useCallback(() => {
    localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
  }, []);

  // Handle notification display logic
  const handleNotificationDisplay = useCallback(
    (detail: NotificationDetail) => {
      if (detail.popup_type === 'popup') {
        if (pathname !== '/') return;

        const hiddenUntil = getNotificationHideUntil();
        if (hiddenUntil && hiddenUntil > Date.now() && detail.ask_again === 1) {
          return;
        }

        if (detail.ask_again === 0) {
          deleteNotificationHideUntil();
        }

        if (detail.title?.trim()) {
          const handleRedirect = () => {
            if (detail.url) {
              if (detail.redirect_type === '_blank') {
                window.open(detail.url, '_blank');
              } else {
                location.href = detail.url;
              }
            }
          };

          showNoticeMUI(
            detail.title,
            detail.description,
            !!detail.url,
            detail.button_oke || '확인',
            detail.button_cancel || '취소',
            handleRedirect,
            '',
            detail.icon,
          );

          if (detail.ask_again === 1) {
            setNotificationHideUntil(detail.repeat_duration);
          }
        }
      } else if (detail.popup_type === 'toasts') {
        setIsOpenNotice(true);
      }
    },
    [pathname, getNotificationHideUntil, deleteNotificationHideUntil, setNotificationHideUntil],
  );

  // Fetch config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const result = await getConfig();
        setConfig(result);
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };
    fetchConfig();
  }, []);

  // Handle notification display when config changes
  useEffect(() => {
    if (config?.notification_detail) {
      handleNotificationDisplay(config.notification_detail);
    }
  }, [config, handleNotificationDisplay]);

  useEffect(() => {
    const handleNativeMessage = (event: MessageEvent) => {
      try {
        const rawData = event?.data;
        const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
        if (!parsedData) return;

        if (parsedData?.source && parsedData.source !== 'native-app') return;

        sessionStorage.setItem('fire_base_token_notification', JSON.stringify(parsedData?.payload ?? parsedData));

        alert(JSON.stringify(parsedData?.payload ?? parsedData));
      } catch (err) {
        console.warn('Invalid message received from native WebView:', err);
      }
    };

    window.addEventListener('message', handleNativeMessage);
    document.addEventListener('message', handleNativeMessage as unknown as EventListener);

    return () => {
      window.removeEventListener('message', handleNativeMessage);
      document.removeEventListener('message', handleNativeMessage as unknown as EventListener);
    };
  }, []);

  // Maintenance mode render
  if (config?.IS_MAINTANCE === '1') {
    return (
      <Box sx={containerStyles}>
        <SeoHead {...SEO_DATA_HOME} />
        <Box sx={logoStyles}>
          <Image
            src="/images/logos/sidebar-logo.svg"
            width={isMobile ? 40 : 50}
            height={isMobile ? 40 : 50}
            alt="logo"
          />
          {LOGO_TEXT}
        </Box>

        <Paper elevation={3} sx={paperStyles}>
          <Typography
            variant="h1"
            fontSize={isMobile ? 28 : 38}
            fontWeight={600}
            mb={isMobile ? 2 : '36px'}
            mt={isMobile ? 1.5 : '28px'}
            lineHeight={isMobile ? '40px' : '50px'}
          >
            서버 점검 안내
          </Typography>

          <Typography
            variant="body2"
            fontSize={isMobile ? 16 : 18}
            fontWeight={500}
            lineHeight="24px"
            color="#686868"
            mb={isMobile ? 3 : '50px'}
          >
            톡탁 서버 점검으로 해당 시간 동안 홈페이지 접속 및 결제 <br />
            서비스 이용이 일시적으로 중단되어 고객님께 양해 말씀을 드립니다.
          </Typography>

          <Box
            sx={{
              backgroundColor: '#4776EF',
              fontWeight: 600,
              fontSize: isMobile ? '20px' : '29.16px',
              px: isMobile ? 3 : '47px',
              py: isMobile ? 1.5 : '18px',
              mb: isMobile ? 2 : '20px',
              color: '#fff',
              borderRadius: 2,
              width: 'fit-content',
              mx: 'auto',
            }}
          >
            서버 점검 일시
          </Box>

          <Typography
            variant="body2"
            fontWeight={600}
            mb={isMobile ? 3 : '50px'}
            fontSize={isMobile ? 18 : 25}
            lineHeight="32px"
            color="#535353"
            sx={{ maxWidth: isMobile ? '100%' : '260px', mx: 'auto' }}
          >
            {config?.MAINTANCE_DESCRIPTION}
          </Typography>

          <Typography
            variant="caption"
            color="#686868"
            fontSize={isMobile ? 14 : 18}
            fontWeight={500}
            lineHeight="24px"
          >
            *예정된 시간 내에 서버점검이 완료될 수 있도록 최선을 다하겠습니다.
            <br />
            이용에 불편을 드려서 죄송합니다.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
};

export default MaintenanceNotice;
