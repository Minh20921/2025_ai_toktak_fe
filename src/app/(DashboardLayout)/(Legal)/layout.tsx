'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { StyledTab, StyledTabs } from '@/app/components/common/AntTab';
import { pretendard } from '@/app/lib/fonts';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_LEGAL, SEO_DATA_TERM } from '@/utils/constant';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const tabs = [
    { label: '이용 약관', path: '/terms' },
    { label: isMobile ? '개인정보방침' : '개인정보 처리방침', path: '/policy' },
    { label: '저작권 정책', path: '/copyright' },
    { label: 'AI 약관', path: '/ai-policy' },
  ];

  const currentTab = tabs.findIndex((tab) => pathname.startsWith(tab.path));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    router.push(tabs[newValue].path);
  };

  return (
    <main className="relative pt-[70px] sm:py-30 sm:px-10">
      <section className="font-pretendard flex flex-col text-center rounded-none max-w-[816px] mx-auto sm:pt-30">
        <h1 className="leading-[100%] text-[16px] font-bold sm:text-[40px] text-[#090909] sm:mb-[50px] sm:font-semibold h-6 sm:h-12 text-center">
          이용 약관 및 개인정보 보호
        </h1>
        <div className="flex flex-col pt-2 w-full text-lg font-medium bg-white rounded-xl sm:shadow-[0px_0px_40px_rgba(0,0,0,0.08)] text-neutral-400 max-md:pb-24 sm:mt-10 max-md:max-w-full">
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <StyledTabs
                value={currentTab === -1 ? 0 : currentTab}
                onChange={handleChange}
                aria-label="terms and privacy tabs"
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontSize: { xs: '14px!important', sm: '18px!important' },
                    fontWeight: 500,
                    color: '#8E8E8E',
                    fontFamily: `${pretendard.style.fontFamily} !important`,
                    '&.Mui-selected': {
                      color: '#070707',
                      fontWeight: 600,
                    },
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <StyledTab
                    key={index}
                    label={tab.label}
                    sx={{
                      fontSize: '1.125rem !important',
                      padding: { xs: '5px', sm: '16px' },
                      marginRight: { xs: '0', sm: '8px' },
                      textWrap: 'no-wrap',
                    }}
                  />
                ))}
              </StyledTabs>
            </Box>
            <Box sx={{ p: 3 }} className="text-left">
              {/* Nội dung các route con sẽ được hiển thị ở đây */}
              {children}
            </Box>
          </Box>
        </div>
      </section>
    </main>
  );
}
