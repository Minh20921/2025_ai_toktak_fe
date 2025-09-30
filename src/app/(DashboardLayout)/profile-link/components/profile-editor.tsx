'use client';

import ProductManager from '@/app/(DashboardLayout)/profile-link/components/Tabs/tabs-product-manage';
import SiteSettings from '@/app/(DashboardLayout)/profile-link/components/Tabs/tabs-site-setting';
import TabsUserInfo from '@/app/(DashboardLayout)/profile-link/components/Tabs/tabs-user-info';
import TabPanel from '@/app/components/common/TabPanel';
import { RootState } from '@/app/lib/store/store';
import { IconEdit, IconLink, IconProduct, IconSiteSetting } from '@/utils/icons/profileLink';
import { Box, Drawer, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function ProfileEditor({
  drawerWidth,
  tabDefault,
}: {
  drawerWidth: number | string;
  tabDefault: number;
}) {
  const profile = useSelector((state: RootState) => state.profile);
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<number>(searchParams.get('tab') ? parseInt(searchParams.get('tab')!) : 0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const multipleLinkDomain = process.env.NEXT_PUBLIC_MUITIPLE_LINK_DOMAIN || 'link.toktak.ai';
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    router.replace(`${pathname}?tab=${newValue}`);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={true}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        position: 'absolute',
        height: '100%',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100%',
          boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
          borderRight: '1px solid #eaeaea',
          display: 'flex',
          flexDirection: 'column',
          zIndex: '1',
        },
      }}
    >
      {/* Header + Tabs */}
      <Box sx={{ p: { xs: 1.5, sm: 5 }, pb: { xs: 0, sm: 3 } }}>
        <Typography
          sx={{
            fontSize: { xs: '16px', sm: '24.73px' },
            lineHeight: '20px',
            height: '30px',
            mb: { xs: 0, sm: 1 },
            textAlign: { xs: 'center', sm: 'left' },
          }}
          component="h1"
          fontWeight="bold"
        >
          멀티링크
        </Typography>
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
            <Typography
              component="span"
              color="#C5CAD1"
              sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16.49px', lineHeight: '24px' }}
            >
              <IconLink className="w-6 h-6" />
              {multipleLinkDomain}/
            </Typography>
            <Typography component="span" color="#090909" sx={{ fontSize: '16.49px', lineHeight: '24px' }}>
              {profile.username || 'User Account'}
            </Typography>
          </Box>
        )}
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="profile editor tabs"
        variant="fullWidth"
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            minHeight: '48px',
            textTransform: 'none',
            fontSize: '15px',
            fontWeight: 600,
            lineHeight: '18px',
          },
          '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            height: '2px',
          },
          '& .MuiTabs-indicatorSpan': {
            maxWidth: '60%',
            width: '100%',
            height: '2px',
            backgroundColor: '#537EEF',
          },
        }}
      >
        <Tab icon={!isMobile ? <IconEdit /> : undefined} iconPosition="start" label="프로필 수정" {...a11yProps(0)} />
        <Tab
          icon={!isMobile ? <IconSiteSetting /> : undefined}
          iconPosition="start"
          label="디자인 설정"
          {...a11yProps(1)}
        />
        <Tab icon={!isMobile ? <IconProduct /> : undefined} iconPosition="start" label="상품 관리" {...a11yProps(2)} />
      </Tabs>

      {/* Scrollable Tab content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '2px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#aaa',
          },
          scrollbarWidth: 'thin', // Firefox
          scrollbarColor: '#ccc #f1f1f1', // Firefox
        }}
      >
        <TabPanel value={activeTab} index={0}>
          <TabsUserInfo />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <SiteSettings />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <ProductManager />
        </TabPanel>
      </Box>
    </Drawer>
  );
}
