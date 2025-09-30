'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Box, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import ReferralPopup from '@/app/(DashboardLayout)/profile/component/referralPopup';

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
          fill="#495057"
        />
      </svg>
      <div className="my-auto text-base leading-[25.17px] basis-auto text-[#6A6A6A]">{children}</div>
      {showBadge && <OptimizationBadge />}
    </div>
  );
};


const GiftFeature: React.FC<PricingFeatureProps> = ({ children, showBadge }) => {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/images/gift.png" alt="" />
      <div className="my-auto text-base leading-[25.17px] basis-auto text-[#6A6A6A]">{children}</div>
      {showBadge && <OptimizationBadge />}
    </div>
  );
};


const PricingHeader: React.FC = () => {
  return (
    <div className="mt-10 w-full">
      <div className="flex gap-1 items-start my-auto whitespace-nowrap">
        <div className="relative flex flex-col z-10">
          <p className="self-start text-base  leading-[19px] text-[#A4A4A4] line-through decoration-2">₩29,900</p>
          <p className="text-[36px] font-bold leading-[43px] text-[#4776EF] mt-1.5">
            ???
            <span className="text-base font-medium leading-[19px] ml-1 text-[#A4A4A4]">/월</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const PackageBasic = ({ handleClickBtn }: { handleClickBtn: () => void }) => {
  const [addedSns, setAddedSns] = useState(0);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isReferralShow, setIsReferralShow] = useState(false);

  // const handleClickBtn = () => {
  //   router.push('/payment');
  // };

  return (
    <article
      className="relative max-w-[433px] w-1/3 bg-white rounded-[14px] group hover:scale-105 transition duration-200 overflow-hidden"
      style={{
        boxShadow: '0px 5.28px 39.63px 0px #0000001A',
      }}
    >
      <ReferralPopup open={isReferralShow} onClose={() => setIsReferralShow(false)} />

      <div className=" inset-0 bg-white bg-opacity-50 z-[1] group-hover:z-[-1]"></div>
      <div className="absolute top-10 right-10 w-[61px] h-[61px] flex items-center justify-center rounded-full bg-[#AA51FF]/10 backdrop-blur-[30px] shadow-[0_0_30px_2px_rgba(170,81,255,0.2)]">
        <Image src="/images/rate/tag-normal.png" alt="tag-normal" width={28} height={44} objectFit="contain" />
      </div>

      <div className="flex flex-col items-between p-10 w-full h-full text-[#6A6A6A]">
        <h2 className="font-bold text-2xl leading-[29px] group-hover:text-[#272727]">베이직</h2>

        <p className="mt-2.5 text-base ">SNS 홍보를 처음 시작하는 분</p>

        <PricingHeader />

        <button
          className="relative overflow-hidden self-stretch h-[50px] px-16 py-[14px] mt-10 text-lg font-semibold leading-[21px] text-center
  rounded-full text-[#6A6A6A] z-10 bg-[#E7E7E7]
  transition-all duration-500 ease-in-out
  group-hover:text-white group-hover:scale-[1.03]"
          onClick={() => setIsReferralShow(true)}
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 z-0 transition-all duration-500 ease-in-out rounded-full"
            style={{
              background: 'linear-gradient(105deg, #4776EF 9.01%, #AD50FF 107.8%)',
            }}
          />
          <span className="relative z-10">무료 이용 연장하기</span>
        </button>

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
            <span className="font-bold"> 1개</span>(선택)
          </PricingFeature>
        </div>

        <div className="mt-2.5">
          <PricingFeature>
            <span>SNS당 자동 게시 콘텐츠 수</span>
            <span className="font-bold"> 1개</span>
          </PricingFeature>
        </div>
        <div className="mt-2.5">
          <PricingFeature>
            <span>업로드 방식</span>
            <span className="font-bold"> 자동</span>
          </PricingFeature>
        </div>
        <div className="mt-2.5">
          <PricingFeature>
            <span>멀티링크 제공</span>
          </PricingFeature>
        </div>
        <hr className="shrink-0 self-stretch my-4 h-px" />

        <div className="mt-1">
          <PricingFeature>콘텐츠 다운로드 무제한</PricingFeature>
        </div>
        {/* <Box className="w-full z-10 flex flex-1 items-end">
          <Box className="w-full">
            <Box className="flex justify-between w-full">
              <Box className="flex items-center gap-[5px]">
                <span className={`text-[#272727] text-[16px] font-medium${addedSns >= 2 ? ' order-2' : ' order-1'}`}>
                  채널 {addedSns}개 추가
                </span>
                <span
                  className={`h-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer relative${addedSns >= 2 ? ' order-1' : ' order-2'}`}
                  onClick={() => {
                    setAddedSns((prev) => prev + (addedSns >= 2 ? -1 : 1));
                  }}
                >
                  <Icon icon={addedSns >= 2 ? 'lineicons:minus-circle' : 'lineicons:plus-circle'} height={24} />
                </span>
              </Box>
              <Box className="flex items-center">
                <span className="text-[#4776EF] font-bold text-[16px] mr-1">{2500 * addedSns}원</span>
                /월
              </Box>
            </Box>
            {addedSns > 0 ? (
              <div className="flex justify-between w-full">
                <Button
                  disableElevation
                  variant="contained"
                  size="large"
                  className="w-full h-[44px] !rounded-[100px] text-[16px] font-semibold px-0 pt-[9px] text-[#4776EF] border-solid border-[1px] border-[#4776EF] bg-[#fff]"
                  onClick={handleClickBtn}
                >
                  추가하기
                </Button>
              </div>
            ) : (
              <div className="h-[44px]" />
            )}
          </Box>
        </Box> */}

        <div className="mt-1">
          <GiftFeature> 친구 추천 시 최대 90일 무료</GiftFeature>
        </div>
      </div>
    </article>
  );
};

export default PackageBasic;
