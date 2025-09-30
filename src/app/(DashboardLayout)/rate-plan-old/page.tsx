'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import PackageBasic from '@/app/(DashboardLayout)/rate-plan-old/packageBasic';
import PackageFree from '@/app/(DashboardLayout)/rate-plan-old/packageFree';
import PackageStandard from '@/app/(DashboardLayout)/rate-plan-old/packageStandard';
import PackageBusiness from '@/app/(DashboardLayout)/rate-plan-old/packageBusiness';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_RATE_PLAN } from '@/utils/constant';

type TabType = 'personal' | 'business';

const RatePlan: React.FC = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [selected, setSelected] = useState<TabType>('personal');
  const [animating, setAnimating] = useState(false);
  const [renderedTab, setRenderedTab] = useState<TabType>('personal');

  const handleTabChange = (tab: TabType) => {
    if (tab === selected || animating) return;
    setAnimating(true);

    // delay to let CSS animate out, then switch tab
    setTimeout(() => {
      setRenderedTab(tab);
      setAnimating(false);
    }, 300); // match transition duration
    setSelected(tab);
  };

  const handleClickBtn = () => {
    if (user) {
      window.open('https://forms.gle/PfbsRtMke2nsnwAV8', '_blank');
    } else {
      router.push('/auth/login');
    }
  }

  return (
    <Box className="font-pretendard px-10 bg-[#F8F8F8] min-h-screen w-full mx-auto py-[40px]">
      <SeoHead {...SEO_DATA_RATE_PLAN} />
      <h1 className="leading-[36px] text-[30px] text-[#090909] mb-[40px] font-bold text-center">
        SNS 수익 자동화 플랜
      </h1>

      {/* Toggle Switch */}
      <Box className="w-full flex justify-center mb-30">
        <div className="relative inline-flex bg-[#E7E7E7] rounded-full p-1.5 font-pretendard h-[43px]">
          <div
            className="absolute top-1.5 bottom-1 bg-white rounded-full shadow transition-all duration-300 ease-in-out h-[31px]"
            style={{ width: `95px`, left: selected == 'personal' ? '6px' : '101px' }}
          />
          <button
            onClick={() => handleTabChange('personal')}
            className={`z-10 px-4 w-[95px] py-[5px] text-lg h-[31px] leading-[21px] font-semibold transition-colors duration-200 ${
              selected === 'personal' ? 'text-[#6A6A6A] font-bold' : 'text-[#A4A4A4]'
            }`}
          >
            개인
          </button>
          <button
            onClick={() => handleTabChange('business')}
            className={`z-10 px-4 w-[95px] py-[5px] text-lg h-[31px] leading-[21px] font-semibold transition-colors duration-200 ${
              selected === 'business' ? 'text-[#6A6A6A] font-bold' : 'text-[#A4A4A4]'
            }`}
          >
            비즈니스
          </button>
        </div>
      </Box>

      {/* Content animation wrapper */}
      <Box className="relative min-h-[726px] max-w-[1351px] mx-auto">
        <Box
          className={`relative   w-full transition-all duration-300 ease-in-out ${
            animating ? 'opacity-0 translate-x-5 pointer-events-none' : 'opacity-100 translate-x-0'
          }`}
        >
          {renderedTab === 'personal' ? (
            <Box className="flex justify-center gap-[25px] items-stretch">
              <PackageFree/>
              <PackageBasic handleClickBtn={handleClickBtn} />
              <PackageStandard handleClickBtn={handleClickBtn} />
            </Box>
          ) : (
            <Box className="flex justify-center items-center">
              <PackageBusiness />
            </Box>
          )}
          <div
            className={`w-full ${selected == 'personal' ? 'max-w-[1351px]' : 'max-w-[433px]'} mx-auto text-left pt-5 text-bas text-[#C5CAD1] font-medium`}
          >
            *콘텐츠 3종(블로그 글, 바이럴 이미지, 쇼츠 영상)
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default RatePlan;
