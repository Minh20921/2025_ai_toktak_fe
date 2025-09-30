'use client';
import { IconFamily, UpDownIcon } from '@/utils/icons/icons';
import { SAMPLE_LIST } from '@/utils/mockData/sampleVideoThumbnail';
import { Box, Button, Divider, Popover, Slide, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import API from '@service/api';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { LocalStorageItems } from '@/../shared/constants';
import BottomPopupMobile from '@/app/(DashboardLayout)/components/popup/BottomPopupMobile';
import Footer from '@/app/(DashboardLayout)/layout/footer/Footer';
import BuyPackagePopup from '@/app/(DashboardLayout)/components/popup/BuyPackagePopup';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import SeoHead from '@/app/components/SeoHead';
import { getConfig } from '@/app/lib/config-api';
import { setProductUrl } from '@/app/lib/store/createContentSlice';
import { RootState } from '@/app/lib/store/store';
import { IS_NEW_USER_REFERRAL, sampleTemplates, SEO_DATA_HOME, TIME_REFERRAL_CODE_PERIOD } from '@/utils/constant';
import { showNoticeError } from '@/utils/custom/notice_error';
import { CloseIcon } from '@/utils/icons/icons';
import { Icon } from '@iconify/react';
import moment from 'moment';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import SampleTemplatesSwiper from './SampleTemplatesSwiper';
import iconAiGenFromPrompt from '@/../public/images/home/material-icon-theme_prompt.svg';

const DEFAULT_IMAGE = '/images/home/blankImg.png';
const DEFAULT_VIDEO = '/images/home/blankVideo.png';

const CreateOptions = ({ handleClose, onChoose }: { handleClose: () => void; onChoose: (value: number) => void }) => {
  const [activeBox, setActiveBox] = useState('now');
  return (
    <Box className="relative">
      <CloseIcon
        className="w-[100vw] h-[calc(100vh-100px)] absolute -top-[calc(100vh-100px)] left-0 p-0 cursor-pointer sm:hidden z-[99999]"
        fill="none"
        onClick={handleClose}
      />
      <Box className={'relative w-full sm:w-[144px] py-[10px] overflow-hidden'}>
        <Box className="px-[19px] py-[10px] cursor-pointer text-[16px] text-[#272727] sm:text-[#A4A4A4] text-center sm:text-left">
          생성 모드
        </Box>
        <Box
          className="flex items-center justify-between px-[19px] py-[15px] cursor-pointer hover:bg-[#F9F9F9] text-[16px]"
          onClick={() => {
            onChoose(0);
            handleClose();
          }}
        >
          간편
        </Box>
        <Box
          className="flex items-center justify-between px-[19px] py-[15px] cursor-pointer hover:bg-[#F9F9F9] text-[16px]"
          onClick={() => {
            handleClose();
            onChoose(1);
          }}
        >
          전문가
        </Box>
      </Box>
    </Box>
  );
};

const SampleList = ({
  handleClose,
  onChoose,
}: {
  handleClose: (e: any) => void;
  onChoose: (value: number) => void;
}) => {
  const [activeBox, setActiveBox] = useState('now');
  const router = useRouter();
  return (
    <Box className={'relative w-full sm:w-[calc(100vw-493px)] sm:max-w-[1108px]'}>
      <Box className="relative py-[20px] sm:hidden">
        <CloseIcon
          className="w-[100vw] h-[calc(100vh-310px)] absolute -top-[calc(100vh-307px)] left-0 p-0 cursor-pointer"
          fill="none"
          onClick={handleClose}
        />
        <Typography className="sm:hidden text-[16px] font-semibold font-pretendard text-center" color="#090909">
          샘플
        </Typography>
      </Box>
      {SAMPLE_LIST.map((item, index) => (
        <Box key={`sample_${index}`}>
          {index > 0 && <Divider color="#F9F9F9" className="w-full h-[1px]" />}
          <Box
            className="flex gap-[20px] items-center py-[10px] px-[20px] cursor-pointer hover:bg-[#EFF5FF] hover:text-[#4776EF]"
            onClick={() => router.push(`analys?sampleId=${item.id}`)}
          >
            <Image src={item.thumbnail} width={65} height={65} alt="loading" className="rounded-[6px]" />
            <Box className="cursor-pointer hover:bg-[#EFF5FF] hover:text-[#4776EF]" onClick={() => { }}>
              <Typography
                className="text-[14px] sm:text-[16px] font-bold font-pretendard w-[calc(100vw-120px)] sm:w-auto text-nowrap text-ellipsis overflow-hidden"
                color="#666C78"
              >
                {item.title}
              </Typography>
              <Box className="flex gap-[10px] items-center cursor-pointer hover:bg-[#EFF5FF] hover:text-[#4776EF]">
                <Box
                  className="text-[12px] font-semibold font-pretendard flex gap-[5px] items-center rounded-[4px] bg-[#F6F7F9] px-[5px] text-nowrap"
                  color="#686868"
                >
                  <Icon
                    icon="octicon:link-16"
                    style={{
                      width: 9,
                      height: 9,
                      color: '#6A6A6A',
                      aspectRatio: '1/1',
                      // transform: `rotate(${expanded ? 0 : 180}deg)`,
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />
                  <b>URL</b> 에서 분석
                </Box>
                <Typography
                  className="w-[calc(100vw-230px)] text-[13px] sm:w-auto sm:text-[14px] font-normal font-pretendard text-nowrap text-ellipsis overflow-hidden"
                  color="#686868"
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const Toast = ({ detail }: { detail: any }) => {
  const [activeBox, setActiveBox] = useState('now');
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpenNotice, setIsOpenNotice] = useState(false);

  useEffect(() => {
    if (detail?.popup_type === 'toasts') {
      setIsOpenNotice(true);
    }
  }, [detail]);

  return (
    <Snackbar
      open={isOpenNotice}
      anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: isMobile ? 'center' : 'right' }}
      autoHideDuration={null}
      slots={{ transition: Slide }}
      onClick={(e) => {
        e.stopPropagation();
        if (detail?.url) {
          if (detail?.redirect_type === '_blank') {
            window.open(detail?.url, '_blank');
          } else {
            location.href = detail?.url;
          }
        }
      }}
      sx={{ position: 'absolute', zIndex: 10, cursor: detail?.url ? 'pointer' : 'default' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: isMobile ? '8px' : '16px',
          maxWidth: isMobile ? '100%' : '673px',
          flexDirection: 'row',
          bgcolor: '#fff',
          boxShadow: '0px 4.11px 30.84px 0px #0000001A',
          p: isMobile ? '12px' : '24px 26px',
          mb: isMobile ? '10px' : '0',
          gap: isMobile ? 1 : 2,
        }}
      >
        <Box
          sx={{
            fontSize: isMobile ? '12px' : '16px',
            lineHeight: '20px',
            color: '#fff',
            padding: '0',
            fontFamily: 'var(--font-pretendard)',
            fontWeight: 600,
            textAlign: 'center',
            backgroundColor: detail?.toasts_color || '#000',
            borderRadius: isMobile ? '14px' : '20px',
            width: isMobile ? '65px' : '90px',
            height: isMobile ? '24px' : '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Box dangerouslySetInnerHTML={{ __html: detail?.title || '' }} />
        </Box>
        <Box
          sx={{
            fontSize: isMobile ? '12px' : '18px',
            lineHeight: isMobile ? '20px' : '30px',
            color: '#272727',
            fontFamily: 'var(--font-pretendard)',
            fontWeight: 500,
            flexGrow: 1,
          }}
        >
          <Box dangerouslySetInnerHTML={{ __html: detail?.description || '' }} />
        </Box>
        <CloseIcon
          width={isMobile ? 15 : 30}
          height={isMobile ? 15 : 30}
          fill="#A4A4A4"
          style={{
            top: isMobile ? '20px' : '25px',
            right: isMobile ? '10px' : '20px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpenNotice(false);
          }}
        />
      </Box>
    </Snackbar>
  );
};

const StartRenderVideo = ({
  onAnalysis,
  setAdsEnabled,
  setNarration,
  setAudios,
  adsEnabled,
  narration,
}: {
  onAnalysis: (url: string) => void;
  setAdsEnabled: (value: boolean) => void;
  setNarration: (value: string) => void;
  setAudios: (value: any[]) => void;
  adsEnabled: boolean;
  narration: string;
}) => {
  const [url, setUrl] = useState('https://ko.aliexpress.com/item/1005007358950728.html?spm=a2g0o.productlist.main.7.26a7jf5Rjf5ROS&pdp_ext_f=%7B%22sku_id%22%3A%2212000040414389915%22%7D&utparam-url=scene%3Asearch%7Cquery_from%3Acategory_navigate');
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [anchorElSample, setAnchorElSample] = React.useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const isDesktop = useMediaQuery('(min-width:640px)');
  const [config, setConfig] = useState<any>();
  const [openBuyPackagePopup, setOpenBuyPackagePopup] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickSample = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElSample(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseSample = () => {
    setAnchorElSample(null);
  };
  const open = Boolean(anchorEl);
  const openSample = Boolean(anchorElSample);
  const id = open ? 'tooltip-popover' : undefined;

  const getConfigBasic = useRef(
    new API(`/api/v1/maker/template_video`, 'GET', {
      success: (res, customData) => {
        saveNarration(res?.data?.narration);
        saveAds(
          customData?.adsChecked?.toString() != 'null'
            ? !!Number(customData?.adsChecked)
            : !!res?.data?.is_paid_advertisements,
        );
        setAudios(res?.data?.audios || []);
        setSelectedOption(res?.data?.is_advance === 1 ? 1 : 0);
      },
      error: (err) => { },
      finally: () => {
        setLoading(false);
      },
    }),
  );

  const searchParams = useSearchParams();

  // Check for DOMEGGOOK_URL in sessionStorage and set as default
  useEffect(() => {
    const domeggookUrl = sessionStorage.getItem('DOMEGGOOK_URL');
    if (domeggookUrl) {
      setUrl(domeggookUrl);
    }
  }, []);

  useEffect(() => {
    const authCompletedRaw = searchParams.get('authCompleted');
    // Nếu không có authCompleted thì không làm gì
    if (authCompletedRaw === null || authCompletedRaw === '') return;

    const authCompleted = parseInt(searchParams.get('authCompleted') || '0');
    const saved = localStorage.getItem(TIME_REFERRAL_CODE_PERIOD);
    const checkNewUserNice = localStorage.getItem(IS_NEW_USER_REFERRAL);
    if (saved && moment().isBefore(moment(saved))) {
      if (authCompleted) {
        if (checkNewUserNice === '1') {
          showNoticeMUI(
            '🎁 가입 선물 30일 + 초대 보상 7일!',
            '🎁 총 37일간 베이직 플랜을 무료로 이용할 수 있어요!<br>즐겁게 이용해 보세요! 😊',
            false,
            '확인',
            '',
            () => router.push('/'),
            'success_coupon.gif',
          );
        } else {
          showNoticeMUI(
            '🔔 이미 가입된 회원입니다!',
            '초대 수락은 신규 가입 계정만 가능해요. 😊',
            false,
            '확인',
            '',
            () => router.push('/'),
          );
        }

        localStorage.removeItem(TIME_REFERRAL_CODE_PERIOD);
      }
    } else {
      // ❌ Hết hạn hoặc không tồn tại
      localStorage.removeItem(TIME_REFERRAL_CODE_PERIOD);
      if (authCompleted === 1) {
        showNoticeMUI('🔔 성공적으로 인증되었습니다', '', false, '확인', '', () => router.push('/'));
      } else if (authCompleted === 0) {
        showNoticeError(
          '⚠️ 인증에 실패하였습니다!',
          '🔄 잠시 후 다시 시도해 주세요. 빠르게 해결할게요! 😊',
          false,
          '확인',
          '취소',
          () => {
            router.push('/');
          },
        );
      }
    }
  }, [searchParams]);

  const closeCoupangPupop = () => {
    const current = new Date().getTime();
    localStorage.setItem(LocalStorageItems.LATEST_TIME_OPEN_COUPANG_POPUP, current.toString());
  };

  // const showNoticeWithCoupang = () => {
  //   const latestTimeOpenLawyerPopup = localStorage.getItem(LocalStorageItems.LATEST_TIME_OPEN_COUPANG_POPUP);
  //   const isOpen =
  //     !latestTimeOpenLawyerPopup ||
  //     moment(Number(latestTimeOpenLawyerPopup)).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD');
  //   if (isOpen) {
  //     showNotice(
  //       '🚧 쿠팡 링크가 잠시 멈췄어요.',
  //       '🎬 지금은 알리의 "영상 상품"으로 멋진 콘텐츠를 만들 기회예요!<br/>🔗 알리 영상 → 쿠팡 수익 연결법은 아래 [영상 보기]를 눌러주세요.👇',
  //       true,
  //       '영상 보기',
  //       '닫기',
  //       () => {
  //         closeCoupangPupop();
  //         window.open('https://www.youtube.com/watch?v=GAzh_rll5M0', '_blank');
  //       },
  //       '',
  //       () => closeCoupangPupop(),
  //     );
  //   }
  // };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const result = await getConfig();
        setConfig(result as any);
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };
    fetchConfig();
  }, []);
  useEffect(() => {
    const adsChecked = localStorage.getItem('adsChecked');
    if (user) {
      getConfigBasic.current.call({ adsChecked });
    }
  }, [user]);
  const handleAnalysisAdvanced = (url: string) => {
    if (loading || !url) return;

    // if (!url.startsWith('https://')) {
    //   showNoticeError(
    //     '⚠️ 상품 정보를 가져오는 데 문제가 생겼어요!',
    //     '올바른 상품 URL을 입력하세요.',
    //     false,
    //     '확인',
    //     '취소',
    //     () => {
    //       setLoading(false);
    //     },
    //   );
    //   return;
    // }
    router.push('/analys/advanced');
  };
  const saveNarration = (data: string) => {
    setNarration(data);
  };
  const saveAds = (data: boolean) => {
    setAdsEnabled(data);
    localStorage.setItem('adsChecked', data ? '1' : '0');
  };
  const getCheckBatch = useRef(
    new API(`/api/v1/maker/check-create-batch`, 'GET', {
      success: (res, customData) => {
        if (res.code == 200) {
          if (customData?.activeBox == 1) {
            handleAnalysisAdvanced(customData?.url);
            return;
          } else {
            onAnalysis(customData?.url);
            setLoading(false);
          }
          // Remove DOMEGGOOK_URL from sessionStorage
          sessionStorage.removeItem('DOMEGGOOK_URL');
        } else if (res.code == 201) {
          if (!['STANDARD'].includes(user?.subscription || '')) {
            setOpenBuyPackagePopup(true);
          } else {
            showNoticeMUI(
              '🥲 생성하기를 모두 사용했어요.',
              '추가 구매 후 더 많은 콘텐츠를 만들어 보세요.',
              true,
              '요금제 결제하기',
              '나중에 할게요',
              () => {
                router.push('/payment?package=STANDARD');
              },
            );
          }
          setLoading(false);
          return;
        } else if (res.code == 202) {
          showNoticeMUI(
            res?.message || '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            res?.data?.error_message || '',
            false,
            '확인',
          );
          setLoading(false);
          return;
        }
      },
      error: (err) => {
        showNoticeMUI(
          err?.message || '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
          (err as any)?.error_message || '',
          false,
          '확인',
        );
        setLoading(false);
      },
      finally: () => { },
    }),
  );

  const handleCheckBatch = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (!/^(?:https?:\/\/)?(?:www\.)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{1,5}(?:\/[\S]*)?$/.test(url.trim())) {
      showNoticeMUI('🔗 링크를 찾을 수 없어요.', 'URL이 정확한지 다시 확인해 주세요.', false, '확인', '', () => { });
      return;
    }

    setLoading(true);

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    dispatch(setProductUrl({ productUrl: formattedUrl }));
    getCheckBatch.current.config.params = { is_advance: selectedOption === 1 };
    getCheckBatch.current.call({ url: formattedUrl, activeBox: selectedOption });
  };
  const listAiGenerated = [
    {
      id: 1,
      title: '프롬프트 AI 콘텐츠 생성',
      icon: iconAiGenFromPrompt,
      path: "/ai-generation"
    },
  ]

  const onClickGenerate = async () => {
    try {
      await fetch('/api/gemini/click', {
        method: 'PATCH',
      })
    } catch (err) {
      console.error('Lỗi khi tăng clickButtonGenerate:', err)
    }
    router.push('/generative-image-toktak')
  }

  return (
    <Box>
      <SeoHead {...SEO_DATA_HOME} />
      <BuyPackagePopup open={openBuyPackagePopup} onClose={() => setOpenBuyPackagePopup(false)} />

      <Box className="font-pretendard flex flex-col">
        <Box className="min-h-[calc(100dvh-60px)] sm:min-h-auto sm:h-[calc(100dvh-30px)] grid grid-cols-1 content-between gap-[20px] mt-[30px] sm:mt-0">
          <Box className="sm:pt-[5dvh]">
            <Typography
              className="text-[22px] sm:text-[36px] mt-[50px] sm:mt-0 text-center text-[#090909] font-semibold"
              sx={{
                background: 'linear-gradient(104.34deg, #4776EF 9.13%, #AD50FF 94.52%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              링크 한 줄, 수익 창출
            </Typography>
            <Typography className="text-[12px] sm:text-[20px] mt-[5px] text-center text-[#272727]">
              상품 URL만 붙이면, AI가 콘텐츠를 만들어 SNS에 자동 업로드합니다
              <br className="sm:hidden" />
            </Typography>
          </Box>
          <Box>
            <Box
              id="productUrl"
              className="bg-white mx-auto w-full max-w-7xl px-3 py-[5px] rounded-[24px] sm:rounded-[24px] pb-3
         md:rounded-[24px] flex flex-col gap-2 sm:gap-4 border-[1px] border-[#F5F5F5]"
              style={{ boxShadow: '0px 4.11px 30.84px 0px #0000001A' }}
            >
              <Box
                component="div"
                sx={{
                  transform: { xs: 'scale(0.75)', sm: 'scale(1)' },
                  transformOrigin: { xs: '0 0', sm: '0 0' },
                  width: { xs: '133.33%', sm: '100%' },
                }}
              >
                <input
                  className="w-full h-[40px] sm:h-[50px] md:h-[70px] flex-grow outline-none text-[16px] sm:text-[18px] font-medium text-[#5F5F5F] placeholder:text-[#C5CAD1] px-0 sm:px-3 [&::placeholder]:origin-left"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="상품 URL을 붙여주세요 (예: 도매꾹/도매매, 알리)"
                  style={{
                    WebkitTextSizeAdjust: 'none',
                    touchAction: 'manipulation',
                    transformOrigin: '0 0',
                  }}
                />
              </Box>

              <Box className="flex justify-between">
                <Button
                  color="primary"
                  disableElevation
                  variant="contained"
                  className="relative flex w-28 h-[40px] flex-none !rounded-full !bg-transparent border-solid border-[1px] border-[#EEEEEE]  font-pretendard"
                  onClick={handleClick}
                >
                  <Typography className=" text-sm font-medium text-[#909090] flex items-center gap-[10px] whitespace-nowrap">
                    {selectedOption === 0 ? '간편' : '전문가'}
                    <UpDownIcon
                      color="#909090"
                      className={`transition-all duration-500 ease-in-out ${open ? 'rotate-180' : ''}`}
                    />
                  </Typography>
                </Button>
                <Button
                  color="primary"
                  disableElevation
                  variant="contained"
                  className="relative flex w-24 h-[40px] flex-none !rounded-full font-pretendard"
                  onClick={handleCheckBatch}
                  disabled={!url}
                  sx={{ background: 'linear-gradient(112.75deg, #6F7BF4 18.67%, #9B6BFB 85.03%)' }}
                >
                  {loading ? (
                    <Image src="/images/home/loading-dot.gif" width={92} height={46} alt="loading" />
                  ) : (
                    <Typography className=" text-sm font-medium text-white flex items-center gap-[10px]">
                      생성하기
                    </Typography>
                  )}
                </Button>
              </Box>
              {isDesktop && (
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  slotProps={{ paper: { sx: { borderRadius: '10px' } }, root: { sx: { mt: '22px' } } }}
                  className="hidden sm:block"
                >
                  <CreateOptions handleClose={handleClose} onChoose={(num: number) => setSelectedOption(num)} />
                </Popover>
              )}
              <BottomPopupMobile open={open} onClose={() => handleClose()}>
                <CreateOptions handleClose={handleClose} onChoose={(num: number) => setSelectedOption(num)} />
              </BottomPopupMobile>
            </Box>
            <Box className="mt-5 w-full max-w-7xl mx-auto flex justify-between text-right">
              <Box className={'flex gap-[12px]'}>
                {listAiGenerated.map((item) => (
                  <Box
                    key={item.id}
                    onClick={() => router.push(item.path)}
                    className="cursor-pointer flex items-center gap-[2px] border border-[#EEEEEE] rounded-[5px] px-[16px] py-[10px] hover:bg-[#F9F9F9] h-[44px]"
                  >
                    <item.icon />
                    <span className="text-sm font-semibold text-[#232323]">
                      {item.title}
                    </span>
                  </Box>
                ))}
                <Button
                  color="primary"
                  disableElevation
                  variant="contained"
                  className="flex min-w-[178PX] h-[44px] flex-none !rounded-[24px] gap-[4px]"
                  onClick={onClickGenerate}
                  sx={{
                    background: 'linear-gradient(112.75deg, #6F7BF4 18.67%, #9B6BFB 85.03%)',
                    border: '1px solid rgba(238, 238, 238, 1)',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  <IconFamily /> <p className={'text-[#fff]'}>AI 가족사진 </p>
                  <Box
                    className={
                      'text-[#9B6BFB] font-[700] leading-[22px] h-[22px] px-1 min-w-[68px] text-[rgba(111, 123, 244, 1)] text-[12px] bg-[#fff] rounded-[100px]'
                    }
                  >
                    무료 이벤트
                  </Box>
                </Button>
              </Box>
              <span
                className="text-[14px] text-[#666C78] font-semibold text-nowrap cursor-pointer underline"
                onClick={handleClickSample}
              >
                샘플 링크 보기
              </span>
              {isDesktop && (
                <Popover
                  id="popover-sample"
                  open={openSample}
                  anchorEl={anchorElSample}
                  onClose={handleCloseSample}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  slotProps={{ paper: { sx: { borderRadius: '10px' } }, root: { sx: { mt: '10px' } } }}
                  className="hidden sm:block"
                >
                  <SampleList handleClose={handleCloseSample} onChoose={handleCheckBatch} />
                </Popover>
              )}
              <BottomPopupMobile open={openSample} onClose={() => handleCloseSample()}>
                <SampleList
                  handleClose={(e: any) => {
                    handleCloseSample();
                    // handleClick(e);
                  }}
                  onChoose={handleCheckBatch}
                />
              </BottomPopupMobile>
            </Box>
          </Box>
          <Box>
            <SampleTemplatesSwiper
              sampleTemplates={sampleTemplates}
              currentIndex={currentIndex}
              onSlideChange={setCurrentIndex}
            />
          </Box>
        </Box>
        <Box className="w-full h-auto sm:max-w-[1031px] my-[20px] sm:my-[50px] sm:mx-auto mt-[50px] sm:mt-[100px]">
          <video
            id="simpate_video_id-wu998sg6fi3"
            src="/videos/home/video-screen.webm"
            style={{
              border: 'none',
              width: '100%!important',
              height: 'auto !important',
              maxWidth: '100% !important',
              aspectRatio: '1/0.5625',
              display: 'block',
              margin: '0 auto',
            }}
            className="w-full"
            muted
            playsInline
            autoPlay
            loop
          />
        </Box>
      </Box>
      <Toast detail={config?.notification_detail} />
      <Footer />
    </Box>
  );
};

export default StartRenderVideo;
