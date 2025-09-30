'use client';
import AnalysProgressBar from '@/app/(DashboardLayout)/components/dashboard/AnalysProgressBar';
import AnalysVideoImg, { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
import { toast } from '@/app/components/common/Toast';
import { RootState } from '@/app/lib/store/store';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { SAMPLE_BATCH_DATA } from '@/utils/mockData/sampleBatch';
import { Icon } from '@iconify/react';
import { Box, Button, IconButton } from '@mui/material';
import API from '@service/api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
// import { io } from 'socket.io-client';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import { setNotificationState } from '@/app/lib/store/notificationSlice';
import { setSnsSettingsState } from '@/app/lib/store/snsSettingsSlice';
import ShowSampleInfo from '@/utils/custom/sampleInfo';
import { DoneIcon } from '@/utils/icons/icons';
import { useDispatch, useSelector } from 'react-redux';
// import TikTokPublishModal from '@/app/components/socialsPosting/tiktokPublishModal';
import SNSSettingsPopup from '@/app/(DashboardLayout)/components/popup/SNSSettingsPopup';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_ANALYS, USER_SUBSCRIPTION } from '@/utils/constant';
import { encodeUserId } from '@/utils/encrypt';
import APIV2 from '@service/api_v2';
import Image from 'next/image';

declare global {
  interface Window {
    __skipConfirm?: boolean; // Biến toàn cục để bỏ qua popup
  }
}
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
const AnalysProduct = ({
  onAnalysisFinish,
  producUrl = '',
  adsEnabled,
  narration,
  audios,
}: {
  onAnalysisFinish: (step: number) => void;
  producUrl?: string;
  adsEnabled: boolean;
  narration: string;
  audios: any[];
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.auth);
  const snsSettings = useSelector((state: RootState) => state.snsSettings);
  const searchParams = useSearchParams();
  const [videoSrc, setVideoSrc] = useState('');
  const [imgData, setImgData] = useState({});
  const [videoData, setVideoData] = useState({});
  const [imgSrc, setImgSrc] = useState('');
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [loadingImg, setLoadingImg] = useState(true);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [loadingComment, setLoadingComment] = useState(true);
  const [loadingHashtag, setLoadingHashtag] = useState(true);
  const [percentVideo, setPercentVideo] = useState(0);
  const [percentImg, setPercentImg] = useState(0);
  const [percentBlog, setPercentBlog] = useState(0);
  const [posts, setPosts] = useState([]);
  const [showInitStyle, setShowInitStyle] = useState(false);
  const pathname = usePathname();
  const isIntercepting = useRef(false);
  let batchIdValue = '';
  const [userId, setUserId] = useState(0);
  const [step, setStep] = useState(0);
  const [randomText, setRandomText] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [callEdit, setCallEdit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const isDoneRef = useRef(false);
  const user_login = useSelector((state: RootState) => state.auth.user);
  let processStatus = 'PENDING';
  let loop = 0;
  let is_get_batch = 0;
  const MAX_LOOP = 42;
  let currentStep = 0;
  const timeouts: any[] = [];
  const intervals: any[] = [];

  let videoFailedShown = false;
  let imgFailedShown = false;
  let blogFailedShown = false;
  const hideDirectPopup = useRef(false);

  // kiểm tra khi người dùng nhấn back or đóng
  useExitAlert('🚪 정말 나가시겠어요?\n지금 작업한 내용은 저장되지 않아요.');
  const abortControllerRef = useRef(new AbortController()); // Tạo một AbortController
  // kiểm tra khi người dùng chuyển router
  useEffect(() => {
    const originalPush = router.push;
    router.push = async (url: string) => {
      if (url === pathname || isIntercepting.current) return;
      // Ngăn vòng lặp và điều hướng lại chính nó
      if (
        window.__skipConfirm ||
        !['PENDING', 'PROCESSING'].includes(processStatus) ||
        !!searchParams.get('sampleId') ||
        (!isCreate && isDoneRef.current) ||
        hideDirectPopup.current === true
      ) {
        window.__skipConfirm = false; // Reset biến sau khi chuyển trang
        return originalPush(url);
      }
      isIntercepting.current = true; // Đánh dấu đang xử lý điều hướng
      await showNotice(
        '🚪 정말 나가시겠어요?',
        !loading ? '콘텐츠는 임시저장함에 안전하게 보관할게요. ' : '지금 작업한 내용은 저장되지 않아요.',
        true,
        '확인',
        '취소',
        async () => {
          abortControllerRef.current.abort();
          abortControllerRef.current = new AbortController();

          createMakerAPI.current.cancel(); // Hủy request API
          originalPush(url); // Thực hiện điều hướng nếu xác nhận
        },
      );
      isIntercepting.current = false; // Reset trạng thái sau khi popup đóng
    };

    return () => {
      router.push = originalPush; // Khôi phục router.push khi component unmount
    };
  }, [pathname, router, loading, isCreate]);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
      popup: 'top-popup rounded-[16px] !w-[250px] h-[80px]',
      title: 'text-[21px] leading-[30px] text-[#272727] mt-[-50px] font-pretendard font-bold !text-center',
    },
  });
  const createMakerAPI = useRef(
    new API(`/api/v1/maker/create-batch`, 'POST', {
      success: (res) => {
        if (res?.code == 201) {
          showNotice(
            '⚠️ 외부 정책 제한으로</br>상품 정보를 불러오기 어렵네요.',
            '🔃 잠시 후 다시 시도하거나 다른 URL을 입력해 주세요. ☺️',
            false,
            '확인',
            '',
            () => {
              onAnalysisFinish(0);
              setLoading(false);
              setLoadingBlog(false);
              setLoadingImg(false);
              setLoadingVideo(false);
            },
          );
          return;
        } else {
          setIsCreate(true);
          const thumbnail = res?.data?.thumbnail;
          if (thumbnail) {
            setImgSrc(thumbnail);
          }

          const tmpPosts = res?.data?.posts;
          if (tmpPosts && tmpPosts?.length > 0) {
            setLoadingVideo(true);
            setPosts(tmpPosts);
          }

          const batchId = res?.data?.id;
          if (batchId && producUrl) {
            let type_post = '';
            let post_video_id = '';
            let post_image_id = '';
            let post_blog_id = '';
            tmpPosts.forEach((post: any) => {
              if (post?.id) {
                type_post = post?.type;
                if (type_post == 'video') {
                  post_video_id = post?.id;
                } else if (type_post == 'image') {
                  post_image_id = post?.id;
                } else if (type_post == 'blog') {
                  post_blog_id = post?.id;
                }
              }
            });

            const url = new URL(window.location.origin + '/analys');
            url.searchParams.set('batchId', batchId);
            url.searchParams.set('post_video', post_video_id);
            url.searchParams.set('post_image', post_image_id);
            url.searchParams.set('post_blog', post_blog_id);
            window.history.pushState(null, '', url.toString());
          }
          batchIdValue = batchId;
          setUserId(res?.data?.user_id);

          currentStep = 1;
          setStep(1);
          Toast.fire({
            icon: 'success',
            title: '링크 분석 완료 ✅',
          });
          const timeoutShowToast = setTimeout(() => {
            Toast.fire({
              icon: 'success',
              title: '키워드 분석 완료 🔍',
            });
            clearTimeout(timeoutShowToast);
          }, 5000);
          timeouts.push(timeoutShowToast);
        }
      },
      error: (err) => {
        loop = MAX_LOOP;
        intervals.forEach((interval) => clearInterval(interval));
        if (err.message != 'canceled') {
          showNotice(
            '⚠️ 외부 정책 제한으로</br>상품 정보를 불러오기 어렵네요.',
            '🔃 잠시 후 다시 시도하거나 다른 URL을 입력해 주세요. ☺️',
            false,
            '확인',
            '',
            () => {
              onAnalysisFinish(0);
              setLoading(false);
              setLoadingBlog(false);
              setLoadingImg(false);
              setLoadingVideo(false);
            },
          );
        }

        console.error('Failed to fetch posts:', err);
        console.error('Failed to fetch posts:', err.code);
      },
      finally: () => {
        // setLoading(false);
      },
    }),
  );

  let isLoadedCommentHashtag = false;
  let isLoadedBlog = false;
  let isLoadedImg = false;
  let isLoadedVideo = false;

  const getBatchAPI = useRef(
    new API(`/api/v1/maker/get-batch`, 'GET', {
      success: (res, dataCallback) => {
        processStatus = res?.data?.process_status || processStatus;
        if (res?.data?.status === 2) {
          showNotice('AI 영상 서버와 연결할 수 없어요.', '', false, '확인', '');
          clearInterval(dataCallback.function);
          setLoading(false);
          return;
        }
        if (res?.data?.process_status === 'PROCESSING') {
          setIsCreate(true);
        }
        if (res?.data?.process_status === 'FAILED') {
          hideDirectPopup.current = true;
          showNoticeError(res?.data?.message, res?.data?.error_message, false, '확인', '', () => {
            router.push('/');
          });
          clearInterval(dataCallback.function);
          setLoading(false);
          return;
        }

        const thumbnail = res?.data?.thumbnail;

        if (thumbnail) {
          setImgSrc(thumbnail);
        }
        const tmpPosts = res?.data?.posts;
        setUserId(res?.data?.user_id);
        if (tmpPosts && tmpPosts?.length > 0) {
          setPosts(tmpPosts);
          if (tmpPosts.every((item: any) => item.process_status === 'COMPLETED') && !dataCallback?.isCreate) {
            clearInterval(dataCallback.function);
            isDoneRef.current = true;
            setVideoSrc(tmpPosts[0]?.video_url);
            setVideoData(tmpPosts[0]);
            setImgData(tmpPosts[1]);
            setBlog(tmpPosts[2]);
            setLoading(false);
            setLoadingBlog(false);
            setLoadingImg(false);
            setLoadingComment(false);
            setLoadingHashtag(false);
            setLoadingVideo(false);
          } else {
            const tmpVideoData = tmpPosts[0];
            const tmpImgData = tmpPosts[1];
            const tmpBlogData = tmpPosts[2];

            // check timeout
            if (dataCallback?.loop >= MAX_LOOP) {
              showNoticeError(
                '⚠️ 외부 정책 제한으로</br>상품 정보를 불러오기 어렵네요.',
                '🔃 잠시 후 다시 시도하거나 다른 URL을 입력해 주세요. ☺️',
                false,
                '확인',
                '취소',
                () => {
                  intervals.forEach((interval) => clearInterval(interval));
                  router.push('/');
                },
              );
              return;
            }

            // check video data
            if (tmpVideoData?.process_status === 'FAILED' && !imgFailedShown) {
              imgFailedShown = true;
              showNoticeError(tmpVideoData?.error_message, '', false, '확인', '취소', () => {
                if (videoFailedShown && imgFailedShown && blogFailedShown) {
                  intervals.forEach((interval) => clearInterval(interval));
                  router.push('/');
                }
              });
            }

            if (tmpVideoData?.process_status === 'COMPLETED') {
              setVideoData(tmpVideoData);
            }

            // check image data
            if (tmpImgData?.process_status === 'FAILED' && !imgFailedShown) {
              imgFailedShown = true;
              showNoticeError(tmpImgData?.error_message, '', false, '확인', '취소', () => {
                if (videoFailedShown && imgFailedShown && blogFailedShown) {
                  intervals.forEach((interval) => clearInterval(interval));
                  router.push('/');
                }
              });
            }
            if (tmpImgData?.process_status === 'COMPLETED') {
              setImgData(tmpImgData);
            }

            // display comment and hashtag
            if (tmpImgData?.description && tmpVideoData?.description && loadingComment && loadingHashtag) {
              if (currentStep === 1 && dataCallback?.isCreate) {
                setStep(2);
                currentStep = 2;
                setLoadingComment(false);
                Toast.fire({
                  icon: 'success',
                  title: 'Comment 생성 완료💬',
                });
                if (loadingHashtag) {
                  let timeout = setTimeout(() => {
                    setStep(3);
                    currentStep = 3;
                    setLoadingHashtag(false);
                    isLoadedCommentHashtag = true;

                    Toast.fire({
                      icon: 'success',
                      title: 'Hashtag 생성 완료 #️⃣',
                    });
                  }, 3000);
                  timeouts.push(timeout);
                }
              }
            }

            // check blog data
            if (!isLoadedBlog && isLoadedCommentHashtag) {
              if (tmpBlogData?.process_status === 'FAILED' && !blogFailedShown) {
                blogFailedShown = true;
                showNoticeError(tmpBlogData?.error_message, '', false, '확인', '취소', () => {
                  if (videoFailedShown && imgFailedShown && blogFailedShown) {
                    intervals.forEach((interval) => clearInterval(interval));
                    router.push('/');
                  }
                });
              }
              if (tmpBlogData?.content != '') {
                setBlog(tmpBlogData);
                setLoadingBlog(false);
                isLoadedBlog = true;
                Toast.fire({
                  icon: 'success',
                  title: '블로그 생성 완료 📝',
                });
              }
            }

            // display image
            if (!isLoadedImg && isLoadedBlog && tmpImgData?.images && tmpImgData?.images?.length > 0) {
              const timeout = setTimeout(() => {
                setLoadingImg(false);
                isLoadedImg = true;
                Toast.fire({
                  icon: 'success',
                  title: '이미지 생성 완료 🖼️',
                });
                clearTimeout(timeout);
              }, 3000);
              timeouts.push(timeout);
            }

            // display video
            if (!isLoadedVideo && isLoadedImg && tmpVideoData?.video_url) {
              clearInterval(dataCallback.function);
              const timeout = setTimeout(() => {
                setVideoSrc(tmpVideoData?.video_url);
                setLoadingVideo(false);
                setLoading(false);
                setPercentVideo(100);
                isLoadedVideo = true;
                loop = MAX_LOOP;
                intervals.forEach((interval) => clearInterval(interval));
                Toast.fire({
                  icon: 'success',
                  title: '영상 생성 완료 🎬',
                });
                clearTimeout(timeout);
              }, 3000);
              timeouts.push(timeout);
            }
          }
        }
      },
      error: (err) => {
        loop = MAX_LOOP;
        intervals.forEach((interval) => clearInterval(interval));
        console.error('Failed to fetch get:', err);
      },
      finally: () => {
        // setLoading(false);
      },
    }),
  );

  const getRandomAPI = useRef(
    new API(`/api/v1/month-text/random-text?batchId=${searchParams.get('batchId')}`, 'GET', {
      success: (res) => {
        if (res?.code === 201) {
        } else {
          setRandomText(res?.data);
        }
      },
      error: (err) => {},
      finally: () => {},
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
      error() {
        console.log('error');
      },
      finally() {
        // console.log('finish');
      },
    });

    Notification.config.params = {
      user_id: encodeUserId(user_login?.id || 0),
      not: 6,
    };
    Notification.call();
  };

  const getSNSSettingsAPI = useRef(
    new API(`/api/v1/user/get-user-link-template`, 'GET', {
      success: (res) => {
        if (res?.code === 201) {
          showNoticeError('', res?.message, false, '확인', '취소', () => {}, 'fail_coupon');
          showNoticeError('', res?.message, false, '확인', '취소', () => {}, 'fail_coupon');
        } else {
          dispatch(setSnsSettingsState({ snsSettings: res?.data }));
        }
      },
      error: (err) => {},
      finally: () => {},
    }),
  );

  useEffect(() => {
    const batchId = searchParams.get('batchId');
    // console.log(userId);
    if (batchId && userId) {
    }
  }, [userId, searchParams.get('batchId')]);

  useEffect(() => {
    const batchId = searchParams.get('batchId');
    const type = searchParams.get('type');
    if (type == 'advanced') {
      setIsCreate(true);
      Toast.fire({
        icon: 'success',
        title: '링크 분석 완료 ✅',
      });
      const timeoutShowToast = setTimeout(() => {
        Toast.fire({
          icon: 'success',
          title: '키워드 분석 완료 🔍',
        });
        clearTimeout(timeoutShowToast);
      }, 5000);
      timeouts.push(timeoutShowToast);
      setToastText('실시간 인기 키워드를 분석 중입니다.');
      setShowToast(true);
      const timeout = setTimeout(() => {
        setShowToast(false);
        clearTimeout(timeout);
      }, 3000);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('type');
      router.replace(`${window.location.pathname}?${params.toString()}`);
    }
    if (producUrl && !batchId) {
      // kiểm tra khi người dùng nhấn back or đóng
      // useExitAlert('정말 페이지를 나가시겠어요?');
      // if (!producUrl.startsWith('https://')) {
      //   showNoticeError(
      //     '⚠️ 상품 정보를 가져오는 데 문제가 생겼어요!',
      //     '올바른 상품 URL을 입력하세요.',
      //     false,
      //     '확인',
      //     '취소',
      //     () => {
      //       // setLoading(false);
      //     },
      //   );

      //   onAnalysisFinish(0);
      //   return;
      // }

      setToastText('실시간 인기 키워드를 분석 중입니다.');
      setShowToast(true);
      const timeout = setTimeout(() => {
        setShowToast(false);
        clearTimeout(timeout);
      }, 3000);

      let is_paid_advertisements = adsEnabled ? 1 : 0;
      createMakerAPI.current.config.data = {
        url: producUrl.trim(),
        is_paid_advertisements: is_paid_advertisements,
        narration: narration,
        voice: audios[0]?.actor_id || '',
      };
      createMakerAPI.current.call();
    }
    if (batchId) {
      batchIdValue = batchId;
      const intervalIdFunc = setInterval(() => {
        if (loop >= MAX_LOOP) {
          clearInterval(intervalIdFunc);
        }
        loop++;
        getBatchAPI.current.setUrl(`/api/v1/maker/get-batch/${batchId}`);
        getBatchAPI.current.call({ loop, function: intervalIdFunc, isCreate: true });
      }, 10000);
      intervals.push(intervalIdFunc);

      if (!producUrl) {
        currentStep = 1;
        setStep(1);
        getBatchAPI.current.setUrl(`/api/v1/maker/get-batch/${batchId}`);
        getBatchAPI.current.call({ loop, function: intervalIdFunc, isCreate: false });
      }

      return () => {
        clearInterval(intervalIdFunc);
      };
    }
  }, [producUrl, searchParams.get('batchId'), adsEnabled, narration]);

  useEffect(() => {
    const timeoutGetRandom = setTimeout(() => {
      getRandomAPI.current.call();
      clearTimeout(timeoutGetRandom);
    }, 1000);
    timeouts.push(timeoutGetRandom);

    getSNSSettingsAPI.current.call();

    const batchIdStorage = localStorage.getItem('batchId');
    const batchId = searchParams.get('batchId');
    let user_level = localStorage.getItem('user_level');

    if (batchIdStorage === batchId && localStorage.getItem('action') === 'saveDraft') {
      if (user_level == '0') {
        showNotice(
          '아직 SNS 연결 전이에요😢<br/>지금 계정 연동하고 통합업로드 해보세요!',
          '생성된 콘텐츠는 임시저장에서 확인 가능합니다.',
          true,
          '연결하기',
          '다음에',
          () => {
            window.location.href = '/profile';
            localStorage.setItem('action', 'connectSNS');
          },
        );
      }
    }

    const sampleId = Number(searchParams.get('sampleId'));
    const batchData = SAMPLE_BATCH_DATA.find((data) => data.id === sampleId);

    if (batchData) {
      setToastText('실시간 인기 키워드를 분석 중입니다.');
      setShowToast(true);

      let timeout = setTimeout(() => {
        setShowToast(false);
        setBlog(batchData.posts[2]);
        setStep(1);
        Toast.fire({
          icon: 'success',
          title: '링크 분석 완료 ✅',
        });
      }, 3000);
      timeouts.push(timeout);

      timeout = setTimeout(() => {
        Toast.fire({
          icon: 'success',
          title: '키워드 분석 완료 🔍',
        });
      }, 6000);
      timeouts.push(timeout);

      timeout = setTimeout(() => {
        setImgData(batchData.posts[1]);
        setVideoData(batchData.posts[0]);
        setLoadingComment(false);
        setStep(2);
        Toast.fire({
          icon: 'success',
          title: 'Comment 생성 완료💬',
        });
      }, 9000);
      timeouts.push(timeout);

      timeout = setTimeout(() => {
        setImgData(batchData.posts[1]);
        setVideoData(batchData.posts[0]);
        setLoadingHashtag(false);
        setStep(3);
        Toast.fire({
          icon: 'success',
          title: 'Hashtag 생성 완료 #️⃣',
        });
      }, 12000);
      timeouts.push(timeout);

      timeout = setTimeout(() => {
        setLoadingBlog(false);
        Toast.fire({
          icon: 'success',
          title: '블로그 생성 완료 📝',
        });
      }, 16000);
      timeouts.push(timeout);

      timeout = setTimeout(() => {
        setLoadingImg(false);
        Toast.fire({
          icon: 'success',
          title: '이미지 생성 완료 🖼️',
        });
      }, 20000);
      timeouts.push(timeout);

      timeout = setTimeout(() => {
        setVideoSrc(batchData.posts[0].video_url);
        setLoadingVideo(false);
        setLoading(false);
        Toast.fire({
          icon: 'success',
          title: '영상 생성 완료 🎬',
        });
        clearTimeout(timeout);
      }, 25000);
      timeouts.push(timeout);
    }

    const intervalIdBlog = setInterval(
      () => {
        setPercentBlog((prev) => {
          const increase = Math.floor(Math.random() * 10);
          if (prev + increase < 100) {
            return prev + increase;
          } else {
            clearInterval(intervalIdBlog);
            return prev;
          }
        });
      },
      !!sampleId ? 700 : 3000,
    );
    intervals.push(intervalIdBlog);

    const intervalIdVideoFunc = setInterval(
      () => {
        setPercentVideo((prev) => {
          const increase = Math.floor(Math.random() * 10);
          if (prev + increase < 100) {
            return prev + increase;
          } else {
            clearInterval(intervalIdVideoFunc);
            return prev;
          }
        });
      },
      !!sampleId ? 1500 : 5000,
    );
    intervals.push(intervalIdVideoFunc);

    const intervalIdImgFunc = setInterval(
      () => {
        setPercentImg((prev) => {
          const increase = Math.floor(Math.random() * 10);
          if (prev + increase < 100) {
            return prev + increase;
          } else {
            clearInterval(intervalIdImgFunc);
            return prev;
          }
        });
      },
      !!sampleId ? 1000 : 3000,
    );
    intervals.push(intervalIdImgFunc);

    return () => {
      clearTimeout(timeoutGetRandom);
      timeouts.forEach((timeout) => clearTimeout(timeout));
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const postVideoAPI = useRef(
    new API(`/api/v1/user/post-to-links`, 'POST', {
      success: (res, dataSource) => {
        if (dataSource.isDirectUpload) {
          window.__skipConfirm = true;
          const batchId = dataSource?.batchId;
          // console.log(userId);
          // if (batchId && dataSource?.userId) {

          // }
          router.push(`/upload?batchId=${batchIdValue || searchParams.get('batchId')}`);
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
      },
      finally: () => {
        setLoadingUpload(false);
      },
    }),
  );

  const snsErrorCallback = () => {
    window.__skipConfirm = true;
    showNotice('로그인이 필요해요! 🔑', '로그인은 구글 간편 로그인으로 할 수 있어요.', true, '로그인', '다음에', () => {
      localStorage.setItem('batchId', batchIdValue);
      localStorage.setItem('action', 'register');
      router.push('/auth/login');
    });
  };
  const saveDraft = useRef(
    new API(`/api/v1/maker/save_draft_batch/${searchParams.get('batchId')}`, 'POST', {
      success: (res: any, customData) => {
        fetchNotification();
        if (customData?.urlPush) {
          processStatus = 'DRAFT';
          toast.success('임시 저장 완료');
          window.__skipConfirm = true;
          router.push(customData.urlPush || '/history?tabIndex=2');
        }
      },
      error: (err: any) => {
        // toast.error('Failed to fetch draft');
        snsErrorCallback();
      },
      finally: () => {
        console.log('Request finished');
      },
    }),
  );

  const checkSNSActiveApi = useRef(
    new API(`/api/v1/user/check-sns-link`, 'POST', {
      success: (res, dataSource) => {
        if (res?.code == 200) {
          dataSource?.posts.forEach((post: any, index: number) => {
            let isDirectUpload = true;
            if (post?.id && post?.type !== 'blog') {
              const postSnsSettings = (dataSource?.snsSettings as any)[post?.type || 'video'];
              const linkIds = postSnsSettings.filter((item: any) => item.selected === 1).map((item: any) => item.id);
              if (linkIds.length > 0) {
                postVideoAPI.current.config.data = {
                  is_all: 0,
                  link_ids: linkIds,
                  post_id: post?.id,
                };
                postVideoAPI.current.call({
                  isDirectUpload,
                  batchId: batchIdValue,
                  userId: post.user_id,
                });
                isDirectUpload = false;
              } else {
                const batchId = batchIdValue || searchParams.get('batchId');
                saveDraft.current.setUrl(`/api/v1/maker/save_draft_batch/${batchId}`);
                saveDraft.current.call();
              }
            } else {
              postVideoAPI.current.config.data = {
                is_all: 1,
                link_ids: [],
                post_id: post?.id,
              };
              postVideoAPI.current.call({
                isDirectUpload,
                batchId: batchIdValue,
                userId: post.user_id,
              });
            }
          });
        } else if (res?.code == 202) {
          showNoticeMUI(
            '📱 SNS 연결이 필요해요',
            '콘텐츠는 임시저장함에 안전하게 저장됐어요.',
            true,
            '확인',
            '취소',
            () => {
              const batchId = batchIdValue || searchParams.get('batchId');
              saveDraft.current.setUrl(`/api/v1/maker/save_draft_batch/${batchId}`);
              saveDraft.current.call({ urlPush: '/profile?tabIndex=2' });
            },
          );
          setLoadingUpload(false);
        } else {
          showNoticeMUI(
            res?.message || '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            res?.data?.error_message || '',
            false,
            '확인',
          );
          setLoadingUpload(false);
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
        setLoadingUpload(false);
        snsErrorCallback();
      },
    }),
  );

  const checkActiveSNS = () => {
    if (loadingUpload) return;
    const sampleId = Number(searchParams.get('sampleId'));
    if (sampleId) {
      window.__skipConfirm = true;
      router.push('/upload/sample?sampleId=' + sampleId);
      return;
    }
    checkSNSActiveApi.current.config.data = {
      batchId: searchParams.get('batchId'),
    };
    setLoadingUpload(true);
    checkSNSActiveApi.current.call({ posts, snsSettings });
  };

  const handleSaveDraft = (isDirectProfile?: boolean) => {
    const sampleId = Number(searchParams.get('sampleId'));
    if (sampleId) {
      showNotice('샘플은 저장할 수 없어요 😊', '', false, '확인');
      return;
    }
    const batchId = batchIdValue || searchParams.get('batchId');
    if (!batchId) {
      toast.error('Batch ID is missing');
      return;
    }

    showNotice(
      '💾 이 콘텐츠를 임시 저장할까요?',
      '나중에 업로드 할 수 있도록 저장할까요?😊',
      true,
      '확인',
      '취소',
      () => {
        saveDraft.current.setUrl(`/api/v1/maker/save_draft_batch/${batchId}`);
        saveDraft.current.call({ urlPush: '/history?tabIndex=2' });
      },
    );
  };

  const handleEditDone = () => {
    showNotice('✏️ 이 콘텐츠를 수정할까요?', '⚠️ 수정한 콘텐츠는 되돌릴 수 없어요!', true, '확인', '취소', () => {
      setCallEdit(true);
      setIsEdit(false);
    });
  };

  return (
    <Box
      className={`font-pretendard sm:px-10 min-h-screen w-full mx-auto sm:py-[40px] ${loading && pathname == '/' ? 'pt-[12px]' : ''}`}
    >
      <SeoHead {...SEO_DATA_ANALYS} />
      <Box className="mx-[-15px] w-full absolute top-0 z-[99] sm:mx-0 sm:relative leading-[47px] sm:leading-[36px] text-[16px] font-semibold sm:text-[30px] text-[#090909] mb-[20px] sm:mb-[40px] sm:font-bold text-center bg-[#fff] sm:text-left sm:bg-transparent border-b-[1px] border-b-[#F1F1F1] sm:border-b-0">
        <IconButton
          sx={{
            position: 'absolute',
            top: { xs: '10px' },
            left: { xs: '13px' },
            zIndex: 1000,
            p: 0,
            display: { sm: 'none' },
            cursor: 'pointer',
          }}
          onClick={() => router.push('/')}
          className="flex-1"
        >
          <Icon icon="material-symbols:home-outline-rounded" color="#090909" width={26} height={26} />
        </IconButton>
        콘텐츠 생성
      </Box>
      {/* <h1 className="leading-[30px] text-[30px] text-[#090909] mt-[15px] mb-[20px] font-bold">콘텐츠 생성</h1> */}
      {loading ? (
        <AnalysProgressBar step={step} />
      ) : (
        <Box
          className={`hidden sm:flex upload-all-btn${showInitStyle ? ' upload-all-btn-init' : ''}`}
          onClick={() => checkActiveSNS()}
        >
          {loadingUpload ? (
            <Image src="/images/home/loading-dot.gif" width={100} height={40} alt="loading" />
          ) : (
            <>
              <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M32.3092 14.2893C32.3091 13.7675 31.886 13.3445 31.3642 13.3443L9.73639 13.3443C9.21456 13.3445 8.79155 13.7675 8.79142 14.2893L10.4612 14.2893L10.4612 15.2792L8.79142 15.2792V27.2481L10.4612 27.2481L10.4612 28.238L8.79142 28.238C8.79155 28.7599 9.21456 29.1829 9.73639 29.183L31.3642 29.183C31.886 29.1829 32.3091 28.7599 32.3092 28.238L30.4593 28.2379L30.4593 27.248L32.3091 27.248V15.2791H30.4593L30.4593 14.2892L32.3091 14.2892L32.3092 14.2893ZM21.5004 14.2893L21.5004 15.2792H19.4205L19.4205 14.2893L21.5005 14.2892L21.5004 14.2893ZM18.7406 14.2893L18.7406 15.2792H16.6607L16.6607 14.2893L18.7406 14.2893ZM15.9808 14.2893V15.2792L13.9008 15.2791L13.9008 14.2892L15.9807 14.2892L15.9808 14.2893ZM11.1411 14.2893L13.221 14.2893L13.221 15.2792L11.141 15.2793L11.141 14.2894L11.1411 14.2893ZM11.1411 28.238L11.1411 27.2481L13.221 27.2481L13.221 28.238L11.1411 28.238ZM13.9009 28.238L13.9009 27.2481L15.9809 27.248L15.9809 28.2379L13.901 28.2379L13.9009 28.238ZM16.6607 28.238L16.6607 27.2481H18.7406L18.7406 28.238L16.6607 28.238ZM19.4202 28.238L19.4202 27.2481L21.5001 27.2481L21.5001 28.238L19.4201 28.2382L19.4202 28.238ZM22.18 28.238L22.18 27.2481L24.2599 27.2481L24.2599 28.238L22.18 28.238ZM24.9398 28.238L24.9398 27.2481H27.0197L27.0197 28.238H24.9398ZM29.7795 28.238L27.6996 28.238L27.6996 27.2481L29.7795 27.2481L29.7795 28.238ZM22.18 15.2792L22.18 14.2893L24.2599 14.2893L24.2599 15.2792L22.18 15.2792ZM24.9398 15.2792L24.9398 14.2893H27.0197L27.0197 15.2792H24.9398ZM29.7794 15.2793L27.6995 15.2793L27.6995 14.2894L29.7794 14.2894L29.7794 15.2793Z"
                  fill="#C3D8FC"
                />
                <path
                  d="M16.0469 36.8469V19.0327C16.0469 18.17 16.7472 17.4707 17.6112 17.4707H23.4563C23.8663 17.4707 24.2652 17.6041 24.5924 17.8507L26.3784 19.1969C26.7057 19.4435 27.1046 19.5769 27.5146 19.5769H40.5175C41.3815 19.5769 42.0818 20.2762 42.0818 21.1389V36.8468C42.0818 37.7668 41.335 38.5125 40.4136 38.5125H17.7151C16.7937 38.5125 16.0469 37.7668 16.0469 36.8468V36.8469Z"
                  fill="url(#paint0_linear_5788_11561)"
                />
                <path
                  d="M40.3951 38.5127H17.7293C16.8004 38.5127 16.0463 37.7597 16.0463 36.8321L16.0463 22.7464C16.0463 21.8845 16.7471 21.1845 17.6105 21.1845L40.514 21.1845C41.3772 21.1845 42.0781 21.8843 42.0781 22.7464V36.832C42.0781 37.7595 41.324 38.5125 40.3951 38.5125V38.5127Z"
                  fill="url(#paint1_linear_5788_11561)"
                />
                <path
                  d="M40.5145 21.1846H17.611C16.7472 21.1846 16.0469 21.8839 16.0469 22.7464V22.8904C16.0469 22.0279 16.7472 21.3286 17.611 21.3286H40.5145C41.3784 21.3286 42.0787 22.0279 42.0787 22.8904V22.7464C42.0787 21.8839 41.3784 21.1846 40.5145 21.1846Z"
                  fill="#B9CCFF"
                />
                <path
                  d="M26.984 29.4336V31.8583C26.984 32.1729 27.2393 32.4278 27.5543 32.4278H30.568C30.883 32.4278 31.1383 32.1729 31.1383 31.8583V29.4336H32.2155C32.3828 29.4336 32.4664 29.2317 32.3482 29.1137L29.1939 25.9641C29.1205 25.8909 29.0018 25.8909 28.9284 25.9641L25.7741 29.1137C25.6559 29.2318 25.7396 29.4336 25.9068 29.4336H26.984Z"
                  fill="#4776EF"
                />
                <path
                  d="M27.3629 33.7882H30.7602C30.9692 33.7882 31.1387 33.6191 31.1387 33.4102C31.1387 33.2015 30.9693 33.0322 30.7602 33.0322H27.3629C27.1539 33.0322 26.9844 33.2014 26.9844 33.4102C26.9844 33.6189 27.1538 33.7882 27.3629 33.7882Z"
                  fill="#4776EF"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_5788_11561"
                    x1="29.0644"
                    y1="20.0797"
                    x2="29.0644"
                    y2="21.8824"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="0.775" stopColor="#DFDFDF" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_5788_11561"
                    x1="29.0622"
                    y1="33.2316"
                    x2="29.0622"
                    y2="42.0939"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="#A4BEEE" />
                  </linearGradient>
                </defs>
              </svg>

              <h2 className="text-[19px] font-semibold !text-[#fff]">톡! 한 번에 콘텐츠 업로드</h2>
            </>
          )}{' '}
        </Box>
      )}

      <Box className={`relative col-span-12 ${loading ? 'mt-[20px]' : 'mt-[100px]'} sm:mt-0 space-y-[20px]`}>
        <Box className="absolute right-0 top-[-30px] sm:top-[40px] flex gap-[16px] z-50">
          {!loading &&
            (isEdit ? (
              <Box className="flex gap-[10px] text-[#6A6A6A] cursor-pointer" onClick={handleEditDone}>
                <DoneIcon width={20} height={20} />
                저장
              </Box>
            ) : (
              <Box className="flex gap-[10px] items-center">
                <Box
                  className="flex gap-[5px] items-center text-[#6A6A6A] text-[12px] font-semibold cursor-pointer"
                  onClick={() => {
                    if (!USER_SUBSCRIPTION.includes(user_login?.subscription || '')) {
                      showNotice(
                        `🔌 무료 요금제에서는 SNS 연동이 안 돼요!`,
                        `첫 달 0원 혜택 받고 요금제 업그레이드하면 SNS 연동이 가능해요.`,
                        true,
                        '확인',
                        '취소',
                        () => {
                          router.push('/rate-plan');
                        },
                      );
                      return;
                    }
                    setOpenSettings(true);
                  }}
                >
                  <Icon icon="icon-park-outline:setting-two" height={20} /> 업로드 설정
                </Box>
                <Box
                  className="flex gap-[5px] items-center text-[#6A6A6A] text-[12px] font-semibold cursor-pointer"
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  <Icon icon="line-md:edit" height={20} /> 수정
                </Box>
              </Box>
            ))}
        </Box>
        <AnalysVideoImg
          imgSrc={videoSrc}
          isLoading={loadingVideo}
          isLoadingComment={loadingComment}
          isLoadingHashtag={loadingHashtag}
          isShowDownload={!loadingVideo}
          data={videoData as PostData}
          percent={percentVideo}
          isDone={isDoneRef.current}
          randomText={randomText?.video}
          isEdit={isEdit}
          callEdit={callEdit}
          setCallEdit={setCallEdit}
        />
        <AnalysVideoImg
          type={1}
          imgSrc={imgSrc}
          isLoading={loadingImg}
          isLoadingComment={loadingComment}
          isLoadingHashtag={loadingHashtag}
          isShowDownload={!loadingVideo}
          data={imgData as PostData}
          percent={percentImg}
          isDone={isDoneRef.current}
          randomText={randomText?.image}
          isEdit={isEdit}
          callEdit={callEdit}
          setCallEdit={setCallEdit}
        />
        <Blog
          data={blog}
          isLoading={loadingBlog}
          isShowDownload={!loadingVideo}
          percent={percentBlog}
          isDone={isDoneRef.current}
          randomText={randomText?.blog}
          isEdit={isEdit}
          callEdit={callEdit}
          setCallEdit={setCallEdit}
        />
      </Box>

      {!loading && (
        <Box className="fixed bottom-0 w-full mx-[-15px] px-[15px] h-[80px] items-center bg-[#fff] z-[999] sm:z-0 sm:relative sm:mt-[30px] flex gap-[8px] sm:gap-[16px] sm:justify-end sm:py-[30px] sm:pr-[90px]">
          <Button
            disableElevation
            variant="contained"
            size="large"
            className="w-[calc(50%-4px)] sm:w-[158px] h-[50px] rounded-[6px] sm:!rounded-[37px] text-[18px] font-semibold px-0 pt-[9px] text-[#4776EF] border-solid border-[2px] border-[#4776EF] bg-[#4776EF] bg-opacity-0 hover:bg-opacity-20 focus:bg-opacity-50"
            onClick={(e) => {
              handleSaveDraft();
              e.preventDefault();
            }}
          >
            임시 저장
          </Button>
          <Button
            disableElevation
            variant="contained"
            aria-label="logout"
            size="large"
            className="w-[calc(50%-4px)] sm:w-[158px] h-[50px] rounded-[6px] sm:!rounded-[37px] text-[18px] font-semibold px-0 bg-[#4776EF] hover:bg-[#488AFF] focus:bg-[#4664DC] pt-[9px]"
            onClick={(e) => {
              checkActiveSNS();
              e.preventDefault();
            }}
          >
            {loadingUpload ? (
              <Image src="/images/home/loading-dot.gif" width={100} height={40} alt="loading" />
            ) : (
              '한번에 업로드'
            )}
          </Button>
        </Box>
      )}
      {showToast && <ShowSampleInfo text={toastText} />}
      <SNSSettingsPopup
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        onSuccess={() => getSNSSettingsAPI.current.call()}
      />
    </Box>
  );
};

export default AnalysProduct;
