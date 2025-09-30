'use client';
import React from 'react';
import Image from 'next/image';
import API from '@service/api';
import { showNoticeError } from '@/utils/custom/notice_error';
import { showNotice } from '@/utils/custom/notice';
import { GiftFeature } from '../rate-plan-old/gifts';

const OptimizationBadge: React.FC = () => {
  return (
    <span
      className="self-center px-2.5 py-0.5 mx-auto text-[10px] font-semibold leading-[12px] h-[18px] text-center text-[#4776EF] whitespace-nowrap
    border border-[#4776EF] bg-[#4776EF1A] rounded-full z-10"
    >
      최적화
    </span>
  );
};

type PricingFeatureProps = {
  children: React.ReactNode;
  showBadge?: boolean;
};

const newPayment = new API('/api/v1/payment/create_new_payment', 'POST', {
  success: (res) => {
    if (res?.code == 201) {
      showNoticeError(res?.message, '', false, '확인', '취소', () => {
        // setLoading(false);
      });
      return;
    } else {
      showNotice(res?.message, '', true, '확인', '취소', async () => { });
    }
  },
  error: (err) => {
    showNoticeError('오류', '정보 업데이트에 실패했습니다.', false, '확인');
  },
  finally: () => { },
});

const handlePaymentClick = () => {
  showNotice('🚀 정말로 이 요금제를 구매하시겠습니까?', '', true, '확인', '취소', async () => {
    newPayment.config.data = {
      package_name: 'BUSINESS',
    };
    newPayment.call();
  });
};

const PricingFeature: React.FC<PricingFeatureProps> = ({ children, showBadge }) => {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.14773 9.2328C3.14773 5.86024 5.88173 3.12625 9.25429 3.12625C12.6269 3.12625 15.3608 5.86024 15.3608 9.2328C15.3608 12.6054 12.6269 15.3394 9.25429 15.3394C5.88173 15.3394 3.14773 12.6054 3.14773 9.2328ZM9.25429 1.59961C5.03859 1.59961 1.62109 5.0171 1.62109 9.2328C1.62109 13.4485 5.03859 16.866 9.25429 16.866C13.4699 16.866 16.8875 13.4485 16.8875 9.2328C16.8875 5.0171 13.4699 1.59961 9.25429 1.59961ZM12.0651 8.26423C12.3733 7.97653 12.3899 7.49353 12.1023 7.18534C11.8146 6.87715 11.3316 6.86049 11.0234 7.14813L8.27289 9.7153L7.48516 8.98007C7.17697 8.69245 6.69395 8.70909 6.4063 9.01732C6.11866 9.32547 6.13531 9.8085 6.4435 10.0962L7.75208 11.3175C8.04534 11.5912 8.50043 11.5912 8.7937 11.3175L12.0651 8.26423Z"
          fill="#495057"
        />
      </svg>
      <div className="my-auto text-[15.15px] leading-[25.17px] basis-auto text-[#495057]">{children}</div>
      {showBadge && <OptimizationBadge />}
    </div>
  );
};

const PricingHeader: React.FC = () => {
  return (
    <div className="mt-10 w-full">
      <div className="flex gap-1 items-start my-auto whitespace-nowrap">
        <div className="relative flex flex-col z-10">
          <p className="self-start text-base  leading-[19px] text-[#A4A4A4] line-through decoration-2">₩89,900</p>
          <p className="text-[36px] font-bold leading-[43px] text-[#4776EF] mt-1.5">영업팀 문의</p>
        </div>
      </div>
    </div>
  );
};

const PackageBusiness: React.FC = () => {
  return (
    <article
      className="relative max-w-[433px] w-1/3 bg-white rounded-[14px] group hover:scale-105 transition duration-200 overflow-hidden "
      style={{
        boxShadow: '0px 5.28px 39.63px 0px #0000001A',
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-50 z-[1] group-hover:z-[-1]"></div>
      <div className="absolute top-10 right-10 w-[61px] h-[61px] flex items-center justify-center rounded-full bg-[#AA51FF]/10 backdrop-blur-[30px] shadow-[0_0_30px_2px_rgba(170,81,255,0.2)]">
        <Image src="/images/rate/tag-premium.png" alt="tag-premium" width={42} height={48} objectFit="contain" />
      </div>

      <div className="flex flex-col items-start p-10 w-full text-[#6A6A6A]">
        <h2 className="font-bold text-2xl leading-[29px] group-hover:text-[#272727]">기업형 스탠다드</h2>

        <p className="mt-2.5 text-base ">브랜드, 플랫폼, 에이전시 고객을 위한 플랜</p>

        <PricingHeader />

        <a
          className="relative overflow-hidden self-stretch h-[50px] px-16 py-[14px] mt-10 text-lg font-semibold leading-[21px] text-center
  rounded-full text-[#6A6A6A] z-10 bg-[#E7E7E7]
  transition-all duration-500 ease-in-out
  group-hover:text-white group-hover:scale-[1.03]"
          href="https://forms.gle/3dgtzd7NvmfAePnQ8"
          target="_blank"
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 z-0 transition-all duration-500 ease-in-out rounded-full"
            style={{
              background: 'linear-gradient(105deg, #4776EF 9.01%, #AD50FF 107.8%)',
            }}
          />
          <span className="relative z-10">컨설팅 신청</span>
        </a>

        <div className="mt-10">
          <PricingFeature>
            <span>콘텐츠 생성 개수</span>
            <span className="font-bold"> 90개</span>
            <span>/월</span><br></br>
            <span>(상품 30개×영상/이미지/블로그)</span>
          </PricingFeature>
        </div>

        <div className="mt-2.5">
          <PricingFeature>
            <span>생성 콘텐츠 종류</span>
            <span className="font-bold"> 3개</span>
          </PricingFeature>
        </div>

        <div className="mt-2.5">
          <PricingFeature>
            <span>SNS 배포 채널</span>
            <span className="font-bold"> 7개</span>
            <span>(모두)</span>
          </PricingFeature>
        </div>

        <div className="mt-2.5">
          <PricingFeature>
            <span>SNS당 자동 게시 콘텐츠 수 </span>
            <span className="font-bold">2개</span>
          </PricingFeature>
        </div>

        <div className="mt-2.5">
          <PricingFeature>
            <span>업로드 방식 </span>
            <span className="font-bold">AI 자동</span>
          </PricingFeature>
        </div>
        <div className="mt-2.5">
          <PricingFeature>
            <span>멀티링크 제공 </span>
          </PricingFeature>
        </div>

        <hr className="shrink-0 self-stretch my-4 h-px" />

        <div className="mt-1">
          <PricingFeature>콘텐츠 다운로드 무제한</PricingFeature>
        </div>

        <div className="mt-2.5">
          <PricingFeature>AI 바이럴 영상 기능</PricingFeature>
        </div>

        <div className="mt-2.5">
          <PricingFeature>AI 바이럴 문구 기능</PricingFeature>
        </div>

        <div className="mt-2.5">
          <PricingFeature>톡탁 API 연동 제공</PricingFeature>
        </div>
      </div>
    </article>
  );
};

export default PackageBusiness;
