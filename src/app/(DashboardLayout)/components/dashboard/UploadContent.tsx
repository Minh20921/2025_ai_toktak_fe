'use client';
import { SocialIcon } from '@/app/(DashboardLayout)/upload/StatusSocial';
import { setNotificationState } from '@/app/lib/store/notificationSlice';
import { RootState } from '@/app/lib/store/store';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { encodeUserId } from '@/utils/encrypt';
import { Blog, Facebook, Instagram, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';
import { Icon } from '@iconify/react';
import {
  Box,
  CircularProgress,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import API from '@service/api';
import APIV2 from '@service/api_v2';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow placement="top" classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '14px',
    borderRadius: 999,
    padding: '8px 20px',
    lineHeight: 1.5,
    whiteSpace: 'nowrap',
    maxWidth: 'unset',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      padding: '6px 14px',
    },
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#8B5CF6', // Mũi tên cùng màu nền
  },
}));

const UploadContent = ({
  indexContent = 0,
  type = 0,
  thumbnail = '',
  statusList = [0, 0, 0, 0, 0, 0, 0],
  socialLinkList = Array(6).fill(''),
  blog = {},
}: {
  indexContent: number;
  type?: number;
  thumbnail?: string;
  statusList?: number[];
  socialLinkList?: string[];
  blog?: any;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const platform = useSelector((state: RootState) => state.platform);
  const [isCopied, setIsCopied] = useState(false);
  const [isDisplayNotice, setDisplayNotice] = useState(false);
  const [isOpenBlog, setIsOpenBlog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDownload, setIsDownload] = useState(false);

  const user_login = useSelector((state: RootState) => state.auth.user);
  const TYPE = [
    { name: 'VIDEO', fileType: 'MP4', size: 8.37 },
    { name: 'IMAGE', fileType: 'PNG', size: 8.37 },
    { name: 'BLOG', fileType: 'DOCX', size: 8.37 },
  ];

  const [socialButtons, setSocialButtons] = useState([
    {
      name: 'youtube',
      icon: <Youtube className="w-7 h-7 sm:w-9 sm:h-9" />,
      status: type === 0 && platform['youtube'].status,
      step: 0,
      isShowAnimation: false,
      type: [0, 1],
    },
    {
      name: 'instagram',
      icon: <Instagram className="w-7 h-7 sm:w-9 sm:h-9" />,
      status: platform['instagram'].status,
      step: 0,
      type: [0, 1],
    },
    {
      name: 'facebook',
      icon: <Facebook className="w-7 h-7 sm:w-9 sm:h-9" />,
      status: platform['facebook'].status,
      step: 0,
      type: [0, 1],
    },
    {
      name: 'tiktok',
      icon: <TikTok className="w-7 h-7 sm:w-9 sm:h-9" />,
      status: platform['tiktok'].status,
      step: 0,
      type: [0, 1],
    },
    {
      name: 'threads',
      icon: <Threads className="w-7 h-7 sm:w-9 sm:h-9" />,
      status: platform['threads'].status,
      step: 0,
      type: [0, 1],
    },
    {
      name: 'twitter',
      icon: <Twitter className="w-7 h-7 sm:w-9 sm:h-9" />,
      status: platform['twitter'].status,
      step: 0,
      type: [0, 1],
    },
    { name: 'blog', icon: <Blog className="w-7 h-7 sm:w-9 sm:h-9" />, status: 0, step: 0, type: [2] },
  ]);

  const lastIndexNotLink = socialButtons.findLastIndex((s) => !s.status && s.name !== 'blog');

  const setSocialButtonsStep = (index: number, step: number) => {
    setSocialButtons((prev) => {
      const tmp = [...prev];
      tmp[index].step = step;
      return tmp;
    });
  };

  useEffect(() => {
    statusList.forEach((status, index) => {
      if (status === 2 && socialButtons[index].step === 0) {
        setSocialButtonsStep(index, 2);
        const timeout = setTimeout(() => {
          setSocialButtonsStep(index, -1);
        }, 2000);
        return () => clearTimeout(timeout);
      }

      if (status === 1 && socialButtons[index].step === 0) {
        setSocialButtonsStep(index, 3);
        let timeout = setTimeout(() => setSocialButtonsStep(index, 4), 1000);
        setSocialButtons((prev) => {
          const tmp = [...prev];
          tmp[index].isShowAnimation = true;
          return tmp;
        });
        timeout = setTimeout(() => setSocialButtonsStep(index, 5), 2000);
        timeout = setTimeout(() => setSocialButtonsStep(index, 6), 4000);
        timeout = setTimeout(() => {
          setSocialButtonsStep(index, 4);
          setSocialButtons((prev) => {
            const tmp = [...prev];
            tmp[index].isShowAnimation = false;
            return tmp;
          });
        }, 5000);
        return () => clearTimeout(timeout);
      }
    });
  }, [statusList]);

  const fetchNotification = () => {
    const Notification = new APIV2('/api/v1/notification/get_total_unread_notification', 'GET', {
      success: (res) => {
        dispatch(setNotificationState({ notification: res?.data?.total_pages || 0 }));
      },
    });
    Notification.config.params = {
      user_id: encodeUserId(user_login?.id || 0),
      not: 2,
    };

    Notification.call();
  };

  const copyBlogApi = new API('/api/v1/maker/copy-blog', 'POST', {
    success: async (res) => {
      if (res?.status !== 201) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([blog?.content || ''], { type: 'text/html' }),
          }),
        ]);
        fetchNotification();
        setIsCopied(true);
        setDisplayNotice(true);
        const timeout = setTimeout(() => setDisplayNotice(false), 2000);
        return () => clearTimeout(timeout);
      }
    },
    error: (err) => console.error(err),
  });

  const handleCopy = () => {
    if (!blog?.content || isCopied) return;
    copyBlogApi.config.data = { blog_id: blog?.id };
    copyBlogApi.call();
  };

  const handleOpenBlog = () => {
    if (isOpenBlog) return;
    setIsOpenBlog(true);
    window.open(platform?.blog?.meta_url, '_blank');
  };

  const handleBlog = (action: () => void) => {
    if (platform?.blog?.meta_url) {
      action();
    } else {
      showNotice(
        '블로그 URL을 연결한 후 시도해주세요 😢',
        '생성된 콘텐츠는 임시저장에서 확인 가능합니다.',
        true,
        '지금 연결하기',
        '다음에',
        () => router.push('/profile'),
      );
    }
  };
  const download = async () => {
    setIsDownload(true);
    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(blog?.docx_url || '')}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob(); // Nhận dữ liệu dạng blob
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'blog.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url); // Giải phóng bộ nhớ
    } catch (error) {
      console.error('❌ Tải xuống thất bại:', error);
    } finally {
      setIsDownload(false);
    }
  };
  const handleDownload = () => {
    if (!user?.can_download) {
      showNoticeError(
        '⏳ 다운로드 기간이 살짝 지났네요.',
        '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>언제든 필요한 콘텐츠를 꺼낼 수 있어요.',
        true,
        '확인',
        '취소',
        () => {
          router.push('/rate-plan');
        },
      );
      return;
    }
    if (user?.subscription === 'FREE' && moment().diff(moment(user?.created_at), 'days') <= 3) {
      showNoticeError(
        '⏳ 무료 다운로드는 가입 후 3일만',
        '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>언제든 무제한 다운로드가 가능해요.',
        true,
        '확인',
        '취소',
        () => {
          download();
        },
      );
      return;
    }
    download();
  };

  const renderSocialButtons = () =>
    type === 2 ? (
      <Box sx={{ display: 'flex', gap: { xs: '4px', sm: '20px' }, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            px: { xs: 1, sm: 2 },
            py: { xs: 0.5, sm: 1 },
            borderRadius: '10px',
            cursor: 'pointer',
            backgroundColor: isCopied ? '#F6F7F9' : 'transparent',
            '&:hover': { backgroundColor: '#F6F7F9' },
            fontSize: { xs: '10px', sm: '12px' },
            fontWeight: 600,
            alignItems: 'center',
          }}
          onClick={() => handleBlog(handleCopy)}
        >
          <Icon icon="tabler:copy" width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} />
          복사
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            px: { xs: 1, sm: 2 },
            py: { xs: 0.5, sm: 1 },
            borderRadius: '10px',
            cursor: 'pointer',
            backgroundColor: isDownload ? '#F6F7F9' : 'transparent',
            '&:hover': { backgroundColor: '#F6F7F9' },
            fontSize: { xs: '10px', sm: '12px' },
            fontWeight: 600,
            alignItems: 'center',
          }}
          onClick={handleDownload}
        >
          {isDownload ? (
            <CircularProgress size={isMobile ? 16 : 20} />
          ) : (
            <Icon icon="ic:round-download" width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} />
          )}
          다운로드
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            px: { xs: 1, sm: 2 },
            py: { xs: 0.5, sm: 1 },
            borderRadius: '10px',
            cursor: 'pointer',
            backgroundColor: isOpenBlog ? '#F6F7F9' : 'transparent',
            fontSize: { xs: '10px', sm: '12px' },
            fontWeight: 600,
            alignItems: 'center',
            '&:hover': { backgroundColor: '#F6F7F9' },
          }}
          onClick={() => handleBlog(handleOpenBlog)}
        >
          <Icon icon="majesticons:open" width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} />
          바로가기
        </Box>
      </Box>
    ) : (
      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        {socialButtons
          .filter((s) => s.type.includes(type))
          .map((social, index) => {
            const showTooltip = index === lastIndexNotLink && type === 0 && indexContent === 0;
            return (
              <CustomTooltip
                key={social.name}
                title={`계정 연결하고 수익 2배 만들기${!isMobile ? ' 💸' : ''}`}
                placement="top"
                arrow
                open={showTooltip}
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <Box sx={{ position: 'relative' }}>
                  <SocialIcon
                    status={social.status ? statusList[index] : -1}
                    icon={social.icon}
                    size={isMobile ? 28 : 40}
                    onClick={() => {
                      if (statusList[index] === 1) {
                        window.open(socialLinkList[index], '_blank');
                      }
                    }}
                  />
                </Box>
              </CustomTooltip>
            );
          })}
      </Box>
    );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 2.5 },
        width: '100%',
        maxWidth: '649px',
        borderRadius: { xs: '8px', md: '16px' },
        boxShadow: { xs: '0px 4px 15px 0px #0000000D', md: '0px 0px 30px 0px #0000000D' },
        position: 'relative',
        gap: 2,
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          flex: 'none',
          width: '80px',
          height: '80px',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: thumbnail ? 'transparent' : '#F8F8F8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {thumbnail ? (
          <img src={thumbnail || '/placeholder.svg'} alt="icon" width={80} height={80} />
        ) : (
          <img src={`/images/upload/empty_post_${type + 1}.png`} alt="default" />
        )}
      </Box>

      {/* Content + Buttons (Mobile) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 1,
          flex: 1,
          px: { xs: 0, md: 2 },
        }}
      >
        <Box sx={{ fontSize: { xs: '14px', sm: '20px' }, fontWeight: 'bold', color: { xs: '#272727', sm: '#686868' } }}>
          {TYPE[type].name}
        </Box>
        {/* Buttons on Mobile */}
        {isMobile && <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>{renderSocialButtons()}</Box>}
        <Box
          sx={{ fontSize: { xs: '10px', sm: '12px' }, fontWeight: { xs: 400, sm: 500 }, color: '#686868' }}
        >{`${TYPE[type].fileType} | ${TYPE[type].size}MB`}</Box>
      </Box>

      {/* Buttons on Desktop */}
      {!isMobile && <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexShrink: 0 }}>{renderSocialButtons()}</Box>}

      {/* Copy Notice */}
      {isDisplayNotice && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            mt: 1,
            width: '100%',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: '#272727',
          }}
        >
          블로그 콘텐츠를 복사했어요.
        </Box>
      )}
    </Box>
  );
};

export default UploadContent;
