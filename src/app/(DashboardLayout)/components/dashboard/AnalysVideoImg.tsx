'use client';

import { toast } from '@/app/components/common/Toast';
import SocialPreview from '@/app/components/socialsPosting/socialPreview';
import type { RootState } from '@/app/lib/store/store';
import { PLATFORM } from '@/utils/constant';
import { showNoticeError } from '@/utils/custom/notice_error';
import { DownloadIcon } from '@/utils/icons/engagements';
import { BackNextIcon } from '@/utils/icons/icons';
import { Facebook, Instagram, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';
import { Icon } from '@iconify/react';
import { Box, CircularProgress, TextField, Typography } from '@mui/material';
import API from '@service/api';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Typewriter from 'typewriter-effect';

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
    popup: 'top-popup rounded-[16px] w-[250px] h-[80px]',
    title: 'text-[21px] leading-[30px] text-[#272727] mt-[-50px] font-pretendard font-bold',
  },
});

export interface PostData {
  batch_id: number;
  description: string;
  created_at: string;
  hashtag: string;
  id: number;
  render_id: number;
  status: number;
  subtitle: string;
  thumbnail: string;
  title: string;
  type: number;
  type_string?: string;
  updated_at: string;
  user_id: number;
  video_url: string;
  video_path: string;
  images: string[];
  content: string;
  social_list_upload?: Array<string>;
  social_sns_description: string;
  docx_url?: string;
}

const AnalysVideoImg = ({
  type = 0,
  imgSrc = '',
  isLoading = false,
  isLoadingComment = false,
  isLoadingHashtag = false,
  isShowDownload = false,
  data,
  percent = 0,
  isDone = false,
  randomText = {
    title: '',
    comment: '',
    hashtag: '',
  },
  isEdit = false,
  callEdit = false,
  setCallEdit = () => {},
}: {
  type?: number;
  imgSrc?: string;
  isLoading?: boolean;
  isLoadingComment?: boolean;
  isLoadingHashtag?: boolean;
  isShowDownload?: boolean;
  data?: PostData;
  percent?: number;
  isDone?: boolean;
  randomText: {
    title?: string;
    comment: string;
    hashtag: string;
  };
  isEdit?: boolean;
  callEdit?: boolean;
  setCallEdit?: (callEdit: boolean) => void;
}) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const platform = useSelector((state: RootState) => state.platform);
  const snsSettings = useSelector((state: RootState) => state.snsSettings);
  const [showBackNext, setShowBackNext] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [platformViewer, setPlatformViewer] = useState<PLATFORM>();
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [displayData, setDisplayData] = useState({
    title: data?.title,
    description: data?.description,
    hashtag: data?.hashtag,
  });
  const [socialButtons, setSocialButtons] = useState([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setDisplayData({
      title: data?.title,
      description: data?.description,
      hashtag: data?.hashtag,
    });
  }, [data]);

  const getSocialStatus = (index: number) => {
    const snsSettingList = type === 0 ? snsSettings.video : snsSettings.image;
    if (snsSettingList.length === 0) {
      return false;
    }
    return snsSettingList[index].selected === 1;
  };

  useEffect(() => {
    setSocialButtons([
      {
        name: 'youtube',
        icon: <Youtube className={'w-9 h-9'} />,
        action: () => {
          setPlatformViewer(PLATFORM.Youtube);
        },
        status: type == 0 && platform['youtube'].status && getSocialStatus(4),
      },
      {
        name: 'instagram',
        icon: <Instagram className={'w-9 h-9'} />,
        action: async () => {
          setPlatformViewer(PLATFORM.Instagram);

          // await fetch("https://api.instagram.com/oauth/access_token", {
          //   method: "POST",
          //   body: JSON.stringify({
          //     client_id: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
          //     client_secret: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_SECRET,
          //     grant_type: "authorization_code",
          //     redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
          //     code: instagramCode,
          //   }),
          // })
          //   .then((res) => res.json())
          //   .then(async (dataR) => {
          //     await fetch(
          //       `https://graph.instagram.com/v22.0/${dataR.data.user_id}/media`,
          //       {
          //         method: "POST",
          //         headers: {
          //           "Content-Type": "application/json",
          //         },
          //         body: JSON.stringify({
          //           image_url: data?.images[0],
          //         }),
          //       }
          //     )
          //       .then((res) => res.json())
          //       .then((data) => {
          //         console.log(data);
          //       });
          //   });
        },
        status: platform['instagram'].status && getSocialStatus(1),
      },
      {
        name: 'facebook',
        icon: <Facebook className={'w-9 h-9'} />,
        action: async () => {
          setPlatformViewer(PLATFORM.Facebook);
        },
        status: platform['facebook'].status && getSocialStatus(0),
      },
      {
        name: 'tiktok',
        icon: <TikTok className={'w-9 h-9'} />,
        action: () => {
          setPlatformViewer(PLATFORM.Tiktok);
        },
        status: platform['tiktok'].status && getSocialStatus(3),
      },
      {
        name: 'threads',
        icon: <Threads className={'w-9 h-9'} />,
        action: () => {
          setPlatformViewer(PLATFORM.Thread);
        },
        status: platform['threads'].status && getSocialStatus(5),
      },
      {
        name: 'twitter',
        icon: <Twitter className={'w-9 h-9'} />,
        action: () => {
          setPlatformViewer(PLATFORM.Twitter);
        },
        status: platform['twitter'].status && getSocialStatus(2),
      },
    ]);
  }, [platform, snsSettings]);

  useEffect(() => {
    if (!isLoading) {
      setShowContent(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (callEdit) {
      editPostAPI.current.config.data = {
        post_id: data?.id,
        title: displayData?.title,
        description: displayData?.description,
        hashtag: displayData?.hashtag,
      };
      editPostAPI.current.call();
      setCallEdit(false);
    }
  }, [callEdit]);

  const editPostAPI = useRef(
    new API(`/api/v1/post/edit_post`, 'POST', {
      success: (res) => {
        if (res?.code === 201) {
          showNoticeError(res?.message, '', false, '확인', '취소', () => {
            // setLoading(false);
          });
        } else {
        }
      },
      error: (err) => {},
      finally: () => {},
    }),
  );
  const download = async () => {
    if ((type === 0 && !imgSrc) || (type === 1 && data && data?.images.length == 0)) return;

    setDownloading(true);
    try {
      if (type === 0) {
        const response = await fetch(`/api/download?url=${encodeURIComponent(imgSrc)}`);

        if (!response.ok) {
          throw new Error('Download failed');
        }

        const blob = await response.blob(); // Nhận dữ liệu dạng blob
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'video.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url); // Giải phóng bộ nhớ
      } else {
        let postId = data?.id;
        try {
          const api = new API<null>('/api/v1/maker/download-zip', 'POST', {
            success: () => console.log('Tải xong'),
            error: (err) => console.error('Lỗi tải:', err),
            finally: () => setDownloading(false),
          });

          api.set({
            data: { post_id: postId },
          });

          api.download(`post_${postId}_images.zip`);
        } catch (error) {
          console.error('Lỗi khi tải zip:', error);
        } finally {
          // setDownloading(false);
        }
      }
    } catch (error) {
      console.error('❌ Tải xuống thất bại:', error);
    } finally {
      setDownloading(false);
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

  const onChangeText = (e: any) => {
    const { name, value } = e.target;
    setDisplayData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleEdit = () => {
  //   setIsEdit(true);
  // };

  // const handleEditDone = () => {
  //   editPostAPI.current.config.data = {
  //     post_id: data?.id,
  //     title: displayData?.title,
  //     description: displayData?.description,
  //     hashtag: displayData?.hashtag,
  //   };
  //   editPostAPI.current.call();
  //   setIsEdit(false);
  // };

  const handleCopy = async () => {
    if (!displayData?.description && !displayData?.hashtag) {
      toast.error('복사할 URL이 없습니다!');
      return;
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob(
            [document.getElementById(`${type === 0 ? 'video' : 'image'}-content`)?.innerHTML || ''],
            {
              type: 'text/html',
            },
          ),
        }),
      ]);
      toast.success(`${type === 0 ? 'Video' : 'Image'}이 복사되었습니다!`);
    } catch (error) {
      console.error('복사 오류:', error);
      toast.error('복사에 실패했습니다!');
    }
  };

  return (
    <Box className="relative sm:py-[40px] p-[20px] sm:px-0 rounded-[8px] shadow-[0px_0px_40px_rgba(0,0,0,0.08)] sm:shadow-none">
      <SocialPreview
        type={type}
        platform={platformViewer!}
        data={data}
        open={!!platformViewer}
        onClose={() => setPlatformViewer(Number.NaN)}
      />
      <Box className={`flex gap-[10px] items-center sm:mb-[20px]${showContent ? ' mb-[20px]' : ''}`}>
        <Box className={`flex gap-[10px] flex-1 items-center`}>
          <Typography className="!text-[#272727] text-[16px] sm:!text-[24px] !font-bold">
            {type === 0 ? 'VIDEO' : 'IMAGE'}
          </Typography>
          {isShowDownload && (
            <Box className="">
              {downloading ? (
                <CircularProgress className="!h-[20px] !w-[20px]" />
              ) : (
                <DownloadIcon onClick={handleDownload} className="cursor-pointer" />
              )}
            </Box>
          )}
          {isLoading && percent < 100 && !showContent && (
            <Typography className="sm:hidden !text-[#4776EF] text-[16px] sm:!text-[24px] !font-medium">
              {percent}%
            </Typography>
          )}
        </Box>
        <Icon
          icon={'ion:chevron-back'}
          onClick={() => setShowContent((prev) => !prev)}
          className={`sm:hidden cursor-pointer${showContent ? ' rotate-90' : ' -rotate-90'}`}
          width={20}
          height={20}
        />
      </Box>
      <Box className={`col-span-12 sm:flex gap-[40px]${showContent ? ' ' : ' hidden sm:block'}`}>
        {type === 1 ? (
          isLoading ? (
            // isLoadingHashtag ? (
            //   <Box className="w-[297px] h-[371px] bg-slate-300 rounded-[10px] animate-[pulse_1s_linear_infinite]" />
            // ) : (
            <Box className="w-full sm:w-[297px] h-[240px] sm:h-[371px] bg-[#F8F8F8] rounded-[10px] content-center space-y-2 sm:space-y-5">
              <img
                src={`/images/home/analys_progress_image.gif`}
                className="hidden sm:block h-[130px] w-[130px] mx-auto mb-[30px] rounded-full"
              />
              <Box className="text-[24px] sm:text-[36px] font-black text-center text-[#4776EF]">{percent}%</Box>
              <Box
                className="text-[10px] sm:text-[14px] font-medium text-[#A4A4A4] text-center"
                dangerouslySetInnerHTML={{
                  __html: '사용되는 콘텐츠에 따라 제작</br>시간이 길어질 수 있습니다.',
                }}
              />
            </Box>
          ) : // )
          !!data?.images?.length ? (
            <Box
              className="flex-none w-full sm:w-[297px] relative"
              onMouseEnter={() => {
                if (swiperInstance?.autoplay) {
                  swiperInstance.autoplay.stop();
                }
                setShowBackNext(true);
              }}
              onMouseLeave={() => {
                if (swiperInstance?.autoplay) {
                  swiperInstance.autoplay.start();
                }
                setShowBackNext(false);
              }}
            >
              <Box className="absolute top-[20px] right-[20px] z-[999] w-[38px] h-[22px] rounded-[13px] text-[#fff] text-center bg-[#000000CC] bg-opacity-80">
                {`${currentSlide + 1}/${data?.images.length}`}
              </Box>
              {showBackNext && (
                <Box className="w-full sm:w-[297px] absolute top-[145px] left-0 z-[999] flex justify-between cursor-pointer">
                  <BackNextIcon className="rotate-180" onClick={() => swiperInstance?.slidePrev()} />
                  <BackNextIcon className="" onClick={() => swiperInstance?.slideNext()} />
                </Box>
              )}
              <Swiper
                modules={[Autoplay, Navigation]}
                noSwiping={true}
                noSwipingClass="no-swiping"
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                speed={500}
                loop={true}
                initialSlide={currentSlide}
                touchRatio={0.4}
                spaceBetween={0}
                onSlideChange={(swiper) => {
                  setCurrentSlide(swiper.realIndex);
                }}
                onSwiper={(swiper) => setSwiperInstance(swiper)}
              >
                {data?.images?.map((image: string, index: number) => (
                  <SwiperSlide
                    className="w-full sm:w-[297px] flex items-stretch absolute justify-end rounded-lg inset-0 cursor-pointer"
                    key={image || index}
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      onError={() => {}}
                      onLoad={(e) => {}}
                      className={`w-full h-auto sm:w-[297px] sm:h-[371px] rounded-[10px]`}
                      alt="News Image"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          ) : (
            <img
              src={'/images/home/blankImg.png'}
              onError={() => {}}
              onLoad={(e) => {}}
              className={`w-[297px] h-[240px] sm:h-[371px] rounded-[10px] object-cover`}
              alt="News Image"
            />
          )
        ) : imgSrc ? (
          <Box className="relative h-[240px] sm:w-[297px] sm:h-[528px] flex-none video-animation overflow-hidden rounded-[10px] mx-auto sm:mx-0">
            <video
              controls
              playsInline
              autoPlay
              muted
              loop
              controlsList="nodownload"
              className="absolute inset-0 mx-auto w-full h-full object-contain sm:object-cover"
            >
              <source src={imgSrc} type="video/mp4" />
            </video>
          </Box>
        ) : isLoading ? (
          // isLoadingHashtag ? (
          //   <Box
          //     className="w-[297px] bg-slate-300 rounded-[20px] animate-[pulse_1s_linear_infinite]"
          //     style={{ height: '528px' }}
          //   />
          // ) : (
          <Box className="w-[297px] h-[240px] sm:h-[528px] bg-[#F8F8F8] rounded-[10px] content-center space-y-2 sm:space-y-5 mx-auto sm:mx-0">
            <img
              src={`/images/home/analys_progress_video.gif`}
              className="h-[130px] w-[130px] mx-auto mb-[30px] rounded-full hidden sm:block"
            />
            <Box className="text-[24px] sm:text-[36px] font-black text-center text-[#4776EF]">{percent}%</Box>
            <Box
              className="text-[10px] sm:text-[14px] font-medium text-[#A4A4A4] text-center"
              dangerouslySetInnerHTML={{
                __html: '사용되는 콘텐츠에 따라 제작</br>시간이 길어질 수 있습니다.',
              }}
            />
          </Box>
        ) : (
          // )
          <Image
            src={`/images/home/blankVideo.png`}
            alt="icon"
            height="528"
            width="297"
            className="rounded-[10px] h-[240px] sm:h-[528px] object-cover mx-auto sm:mx-0"
            style={{ width: 'auto' }}
          />
        )}
        <Box className="flex flex-col sm:w-[calc(100%-620px)] gap-[20px] mt-[20px] sm:mt-0">
          <Box
            id={`${type === 0 ? 'video' : 'image'}-content`}
            className={`w-full flex flex-col gap-[20px]${isEdit ? ' sm:border-[2px] sm:border-[#537EEF] sm:p-[30px] rounded-[10px]' : ''}  relative`}
          >
            {/* {!isLoading &&
              !searchParams.get('sampleId') &&
              (isEdit ? (
                <Box
                  className="flex gap-[10px] text-[#6A6A6A] absolute right-[30px] cursor-pointer"
                  onClick={handleEditDone}
                >
                  <DoneIcon width={20} height={20} />
                  저장
                </Box>
              ) : (
                <Box className="flex gap-[10px] text-[#6A6A6A] absolute right-[30px]">
                  <Icon icon={'line-md:edit'} onClick={handleEdit} className="cursor-pointer" width={20} height={20} />
                  <Icon icon={'tabler:copy'} onClick={handleCopy} className="cursor-pointer" width={20} height={20} />
                </Box>
              ))} */}
            {type === 0 && (
              <Box className="space-y-[10px]">
                <Typography className="!text-[#686868] text-[14px] sm:!text-[16px] !font-bold !font-pretendard">
                  Title
                </Typography>

                {isEdit ? (
                  <TextField
                    name="title"
                    placeholder="MultiLine with rows: 2 and rowsMax: 4"
                    value={displayData?.title}
                    onChange={onChangeText}
                    multiline
                    maxRows={7}
                    sx={{
                      display: 'flex',
                      flexGrow: 1,
                      width: '100%',
                      '.MuiInputBase-root': {
                        padding: { xs: '5px', sm: '0' },
                        border: { xs: 'solid 1px #F1F1F1', sm: 'none!important' },
                        color: '#686868',
                        borderRadius: '10px',
                      },
                      '.MuiInputBase-root:focus-within': {
                        border: { xs: 'solid 1px #4776EF', sm: 'none!important' },
                      },
                      '.MuiInputBase-input:focus-visible': {
                        '--tw-ring-offset-shadow': 'transparent!important',
                      },
                    }}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        height: '100%',
                      },
                    }}
                  />
                ) : isDone ? (
                  <Typography
                    className="!text-[#686868] text-[14px] sm:!text-[16px] !leading-[24px] break-all !font-pretendard whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: displayData?.title || '' }}
                  />
                ) : isLoadingComment ? (
                  <Typography className="!text-[#686868] text-[14px] sm:!text-[16px] !leading-[24px] !font-pretendard">
                    {randomText.title}
                  </Typography>
                ) : (
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(displayData?.title || '')
                        .pauseFor(100)
                        .start();
                    }}
                    options={{
                      delay: 25,
                    }}
                  />
                )}
              </Box>
            )}
            {/* {isLoadingComment ? (
              <Box className="space-y-[10px] w-full animate-[pulse_1s_linear_infinite]">
                <Box className="h-6 bg-slate-300 w-[30%] rounded-[20px]" />
                <Box className="h-6 bg-slate-200 w-[90%] rounded-[20px]" />
              </Box>
            ) : ( */}
            <Box className="space-y-[10px]">
              <Typography className="!text-[#686868]  text-[14px] sm:!text-[16px] !font-bold !font-pretendard">
                Comment
              </Typography>
              {isEdit ? (
                <TextField
                  name="description"
                  placeholder="MultiLine with rows: 2 and rowsMax: 4"
                  value={displayData?.description}
                  onChange={onChangeText}
                  multiline
                  maxRows={7}
                  sx={{
                    display: 'flex',
                    flexGrow: 1,
                    width: '100%',
                    '.MuiInputBase-root': {
                      padding: { xs: '5px', sm: '0' },
                      border: { xs: 'solid 1px #F1F1F1', sm: 'none!important' },
                      color: '#686868',
                      borderRadius: '10px',
                    },
                    '.MuiInputBase-root:focus-within': {
                      border: { xs: 'solid 1px #4776EF', sm: 'none!important' },
                    },
                    '.MuiInputBase-input:focus-visible': {
                      '--tw-ring-offset-shadow': 'transparent!important',
                    },
                  }}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      height: '100%',
                    },
                  }}
                />
              ) : isDone ? (
                <Typography
                  className="!text-[#686868] text-[14px] sm:!text-[16px] !leading-[24px] break-all !font-pretendard whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: displayData?.description || '' }}
                />
              ) : isLoadingComment ? (
                <Typography className="!text-[#686868] text-[14px] sm:!text-[16px] !leading-[24px] !font-pretendard whitespace-pre-line">
                  {randomText.comment}
                </Typography>
              ) : (
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(displayData?.description || '')
                      .pauseFor(1000)
                      .start();
                  }}
                  options={{
                    delay: 25,
                    wrapperClassName: 'whitespace-pre-line',
                  }}
                />
              )}
            </Box>
            {/* )} */}
            {/* {isLoadingHashtag ? (
              <Box className="space-y-[10px] w-full animate-[pulse_1s_linear_infinite]">
                <Box className="h-6 bg-slate-300 w-[40%] rounded-[20px]" />
                <Box className="h-6 bg-slate-200 w-[80%] rounded-[20px]" />
              </Box>
            ) : ( */}
            <Box className="space-y-[10px]">
              <Typography className="!text-[#686868] text-[14px] sm:!text-[16px] !font-bold !font-pretendard">
                Hashtag
              </Typography>
              {isEdit ? (
                <TextField
                  name="hashtag"
                  placeholder="MultiLine with rows: 2 and rowsMax: 4"
                  value={displayData?.hashtag}
                  onChange={onChangeText}
                  multiline
                  maxRows={7}
                  sx={{
                    display: 'flex',
                    flexGrow: 1,
                    width: '100%',
                    '.MuiInputBase-root': {
                      padding: { xs: '5px', sm: '0' },
                      border: { xs: 'solid 1px #F1F1F1', sm: 'none!important' },
                      color: '#686868',
                      borderRadius: '10px',
                    },
                    '.MuiInputBase-root:focus-within': {
                      border: { xs: 'solid 1px #4776EF', sm: 'none!important' },
                    },
                    '.MuiInputBase-input:focus-visible': {
                      '--tw-ring-offset-shadow': 'transparent!important',
                    },
                  }}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      height: '100%',
                    },
                  }}
                />
              ) : isDone ? (
                <Typography
                  className="!text-[#686868] text-[14px] sm:!text-[16px] !leading-[24px] break-all !font-pretendard"
                  dangerouslySetInnerHTML={{ __html: displayData?.hashtag || '' }}
                />
              ) : isLoadingHashtag ? (
                <Typography className="!text-[#686868] text-[14px] sm:!text-[16px] !leading-[24px] !font-pretendard">
                  {randomText.hashtag}
                </Typography>
              ) : (
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(displayData?.hashtag || '')
                      .pauseFor(1000)
                      .start();
                  }}
                  options={{
                    delay: 25,
                  }}
                />
              )}
            </Box>
            {/* )} */}
          </Box>
          <Box className="mt-auto">
            <Typography className="text-[#686868] text-[14px] sm:text-[16px] font-bold !font-pretendard">
              미리보기
            </Typography>
            <Box className="flex justify-between sm:justify-start gap-[10px] mt-[5px]">
              {socialButtons.map((social, index) => (
                <Box
                  key={social.name}
                  className={`${
                    !social.status ? 'text-gray-300' : 'text-black'
                  } rounded-full bg-[#F4F4F4] cursor-pointer w-9 h-9`}
                  onClick={() => {
                    if (!isLoading && social.status) {
                      social.action();
                    }
                  }}
                >
                  {social.icon}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        {/* )} */}
      </Box>
    </Box>
  );
};

export default AnalysVideoImg;
