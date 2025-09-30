'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import TabPanel from '@/app/components/common/TabPanel';
import ServiceGuide from './components/usage/toktak';
import TodoStarting from './components/todo/todoStarting';
import IntroGuide from './components/intro/IntroGuide';
import { useEffect, useState } from 'react';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_GUIDE } from '@/utils/constant';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
const Guide = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const tabParam = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(Number(tabParam) || 0);

  const tabs = [
    { label: '쉽게 시작하기', value: 0 },
    { label: '서비스 소개', value: 1 },
    { label: '이용 안내', value: 2 },
  ];

  useEffect(() => {
    setCurrentTab(Number(tabParam) || 0);
  }, [tabParam]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    router.replace(`/guide?tab=${newValue}`);
  };

  return (
    <Box
      sx={{
        px: { xs: 0, sm: 5 },
        py: { xs: 5, sm: 3.75 },
      }}
    >
      <SeoHead {...SEO_DATA_GUIDE} />
      {/* Title */}
      <Box
        component="h1"
        sx={{
          position: { xs: 'sticky', sm: 'static' },
          top: 0,
          zIndex: 40,
          lineHeight: { xs: '19x', sm: '36px' },
          fontSize: { xs: '16px', sm: '30px' },
          mt: 0.5,
          mb: 0.25,
          py: { xs: '14px', sm: 0 },
          fontWeight: 700,
          textAlign: { xs: 'center', sm: 'left' },
          color: '#090909',
          bgcolor: 'white',
        }}
      >
        서비스 가이드북
      </Box>

      <Box sx={{ position: 'relative', pb: { xs: 8, sm: 0 } }}>
        {/* Sticky Tabs + Actions */}
        <Box
          sx={{
            position: 'sticky',
            top: { xs: 40, sm: 0 },
            zIndex: 40,
            py: { xs: 0, sm: 2.5 },
            px: { xs: '18px', sm: 0 },
            backgroundColor: '#FFFFFF',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleChange}
            aria-label="tab-create"
            indicatorColor="primary"
            textColor="inherit"
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{
              '& .MuiTab-root': {
                minWidth: 'auto',
                padding: { xs: '0px 20px', sm: '0px 20px 8px' },
                fontSize: { xs: '14px', sm: '18px' },
                fontWeight: { xs: 500, sm: 600 },
                lineHeight: '100%',
                textTransform: 'none',
                color: '#A4A4A4',
                minHeight: '45px',
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
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>

        {/* Content Panels */}
        <TabPanel value={currentTab} index={0}>
          <TodoStarting />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <IntroGuide />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <ServiceGuide />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Guide;
