'use client';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import { noticeWebcomeNewUser } from '@/app/components/common/noticeWebcomeNewUser';
import { IconChecked, IconNonCheck } from '@/utils/icons/profileLink';
import type { RootState } from '@/app/lib/store/store';
import { Box, Button, Checkbox, CircularProgress, Dialog, Drawer, FormControlLabel, Modal, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import API from '@service/api';
import { useRouter } from 'next/navigation';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';


interface NewUserWellcomePopupProps {
  open: boolean;
  onClose: () => void;
  view?: 'billingInfo' | 'homepage';
}

const NewUserWellcomePopup = ({ open, onClose, view = 'homepage' }: NewUserWellcomePopupProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // ✅ NEW: marketing states
  const [emailAgree, setEmailAgree] = useState<boolean>(true);
  const [smsAgree, setSmsAgree] = useState<boolean>(true);
  const bothAgree = useMemo(() => emailAgree && smsAgree, [emailAgree, smsAgree]);

  let title = '🎉 신규 가입을 환영합니다!';
  let description = '톡탁의 무료 강의·이벤트·신규 기능 소식을 받아 보시겠어요?';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
    }
  }, [open]);

  const updateMktUser = useRef(
    new API('/api/v1/profile/mkt_update_member', 'POST', {
      success: (res) => {
        if (res.code === 200) {
          onClose();
        } else {
          showNoticeMUI('오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
        }
        setLoading(false);
      },
      error: (res) => {
        setLoading(false);
      },
    }),
  );


  const handleClickBtn = async () => {

    if (loading) return;
    setLoading(true);

    updateMktUser.current.config.data = {
      email_mkt: emailAgree ? 1 : 0,
      sms_mkt: smsAgree ? 1 : 0,
    };
    updateMktUser.current.call();
  };

  type PricingFeatureProps = {
    children: React.ReactNode;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
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
  const handleOpenMarketingNotice = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    noticeWebcomeNewUser();
  };

  // ✅ UPDATED: Checkbox “ở ngoài” (bên trái) nội dung
  const PricingFeature: React.FC<PricingFeatureProps> = ({ children, checked, onChange, disabled, showBadge }) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            icon={<IconNonCheck />}
            checkedIcon={<IconChecked />}
            size="small"
            checked={!!checked}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}

            sx={{
              color: '#E7E7E7',
              p: 0,
              width: '15px !important',
              height: '15px !important',
              minWidth: '15px !important',
              minHeight: '15px !important',
              '& .MuiSvgIcon-root': {
                width: '15px !important',
                height: '15px !important',
              },
              '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                color: '#4776EF',
              },
            }}
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, ml: 1, fontFamily: 'var(--font-pretendard)' }}>
            <span className="mr-1 my-auto text-sm leading-[17px] basis-auto text-[#A4A4A4] flex-shrink-0">(선택)</span>
            <div className="my-auto text-sm leading-[17px] basis-auto text-[#A4A4A4]">{children}</div>
            {showBadge && <OptimizationBadge />}
          </Box>
        }
        sx={{
          ml: 0,
        }}
      />

    );
  };

  const PackageDesc = (type: number = 0) => (
    <>
      <div className="border-solid border-[1px] border-[#E7E7E7] rounded-[5px] p-6 mt-2.5">
        <Typography
          sx={{
            color: '#090909',
            fontSize: '16px',
            lineHeight: '19px',
            fontWeight: 700,
            fontFamily: 'var(--font-pretendard)',
            cursor: 'pointer',
            whiteSpace: 'pre-line',
          }}
        >
          지금 마케팅 수신 동의하면 톡탁 <br />
          첫 결제 0원 혜택을 놓치지 않고 받으실 수 있어요!
        </Typography>

        <div className="mt-2.5">
          {/* ✅ “둘 다” → check cả email + sms */}
          <PricingFeature
            checked={bothAgree}
            onChange={(ck) => {
              // nếu tick “둘 다”, set cả hai true; bỏ tick thì không đổi lựa chọn cá nhân (có thể tùy chỉnh)
              if (ck) {
                setEmailAgree(true);
                setSmsAgree(true);
              } else {
                // Bỏ tick “cả hai” không bắt buộc bỏ riêng lẻ — để tự user chỉnh 2 option dưới
                // Nếu muốn bỏ cả hai luôn, dùng:
                // setEmailAgree(false); setSmsAgree(false);
              }
            }}
          >
            <span>둘 다 받아볼게요.</span>
            <span className="ml-2 text-[#4776EF] font-semibold">혜택 놓치기 싫어요!</span>

          </PricingFeature>

          <div className="mt-2.5">
            <PricingFeature checked={emailAgree} onChange={setEmailAgree}>
              <span>이메일로 받아볼게요.</span>
            </PricingFeature>
          </div>

          <div className="mt-2.5">
            <PricingFeature checked={smsAgree} onChange={setSmsAgree}>
              <span>문자로 받아볼게요.</span>
            </PricingFeature>
          </div>
        </div>

      </div>
    </>
  );

  const MarketingContent = (
    <Box
      sx={{
        width: '100%',
        borderRadius: { xs: 0, sm: '30px' },
        backgroundColor: 'white',
        boxShadow: 3,
        p: '48px 53px',
        mx: 'auto',
        maxHeight: '100%',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          width: '80px',
          height: '80px',
          border: 'none',
          backgroundColor: '#4776EF14',
          backdropFilter: 'blur(75px)',
          boxShadow: '0 0 60px 20px rgba(59,130,246,0.2)',
          borderRadius: '9999px',
          mx: 'auto',
        }}
      >
        <img src="/images/home/ring.svg" alt="icon" />
      </Box>
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
            fontFamily: 'var(--font-pretendard)',
            fontWeight: 600,
            textAlign: 'center',
            mt: { xs: 0, sm: '10px' },
          }}
        >
          {title}
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
          {description}
        </Box>

        {PackageDesc(0)}

        <div className="mt-2.5 flex flex-col gap-1">
          <span className="self-start text-[12px] font-medium leading-[19px] text-[#A4A4A4] ">
            ※ 연락처는 나중에 [내 정보]에서 등록하실 수 있어요.
          </span>
          <span className="self-start text-[12px] font-medium leading-[19px] text-[#A4A4A4] ">
            ※ 동의하지 않아도 가입과 서비스 이용에는 영향이 없습니다.
          </span>
          <span className="self-start text-[12px] font-medium leading-[19px] text-[#A4A4A4] ">
            ※ 수신 동의 시 안내가 더 빠르게 제공되며, 본 혜택은 모두에게 적용됩니다.
          </span>
          <Typography align="center" sx={{ mt: '30px' }}>
            <a href="" className="text-[#4776EF] underline  text-[12px] font-medium leading-[19px]  font-pretendard" onClick={handleOpenMarketingNotice}>
              마케팅 정보 수신 동의
            </a>
          </Typography>
        </div>

        {/* BUTTONS */}

        <Box sx={{ width: '100%', mt: '20px', display: 'flex', gap: 1, justifyContent: 'center', }}>
          <Button
            disableRipple
            disableElevation
            onClick={handleClickBtn}
            sx={{
              borderRadius: '9999px',
              fontSize: '18px',
              fontFamily: 'var(--font-pretendard)',
              fontWeight: 600,
              lineHeight: '21px',
              backgroundColor: '#272727',
              color: '#fff',
              height: '50px',
              px: 4,
              width: '220px',
            }}
            disabled={loading}
          >

            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: '#fff' }} />
                <span>확인</span>
              </>
            ) : (
              '확인'
            )}
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
          onClose={(event, reason) => {
            if (reason === 'backdropClick') return; // không đóng khi click ra ngoài
            onClose();
          }}
          PaperProps={{ sx: { borderTopLeftRadius: 12, borderTopRightRadius: 12 } }}
        >
          {MarketingContent}
        </Drawer>
      ) : (
        <Dialog
          open={open}
          onClose={(event, reason) => {
            if (reason === 'backdropClick') return; // không đóng khi click ra ngoài
            onClose();
          }}
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
          {MarketingContent}
        </Dialog>
      )}
    </>
  );
}

export default memo(NewUserWellcomePopup);
