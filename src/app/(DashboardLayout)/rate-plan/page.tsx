'use client';

import RatePlanMobile from '@/app/(DashboardLayout)/rate-plan/RatePlanMobile';
import PackageBusiness from '@/app/(DashboardLayout)/rate-plan/packageBusiness';
import PackageFree from '@/app/(DashboardLayout)/rate-plan/packageFree';
import PackageStandard from '@/app/(DashboardLayout)/rate-plan/packageStandard';
import SeoHead from '@/app/components/SeoHead';
import { login } from '@/app/lib/store/authSlice';
import { RootState } from '@/app/lib/store/store';
import { SEO_DATA_RATE_PLAN } from '@/utils/constant';
import { Box, CircularProgress, Tab, Tabs } from '@mui/material';
import API from '@service/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FlashIcon } from './icons';
import PackageBasic from './packageBasic';
import PackageCredit from './packageCredit';
type TabType = 'personal' | 'business';

const RatePlan: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [selected, setSelected] = useState<TabType>('personal');
  const [animating, setAnimating] = useState(false);
  const [renderedTab, setRenderedTab] = useState<TabType>('personal');
  const [activeTab, setActiveTab] = useState(0);
  const fetchUserProfile = async () => {
    const getProfile = new API(`/api/v1/auth/me`, 'GET', {
      success: (res) => {
        const data = res?.data;
        dispatch(login({ user: data }));
        localStorage.setItem('user_level', res?.data.level);
        localStorage.setItem('can_download', res?.data.can_download);
      },
      error: async (err) => {
        console.error('Failed to fetch profile:', err);
      },
      finally: () => {},
    });
    getProfile.call();
  };
  // Compute Swiper breakpoints automatically based on desired max visible cards
  const CARD_WIDTH = 373; // base card width
  const GAP_WIDTH = 25; // px (Swiper spaceBetween)
  const H_PADDING = 40; // container horizontal padding allowance
  const visibleCardsCount = (() => {
    const hasFree = !user || user?.subscription === 'FREE';
    const hasBasic = !!user && !['STANDARD', 'BUSINESS'].includes(user?.subscription || '');
    let total = 0;
    if (hasFree) total += 1;
    if (hasBasic) total += 1;
    total += 2; // STANDARD + CREDIT
    return total;
  })();
  const autoBreakpoints = React.useMemo(() => {
    const maxVisible = Math.min(4, visibleCardsCount); // cap at 4 by design
    const bp: Record<number, { slidesPerView: number }> = {};
    for (let i = 1; i <= maxVisible; i++) {
      const threshold = H_PADDING + i * CARD_WIDTH + (i - 1) * GAP_WIDTH;
      bp[threshold] = { slidesPerView: i };
    }
    return bp;
  }, [visibleCardsCount]);

  // Stretch all swiper slides to match tallest card
  useEffect(() => {
    const syncSlideHeights = () => {
      const slides = Array.from(document.querySelectorAll<HTMLElement>('.rate-plan-swiper .swiper-slide'));
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.rate-plan-swiper .swiper-slide .rate-card'));
      if (!slides.length || !cards.length) return;

      // reset
      slides.forEach((s) => (s.style.height = 'auto'));
      cards.forEach((c) => (c.style.height = 'auto'));

      const maxH = cards.reduce((m, c) => Math.max(m, c.offsetHeight), 0);
      if (maxH > 0) {
        slides.forEach((s) => (s.style.height = `${maxH}px`));
        cards.forEach((c) => (c.style.height = '100%'));
      }
    };

    const id = setTimeout(syncSlideHeights, 50);
    window.addEventListener('resize', syncSlideHeights);
    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', syncSlideHeights);
    };
  }, [activeTab, user]);

  useEffect(() => {
    fetchUserProfile();
  }, []);
  const handleTabChange = (tab: number) => {
    if (tab === activeTab || animating) return;
    setAnimating(true);

    // delay to let CSS animate out, then switch tab
    setTimeout(() => {
      setActiveTab(tab);
      setAnimating(false);
    }, 300); // match transition duration
    setSelected(tab === 0 ? 'personal' : 'business');
  };

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }
  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      className="font-pretendard bg-[#fff] sm:px-10 sm:bg-[#F8F8F8] min-h-screen w-full mx-auto sm:py-[40px]"
      sx={{
        position: 'relative',
        py: { xs: 8, sm: '35px' },
        px: { xs: 0, sm: 5 },
      }}
    >
      <SeoHead {...SEO_DATA_RATE_PLAN} />
      {/* <h1 className="leading-[36px] text-[30px] text-[#090909] mb-[40px] font-bold text-center">
        SNS 수익 자동화 플랜
      </h1> */}

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
          backgroundColor: { xs: 'white', sm: 'transparent' },
        }}
        color="#090909"
      >
        SNS 수익 자동화 플랜
      </Box>

      {/* Toggle Switch */}
      <Box className="hidden sm:flex w-full justify-center ">
        <div className="relative inline-flex bg-[#E7E7E7] rounded-full p-1.5 font-pretendard h-[43px]">
          <div
            className="absolute top-1.5 bottom-1 bg-white rounded-full shadow transition-all duration-300 ease-in-out h-[31px]"
            style={{ width: `95px`, left: selected == 'personal' ? '6px' : '101px' }}
          />
          <button
            onClick={() => handleTabChange(0)}
            className={`z-10 px-4 w-[95px] py-[5px] text-lg h-[31px] leading-[21px] font-semibold transition-colors duration-200 ${
              selected === 'personal' ? 'text-[#6A6A6A] font-bold' : 'text-[#A4A4A4]'
            }`}
          >
            개인
          </button>
          <button
            onClick={() => handleTabChange(1)}
            className={`z-10 px-4 w-[95px] py-[5px] text-lg h-[31px] leading-[21px] font-semibold transition-colors duration-200 ${
              selected === 'business' ? 'text-[#6A6A6A] font-bold' : 'text-[#A4A4A4]'
            }`}
          >
            비즈니스
          </button>
        </div>
      </Box>

      <Box
        sx={{
          position: 'sticky',
          top: { xs: 35, sm: 0 },
          zIndex: 50,
          display: { xs: 'block', sm: 'none' },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_event, value) => handleTabChange(value)}
          indicatorColor="primary"
          textColor="inherit"
          aria-label="tab-create"
          variant="fullWidth"
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
          <Tab label="개인" {...a11yProps(0)} />
          <Tab label="비즈니스" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* Content animation wrapper */}
      <Box className="hidden sm:block relative min-h-[726px]  mx-auto">
        <Box
          className={`relative w-full transition-all duration-300 ease-in-out ${
            animating ? 'opacity-0 translate-x-5 pointer-events-none' : 'opacity-100 translate-x-0'
          }`}
        >
          {activeTab === 0 ? (
            <Box className="px-[15px] mt-[15px] sm:px-0 sm:mt-0">
              <Swiper
                spaceBetween={GAP_WIDTH}
                grabCursor
                centeredSlides
                centeredSlidesBounds
                slidesPerView={'auto'}
                slidesOffsetBefore={15}
                slidesOffsetAfter={15}
                breakpoints={autoBreakpoints as any}
                className="mx-auto !py-10 rate-plan-swiper"
              >
                {(!user || user?.subscription === 'FREE') && (
                  <SwiperSlide style={{ width: CARD_WIDTH, flex: `0 0 ${CARD_WIDTH}px` }}>
                    <PackageFree />
                  </SwiperSlide>
                )}
                {!!user && !['STANDARD', 'BUSINESS'].includes(user?.subscription) && (
                  <SwiperSlide style={{ width: CARD_WIDTH, flex: `0 0 ${CARD_WIDTH}px` }}>
                    <PackageBasic />
                  </SwiperSlide>
                )}
                <SwiperSlide style={{ width: CARD_WIDTH, flex: `0 0 ${CARD_WIDTH}px` }}>
                  <PackageStandard />
                </SwiperSlide>
                <SwiperSlide style={{ width: CARD_WIDTH, flex: `0 0 ${CARD_WIDTH}px` }}>
                  <PackageCredit />
                </SwiperSlide>
              </Swiper>
            </Box>
          ) : (
            <Box className="flex justify-center items-center !py-10">
              <PackageBusiness />
            </Box>
          )}
          <Box className={`w-full max-w-[766px] mx-auto text-left pt-5`}>
            <Box className="text-[#C5CAD1] font-bold mb-2">이용안내</Box>
            <ul className="text-[#C5CAD1] space-y-2">
              <li className="leading-[26px]">
                - URL 1개 생성 시 영상·이미지·블로그 3종이 동시에 생성되며, 1회당
                <span className="inline-flex items-center mx-1 align-middle">
                  <FlashIcon width={14} height={14} color="#C5CAD1" />
                </span>
                6 차감됩니다.
              </li>
              <li className="leading-[26px]">- 템플릿·보이스 등 부가 기능은 기능별 안내에 따른 크레딧이 차감됩니다.</li>
              <li className="leading-[26px]">
                - 구독 크레딧은 지급일로부터 30일간 유효하며, 이월되지 않고 만료 시 자동 소멸됩니다.
              </li>
              <li className="leading-[26px]">
                - 패키지 크레딧은 플랜과 별도로 구매 가능하며, 결제일로부터 1년간 유효합니다.
              </li>
            </ul>
          </Box>
        </Box>
      </Box>
      <RatePlanMobile tab={activeTab} />
    </Box>
  );
};

export default RatePlan;
