'use client';

import type { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import type { SNSStatus } from '@/app/(DashboardLayout)/history/components/const';
import CustomButton from '@/app/components/common/CustomButton';
import MuiDropdownSelect, { DropdownOption } from '@/app/components/common/MuiDropdownSelect';
import TextareaCustom from '@/app/components/common/TextareaCustom';
import { toast } from '@/app/components/common/Toast';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import type { RootState } from '@/app/lib/store/store';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { DownloadIcon } from '@/utils/icons/engagements';
import { IconDone, IconUploadMedia, MoreIcon, NextSlideIcon, PreviousSlideIcon } from '@/utils/icons/icons';
import { Icon } from '@iconify/react';
import { Avatar, Box, Button, CircularProgress, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { GlobalStyles } from '@mui/system';
import API from '@service/api';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface EditImageProps {
  data: PostData | undefined;
  handleReFetch: () => void;
  isPreview: boolean;
}

export default function EditImage({ data, handleReFetch, isPreview }: EditImageProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [commentValue, setCommentValue] = React.useState<string>(data?.description || '');
  const [hashtagValue, setHashtagValue] = React.useState<string>(data?.hashtag || '');
  const swiperRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const snsUploaded: SNSStatus[] = data?.social_sns_description ? JSON.parse(data?.social_sns_description) : [];
  const [uploadFailed, setUploadFailed] = useState(snsUploaded.some((sns) => sns.status === 'ERRORED'));
  const snsSettings = useSelector((state: RootState) => state.snsSettings);
  const user = useSelector((state: RootState) => state.auth.user);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };
  const apiSave = useRef(
    new API('/api/v1/post/edit_post ', 'POST', {
      success: (res) => {
        if (res?.code === 200) {
          toast.success('게시물이 편집되었습니다!');
          setIsEdit(false);
          handleReFetch();
        } else {
          showNoticeError(res?.message, '', false, '확인', '취소', () => {
            // setLoading(false);
          });
        }
      },
      error: (err) => {
        toast.error(err.message);
      },
      finally: () => {
        setLoading(false);
      },
    }),
  );
  const apiUpload = useRef(
    new API('/api/v1/user/send-posts', 'POST', {
      success: (res) => {
        if (res?.code == 201) {
          showNoticeMUI(
            res?.message || '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            res?.data?.error_message || '🎟️ 참여 방법은 도매꾹 홈페이지 톡탁 이벤트를 확인하세요. 😊',
            false,
            '확인',
          );
          setLoading(false);
        } else if (res?.data?.sync_id) {
          router.push(`/upload?syncId=${res?.data?.sync_id}&reup=${uploadFailed ? 1 : 0}`);
        }
      },
      error: (err) => {
        console.log(err);
        toast.error(err.message);
      },
      finally: () => {},
    }),
  );
  const apiDelete = useRef(
    new API('/api/v1/maker/delete_post', 'POST', {
      success: () => {
        toast.success('게시물이 성공적으로 삭제되었습니다.');
        handleReFetch();
      },
      error: (err) => {
        console.log(err);
        toast.error(err.message);
      },
      finally: () => {},
    }),
  );

  const handleUpdateImage = async () => {
    setLoading(true);
    apiSave.current.config.data = {
      post_id: data?.id,
      description: commentValue || [],
      hashtag: hashtagValue || [],
    };

    showNotice('✏️ 이 콘텐츠를 수정할까요?', '⚠️ 수정한 콘텐츠는 되돌릴 수 없어요!', true, '확인', '취소', () => {
      apiSave.current.call();
    });
  };
  const snsErrorCallback = () => {
    showNotice('로그인이 필요해요! 🔑', '로그인은 구글 간편 로그인으로 할 수 있어요.', true, '로그인', '다음에', () => {
      localStorage.setItem('action', 'register');
      router.push('/auth/login');
    });
  };
  const checkSNSActiveApi = useRef(
    new API(`/api/v1/user/check-sns-link`, 'POST', {
      success: (res, dataSource) => {
        if (res?.code == 200) {
          apiUpload.current.config.data = {
            post_ids: [
              {
                id: dataSource?.data?.id,
                is_all: 0,
                link_ids: dataSource?.data?.social_list_upload,
              },
            ],
          };
          apiUpload.current.call();
        } else if (res?.code == 201) {
          showNoticeMUI(
            res?.message || '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            res?.data?.error_message || '🎟️ 참여 방법은 도매꾹 홈페이지 톡탁 이벤트를 확인하세요. 😊',
            false,
            '확인',
            '',
            () => router.push('/profile'),
          );
        } else if (res?.code == 202) {
          showNoticeMUI(
            res?.message || '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            res?.data?.error_message || '',
            true,
            '지금 연결하기',
            '다음에',
          );
        } else {
          showNoticeMUI(res?.message, res?.data?.error_message || '', false, '확인', '');
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
        snsErrorCallback();
        setLoading(false);
      },
    }),
  );

  const handleUpload = async () => {
    setLoading(true);
    checkSNSActiveApi.current.config.data = {
      listIds: [data?.id],
    };
    await checkSNSActiveApi.current.call({ data });
  };
  const download = async () => {
    setDownloading(true);
    const postId = data?.id;

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

  const handleRemove = async () => {
    showNotice(
      '선택한 콘텐츠를 삭제하시겠어요?',
      '삭제한 컨텐츠는 다시 복구할 수 없어요.',
      true,
      '삭제',
      '취소',
      async () => {
        apiDelete.current.config.data = {
          post_ids: data?.id.toString(),
        };
        await apiDelete.current.call();
      },
    );
  };
  const optionMore: DropdownOption[] = [
    {
      value: 'download',
      id: 'download',
      label: (
        <Box className="py-2.5 px-3 flex items-center gap-2" onClick={handleDownload}>
          {!isMobile && (downloading ? <CircularProgress size={20} /> : <DownloadIcon />)}
          <Typography sx={{ ml: 1 }}>다운로드</Typography>
        </Box>
      ),
    },
    {
      value: 'edit',
      id: 'edit',
      label: (
        <Box
          className="py-2.5 px-3 flex items-center gap-2"
          onClick={() => {
            setIsEdit(true);
          }}
        >
          {!isMobile && <Icon icon="carbon:edit" />}
          <Typography sx={{ ml: 1 }}>콘텐츠 수정</Typography>
        </Box>
      ),
    },
    {
      value: 'trash',
      id: 'trash',
      label: (
        <Box className="py-2.5 px-3 flex items-center gap-2" onClick={handleRemove}>
          {!isMobile && <Icon icon="tabler:trash" />}
          <Typography sx={{ ml: 1, color: { xs: '#FF5959', sm: 'inherit' } }}>삭제</Typography>
        </Box>
      ),
    },
  ];

  return (
    <>
      <GlobalStyles
        styles={{
          '.swiper-pagination-bullet': {
            width: 8,
            height: 8,
            margin: 0,
            background: '#fff',
            opacity: 0.5,
            transition: 'all 0.3s ease',
          },
          '.swiper-pagination-bullet-active': {
            opacity: 1,
          },
        }}
      />
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          width: '100%',
          top: 0,
          px: 2,
          py: 2.5,
        }}
      >
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '19px',
            textAlign: 'center',
          }}
        >
          IMAGE
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          height: { xs: '100%', md: '90vh' },
          px: { xs: 4.75, sm: 0 },
        }}
      >
        {/* Left: Media */}
        <Box
          sx={{
            flex: { xs: 'none', sm: 'auto' },
            width: { xs: '100%', md: 640 },
            height: { xs: '40vh', md: '100%' },
            bgcolor: '#090909',
            position: 'relative',
            borderRadius: { xs: '8px', sm: 0 },
            overflow: 'hidden',
          }}
        >
          {currentIndex > 0 && (
            <IconButton
              onClick={handlePrev}
              sx={{ position: 'absolute', top: '50%', left: 20, zIndex: 10, transform: 'translateY(-50%)' }}
            >
              <PreviousSlideIcon />
            </IconButton>
          )}
          {currentIndex < (data?.images?.length ?? 1) - 1 && (
            <IconButton
              onClick={handleNext}
              sx={{ position: 'absolute', top: '50%', right: 20, zIndex: 10, transform: 'translateY(-50%)' }}
            >
              <NextSlideIcon />
            </IconButton>
          )}
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            style={{ height: isMobile ? '40vh' : '100%' }}
          >
            {data?.images?.map((img, idx) => (
              <SwiperSlide key={idx}>
                <Image
                  src={img || '/images/home/blankImg.png'}
                  fill
                  style={{ objectFit: 'cover' }}
                  alt={`Slide ${idx + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Right: Details & Controls */}
        <Box
          sx={{
            width: { xs: '100%', md: 588 },
            display: 'flex',
            flexDirection: 'column',
            pb: { xs: 8, sm: 0 },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 5,
              py: 3.75,
              display: { xs: 'none', sm: 'flex' },
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: 'grey.200',
            }}
          >
            <Box>
              <Typography className="font-pretendard font-bold text-base leading-[100%]" color="#686868">
                콘텐츠 상세 정보
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar src="/images/rank/Rank-1.png" sx={{ width: 38, height: 38 }} />
                <Typography sx={{ ml: 1, color: '#686868' }}>TOKTAK: {data?.id}</Typography>
              </Box>
            </Box>

            {!isPreview && !isMobile && (
              <MuiDropdownSelect
                options={optionMore}
                isRadio={false}
                menuOrigin={{
                  transformOrigin: { horizontal: 'left', vertical: 'top' },
                  anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
                }}
                renderButton={({ onClick }) => (
                  <IconButton onClick={onClick} sx={{ borderRadius: '4px' }}>
                    <MoreIcon />
                  </IconButton>
                )}
              />
            )}
          </Box>

          {/* Content Area */}
          {isEdit ? (
            <Box sx={{ p: { xs: '20px 0', sm: 5 }, overflowY: 'auto' }}>
              <Box
                sx={{
                  p: { xs: 0, sm: 2.5 },
                  border: { xs: 0, sm: 2 },
                  borderColor: '#F1F1F1',
                  borderRadius: 1,
                }}
              >
                <Typography fontWeight="bold">Comment</Typography>
                <TextareaCustom
                  className="border !border-solid sm:!border-none border-[#F1F1F1] rounded-md mt-2 p-2.5"
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                />
                <Typography fontWeight="bold" sx={{ mt: 3 }}>
                  Hashtag
                </Typography>
                <TextareaCustom
                  className="border !border-solid sm:!border-none border-[#F1F1F1] rounded-md mt-2 p-2.5"
                  value={hashtagValue}
                  onChange={(e) => setHashtagValue(e.target.value)}
                />
              </Box>
              <Box
                sx={{
                  mt: 5,
                  p: { xs: '10px 18px', sm: 0 },
                  textAlign: 'center',
                  position: { xs: 'fixed', sm: 'static' },
                  bottom: 0,
                  left: 0,
                  bgcolor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'end' },
                  gap: '10px',
                  width: '100%',
                }}
              >
                <CustomButton
                  startIcon={!isMobile && <IconDone />}
                  disabled={
                    (!commentValue && !hashtagValue) ||
                    (commentValue === data?.description && hashtagValue === data?.hashtag)
                  }
                  variant="contained"
                  loading={loading}
                  onClick={handleUpdateImage}
                  sx={{
                    p: { sm: '10px 24px' },
                    height: { xs: 50, sm: 'auto' },
                    width: { xs: '100%', sm: 'auto' },
                    borderRadius: { xs: '6px', sm: '10px' },
                  }}
                >
                  저장
                </CustomButton>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: { xs: '20px 0', sm: 5 }, flexGrow: 1, overflowY: 'auto' }}>
              <Typography fontWeight="bold">Comment</Typography>
              <Typography sx={{ mt: 1 }}>{commentValue || data?.description}</Typography>
              <Typography fontWeight="bold" sx={{ mt: 3 }}>
                Hashtag
              </Typography>
              <Typography sx={{ mt: 1 }}>{hashtagValue || data?.hashtag}</Typography>

              {!isPreview && snsSettings?.image.some((i) => i.selected === 1 && i.id !== 5) && (
                <Box
                  sx={{
                    mt: 5,
                    p: { xs: '10px 18px', sm: 0 },
                    textAlign: 'center',
                    position: { xs: 'fixed', sm: 'static' },
                    bottom: 0,
                    left: 0,
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                  }}
                >
                  {!isPreview && isMobile && (
                    <MuiDropdownSelect
                      options={optionMore}
                      isRadio={false}
                      menuOrigin={{
                        transformOrigin: { horizontal: 'left', vertical: 'top' },
                        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
                      }}
                      renderButton={({ onClick }) => (
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={onClick}
                          sx={{
                            borderRadius: '4px',
                            border: '1.5px solid #E7E7E7',
                            height: '50px',
                            width: '50px',
                            minWidth: '50px',
                            flex: 'none',
                          }}
                        >
                          <MoreIcon />
                        </Button>
                      )}
                    />
                  )}
                  <CustomButton
                    startIcon={<IconUploadMedia />}
                    variant="contained"
                    loading={loading}
                    onClick={handleUpload}
                    sx={{
                      height: { xs: 50, sm: 'auto' },
                      width: { xs: '100%', sm: 'auto' },
                      borderRadius: { xs: '6px', sm: '24px' },
                    }}
                  >
                    톡! 콘텐츠 업로드
                  </CustomButton>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
