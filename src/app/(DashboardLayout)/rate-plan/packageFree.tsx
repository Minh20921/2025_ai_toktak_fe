'use client';
import { RootState } from '@/app/lib/store/store';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import { FlashIcon } from './icons';

const OptimizationBadge: React.FC = () => {
  return (
    <span
      className="self-center px-3.5 pt-1 pb-px m-auto text-xs font-semibold leading-3 text-center text-blue-500 whitespace-nowrap
    border border-[#4776EF] bg-[background: #4776EF1A] bg-opacity-20 rounded-full"
    >
      최적화
    </span>
  );
};

type PricingFeatureProps = {
  children: React.ReactNode;
  showBadge?: boolean;
};

const PricingFeature: React.FC<PricingFeatureProps> = ({ children, showBadge }) => {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.14773 9.2328C3.14773 5.86024 5.88173 3.12625 9.25429 3.12625C12.6269 3.12625 15.3608 5.86024 15.3608 9.2328C15.3608 12.6054 12.6269 15.3394 9.25429 15.3394C5.88173 15.3394 3.14773 12.6054 3.14773 9.2328ZM9.25429 1.59961C5.03859 1.59961 1.62109 5.0171 1.62109 9.2328C1.62109 13.4485 5.03859 16.866 9.25429 16.866C13.4699 16.866 16.8875 13.4485 16.8875 9.2328C16.8875 5.0171 13.4699 1.59961 9.25429 1.59961ZM12.0651 8.26423C12.3733 7.97653 12.3899 7.49353 12.1023 7.18534C11.8146 6.87715 11.3316 6.86049 11.0234 7.14813L8.27289 9.7153L7.48516 8.98007C7.17697 8.69245 6.69395 8.70909 6.4063 9.01732C6.11866 9.32547 6.13531 9.8085 6.4435 10.0962L7.75208 11.3175C8.04534 11.5912 8.50043 11.5912 8.7937 11.3175L12.0651 8.26423Z"
          fill="#6A6A6A"
        />
      </svg>
      <div className="my-auto text-base leading-[22px] basis-auto text-[#A4A4A4] flex items-center gap-0">
        {children}
      </div>
      {showBadge && <OptimizationBadge />}
    </div>
  );
};

const SubFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-start gap-2 ml-7 mt-1">
      <span className="text-sm leading-[25px] text-[#A4A4A4]">•</span>
      <div className="text-sm leading-[25px] text-[#A4A4A4]">{children}</div>
    </div>
  );
};

const PricingHeader: React.FC = () => {
  return (
    <div className="mt-10 w-full">
      <div className="flex gap-1 items-start my-auto whitespace-nowrap">
        <div className="relative flex flex-col z-10">
          <p className="self-start text-base font-bold leading-[19px] text-[#4776EF]">한시적</p>
          <p className="text-[36px] font-bold leading-[43px] text-[#4776EF] mt-1.5">
            Free
            <span className="text-base font-medium leading-[19px] ml-1 text-[#A4A4A4]">/월</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const PackageFree = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <article
      className="rate-card relative w-full shrink-0 bg-white rounded-[14px] group hover:scale-105 transition duration-200 overflow-hidden"
      style={{
        boxShadow: '0px 5.28px 39.63px 0px #0000001A',
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-50 z-[1] group-hover:z-[-1]"></div>

      <div className="flex flex-col items-start p-6 w-full text-[#6A6A6A]">
        <h2 className="font-bold text-2xl leading-[29px] group-hover:text-[#272727] mt-2">무료</h2>

        <p className="mt-2.5 text-base ">SNS 수익화, 지금 시작해보세요.</p>

        <PricingHeader />

        <button
          className="relative overflow-hidden self-stretch h-[50px] px-16 py-[14px] mt-10 text-lg font-semibold leading-[21px] text-center
  rounded-full text-[#6A6A6A] z-10 bg-[#E7E7E7]
  transition-all duration-500 ease-in-out
  group-hover:text-white group-hover:scale-[1.03]"
          onClick={() => {
            if (!user) {
              router.push('/auth/login');
            }
          }}
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 z-0 transition-all duration-500 ease-in-out rounded-full"
            style={{
              background: 'linear-gradient(105deg, #4776EF 9.01%, #AD50FF 107.8%)',
            }}
          />
          <span className="relative z-10">{user ? '나의 현재 플랜' : '무료 이용하기'}</span>
        </button>

        <div className="mt-10">
          <PricingFeature>
            <span>이벤트 크레딧: </span>
            <FlashIcon width={16} height={16} color="#4776EF" />
            <span className="font-bold"> 30</span>
            <span>/월</span>
          </PricingFeature>
        </div>

        <div className="mt-2">
          <PricingFeature>
            <span>생성 가능한 URL: </span>
            <span>
              최대 <span className="font-bold">5개</span>/월
            </span>
            <span className="text-[#A4A4A4]"> (1개 생성= </span>
            <FlashIcon width={16} height={16} color="#4776EF" />
            <span className="text-[#A4A4A4]">6)</span>
          </PricingFeature>
          <SubFeature>
            <span>
              생성 콘텐츠: 영상/이미지/블로그 (최대 <span className="font-bold"> 15개</span>)
            </span>
          </SubFeature>
          <SubFeature>
            <span>유료 보이스·템플릿 등 부가 기능에도 사용 가능</span>
          </SubFeature>
        </div>

        <div className="mt-2">
          <PricingFeature>
            <span>콘텐츠 다운로드</span>
            <span className="font-bold mx-0.5"> 신규 가입 후 3일간</span>무제한 가능
          </PricingFeature>
        </div>

        <div className="mt-2">
          <PricingFeature>
            <span>업로드 방식 수동</span>
          </PricingFeature>
        </div>
        <div className="mt-2">
          <PricingFeature>
            <span>멀티링크 제공</span>
          </PricingFeature>
        </div>
      </div>
    </article>
  );
};

export default PackageFree;
