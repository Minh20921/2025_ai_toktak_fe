'use client';
import type { RootState } from '@/app/lib/store/store';
import { UpDownIcon } from '@/utils/icons/icons';
import { Box, Button, CircularProgress, Dialog, Drawer, Modal, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface FacebookProps {
  open: boolean;
  onClose: () => void;
  view?: 'billingInfo' | 'homepage';
}

export default function BuyPackagePopup({ open, onClose, view = 'homepage' }: FacebookProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [openBasic, setOpenBasic] = useState(false);
  const [openStandard, setOpenStandard] = useState(false);
  const isBillingView = view === 'billingInfo';
  let title = '🥲 무료 생성하기 횟수를 모두 사용했어요.';
  let description = '요금제를 업그레이드하면 콘텐츠 생성을 이어갈 수 있어요.';

  if (user?.is_payment === 0) {
    title = '🥲 무료 생성하기 횟수를 모두 사용했어요.';
    description = '첫 달 0원 혜택 받고 요금제 업그레이드하면 <br /> 콘텐츠 생성을 이어갈 수 있어요.';
  } else if (user?.subscription === 'FREE') {
    title = '🥲 무료 생성하기 횟수를 모두 사용했어요.';
    description = '요금제를 업그레이드하면 콘텐츠 생성을 이어갈 수 있어요.';
  } else if (user?.subscription === 'BASIC') {
    title = '🥲 생성하기를 모두 사용했어요.';
    description = '스탠다드 요금제로 업그레이드하면 더 많이 만들 수 있어요.';
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
      setOpenBasic(false);
      setOpenStandard(true);
    }
  }, [open]);

  const handleClickBtn = () => {
    onClose();
    router.push('/payment?package=STANDARD');
  };

  type PricingFeatureProps = {
    children: React.ReactNode;
    showBadge?: boolean;
  };

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

  const PackageDesc = (type: number = 0) => (
    <>
      <div className="border-solid border-[1px] border-[#E7E7E7] rounded-[5px] p-6 mt-2">
        <Box
          sx={{
            color: '#4776EF',
            border: 'solid 1px #4776EF',
            borderRadius: '4px',
            width: '109px',
            height: '25px',
            fontSize: '14px',
            textAlign: { xs: 'start', sm: 'center' },
            fontWeight: 700,
            gap: 2,
          }}
        >
          가장 인기있어요!
        </Box>
        <Typography
          sx={{
            color: '#090909',
            fontSize: '16px',
            lineHeight: '16px',
            fontWeight: 700,
            mt: { xs: 0, sm: '20px' },
            // mb: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => setOpenStandard((prev) => !prev)}
        >
          스탠다드
          <UpDownIcon
            color="#191919"
            width={24}
            height={10}
            className={`transition-all duration-500 ease-in-out ${openStandard ? 'rotate-180' : ''}`}
          />
        </Typography>
        {openStandard && (
          <div className="mt-[20px]">
            <div className="">
              <PricingFeature>
                <span>콘텐츠 생성 개수</span>
                <span className="font-bold"> 180개</span>
                <span>/월</span>
                <br></br>
                <span>(상품 60개×영상/이미지/블로그)</span>
              </PricingFeature>
            </div>
            <div className="mt-2.5">
              <PricingFeature>
                <span>생성 콘텐츠 종류 </span>
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
              <span className="self-start text-base leading-[19px] text-[#6A6A6A] line-through decoration-2">
                월 89,900원
              </span>
              <span className="text-[#4776EF] font-bold text-[16px] ml-3">월 29,900원</span>
            </div>
          </div>
        )}
      </div>
      <div className="border-solid border-[1px] border-[#E7E7E7] rounded-[5px] p-6 mt-2">
        <Typography
          sx={{
            color: '#090909',
            fontSize: '16px',
            lineHeight: '16px',
            fontWeight: 700,
            // mt: { xs: 0, sm: '20px' },
            // mb: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => setOpenBasic((prev) => !prev)}
        >
          베이직
          <UpDownIcon
            color="#191919"
            width={24}
            height={10}
            className={`transition-all duration-500 ease-in-out ${openBasic ? 'rotate-180' : ''}`}
          />
        </Typography>
        {openBasic && (
          <div className="mt-[20px]">
            <div className="">
              <PricingFeature>
                <span>콘텐츠 생성 개수</span>
                <span className="font-bold"> 90개</span>
                <span>/월</span>
                <br></br>
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
              <span className="self-start text-base leading-[19px] text-[#6A6A6A] line-through decoration-2">
                월 29,900원
              </span>
              <span className="text-[#4776EF] font-bold text-[16px] ml-3">월 9,900원</span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const CancelContent = (
    <Box
      sx={{
        width: '100%',
        borderRadius: { xs: 0, sm: '30px' },
        backgroundColor: 'white',
        boxShadow: 3,
        p: '53px 48px',
        mx: 'auto',
        maxHeight: '100%',
        overflowY: 'auto',
      }}
    >
      <img src="/images/home/ring.svg" alt="icon" className="mx-auto" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', sm: 'stretch' },
          position: 'relative',
          mx: 'auto',
          mt: '20px',
        }}
      >
        <Typography
          sx={{
            color: '#090909',
            fontSize: { xs: '18px', sm: '21px' },
            lineHeight: { xs: '27px', sm: '30px' },
            fontWeight: 600,
            textAlign: 'center',
            mt: { xs: 0, sm: '10px' },
          }}
        >
          {isBillingView ? '🚀 가능성은 무한대로!' : title}
        </Typography>

        <Box
          sx={{
            color: '#A4A4A4',
            fontSize: '14px',
            textAlign: { xs: 'start', sm: 'center' },
            fontWeight: 500,
            width: '100%',
            gap: 2,
            mb: '10px',
          }}
        >
          {isBillingView ? (
            <>
              요금제 업그레이드하고 더 많은 생성과 SNS 배포,
              <br />
              수익화를 즐겨 보세요.
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </Box>

        {PackageDesc(user?.subscription === 'BASIC' || user?.subscription === 'COUPON_BASIC' ? 0 : 1)}

        {/* BUTTONS */}
        <Box sx={{ width: '100%', mt: '15px' }}>
          <Button
            variant="contained"
            aria-label="save"
            size="large"
            sx={{
              width: '100%',
              height: '50px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: { xs: 500, sm: 600 },
              px: 0,
              pt: '9px',
              backgroundColor: '#4776EF',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#4776EF',
                boxShadow: 'none',
              },
              boxShadow: 'none',
            }}
            onClick={() => {
              handleClickBtn();
            }}
          >
            요금제 업그레이드 하기
          </Button>
          <Button
            variant="contained"
            aria-label="save"
            size="large"
            sx={{
              width: '100%',
              height: '50px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: { xs: 500, sm: 600 },
              px: 0,
              pt: '9px',
              mt: '10px',
              backgroundColor: '#E7E7E7',
              color: '#6A6A6A',
              '&:hover': {
                backgroundColor: '#E7E7E7',
                boxShadow: 'none',
              },
              boxShadow: 'none',
            }}
            onClick={onClose}
          >
            지금 플랜 유지하기
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Loading Modal */}
      <Modal className="w-screen flex items-center justify-center" open={loading} onClose={() => setLoading(false)}>
        <CircularProgress />
      </Modal>

      {/* Main Modal or Drawer */}
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={onClose}
          PaperProps={{ sx: { borderTopLeftRadius: 12, borderTopRightRadius: 12 } }}
        >
          {CancelContent}
        </Drawer>
      ) : (
        <Dialog
          open={open}
          onClose={() => {}}
          aria-labelledby="sns-dialog"
          scroll="body"
          maxWidth={false}
          PaperProps={{
            style: {
              borderRadius: 30,
              padding: 0,
              maxWidth: 472,
              width: '100%',
            },
          }}
          fullWidth
        >
          {CancelContent}
        </Dialog>
      )}
    </>
  );
}
