'use client';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  styled,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CloseIcon } from '@/utils/icons/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import Image from 'next/image';
import API from '@service/api';
import { Icon } from '@iconify/react';

// Styled components
const BlueBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#4169e1',
  color: 'white',
  padding: theme.spacing(4, 0),
  textAlign: 'center',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: '15px 0 22px',
  },
}));

const CouponBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '300px', // default (xs)
  maxWidth: '100%',
  height: 'auto',
  margin: '0 auto',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    width: '220px',
  },
  [theme.breakpoints.up('md')]: {
    width: '365px',
  },
}));

const StepBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'start',
  marginBottom: 12,
}));

const StepLabel = styled(Box)(({ theme }) => ({
  flex: 'none',
  color: '#4776EF',
  borderRadius: 99,
  padding: '3px 6px',
  marginRight: theme.spacing(2),
  marginTop: -2,
  fontWeight: '700',
  lineHeight: '19px',
  border: '2px solid #4776EF',
  width: '70px',
  textAlign: 'center',
  fontSize: '13.55px',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    width: '60px',
    marginTop: -6,
    height: 24,
    padding: '2px 6px',
  },
}));

const StepContent = styled(Typography)(({ theme }) => ({
  color: '#272727',
  fontWeight: '500',
  lineHeight: '21px',
  fontFamily: 'var(--font-pretendard)',
  fontSize: '18px',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    lineHeight: '14px',
    whiteSpace: 'normal',
  },
}));

const NumberCircle = styled(Box)(({ theme }) => ({
  backgroundColor: '#0045FF',
  color: 'white',
  borderRadius: '4px',
  width: 19,
  height: 19,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1),
  fontSize: '12px',
}));

const LightBlueBackground = styled(Box)(({ theme }) => ({
  backgroundColor: '#EFF5FF',
  padding: 40,
  [theme.breakpoints.down('sm')]: {
    padding: '24px 18px',
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
  [theme.breakpoints.down('sm')]: {
    padding: 0,
    gap: 10,
  },
}));

const InvitationRecord = styled(Box)(({ theme }) => ({
  backgroundColor: '#E0EBFF',
  padding: 40,
  borderRadius: '12px',
  marginTop: theme.spacing(2),
  maxWidth: 448,
  justifySelf: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '24px 30px',
    marginTop: 1.5,
  },
}));

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: '70%' },
  maxWidth: 1228,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 0,
  boxShadow: 24,
  p: 0,
  overflow: 'auto',
  mx: '0 auto',
  fontFamily: 'var(--font-pretendard)',
};
const customScroll = {
  // 👇 Custom scrollbar
  '&::-webkit-scrollbar': {
    width: '6px',
    overflow: 'hidden',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#D9D9D9',
    borderRadius: '99px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
};

interface IReferralData {
  referral_histories: Array<{
    created_at: string;
    id: number;
    referral_code: string;
    referred_user_email: string;
    referred_user_id: number;
    referrer_email: string;
    referrer_user_id: number;
    status: string;
    updated_at: string;
    display_name: string;
  }>;
  total: number;
  total_days: number;
  max_days: number;
}

// Content component that will be used in both Modal and Drawer
const InvitationContent = ({ onClose }: { onClose: () => void }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [referralData, setReferralData] = useState<IReferralData>();
  const getListInvited = useRef(
    new API('/api/v1/user/get_refer_user', 'GET', {
      success: (res) => {
        setReferralData(res.data);
      },
      error: (err) => {},
    }),
  );
  useEffect(() => {
    getListInvited.current.call();
  }, []);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/r/${user?.referral_code}`);
  };

  return (
    <Box className="grid">
      {/* Blue Header */}
      <BlueBackground>
        <IconButton
          sx={{
            display: { xs: 'block', sm: 'none' },
            position: 'absolute',
            top: { xs: 12, sm: 32 },
            left: { xs: 18, sm: 32 },
          }}
          onClick={() => onClose()}
        >
          <Icon icon={'fluent:ios-arrow-24-filled'} color="white" width={26} height={26} />
        </IconButton>
        <Typography
          color="#FFFFFF"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '24px', sm: '20px', md: '30px' },
            lineHeight: { xs: '32px', sm: '42px', md: '42px' },
            mb: { xs: '22px', sm: '16px', md: '40px' },
            whiteSpace: { xs: 'pre-line', sm: 'nowrap', md: 'pre-line' },
          }}
        >
          {'친구에게 톡탁 소개하고 \n 이용권 받기!'}
        </Typography>

        {/* Coupon */}
        <Box sx={{ mt: 0, mb: { xs: -12.5, sm: -9, md: -9 }, mx: 2 }}>
          <CouponBox className="shadow-lg">
            <Box
              component="img"
              src={'/images/referral/coupon-tag.png'}
              sx={{ width: { xs: '300px', sm: '220px', md: '365px' } }}
              alt="coupon-tag"
            />

            <Box
              sx={{
                position: 'absolute',
                textAlign: 'center',
                zIndex: '10',
                top: { xs: '28.86px', sm: '20.43px', md: '49px' },
                left: 0,
                right: 0,
              }}
            >
              <Typography
                variant="body2"
                color="#494949"
                sx={{
                  fontWeight: 'normal',
                  fontSize: { xs: '16px', sm: '12.64px ', md: '21px' },
                  mb: { xs: '16px', sm: '12px', md: '19px' },
                  fontFamily: 'var(--font-pretendard)',
                  lineHeight: { xs: '11px', sm: '9px', md: '15px' },
                }}
              >
                7일 무료 이용
              </Typography>
              <Typography
                color="#2B2B2B"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '32px', sm: '24.08px', md: '40px' },
                  letterSpacing: { xs: '-1.18px', sm: '-0.86px', md: '-1.43px' },
                  lineHeight: { xs: '23px', sm: '17px', md: '28px' },
                  fontFamily: 'var(--font-pretendard)',
                }}
              >
                Basic 쿠폰
              </Typography>
            </Box>
          </CouponBox>
        </Box>
      </BlueBackground>
      {/* Invitation Method */}
      <Box sx={{ my: { xs: '30px', sm: 5 }, justifySelf: 'center' }}>
        <Typography
          align="center"
          color="#4776EF"
          sx={{
            fontWeight: '700',
            fontSize: { xs: '16px', md: '24px' },
            lineHeight: '24px',
            fontFamily: 'var(--font-pretendard)',
            mb: { xs: 1, md: 5 },
          }}
        >
          초대 수락 방법
        </Typography>

        {/* Step 1 */}
        <StepBox>
          <StepLabel>STEP 1</StepLabel>
          <StepContent>‘초대링크 복사’ 버튼을 눌러서 친구를 초대하세요.</StepContent>
        </StepBox>

        {/* Step 2 */}
        <StepBox>
          <StepLabel>STEP 2</StepLabel>
          <StepContent>친구는 초대 링크를 통해 톡탁에 접속해야 합니다.</StepContent>
        </StepBox>

        {/* Step 3 */}
        <StepBox>
          <StepLabel>STEP 3</StepLabel>
          <StepContent>초대링크를 통해 접속한 친구는 다음 2가지를 완료 합니다.</StepContent>
        </StepBox>

        <Box sx={{ ml: { xs: 9.5, md: 11 }, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <NumberCircle>1</NumberCircle>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: { xs: '12px', md: '18px' },
                lineHeight: { xs: '16x', md: '21px' },
                color: '#0045FF',
                fontFamily: 'var(--font-pretendard)',
              }}
            >
              회원가입
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NumberCircle>2</NumberCircle>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: { xs: '12px', md: '18px' },
                lineHeight: { xs: '16x', md: '21px' },
                color: '#0045FF',
                fontFamily: 'var(--font-pretendard)',
              }}
            >
              연락처 등록 및 본인 인증
            </Typography>
          </Box>
        </Box>

        {/* Step 4 */}
        <StepBox>
          <StepLabel>STEP 4</StepLabel>
          <StepContent>
            회원가입과 연락처 본인 인증이 완료되면 <br />
            초대한 친구와 초대 받은 친구에게 보상이 자동 적용됩니다.
          </StepContent>
        </StepBox>
      </Box>
      <Divider
        sx={{
          maxWidth: '1068px',
          mx: 'auto',
          width: '90%',
        }}
      />
      {/* Coupon Information */}
      <Box sx={{ my: { xs: '30px', sm: 5 }, justifySelf: 'center' }}>
        <Typography
          align="center"
          color="#686868"
          sx={{
            fontWeight: '700',
            fontSize: { xs: '16px', md: '24px' },
            lineHeight: '24px',
            fontFamily: 'var(--font-pretendard)',
            mb: { xs: 1, md: 5 },
          }}
        >
          초대 방법
        </Typography>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0 }}>
            <Typography
              sx={{
                mr: 1,
                lineHeight: { xs: '16px', md: '24px' },
              }}
            >
              •
            </Typography>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: { xs: '12px', md: '18px' },
                lineHeight: { xs: '16px', md: '24px' },
                color: '#686868',
                fontFamily: 'var(--font-pretendard)',
                whiteSpace: 'pre-line',
              }}
            >
              보상은 최대 90일까지 누적할 수 있습니다.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Typography
              sx={{
                mr: 1,
                lineHeight: { xs: '16px', md: '24px' },
              }}
            >
              •
            </Typography>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: { xs: '12px', md: '18px' },
                lineHeight: { xs: '16px', md: '24px' },
                color: '#686868',
                fontFamily: 'var(--font-pretendard)',
                whiteSpace: 'pre-line',
              }}
            >
              마이페이지에서 초대 보상을 확인할 수 있습니다.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* My Friend Invitation */}
      <LightBlueBackground>
        <Typography
          align="center"
          color="#272727"
          sx={{
            fontWeight: '700',
            fontSize: { xs: '16px', md: '24px' },
            lineHeight: '24px',
            fontFamily: 'var(--font-pretendard)',
            mb: { xs: 1, md: 5 },
          }}
        >
          나의 친구 초대
        </Typography>

        <Box
          sx={{
            display: 'flex',
            maxWidth: 500,
            mx: 'auto',
            position: 'relative',
            zIndex: 1,
            bgcolor: 'white',
            borderRadius: '9999px',
            boxShadow: '0px 4.11px 30.84px 0px #0000001A',
            width: '100%',
            height: { xs: 'auto', sm: '70px' },
            justifyContent: 'space-between',
            alignItems: 'center',
            p: { xs: '4px', sm: '10px' },
            mb: '20px',
          }}
        >
          <Typography
            sx={{ ml: '25px', fontSize: { xs: '14px', sm: '18px' }, fontWeight: 'semibold', lineHeight: '21px' }}
            color="#C5CAD1"
            className="line-clamp-1"
          >
            {`${window.location.origin}/r/${user?.referral_code}`}
          </Typography>
          <Button
            variant="contained"
            onClick={handleCopy}
            color="primary"
            sx={{
              flex: 'none',
              borderRadius: '9999px',
              p: { xs: '10px 12px', sm: '14px 24px' },
              bgcolor: '#4169e1',
              whiteSpace: 'nowrap',
              fontSize: { xs: '12px', sm: '18px' },
              fontWeight: 'semibold',
              lineHeight: '21px',
              textAlign: 'center',
            }}
          >
            초대링크 복사
          </Button>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            maxWidth: 448,
            justifySelf: 'center',
          }}
        >
          <StatBox>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '19px',
                color: '#6A6A6A',
                fontFamily: 'var(--font-pretendard)',
              }}
            >
              총 보상일 수
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '29px',
                color: '#4776EF',
                fontFamily: 'var(--font-pretendard)',
              }}
            >
              {referralData?.total_days}/{referralData?.max_days}일
            </Typography>
          </StatBox>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{
              width: '2px',
              marginTop: { xs: '40px', sm: '26px' },
              height: '56px',
              bgcolor: '#D1E1FD',
            }}
          />
          <StatBox>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '19px',
                color: '#6A6A6A',
                fontFamily: 'var(--font-pretendard)',
              }}
            >
              초대 인원
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '29px',
                color: '#4776EF',
                fontFamily: 'var(--font-pretendard)',
              }}
            >
              {referralData?.total}명
            </Typography>
          </StatBox>
        </Box>

        {!!referralData?.referral_histories.length && (
          <InvitationRecord>
            <List disablePadding>
              {referralData?.referral_histories?.map((item, index) => (
                <ListItem key={index} sx={{ py: 0, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <Image src={'/images/referral/ring.png'} alt={'ring'} width={15} height={15} quality={100} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.display_name}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: '#666C78' }}
                  />
                </ListItem>
              ))}
            </List>
          </InvitationRecord>
        )}
      </LightBlueBackground>
    </Box>
  );
};

interface ReferralPopupProps {
  open: boolean;
  onClose: () => void;
}

const ReferralPopup: FC<ReferralPopupProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  return (
    <>
      {/* Modal for desktop */}
      {!isMobile && (
        <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="modal-invitation"
          aria-describedby="modal-invitation-description"
        >
          <Box sx={{ fontFamily: 'var(--font-pretendard)' }}>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
                zIndex: 1,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ ...modalStyle, ...customScroll }}>
              <InvitationContent onClose={onClose} />
            </Box>
          </Box>
        </Modal>
      )}

      {/* Drawer for mobile */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {
              position: 'relative',
              p: 0,
              width: '100vw',
              height: '100vh',
              overflowX: 'hidden',
            },
          }}
        >
          <Box sx={{ fontFamily: 'var(--font-pretendard)', ...customScroll }}>
            <InvitationContent onClose={onClose} />
          </Box>
        </Drawer>
      )}
    </>
  );
};
export default ReferralPopup;
