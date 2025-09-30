'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  CardActions,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import 'swiper/css';
import { login, logout, User } from '@/app/lib/store/authSlice';
import Swal from 'sweetalert2';
import { usePathname, useRouter } from 'next/navigation';
import UserAvatar from '../component/userAvatar';
import { useDispatch, useSelector } from 'react-redux';
import API from '@service/api';
import moment from 'moment';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { setNotificationState } from '@/app/lib/store/notificationSlice';
import { RootState } from '@/app/lib/store/store';
import { Icon } from '@iconify/react';
import ReferralPopup from '@/app/(DashboardLayout)/profile/component/referralPopup';
import APIV2 from '@service/api_v2';
import { encodeUserId } from '@/utils/encrypt';
import { CustomSwitch } from '@/app/components/common/CustomSwitch';
import { Label } from 'flowbite-react';

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isVerify?: boolean;
  isVerifyButton?: boolean;
}

function EditableField({
  label,
  value,
  onChange,
  placeholder,
  isVerify = false,
  isVerifyButton = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const router = useRouter();
  const pathname = usePathname();

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const changeToPhoneVerification = () => {
    showNotice('인증하시겠습니까?', '', true, '확인', '취소', () => {
      router.push(`/auth/verification/nice_auth?redirect=${pathname}`);
    });
  };


  return (
    <Box sx={{ mb: { xs: 2, sm: 6 } }}>
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        color="#272727"
        sx={{ fontSize: { xs: 14, sm: 16 } }}
        gutterBottom
      >
        {label}
      </Typography>

      {isEditing ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder={placeholder}
            sx={{
              maxWidth: '270px',
              width: '100%',
              '.MuiInputBase-root': {
                border: '2px solid #F1F1F1',
                borderRadius: '10px',
                color: '#686868',
                overflow: 'hidden',
              },
              '.MuiInputBase-input:focus-visible': {
                '--tw-ring-offset-shadow': 'transparent!important',
              },
            }}
            variant="standard"
            InputProps={{ disableUnderline: true }}
          />
          <Box sx={{ display: 'flex', flex: 'none', gap: 1.5 }}>
            <Button
              variant="contained"
              color="inherit"
              onClick={handleCancel}
              sx={{ backgroundColor: '#E7E7E7', borderRadius: '10px' }}
            >
              취소
            </Button>

            {isVerifyButton ? (
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: '#4776EF',
                  borderRadius: '10px',
                  width: { xs: 72, sm: '100%' },
                  px: { xs: 0, sm: '18px' },
                }}
                onClick={changeToPhoneVerification}
              >
                본인 인증
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: '#4776EF', borderRadius: '10px', width: { xs: 72, sm: '100%' } }}
                onClick={handleSave}
              >
                저장
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', minHeight: '40px', gap: 1 }}>
          <Typography sx={{ fontSize: { xs: 14, sm: 16 }, color: '#686868' }}>{value || placeholder}</Typography>
          <IconButton onClick={() => setIsEditing(true)} sx={{ ml: 1, color: 'text.secondary' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M2 14H14" stroke="#6A6A6A" strokeWidth="1.15" strokeLinecap="round" />
              <path
                d="M4.67 11.33V8.67L11.34 2L14 4.67L7.34 11.33H4.67Z"
                stroke="#6A6A6A"
                strokeWidth="1.15"
                strokeLinecap="round"
              />
              <path d="M9.33 4L12 6.67" stroke="#6A6A6A" strokeWidth="1.15" strokeLinecap="round" />
            </svg>
          </IconButton>
          {isVerifyButton && isVerify && (
            <Button
              size="small"
              className="flex items-center gap-1 text-[#4776EF] bg-[#EFF5FF] rounded-[17px] px-2 py-1 text-[12px] font-semibold"
            >
              <Icon icon="icon-park-solid:success" width={16} height={16} />
              본인 인증 완료
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}

const MyPage = ({ profile, getUserInfo }: { profile: User; getUserInfo: () => void }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isVerify, setIsVerify] = useState(false);
  const [isVerifyButton, setIsVerifyButton] = useState(true);
  const [isReferralShow, setIsReferralShow] = useState(false);
  const swiperRef = useRef(null);
  const [avatarList, setAvatarList] = useState([]);
  const [agreeOption, setAgreeOption] = useState<string>('all');
  const [emailAgree, setEmailAgree] = useState(false);
  const [smsAgree, setSmsAgree] = useState(false);
  const bothAgree = useMemo(() => emailAgree && smsAgree, [emailAgree, smsAgree]);

  const apiGetProfileDetail = new API('/api/v1/profile/profile_detail', 'GET', {
    success: (data) => {
      setEmailAgree(data.email_mkt === 1);
      setSmsAgree(data.sms_mkt === 1);
    },
    error: (err) => {
      console.error('getProfile error:', err);
    },
  });
  const apiUpdateMKT =  new API('/api/v1/profile/mkt_update_member', 'POST', {
    success: (res) => {
      const data = res.data;
      setEmailAgree(data.email_mkt === 1);
      setSmsAgree(data.sms_mkt === 1);
    },
    error: (err) => {
      console.error('getProfile error:', err);
    },
  });


  const user_login = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (profile?.level_info) {
      const levelInfo = JSON.parse(profile.level_info);
      setAvatarList(levelInfo);
      dispatch(login({ user: profile }));
    }
    setIsVerify(profile?.is_auth_nice === 1);
    apiGetProfileDetail.call();
  }, [profile]);

  const updateField = (field: keyof typeof profile) => (value: string) => {
    updateUserAPI.config.data = { [field]: value };
    updateUserAPI.call();
  };

  // === Handlers ===

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    router.refresh();
  };

  const updateUserAPI = new API('/api/v1/auth/update_user', 'POST', {
    success: (res) => {
      dispatch(login({ user: res.data }));
      fetchNotification();
      getUserInfo();
      showNotice('성공', '정보가 성공적으로 업데이트되었습니다.', false, '확인');
    },
    error: () => showNoticeError('오류', '정보 업데이트에 실패했습니다.', false, '확인'),
  });

  const fetchNotification = () => {
    new APIV2('/api/v1/notification/get_total_unread_notification?user_id=' + encodeUserId(user_login?.id || 0), 'GET', {
      success: (res) => dispatch(setNotificationState({ notification: res?.data?.total_pages || 0 })),
    }).call();
  };

  const deleteAccountAPI = useRef(
    new API('/api/v1/auth/delete_account', 'POST', {
      success: () => handleLogout(),
      error: () => showNoticeError('탈퇴 실패', '', false, '확인'),
    }),
  );

  const handleClick = (action: number) => {
    showNotice(
      action === 0 ? '로그아웃 하시겠어요?' : '😢 정말 계정을 탈퇴 하시겠어요?',
      action === 0
        ? '잠시 자리를 비우시거나, 보안을 위해<br/>로그아웃이 필요하면 확인 버튼을 눌러 주세요. 🔒'
        : '탈퇴 후에는 30일간 다시 가입할 수 없어요<br/>조금 더 고민해 보시는 건 어떨까요? 💻',
      true,
      '확인',
      '취소',
      async () => {
        action === 0 ? handleLogout() : deleteAccountAPI.current.call();
      },
    );
  };
  const updateMKT = (value: boolean, type: 'email' | 'sms' | 'both') => {
    apiUpdateMKT.config.data = {
      email_mkt: type === 'email' || type === 'both' ? value ? 1 : 0 : undefined,
      sms_mkt: type === 'sms' || type === 'both' ? value ? 1 : 0 : undefined,
    };
    apiUpdateMKT.call();
  }
  const handleUpdateMKT = (value: boolean, type: 'email' | 'sms' | 'both') => {
    if (value) {
      showNotice(
        '☑️ 수신 동의가 완료 되었습니다!',
        '톡탁의 다양한 소식을 가장 먼저 받아 보실 수 있어요.</br>언제든 [내 정보]에서 변경하실 수 있습니다.',
        false,
        '확인',
        '',
        () => {
          if (type === 'email') {
            setEmailAgree(value);
          } else if (type === 'sms') {
            setSmsAgree(value);
          } else if (type === 'both') {
            setEmailAgree(value);
            setSmsAgree(value);
          }
          updateMKT(value, type);
        });
    } else {
      showNotice(
        '🥲 정말 수신을 중단하시겠어요?',
        '수신을 거부하면 톡탁의 쿠폰, 이벤트, 신규 기능 소식을</br>더 이상 받지 못하게 됩니다. 언제든 다시 설정할 수 있어요.',
        true,
        '수신 유지',
        '수신 중단',
        () => { },
        undefined,
        () => {
          if (type === 'email') {
            setEmailAgree(value);
          } else if (type === 'sms') {
            setSmsAgree(value);
          } else if (type === 'both') {
            setEmailAgree(value);
            setSmsAgree(value);
          }
          updateMKT(value, type);
          showNotice('수신 거부 되었습니다.', '', false, '확인');
        }
      );
    }

  }
  return (
    <>
      <ReferralPopup open={isReferralShow} onClose={() => setIsReferralShow(false)} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 0, sm: 6 },
          py: { xs: 2.5, sm: 6 },
          px: { xs: '18px', sm: 0 },
        }}
      >
        <UserAvatar avatarList={avatarList} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                fontSize={{ xs: 14, sm: 16 }}
                lineHeight={{ xs: '17px', sm: '19px' }}
                color="#272727"
                mt={4}
              >
                아이디(E-mail)
              </Typography>
              <Typography
                variant="body1"
                fontWeight="medium"
                color="#272727"
                mt={1}
                fontSize={{ xs: 14, sm: 16 }}
                lineHeight={{ xs: '17px', sm: '19px' }}
              >
                {profile.email}
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                flex: 'none',
                mt: { xs: 3, sm: 4 },
                p: { xs: 1.5, sm: '15px 46px' },
                backgroundColor: '#4776EF',
                borderRadius: { xs: '10px', sm: 999 },
                height: { xs: 40, sm: 50 },
                width: 'fit-content',
                fontSize: 16,
                fontWeight: 600,
              }}
              onClick={() => setIsReferralShow(true)}
            >
              초대 하기
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: { xs: 0.5, sm: 2 },
              mt: { xs: 1.5, sm: '10px' },
              pb: { xs: 2, sm: 0 },
            }}
          >
            <Typography fontSize={14} color="text.secondary">
              가입: {moment(profile.created_at).format('YYYY.MM.DD')}
            </Typography>
            <Typography fontSize={14} color="text.secondary">
              최근 수정: {moment(profile.updated_at).format('YYYY.MM.DD')}
            </Typography>
            <Typography fontSize={14} color="text.secondary">
              마지막 접속: {moment(profile.last_activated).format('YYYY.MM.DD')}
            </Typography>
          </Box>
          <Divider sx={{ my: { xs: 2.5, sm: 5 } }} />

          <EditableField
            label="이름"
            placeholder="이름을 입력해주세요."
            value={profile.name}
            onChange={updateField('name')}
          />
          <EditableField
            label="연락처"
            placeholder="연락처를 입력해주세요."
            value={profile.phone}
            onChange={updateField('phone')}
            isVerify={isVerify}
            isVerifyButton={isVerifyButton}
          />
          <EditableField
            label="회사명"
            placeholder="회사명을 입력해주세요."
            value={profile.company_name}
            onChange={updateField('company_name')}
          />


          <Box>
            <Typography
              variant="subtitle2"
              fontWeight="700"
              color="#272727"
              sx={{ fontSize: { xs: 14, sm: 16 } }}
              gutterBottom
            >
              마케팅 정보 수신 동의
            </Typography>

            <Typography
              variant="subtitle2"
              fontWeight="400"
              color="#686868"
              sx={{ fontSize: { xs: 14, sm: 16 } }}
              gutterBottom
            >
              톡탁의 최신 소식과 전용 혜택(강의, 이벤트, 신규 기능 등)을 이메일/문자로 가장 먼저 받아 보세요!
            </Typography>


          </Box>

          <Box sx={{ mt: 4, maxWidth: 250, }} >
            <FormControl component="fieldset" fullWidth>
              {/* 수신 동의 방식 선택 */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between', // ✅ switch luôn bên phải
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="700"
                  color="#686868"
                  sx={{ fontSize: 16 }}
                >
                  수신 동의 방식 선택
                </Typography>
                <CustomSwitch color="primary" checked={bothAgree} disabled={bothAgree}
                  onChange={(e) => handleUpdateMKT(e.target.checked, 'both')} />
              </Box>

              {/* 이메일 */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between', // ✅ switch luôn bên phải
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  component={'div'}
                  fontWeight="500"
                  color="#686868"
                  sx={{ fontSize: 16, width: '125px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  이메일 <span style={{ color: '#A4A4A4', fontSize: '16px', textAlign: 'center', minWidth: 80 }}>{emailAgree ? '동의' : '동의안함'}</span>
                </Typography>
                <CustomSwitch
                  color="primary"
                  checked={emailAgree}
                  onChange={(e) => handleUpdateMKT(e.target.checked, 'email')}
                  sx={{
                    width: isMobile ? 36 : 45,
                    height: isMobile ? 22 : 19,
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      transform: `translateX(${isMobile ? 13 : 26}px)`,
                    },
                    '& .MuiSwitch-thumb': {
                      width: isMobile ? 18 : 15,
                      height: isMobile ? 18 : 15,
                    },
                  }}
                />


              </Box>

              {/* 문자 */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between', // ✅ switch luôn bên phải
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  component={'div'}
                  fontWeight="500"
                  color="#686868"
                  sx={{ fontSize: 16, width: '125px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  문자 <span style={{ color: '#A4A4A4', fontSize: '16px', textAlign: 'center', minWidth: 80 }}>{smsAgree ? '동의' : '동의안함'}</span>
                </Typography>
                <CustomSwitch color="primary" checked={smsAgree}
                  onChange={(e) => handleUpdateMKT(e.target.checked, 'sms')} />
              </Box>
            </FormControl>
          </Box>




          <Divider sx={{ my: { xs: 2.5, sm: 5 } }} />

          <Box
            sx={{
              gap: { xs: 2, sm: 4 },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              px: 0,
              pb: 0,
              alignItems: 'start',
            }}
          >
            <Link href="#" color="#A4A4A4" onClick={() => handleClick(0)}>
              로그아웃
            </Link>
            <Link href="#" color="#A4A4A4" onClick={() => handleClick(1)}>
              회원 탈퇴하기
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MyPage;
