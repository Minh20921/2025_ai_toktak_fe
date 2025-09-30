'use client';
import React, { useEffect, useRef, useState } from 'react';
import API from '@service/api';
import {
  Box,
  CircularProgress,
  LinearProgress,
  linearProgressClasses,
  Snackbar,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import UploadContent from '../components/dashboard/UploadContent';
import { useDispatch } from 'react-redux';
import { setNotificationState } from '@/app/lib/store/notificationSlice';
import ShowSampleInfo from '@/utils/custom/sampleInfo';
import { IPost } from '@/app/(DashboardLayout)/history/components/const';
import { Icon } from '@iconify/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import APIV2 from '@service/api_v2';
import { encodeUserId } from '@/utils/encrypt';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_UPLOAD } from '@/utils/constant';
import { showNotice } from '@/utils/custom/notice';

const useExitAlert = (message: string) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
    };

    const handlePopState = () => {
      if (!window.confirm(message)) {
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [message]);
};
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  maxWidth: '80%',
  margin: '0 auto',
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundImage: 'linear-gradient(91.47deg, #4776EF 7.33%, #3265EA 95.87%)', // Gradient bar
  },
}));
const Upload = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [postsData, setPostsData] = useState<IPost[]>();
  const [fakePercent, setFakePercent] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const isIntercepting = useRef(false);
  const snsErrorUpload = useRef<string[]>([]);
  const user_login = useSelector((state: RootState) => state.auth.user);

  const loop = useRef(0);
  const MAX_LOOP = 50;
  // kiểm tra khi người dùng nhấn back or đóng
  useExitAlert('🚪 정말 나가시겠어요?\nSNS에는 업로드되지 않고, 임시저장함에 보관돼요.');
  const abortControllerRef = useRef(new AbortController()); // Tạo một AbortController

  // kiểm tra khi người dùng chuyển router
  useEffect(() => {
    const originalPush = router.push;

    router.push = async (url: string) => {
      if (url === pathname || isIntercepting.current) return; // Ngăn vòng lặp và điều hướng lại chính nó
      if (window.__skipConfirm || fakePercent === 100) {
        window.__skipConfirm = false; // Reset biến sau khi chuyển trang
        return originalPush(url);
      }
      isIntercepting.current = true; // Đánh dấu đang xử lý điều hướng
      await showNotice(
        '🚪 정말 나가시겠어요?',
        'SNS에는 업로드되지 않고, 임시저장함에 보관돼요.',
        true,
        '확인',
        '취소',
        async () => {
          abortControllerRef.current.abort();
          abortControllerRef.current = new AbortController();

          originalPush(url); // Thực hiện điều hướng nếu xác nhận
        },
      );
      isIntercepting.current = false; // Reset trạng thái sau khi popup đóng
    };

    return () => {
      router.push = originalPush; // Khôi phục router.push khi component unmount
    };
  }, [pathname, router, fakePercent]);
  const getBatchAPI = useRef(
    new API(`/api/v1/maker/get-batch/${searchParams.get('batchId')}`, 'GET', {
      success: (res) => {
        const posts = res?.data?.posts;
        if (posts?.length > 0) {
          const data = posts?.map((item: any) => {
            return {
              ...item,
              type: item?.type == 'image' ? 1 : item?.type == 'video' ? 0 : 2,
              type_string: item?.type,
            };
          });
          setPostsData(data);
        }
      },
      error: (err) => console.error('Failed to fetch get:', err),
    }),
  );

  const calculatePercent = (posts = [], field = 'social_post_detail') => {
    const totalSocial = posts.reduce((total, post) => {
      return total + (post as any)[field]?.length;
    }, 0);
    const completeSocial = posts.reduce((total, post) => {
      return total + (post as any)[field]?.filter((social: any) => social.process_number === 100)?.length;
    }, 0);
    return totalSocial > 0 ? Math.floor((completeSocial / totalSocial) * 100) : 0;
  };

  const getSyncIdAPI = useRef(
    new API(`/api/v1/maker/get-status-upload-by-sync-id/${searchParams.get('syncId')}`, 'GET', {
      success: (res, callbackData) => {
        const posts = res?.data?.posts;
        if (posts?.length > 0) {
          const data = posts?.map((item: any) => {
            if (item?.social_posts) {
              const socialPostDetail = item?.social_posts;
              const failedSocials = socialPostDetail
                .filter((social: any) => social.status === 'ERRORED')
                .map((social: any) => social.title);
              if (failedSocials.length > 0) {
                snsErrorUpload.current = failedSocials;
              }
            }
            return {
              ...item,
              type: item?.type == 'image' ? 1 : item?.type == 'video' ? 0 : 2,
              type_string: item?.type,
            };
          });
          setPostsData(data);
          const currentPercent = calculatePercent(posts, 'social_posts');
          if (currentPercent !== fakePercent) {
            fetchNotification();
            setFakePercent(currentPercent);
          }

          if (currentPercent === 100 && fakePercent < 100) {
            setToastText('업로드가 완료되었습니다! 버튼을 눌러 게시물을 확인해보세요!🎉');
            setShowToast(true);
            if (snsErrorUpload.current.length > 0 && loop.current > 0) {
              showNotice(
                '😥 일부 SNS 업로드에 문제가 있었어요.',
                '콘텐츠는 임시저장함에 안전하게 보관됐어요.',
                false,
                '확인',
                '',
              );
            }
            clearInterval(callbackData?.function);
          }
        }
      },
      error: (err) => console.error('Failed to fetch get:', err),
    }),
  );
  const getStatusAPI = useRef(
    new API(`/api/v1/maker/get-status-upload-with-batch-id/${searchParams.get('batchId')}`, 'GET', {
      success: (res, callbackData) => {
        const posts = res?.data?.posts;
        if (posts?.length > 0 && JSON.stringify(posts) !== JSON.stringify(postsData)) {
          const data = posts?.map((item: any) => {
            if (item?.social_post_detail) {
              const socialPostDetail = item?.social_post_detail;
              const failedSocials = socialPostDetail
                .filter((social: any) => social.status === 'ERRORED')
                .map((social: any) => social.title);
              if (failedSocials.length > 0) {
                snsErrorUpload.current = failedSocials;
              }
            }
            return {
              ...item,
              type: item?.type == 'image' ? 1 : item?.type == 'video' ? 0 : 2,
              type_string: item?.type,
            };
          });
          setPostsData(data);
          const currentPercent = calculatePercent(posts);
          if (currentPercent !== fakePercent) {
            fetchNotification();
            setFakePercent(currentPercent);
          }
          if (currentPercent === 100 && fakePercent < 100) {
            setToastText('업로드가 완료되었습니다! 버튼을 눌러 게시물을 확인해보세요!🎉');
            setShowToast(true);
            if (snsErrorUpload.current.length > 0 && loop.current > 0) {
              showNotice(
                '😥 일부 SNS 업로드에 문제가 있었어요.',
                '콘텐츠는 임시저장함에 안전하게 보관됐어요.',
                false,
                '확인',
                '',
              );
            }
            clearInterval(callbackData?.function);
          }
        }
      },
      error: (err) => {
        console.error('Failed to fetch get:', err);
      },
    }),
  );

  const fetchNotification = () => {
    const Notification = new APIV2('/api/v1/notification/get_total_unread_notification', 'GET', {
      success: (response) => {
        dispatch(
          setNotificationState({
            notification: response?.data?.total_pages || 0,
          }),
        );
      },
    });
    Notification.config.params = {
      user_id: encodeUserId(user_login?.id || 0),
      not: 5,
    };

    Notification.call();
  };

  useEffect(() => {
    if (searchParams.get('syncId')) {
      const intervalIdFunc = setInterval(() => {
        if (loop.current === MAX_LOOP) {
          clearInterval(intervalIdFunc);
        }
        loop.current++;
        getSyncIdAPI.current.setUrl(`/api/v1/maker/get-status-upload-by-sync-id/${searchParams.get('syncId')}`);
        getSyncIdAPI.current.call({ function: intervalIdFunc });
      }, 5000);
      getSyncIdAPI.current.call({ function: intervalIdFunc });
      return () => clearInterval(intervalIdFunc);
    } else {
      const batchId = searchParams.get('batchId');
      getBatchAPI.current.call();
      const intervalIdFunc = setInterval(() => {
        if (loop.current === MAX_LOOP) {
          clearInterval(intervalIdFunc);
        }
        loop.current++;
        getStatusAPI.current.setUrl(`/api/v1/maker/get-status-upload-with-batch-id/${batchId}`);
        getStatusAPI.current.call({ function: intervalIdFunc });
      }, 5000);
      getStatusAPI.current.call({ function: intervalIdFunc });

      return () => clearInterval(intervalIdFunc);
    }
  }, []);

  const getNoticeText = () => {
    if (searchParams.get('reup') === '1') {
      const socialPostDetail = postsData?.[0]?.social_post_detail || postsData?.[0]?.social_posts || [];
      let failedSocials: string[] = [];
      if (socialPostDetail) {
        [
          { id: 'Youtube', name: '유튜브' },
          { id: 'Instagram', name: '인스타그램' },
          { id: 'Facebook', name: '페이스북' },
          { id: 'Tiktok', name: '틱톡' },
          { id: 'Thread', name: '스레드' },
          { id: 'X', name: '엑스' },
        ].forEach((social: any) => {
          const currentSocial = socialPostDetail.find((socialPost: any) => socialPost?.title === social.id);
          if (currentSocial?.status === 'ERRORED') {
            failedSocials.push(social.name);
          }
        });
      }
      if (failedSocials.length > 0) {
        return `${failedSocials.join(', ')} 전송이 중단 되었습니다. 조금 뒤 다시 시도해 주세요.`;
      }
      if (fakePercent >= 100) return '생성된 콘텐츠가 업로드 완료되었습니다!';
    }
    if (fakePercent >= 100) return '생성된 콘텐츠가 업로드 완료되었습니다!';
    if (!searchParams.get('syncId')) return '콘텐츠를 SNS 채널에 업로드 중입니다.';
    return '선택한 콘텐츠를 SNS 채널에 업로드 중입니다.';
  };

  return (
    <Box
      className="!font-pretendard"
      sx={{
        py: { xs: 3, sm: '35px' },
        px: { xs: 2, sm: 5 },
      }}
    >
      <SeoHead {...SEO_DATA_UPLOAD} />
      <Box className="mx-[-15px] w-full flex justify-center absolute sm:block top-0 z-[1000] sm:mx-0 sm:relative leading-[47px] sm:leading-[36px] text-[16px] font-semibold sm:text-[30px] text-[#090909] mb-[20px] sm:mb-[40px] sm:font-bold text-center sm:text-left bg-[#fff] sm:bg-transparent">
        <Icon
          icon="material-symbols:home-outline-rounded"
          color="#090909"
          width={26}
          height={26}
          onClick={() => {
            router.push('/');
          }}
          className="sm:hidden absolute cursor-pointer top-[10px] left-[13px] z-[2222]"
        />
        통합 업로드
      </Box>
      <Box
        className="relative mx-auto"
        sx={{
          width: { xs: 'fit-content', sm: 90, md: 100 },
          height: { xs: 25, sm: 90, md: 100 },
          mt: { xs: 3, sm: 3 },
          mb: { xs: 0.5, sm: 4 },
        }}
      >
        <Box
          className=" top-1/2 left-1/2"
          sx={{
            position: { xs: 'relative', sm: 'absolute' },
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 21, sm: 24 },
              fontWeight: 'bold',
              color: '#4776EF',
              lineHeight: { xs: '25px', sm: '30px' },
              fontFamily: 'var(--font-pretendard)',
            }}
          >
            {fakePercent}%
          </Typography>
        </Box>
        {fakePercent === 100 && !isMobile && (
          <img
            src={`/images/upload/upload_success.gif?timestamp=${new Date().getTime()}`}
            className="absolute inset-0"
            style={{ transform: 'scale(1.5)' }}
          />
        )}

        {!isMobile && (
          <>
            <CircularProgress
              variant="determinate"
              value={100}
              thickness={3.5}
              sx={{ color: '#F4F4F4', display: { xs: 'none', sm: 'inline-block' } }}
              size="100%"
            />
            <CircularProgress
              className="absolute left-0"
              variant="determinate"
              value={fakePercent}
              thickness={3.5}
              sx={{ color: '#4776EF' }}
              size="100%"
            />
          </>
        )}
      </Box>

      <Typography
        sx={{
          mt: { xs: 0, sm: 2 },
          textAlign: 'center',
          fontSize: { xs: 14, sm: 16, md: 18 },
          color: { xs: '#A4A4A4', sm: '#272727' },
          fontFamily: 'var(--font-pretendard)',
        }}
      >
        {getNoticeText()}
      </Typography>
      {isMobile && (
        <BorderLinearProgress variant="determinate" value={fakePercent} sx={{ color: '#F4F4F4', mt: '10px' }} />
      )}
      <Box
        sx={{
          mt: { xs: 4, sm: 6 },
          px: { xs: 0, sm: '18px' },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 },
          alignItems: 'center',
        }}
      >
        {postsData?.map((post, index: number) => {
          const status: number[] = [-1, -1, -1, -1, -1, -1];
          const socialLink: string[] = Array(6).fill('');
          const socialPostDetail = post?.social_post_detail || post?.social_posts;

          if (socialPostDetail) {
            ['Youtube', 'Instagram', 'Facebook', 'Tiktok', 'Thread', 'X'].forEach((social: string, i: number) => {
              const currentSocial = socialPostDetail.find((socialPost: any) => socialPost?.title === social);
              if (currentSocial) {
                status[i] = currentSocial?.status === 'PUBLISHED' ? 1 : currentSocial?.status === 'ERRORED' ? 2 : 0;
                if (currentSocial?.status === 'PUBLISHED') {
                  socialLink[i] = currentSocial?.social_link;
                }
              }
            });
          }
          return (
            <UploadContent
              indexContent={index}
              key={`upload-content-${index}`}
              type={post.type}
              thumbnail={post?.thumbnail}
              statusList={status}
              socialLinkList={socialLink}
              blog={post?.type === 2 ? post : {}}
            />
          );
        })}
      </Box>

      {showToast && !isMobile && <ShowSampleInfo text={toastText} />}

      {isMobile && (
        <Snackbar
          open={showToast}
          autoHideDuration={3000}
          onClose={() => setShowToast(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Box
            sx={{
              backgroundColor: '#292929E5',
              backdropFilter: 'blur(4px)',
              color: 'white',
              width: '100%',
              px: 7,
              py: 1.5,
              borderRadius: 2,
              boxShadow: 3,
              fontWeight: 600,
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: 500,
              }}
            >
              업로드가 완료되었습니다! <br /> 버튼을 눌러 게시물을 확인해보세요!🎉
            </Typography>
          </Box>
        </Snackbar>
      )}
    </Box>
  );
};

export default Upload;
