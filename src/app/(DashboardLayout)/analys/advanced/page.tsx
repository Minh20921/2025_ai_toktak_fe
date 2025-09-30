'use client';

import { AdvancedIcon, IconHashtag, IconImage, IconProductInfo, IconShopCart, IconText } from '@/utils/icons/advanced';
import {
  Box,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid2,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import API from '@service/api';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import CustomButton from '@/app/components/common/CustomButton';
import { RootState } from '@/app/lib/store/store';
import { SEX, voiceOptionsFMale, voiceOptionsMale } from '@/utils/constant';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { getSessionWithExpiry, setSessionWithExpiry } from '@/utils/helper/session';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import 'swiper/css';
import NarrationSetting, { NarrationValue } from '../components/NarrationSetting';
import OptionItem from '../components/OptionItem';
import TooltipPreview from '../components/TooltipPreview';
import VideoPreview from '../components/VideoPreview';

const TEN_MINUTES_MS = 10 * 60 * 1000;

interface IContent {
  created_at: string;
  id: number;
  is_caption_last: number;
  is_caption_top: number;
  is_paid_advertisements: number;
  is_product_name: number;
  is_purchase_guide: number;
  is_video_hooking: number;
  product_name: string;
  purchase_guide: string;
  updated_at: string;
  user_id: number;
  video_hooks: {
    duration: number;
    video_name: string;
    video_url: string;
  }[];
  voice_gender: number;
  voice_id: number;
  image_template: {
    id: number;
    image_url: string;
    template_image: string;
    template_name: string;
    name: string;
  }[];

  image_template_id: string;
  subscribe_video: string;
  viral_messages: {
    duration: number;
    video_name: string;
    video_url: string;
  }[];
  audios: AudioOption[];
  audio_by_gender: {
    [key in SEX]: AudioOption[];
  };
}

interface FormData {
  paid_advertisements: {
    enabled: boolean;
    value: string;
  };
  productInfo: {
    enabled: boolean;
    value: string;
  };
  purchaseInfo: {
    enabled: boolean;
    value: string;
  };
  narration: {
    gender: number;
    soundType: string;
  };
  viralVideo: boolean;
  viralText: boolean;
  subscribeAndLike: boolean;
  imageTemplate: string;
  hashtag: {
    enabled: boolean;
    value: Array<string>;
  };
  comment: {
    enabled: boolean;
    value: string;
  };
  audio: AudioOption;
}

type OptionItemInputType = 'text' | 'hashtag' | undefined;

export interface AudioOption {
  name: {
    ko: string;
    en: string;
  };
  language: string;
  actor_id: string;
  img_url: string;
  actor_url: string;
  audio_url: string;
  video_url: string;
  unique_id: string;
  sex: [string];
  age: string;
  tag: [string];
  bookmark: boolean;
  hidden: boolean;
}

export default function ContentSettings() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Define narration options

  const cancelled = useRef(false);
  // cancel helper
  const stopPolling = () => {
    cancelled.current = true;
    if (pollTimeout.current) {
      clearTimeout(pollTimeout.current);
      pollTimeout.current = null;
    }
    try {
      if (storageKeyPollAttemptsRef.current) {
        sessionStorage.removeItem(storageKeyPollAttemptsRef.current);
      }
    } catch (e) {}
  };

  useEffect(() => {
    cancelled.current = false;
    return () => {
      // component unmount / dependency change
      cancelled.current = true;
      if (pollTimeout.current) {
        clearTimeout(pollTimeout.current);
        pollTimeout.current = null;
      }
      try {
        getBatchByBatchIdAPI.current?.cancel?.();
        getDataTemplateVideo.current?.cancel?.();
        createMakerAdvanceAPI.current?.cancel?.();
        makeBatchImageAPI.current?.cancel?.();
        updateBatch?.cancel?.();
      } catch (e) {}
    };
  }, []);

  const productUrl = useSelector((state: RootState) => state.createContent.productUrl);

  const narrationOptions = {
    [SEX.Male]: voiceOptionsMale,
    [SEX.FMale]: voiceOptionsFMale,
  };
  const [data, setData] = React.useState<IContent>();
  const [loading, setLoading] = useState(true);
  const [isProduct, setIsProduct] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Form state
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
  });
  /**
   * để tạm 200 lần polling, nếu quá thì sẽ dừng lại
   */
  const MAX_POLL_ATTEMPTS = 150;
  const TIME_RUN_BATCH = 4000;
  const batchId = useMemo(() => searchParams.get('batchId') ?? '', [searchParams.get('batchId')]);
  const storageKeyPollAttempts = useMemo(() => (batchId ? `pollAttempts:${batchId}` : ''), [batchId]);
  const pollAttempts = useRef(0);
  const pollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs to avoid stale closures inside API callbacks
  const batchIdRef = useRef<string>(batchId);
  useEffect(() => {
    batchIdRef.current = batchId;
  }, [batchId]);

  const storageKeyPollAttemptsRef = useRef<string>(storageKeyPollAttempts);
  useEffect(() => {
    storageKeyPollAttemptsRef.current = batchId ? `pollAttempts:${batchId}` : '';
  }, [batchId]);

  useEffect(() => {
    if (!batchId) return;
    try {
      const saved = getSessionWithExpiry<number>(batchId ? `pollAttempts:${batchId}` : '');
      pollAttempts.current = typeof saved === 'number' ? saved : 0;
    } catch (e) {
      pollAttempts.current = 0;
    }
  }, [batchId]);

  const [formData, setFormData] = useState<FormData>({
    paid_advertisements: {
      enabled: false,
      value: '',
    },
    productInfo: {
      enabled: false,
      value: '',
    },
    purchaseInfo: {
      enabled: false,
      value: '',
    },
    narration: {
      gender: SEX.Male,
      // soundType: narrationOptions[SEX.Male][0]?.actor_id,
      soundType: narrationOptions[SEX.Male][0].value,
    },
    viralVideo: false,
    viralText: false,
    subscribeAndLike: false,
    imageTemplate: '',
    hashtag: {
      enabled: false,
      value: [],
    },
    comment: {
      enabled: false,
      value: '',
    },
    audio: {
      name: {
        ko: '',
        en: '',
      },
      language: '',
      actor_id: '',
      img_url: '',
      actor_url: '',
      audio_url: '',
      video_url: '',
      unique_id: '',
      sex: [''],
      age: '',
      tag: [''],
      bookmark: false,
      hidden: false,
    },
  });
  const getDataTemplateVideo = useRef(
    new API(`/api/v1/maker/template_video`, 'GET', {
      success: (res, customData) => {
        setData(res?.data);
        setFormData({
          paid_advertisements: {
            enabled: !!res?.data?.is_paid_advertisements,
            value: res?.data?.comment_ads || '',
          },

          productInfo: {
            enabled: !!res?.data?.is_product_name,
            value: res?.data?.product_name || '',
          },
          purchaseInfo: {
            enabled: !!res?.data?.is_purchase_guide,
            value: res?.data?.purchase_guide || '',
          },
          narration: {
            // gender: narrationOptions[SEX.Male] && narrationOptions[SEX.Male].length > 0 ? SEX.Male : SEX.FMale,
            // soundType: firstNarration?.actor_id || '',
            gender: res?.data?.voice_gender,
            soundType: res?.data?.voice_id?.toString(),
          },
          viralVideo: !!res?.data?.is_video_hooking,
          viralText: !!res?.data?.is_caption_top,
          subscribeAndLike: !!res?.data?.is_caption_last,
          imageTemplate: res?.data?.image_template_id?.toString() || res?.data?.image_template?.[0]?.id?.toString(),
          hashtag: {
            enabled: !!res?.data?.is_hashtag,
            value: res?.data?.hashtag || [],
          },
          comment: {
            enabled: !!res?.data?.is_comment,
            value: res?.data?.comment || '',
          },
          audio: res?.data?.audios?.[0] || {},
        });
      },
      error: (err) => console.error('Failed to fetch get:', err),
      finally: () => {
        // setLoading(false);
      },
    }),
  );

  useEffect(() => {
    if (batchId) {
      setIsProduct(false);
      setFormData({
        ...formData,
        productInfo: { ...formData.productInfo, enabled: false },
      });

      getDataTemplateVideo.current.config.params = {
        batch_id: batchId,
      };
      const adsChecked = localStorage.getItem('adsChecked');
      getDataTemplateVideo.current.call({ adsChecked });

      getBatchByBatchIdAPI.current.setUrl(`/api/v1/maker/get-batch/${batchId}`);
      getBatchByBatchIdAPI.current.call({ batchId });
    }
  }, [batchId]);

  const createMakerAdvanceAPI = useRef(
    new API(`/api/v1/maker/create-batch`, 'POST', {
      success: (res) => {
        if (res?.code == 201) {
          showNoticeError(
            '⚠️ 외부 정책 제한으로</br>상품 정보를 불러오기 어렵네요.',
            '🔃 잠시 후 다시 시도하거나 다른 URL을 입력해 주세요. ☺️',
            false,
            '확인',
            '취소',
            () => {
              // setLoading(false);
              router.push('/');
            },
          );
          return;
        } else {
          const batchId = res?.data?.id;
          setSessionWithExpiry(`pollAttempts:${batchId}`, 1, TEN_MINUTES_MS);
          const url = new URL(window.location.origin + '/analys/advanced');
          url.searchParams.set('batchId', batchId);
          window.history.pushState(null, '', url.toString());

          setFormData({
            ...formData,
            productInfo: { ...formData.productInfo, value: res?.data?.product_name as string },
          });
        }
      },
      error: (err) => {
        showNoticeError(
          '⚠️ 외부 정책 제한으로</br>상품 정보를 불러오기 어렵네요.',
          '🔃 잠시 후 다시 시도하거나 다른 URL을 입력해 주세요. ☺️',
          false,
          '확인',
          '취소',
          () => {
            // setLoading(true);
            router.push('/');
          },
        );
        console.error('Failed to fetch posts:', err);
      },
      finally: () => {
        // setLoading(false);
      },
    }),
  );

  useEffect(() => {
    if (productUrl) {
      const adsChecked = localStorage.getItem('adsChecked');
      getDataTemplateVideo.current.call({ adsChecked });
      createMakerAdvanceAPI.current.config.data = {
        url: productUrl.trim(),
        is_advance: true,
      };
      createMakerAdvanceAPI.current.call();
    } else {
    }
  }, [productUrl]);

  const makeBatchImageAPI = useRef(
    new API(`/api/v1/maker/batch-make-image`, 'POST', {
      success: (res, dataSource) => {
        if (res?.code === 200) {
          const tmpPosts = res?.data;
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
          router.push(
            `/analys?batchId=${dataSource?.batchId}&post_video=${post_video_id}&post_image=${post_image_id}&post_blog=${post_blog_id}&type=advanced`,
          );
        } else {
          showNoticeError(
            '⚠️ 외부 정책 제한으로</br>상품 정보를 불러오기 어렵네요.',
            '🔃 잠시 후 다시 시도하거나 다른 URL을 입력해 주세요. ☺️',
            false,
            '확인',
            '취소',
            () => {
              setLoading(false);
            },
          );
        }
      },
      error: (err) => {
        // Swal.fire({
        //   title: 'Failed to make post',
        // });
      },
      finally: () => {},
    }),
  );

  const getBatchByBatchIdAPI = useRef(
    new API(`/api/v1/maker/get-batch/${batchId}`, 'GET', {
      success: (res, customData) => {
        if (cancelled.current) return; // don't do anything if cancelled

        const process_status = res?.data?.process_status;
        const created_at = res?.data?.created_at;

        if (created_at) {
          const createdTime = new Date(created_at);
          const currentTime = new Date();

          // So sánh thời gian hiện tại với thời gian tạo (currentTime - createdTime)
          const timeDiff = currentTime.getTime() - createdTime.getTime();
          const minutesDiff = timeDiff / (1000 * 60); // Chuyển đổi từ milliseconds sang phút

          if (minutesDiff >= 10) {
            stopPolling();
            showNoticeError(
              '⚠️ 외부 정책 제한으로</br>상품 정보를 불러오기 어렵네요.',
              '🔃 잠시 후 다시 시도하거나 다른 URL을 입력해 주세요. ☺️',
              false,
              '확인',
              '',
              () => router.push('/'),
            );
            return;
          }
        }

        if (process_status === 'CRAWLED') {
          stopPolling();
          setLoading(false);
          setIsProduct(true);

          setFormData((prev) => ({
            ...prev,
            productInfo: { ...prev.productInfo, value: res?.data?.product_name as string },
          }));
          return;
        } else if (process_status === 'FAILED') {
          stopPolling();
          showNoticeError(
            '⚠️ 외부 정책 제한으로</br>상품 정보를 불러오기 어렵네요.',
            '🔃 잠시 후 다시 시도하거나 다른 URL을 입력해 주세요. ☺️',
            false,
            '확인',
            '',
            () => router.push('/'),
          );
          return;
        }

        // keep polling
        pollAttempts.current += 1;
        if (storageKeyPollAttemptsRef.current) {
          try {
            setSessionWithExpiry(storageKeyPollAttemptsRef.current, pollAttempts.current, TEN_MINUTES_MS);
          } catch (e) {}
        }
        if (pollAttempts.current >= MAX_POLL_ATTEMPTS) {
          stopPolling();
          showNoticeError(res?.data?.message, res?.data?.error_message, false, '확인', '', () => router.push('/'));
          return;
        }

        const nextBatchId = customData?.batchId || batchIdRef.current;
        pollTimeout.current = setTimeout(() => {
          if (cancelled.current || !nextBatchId) return;
          getBatchByBatchIdAPI.current.setUrl(`/api/v1/maker/get-batch/${nextBatchId}`);
          getBatchByBatchIdAPI.current.call({ batchId: nextBatchId });
        }, TIME_RUN_BATCH);
      },
      error: (err) => {
        if (cancelled.current) return;
        console.error('Failed to fetch get:', err);
        stopPolling();
      },
    }),
  );

  const updateBatch = new API('/api/v1/maker/update_template_video_user', 'POST', {
    success: (res) => {
      if (res?.code == 200) {
        makeBatchImageAPI.current.config.data = {
          batch_id: batchId,
        };
        makeBatchImageAPI.current.call({ batchId: batchId });
        return;
      } else {
        showNoticeError(res?.message, '', false, '확인', '취소', () => {
          setLoading(false);
        });
        return;
      }
    },
    error: (err) => {
      console.log(err);
    },
    finally: () => {},
  });

  // Handle form submission
  const handleSubmit = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    showNotice(
      '✨ 콘텐츠 맞춤 설정을 마치셨나요?',
      '🚀 확인을 누르시면 바로 멋진 콘텐츠 제작을 시작할게요! 😃',
      true,
      '확인',
      '취소',
      async () => {
        updateBatch.config.data = {
          batch_id: batchId,
          is_paid_advertisements: formData?.paid_advertisements.enabled ? 1 : 0,
          comment_ads: formData?.paid_advertisements.value,
          is_product_name: formData?.productInfo.enabled ? 1 : 0,
          product_name: formData?.productInfo.value,
          is_purchase_guide: formData?.purchaseInfo?.enabled ? 1 : 0,
          purchase_guide: formData?.purchaseInfo?.value,
          voice_gender: formData?.narration.gender,
          voice_id: formData?.narration.soundType,
          is_video_hooking: formData?.viralVideo ? 1 : 0,
          is_caption_top: formData?.viralText ? 1 : 0,
          is_caption_last: formData?.subscribeAndLike ? 1 : 0,
          image_template_id: formData?.imageTemplate,
          is_hashtag: formData?.hashtag.enabled ? 1 : 0,
          hashtag: formData?.hashtag.value,
          is_comment: formData?.comment.enabled ? 1 : 0,
          comment: formData?.comment.value,
        };
        updateBatch.call();
      },
      undefined,
      () => {
        setLoading(false);
      },
    );
  };

  const onNarrationChange = (newVal: NarrationValue) => {
    if (!USER_SUBSCRIPTION.includes(user_login?.subscription || '')) {
      showNoticeError(
        '🥲 이 기능은 유료 요금제에서만 가능해요.',
        '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>고급 기능으로 완성도를 높일 수 있어요.',
        true,
        '확인',
        '취소',
        () => router.push('/rate-plan'),
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      narration: newVal,
    }));
  };
  const onChangeVoiceVideo = () => {
    if (!USER_SUBSCRIPTION.includes(user_login?.subscription || '')) {
      showNoticeError(
        '🥲 이 기능은 유료 요금제에서만 가능해요.',
        '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>고급 기능으로 완성도를 높일 수 있어요.',
        true,
        '확인',
        '취소',
        () => router.push('/rate-plan'),
      );
      return;
    }
  };

  const user_login = useSelector((state: RootState) => state.auth.user);

  const USER_SUBSCRIPTION = [
    'NEW_USER',
    'BASIC',
    'COUPON_BASIC',
    'STANDARD',
    'COUPON_STANDARD',
    'BUSINESS',
    'COUPON_BUSINESS',
  ];

  const USER_SUBSCRIPTION_STANDARD = ['STANDARD', 'COUPON_STANDARD', 'BUSINESS', 'COUPON_BUSINESS'];

  return (
    <Box
      sx={{
        px: { xs: 0, md: 5 },
        py: { xs: 0, md: '25px' },
        bgcolor: '#F8F8F8',
        width: '100%',
        xl: 'calc(100vw - 240px)',
      }}
    >
      <Typography
        component="div"
        sx={{
          position: { xs: 'sticky', sm: 'static' },
          top: { xs: 0, sm: 'auto' },
          zIndex: { xs: 50, sm: 'auto' },
          bgcolor: { xs: '#fff', sm: 'transparent' },
          fontSize: { xs: 16, sm: 30 },
          fontWeight: { xs: 600, sm: 700 },
          lineHeight: 1,
          color: '#090909',
          py: { xs: 2, sm: 1.5 },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        콘텐츠 맞춤 설정
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: 12, sm: 18 },
          fontWeight: { xs: 400, sm: 600 },
          color: '#A4A4A4',
          mt: { xs: 2, sm: 2.5 },
          mb: 1.5,
          textAlign: { xs: 'center', sm: 'left' },
          whiteSpace: { xs: 'pre-line', sm: 'nowrap' },
        }}
      >
        {'용도에 따라 상품과 잘 어울리는 옵션을 선택해 주세요. \n 미설정 시 기본 옵션 값으로 콘텐츠가 생성됩니다.😊'}
      </Typography>
      <Divider sx={{ mt: { xs: 6, sm: 0 }, display: { xs: 'none', sm: 'block' }, borderColor: '#F1F1F1' }} />

      <Container sx={{ px: { xs: '18px', sm: 0 }, pb: { xs: 20, sm: '0' } }} maxWidth="xl" disableGutters>
        <Box sx={{ maxWidth: 1379, mt: 2.5 }}>
          <Grid2 container spacing={{ xs: 0, md: 1.25 }}>
            <Grid2 size={{ xs: 12, md: 12 }}>
              {/* OptionItem: 유료 광고 표시 */}
              <Paper
                elevation={0}
                sx={{ bgcolor: '#fff', borderRadius: 1, py: { xs: 2.5, md: 3.25 }, px: { xs: 2.5, md: 3.75 } }}
              >
                <OptionItem
                  icon={<AdvancedIcon />}
                  title="유료 광고 표시"
                  description="유튜브와 공식 제휴한 comment에 표시됩니다."
                  switchValue={formData.paid_advertisements.enabled}
                  placeholder="이 포스팅은 쿠팡 파트너스, 알리, 네이버 등 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
                  onSwitchChange={(checked) => {
                    setFormData({
                      ...formData,
                      paid_advertisements: { enabled: checked, value: formData.paid_advertisements.value as string },
                    });
                    localStorage.setItem('adsChecked', checked ? '1' : '0');
                  }}
                  inputType={'text'}
                  inputValue={formData.paid_advertisements.value}
                  onInputChange={(val) =>
                    setFormData({
                      ...formData,
                      paid_advertisements: { ...formData.paid_advertisements, value: val as string },
                    })
                  }
                  inputGrow
                  maxLength={255}
                  tooltipContainer={
                    <Box
                      sx={{
                        width: { xs: '100%', md: '453px' },
                        p: { xs: 2, md: 2.75 },
                        border: '2px solid #4776EF',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: '--var(font-pretendard)',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          lineHeight: '19px',
                          color: '#4776EF',
                        }}
                      >
                        유료 광고 표시 예시
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '--var(font-pretendard)',
                          fontSize: '14px',
                          mt: 2.5,
                          mb: 1.5,
                          color: '#686868',
                        }}
                      >
                        설정 시 코멘트 앞에 사용자가 작성한 수익성 문구가 표기되며, <br />
                        #광고 해시태그 추가, 블로그 본문에 수익 활동 문구가 추가됩니다.
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                          sx={{
                            width: { xs: '200px', md: '242px' },
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={'/images/products/paid_advertisements_tooltip.png'}
                            alt={'tooltip-1'}
                            width={242}
                            height={430}
                            quality={100}
                            objectFit={'cover'}
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '10px',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  }
                />
              </Paper>

              {/* 고정 문구 표시 */}
              <Paper
                elevation={0}
                sx={{ bgcolor: '#fff', borderRadius: 1, py: { xs: 2.5, md: 3.25 }, px: { xs: 2.5, md: 3.75 }, mt: 2.5 }}
              >
                <OptionItem
                  icon={<IconText />}
                  title="고정 문구 표시"
                  hasSwitch
                  switchValue={formData.comment.enabled}
                  placeholder="👆프로필 클릭하고 단 24시간 특가받기👆, 💌비즈니스 문의는 프로필 링크를 클릭해 주세요., ❤️ 리뷰 영상에 진심을 담습니다 :) ❤️"
                  onSwitchChange={(checked: boolean) => {
                    setFormData((prev) => ({
                      ...prev,
                      comment: { ...prev.comment, enabled: checked },
                    }));
                  }}
                  inputType={'text'}
                  inputValue={formData.comment.value}
                  onInputChange={(val) =>
                    setFormData({
                      ...formData,
                      comment: { ...formData.comment, value: val as string },
                    })
                  }
                  maxLength={255}
                  inputGrow
                  tooltipContainer={
                    <Box
                      sx={{
                        width: { xs: '100%', md: '453px' },
                        p: { xs: 2, md: 2.75 },
                        border: '2px solid #4776EF',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: '--var(font-pretendard)',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          lineHeight: '19px',
                          color: '#4776EF',
                        }}
                      >
                        고정 문구 표시 예시
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '--var(font-pretendard)',
                          fontSize: '14px',
                          mt: 2.5,
                          mb: 1.5,
                          color: '#686868',
                        }}
                      >
                        설정 시 AI가 자동으로 분석해준 코멘트 앞에 <br />
                        사용자가 작성한 문구가 표시됩니다.
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                          sx={{
                            width: { xs: '200px', md: '242px' },
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={'/images/products/comment_tooltip.png'}
                            alt={'tooltip-1'}
                            width={242}
                            height={430}
                            quality={100}
                            objectFit={'cover'}
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '10px',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  }
                />
              </Paper>

              {/* 고정 해시태그 */}
              <Paper
                elevation={0}
                sx={{ bgcolor: '#fff', borderRadius: 1, py: { xs: 2.5, md: 3.25 }, px: { xs: 2.5, md: 3.75 }, mt: 2.5 }}
              >
                <OptionItem
                  icon={<IconHashtag />}
                  title="고정 해시태그"
                  hasSwitch
                  switchValue={formData.hashtag.enabled}
                  onSwitchChange={(checked: boolean) => {
                    // Nếu bật mà không có quyền → chặn + popup + revert
                    if (!USER_SUBSCRIPTION.includes(user_login?.subscription || '')) {
                      showNoticeError(
                        '🥲 이 기능은 유료 요금제에서만 가능해요.',
                        '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>고급 기능으로 완성도를 높일 수 있어요.',
                        true,
                        '확인',
                        '취소',
                        () => router.push('/rate-plan'),
                      );

                      setFormData((prev) => ({
                        ...prev,
                        hashtag: { ...prev.hashtag, enabled: false },
                      }));
                      return;
                    }

                    // Hợp lệ → cập nhật bình thường
                    setFormData((prev) => ({
                      ...prev,
                      hashtag: { ...prev.hashtag, enabled: checked },
                    }));
                  }}
                  inputType="hashtag"
                  inputValue={formData.hashtag.value}
                  onInputChange={(val) =>
                    setFormData({
                      ...formData,
                      hashtag: { ...formData.hashtag, value: val as string[] },
                    })
                  }
                  placeholder="#해시태그 입력(최대 3개)"
                  maxLength={3}
                  inputGrow
                  tooltipContainer={
                    <Box
                      sx={{
                        width: { xs: '100%', md: '453px' },
                        p: { xs: 2, md: 3.75 },
                        border: '2px solid #4776EF',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: '--var(font-pretendard)',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          lineHeight: '19px',
                          color: '#4776EF',
                        }}
                      >
                        고정 해시태그 표시 예시
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '--var(font-pretendard)',
                          fontSize: '14px',
                          mt: 2.5,
                          mb: 3,
                          color: '#686868',
                        }}
                      >
                        설정 시 코멘트 뒷 분에 사용자가 작성한 해시태그가 추가됩니다.
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                          sx={{
                            width: { xs: '200px', md: '242px' },
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={'/images/products/hashtag_tooltip.png'}
                            alt={'tooltip-1'}
                            width={242}
                            height={430}
                            quality={100}
                            objectFit={'cover'}
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '10px',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  }
                />
              </Paper>

              {/* VIDEO OPTION */}
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: '29px',
                  color: '#272727',
                  mt: '60px',
                  mb: 2.5,
                }}
              >
                VIDEO OPTION
              </Typography>

              {/* 제품 정보 */}
              <Paper
                elevation={0}
                sx={{ bgcolor: '#fff', borderRadius: 1, py: { xs: 2.5, md: 3.25 }, px: { xs: 2.5, md: 3.75 }, mt: 2.5 }}
              >
                <OptionItem
                  icon={<IconProductInfo />}
                  title="제품 정보"
                  description="영상 제품의 출처와 상품명을 작성해 주세요."
                  inputType={'text'}
                  placeholder="미작성 시, 제품 정보가 표시되지 않습니다.(최대 10자)"
                  // switchValue={formData.productInfo.enabled}
                  switchValue={isProduct && formData.productInfo.enabled}
                  isLoading={loading}
                  hasSwitch={true}
                  onSwitchChange={(checked: boolean) => {
                    // Nếu bật mà không có quyền → chặn + popup + revert
                    if (!USER_SUBSCRIPTION.includes(user_login?.subscription || '')) {
                      showNoticeError(
                        '🥲 이 기능은 유료 요금제에서만 가능해요.',
                        '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>고급 기능으로 완성도를 높일 수 있어요.',
                        true,
                        '확인',
                        '취소',
                        () => router.push('/rate-plan'),
                      );

                      setFormData((prev) => ({
                        ...prev,
                        productInfo: { ...prev.productInfo, enabled: false },
                      }));
                      return;
                    }

                    // Hợp lệ → cập nhật bình thường
                    setFormData((prev) => ({
                      ...prev,
                      productInfo: { ...prev.productInfo, enabled: checked },
                    }));
                  }}
                  inputValue={formData.productInfo.value}
                  onInputChange={(value) => {
                    setFormData({
                      ...formData,
                      productInfo: { ...formData.productInfo, value: value as string },
                    });
                  }}
                  inputGrow
                  maxLength={10}
                  tooltipContainer={
                    <Box
                      sx={{
                        width: { xs: '100%', md: '453px' },
                        p: { xs: 2, md: 3.75 },
                        border: '2px solid #4776EF',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'pretendard',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          lineHeight: '19px',
                          color: '#4776EF',
                        }}
                      >
                        제품 정보 예시
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'pretendard',
                          fontSize: '14px',
                          mt: 2.5,
                          mb: 3,
                          height: '34px',
                          color: '#686868',
                        }}
                      >
                        영상 좌상단에 들어가는 제품명 안내 이미지입니다.
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                          sx={{
                            width: { xs: '200px', md: '242px' },
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={'/images/products/preview-2.png'}
                            alt={'tooltip-2'}
                            width={242}
                            height={430}
                            quality={100}
                            objectFit={'cover'}
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '10px',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  }
                />
              </Paper>

              {/* 구매 정보 안내 */}
              <Paper
                elevation={0}
                sx={{ bgcolor: '#fff', borderRadius: 1, py: { xs: 2.5, md: 3.25 }, px: { xs: 2.5, md: 3.75 }, mt: 2.5 }}
              >
                <OptionItem
                  icon={<IconShopCart />}
                  title="구매 정보 안내"
                  description="상품 구매자 상품 구매 안내 문구를 작성해 주세요."
                  inputType={'text'}
                  placeholder="예시: 구매링크는 프로필 확인(최대 12자)"
                  switchValue={formData.purchaseInfo.enabled}
                  onSwitchChange={(checked: boolean) => {
                    if (!USER_SUBSCRIPTION.includes(user_login?.subscription || '')) {
                      showNoticeError(
                        '🥲 이 기능은 유료 요금제에서만 가능해요.',
                        '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>고급 기능으로 완성도를 높일 수 있어요.',
                        true,
                        '확인',
                        '취소',
                        () => router.push('/rate-plan'),
                      );
                      setFormData((prev) => ({
                        ...prev,
                        purchaseInfo: { ...prev.purchaseInfo, enabled: false },
                      }));
                      return;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      purchaseInfo: { ...prev.purchaseInfo, enabled: checked },
                    }));
                  }}
                  inputValue={formData.purchaseInfo.value}
                  onInputChange={(value) => {
                    setFormData({
                      ...formData,
                      purchaseInfo: { ...formData.purchaseInfo, value: value as string },
                    });
                  }}
                  inputGrow
                  maxLength={12}
                  tooltipContainer={
                    <TooltipPreview
                      title="구매 정보 안내 예시"
                      description="영상 우상단과 영상 마지막 가운데에 제품 구매 정보가 표시됩니다."
                    />
                  }
                />
              </Paper>

              {/* 나레이션 설정 */}
              <NarrationSetting
                narrationOptions={narrationOptions}
                value={formData.narration}
                subscription={user_login?.subscription || ''}
                onChange={onNarrationChange}
                onVoiceChange={onChangeVoiceVideo}
                disabled={!USER_SUBSCRIPTION.includes(user_login?.subscription || '')}
              />

              {/* Video Preview Section */}
              <Grid2 container spacing={2.5} sx={{ mt: 2.5 }}>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <VideoPreview
                    video={data?.video_hooks}
                    title="바이럴 영상"
                    description="영상 시작과 끝에 짧은 바이럴 클립이 삽입됩니다."
                    value={formData.viralVideo}
                    onChange={(checked) => {
                      if (
                        !['STANDARD', 'COUPON_STANDARD', 'BUSINESS', 'COUPON_BUSINESS'].includes(
                          user_login?.subscription || '',
                        )
                      ) {
                        showNoticeError(
                          '💡 스탠다드·비즈니스 플랜 전용 기능이에요!',
                          '현재 이용 중인 요금제에서는 사용할 수 없어요. 😊',
                          true,
                          '확인',
                          '취소',
                          () => router.push('/payment?package=STANDARD'),
                        );
                        setFormData({ ...formData, viralVideo: false });
                        return;
                      }
                      setFormData({ ...formData, viralVideo: checked });
                    }}
                    isStandard={true}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <VideoPreview
                    video={data?.viral_messages}
                    title="바이럴 문구"
                    description="영상 위에 바이럴 문구가 표시됩니다."
                    value={formData.viralText}
                    onChange={(checked) => {
                      if (!USER_SUBSCRIPTION_STANDARD.includes(user_login?.subscription || '')) {
                        showNoticeError(
                          '💡 스탠다드·비즈니스 플랜 전용 기능이에요!',
                          '현재 이용 중인 요금제에서는 사용할 수 없어요. 😊',
                          true,
                          '확인',
                          '취소',
                          () => router.push('/payment?package=STANDARD'),
                        );
                        setFormData({ ...formData, viralText: false });
                        return;
                      }
                      setFormData({ ...formData, viralText: checked });
                    }}
                    type={'image'}
                    isStandard={true}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <VideoPreview
                    video={[{ video_url: data?.subscribe_video || '', duration: 1, video_name: 's&l' }]}
                    title="구독 & 좋아요"
                    description="영상 끝에 구독과 좋아요 안내 문구가 표시됩니다."
                    value={formData.subscribeAndLike}
                    onChange={(checked) => {
                      if (!USER_SUBSCRIPTION_STANDARD.includes(user_login?.subscription || '')) {
                        showNoticeError(
                          '🥲 이 기능은 유료 요금제에서만 가능해요.',
                          '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>고급 기능으로 완성도를 높일 수 있어요.',
                          true,
                          '확인',
                          '취소',
                          () => router.push('/rate-plan'),
                        );
                        setFormData({ ...formData, subscribeAndLike: false });
                        return;
                      }
                      setFormData({ ...formData, subscribeAndLike: checked });
                    }}
                  />
                </Grid2>
              </Grid2>

              {/* IMAGE OPTION */}
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: '29px',
                  color: '#272727',
                  mt: '60px',
                  mb: 2.5,
                }}
              >
                IMAGE OPTION
              </Typography>

              {/* 표지 템플릿 설정 */}
              <Paper sx={{ bgcolor: '#fff', borderRadius: 1, mt: 2.5 }} elevation={0}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: { xs: 2.5, md: 3.25 },
                    px: { xs: 2.5, md: 3.75 },
                    borderBottom: { xs: 'none', sm: '2px solid #F1F1F1' },
                  }}
                >
                  <IconImage className="w-6 aspect-square md:w-[30px]" />
                  <Typography sx={{ fontSize: { xs: '14px', md: '16px' }, fontWeight: 'bold', color: '#272727' }}>
                    표지 템플릿 설정
                  </Typography>
                </Box>

                <FormControl
                  component="fieldset"
                  sx={{ width: '100%', pb: 3.75, pt: { xs: 0, sm: 3.75 }, px: { xs: 2.5, md: 10.75 } }}
                >
                  <RadioGroup
                    row
                    name="image-template"
                    value={formData.imageTemplate.toString()}
                    onChange={(e) => {
                      if (!USER_SUBSCRIPTION_STANDARD.includes(user_login?.subscription || '')) {
                        showNoticeError(
                          '🥲 이 기능은 유료 요금제에서만 가능해요.',
                          '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>고급 기능으로 완성도를 높일 수 있어요.',
                          true,
                          '확인',
                          '취소',
                          () => router.push('/rate-plan'),
                        );
                        return;
                      }
                      setFormData({ ...formData, imageTemplate: e.target.value });
                    }}
                  >
                    <Grid2 container spacing={{ xs: '26px', md: 1.25 }}>
                      {data?.image_template?.map((image) => (
                        <Grid2 key={image.id} size={4}>
                          <FormControlLabel
                            value={image.id.toString()}
                            control={<Radio size="small" sx={{ p: 0, mx: 1, '&.Mui-checked': { color: '#4776EF' } }} />}
                            label={
                              <Typography
                                sx={{
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  lineHeight: '17px',
                                  color:
                                    formData.imageTemplate.toString() === image.id.toString() ? '#4776EF' : '#686868',
                                }}
                              >
                                {image.template_name}
                              </Typography>
                            }
                            sx={{ mb: 1.25 }}
                          />
                          <Image
                            src={image.template_image || '/placeholder.svg'}
                            alt={`${image.name} - ${image.template_name}`}
                            width={242}
                            height={302}
                            quality={100}
                            style={{ borderRadius: isMobile ? 4 : 10 }}
                          />
                        </Grid2>
                      ))}
                    </Grid2>
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid2>
          </Grid2>
        </Box>
      </Container>

      {!isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <CustomButton
            variant="contained"
            sx={{
              borderRadius: '9999px',
              py: '13px',
              fontWeight: 'semibold',
              width: '212px',
              padding: '0 !important',
              height: '50px',
            }}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <Image
                src="/images/home/loading-dot.gif"
                width={100}
                height={50}
                alt="loading"
                className="object-cover"
              />
            ) : (
              <Typography className="text-[16px] font-medium text-white">내 스타일로 시작하기</Typography>
            )}
          </CustomButton>
        </Box>
      )}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            bgcolor: 'white',
            width: '100%',
            gap: '10px',
            padding: '8px 18px 20px',
            zIndex: 50,
          }}
        >
          <CustomButton
            variant="contained"
            sx={{
              borderRadius: '6px',
              height: '50px',
              width: '100%',
            }}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <Image src="/images/home/loading-dot.gif" width={92} height={46} alt="loading" />
            ) : (
              <Typography className="text-[16px] font-medium text-white">내 스타일로 시작하기</Typography>
            )}
          </CustomButton>
        </Box>
      )}
    </Box>
  );
}
