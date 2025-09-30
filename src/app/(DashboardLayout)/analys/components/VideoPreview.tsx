'use client';

import React, { useRef, useState } from 'react';
import { Box, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material';
import { CustomSwitch } from '@/app/components/common/CustomSwitch';
import { NextSlideIconV2, PreviousSlideIconV2 } from '@/utils/icons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

interface VideoPreviewProps {
  title: string;
  description: string;
  value: boolean;
  video?: {
    duration: number;
    video_name: string;
    video_url: string;
  }[];
  onChange: (checked: boolean) => void;
  type?: string;
  isStandard?: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  video,
  title,
  description,
  value,
  onChange,
  type,
  isStandard,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const swiperRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <Box className="relative w-full bg-white rounded-lg" sx={{ p: { xs: 2.5, sm: '30px' } }}>
      {/* header */}
      <Box className="flex items-center mb-2">
        <Typography className="text-base leading-[19px] font-pretendard font-bold mr-1.5" color="#272727">
          {title}
        </Typography>

        {isStandard && (
          <Box sx={{ position: 'relative', display: 'inline-block', height: 28, minWidth: 113 }}>
            {/* Nền gradient mờ */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '999px',
                background: 'linear-gradient(270deg, #8D87F3 0%, #AB87F3 100%)',
                opacity: 0.15,
                zIndex: 0,
              }}
            />
            {/* Nội dung */}
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.75,
                borderRadius: '999px',
                height: 28,
                minWidth: 113,
                zIndex: 1,
                gap: 0.5,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.00065 12.333C2.81176 12.333 2.65354 12.269 2.52599 12.141C2.39843 12.013 2.33443 11.8548 2.33399 11.6663C2.33354 11.4779 2.39754 11.3197 2.52599 11.1917C2.65443 11.0637 2.81265 10.9997 3.00065 10.9997H11.0007C11.1895 10.9997 11.348 11.0637 11.476 11.1917C11.604 11.3197 11.6678 11.4779 11.6673 11.6663C11.6669 11.8548 11.6029 12.0132 11.4753 12.1417C11.3478 12.2701 11.1895 12.3339 11.0007 12.333H3.00065ZM3.46732 9.99967C3.1451 9.99967 2.8591 9.89412 2.60932 9.68301C2.35954 9.4719 2.20665 9.20523 2.15065 8.88301L1.48399 4.64968C1.46176 4.64968 1.43687 4.65256 1.40932 4.65834C1.38176 4.66412 1.35665 4.66679 1.33399 4.66634C1.05621 4.66634 0.820208 4.56923 0.625986 4.37501C0.431764 4.18079 0.33443 3.94456 0.333986 3.66634C0.333541 3.38812 0.430875 3.15212 0.625986 2.95834C0.821097 2.76456 1.0571 2.66723 1.33399 2.66634C1.61087 2.66545 1.8471 2.76279 2.04265 2.95834C2.23821 3.1539 2.33532 3.3899 2.33399 3.66634C2.33399 3.74412 2.32554 3.81634 2.30865 3.88301C2.29176 3.94968 2.27243 4.01079 2.25065 4.06634L4.33399 4.99968L6.41732 2.14968C6.2951 2.06079 6.1951 1.94412 6.11732 1.79968C6.03954 1.65523 6.00065 1.49968 6.00065 1.33301C6.00065 1.05523 6.09799 0.819009 6.29265 0.624343C6.48732 0.429676 6.72332 0.332565 7.00065 0.333009C7.27799 0.333454 7.51421 0.430787 7.70932 0.625009C7.90443 0.819232 8.00154 1.05523 8.00065 1.33301C8.00065 1.49968 7.96176 1.65523 7.88399 1.79968C7.80621 1.94412 7.70621 2.06079 7.58399 2.14968L9.66732 4.99968L11.7507 4.06634C11.7284 4.01079 11.7089 3.94968 11.692 3.88301C11.6751 3.81634 11.6669 3.74412 11.6673 3.66634C11.6673 3.38856 11.7647 3.15234 11.9593 2.95768C12.154 2.76301 12.39 2.6659 12.6673 2.66634C12.9447 2.66679 13.1809 2.76412 13.376 2.95834C13.5711 3.15257 13.6682 3.38856 13.6673 3.66634C13.6664 3.94412 13.5693 4.18034 13.376 4.37501C13.1827 4.56968 12.9464 4.66679 12.6673 4.66634C12.6451 4.66634 12.6202 4.66368 12.5927 4.65834C12.5651 4.65301 12.54 4.65012 12.5173 4.64968L11.8507 8.88301C11.7951 9.20523 11.6424 9.4719 11.3927 9.68301C11.1429 9.89412 10.8567 9.99967 10.534 9.99967H3.46732Z"
                  fill="url(#paint0_linear_11621_7763)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_11621_7763"
                    x1="1.86176"
                    y1="0.333006"
                    x2="15.0919"
                    y2="4.09167"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4776EF" />
                    <stop offset="1" stopColor="#AD50FF" />
                  </linearGradient>
                </defs>
              </svg>

              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  background: 'linear-gradient(104.34deg, #4776EF 9.13%, #AD50FF 94.52%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  lineHeight: '14px',
                }}
              >
                스탠다드 전용
              </Typography>
            </Box>
          </Box>
        )}

        <Box className="flex-grow" />
        <CustomSwitch checked={value} onChange={(e) => onChange(e.target.checked)} color="primary" />
      </Box>

      {/* description */}
      <Typography className="text-sm font-pretendard" color="#686868">
        {description}
      </Typography>

      {/* carousel only if desktop OR đã expand trên mobile */}
      {(!isMobile || expanded) && (
        <Box className="overflow-hidden mt-30">
          {currentIndex > 0 && (
            <IconButton className="absolute top-[45%] left-0 z-10" onClick={handlePrev}>
              <PreviousSlideIconV2 />
            </IconButton>
          )}
          {currentIndex < (video?.length ?? 1) - 1 && (
            <IconButton className="absolute top-[45%] right-0 z-10" onClick={handleNext}>
              <NextSlideIconV2 />
            </IconButton>
          )}
          <Box className="flex-none h-full">
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(s) => setCurrentIndex(s.activeIndex)}
              initialSlide={0}
              touchRatio={1}
              spaceBetween={0}
              slidesPerView={1}
              navigation={false}
              height={100}
              className="h-full"
            >
              {video?.map((item, idx) => (
                <SwiperSlide
                  key={item.video_name || idx}
                  className="w-full h-full bg-white bg-opacity-50 cursor-pointer"
                >
                  {type === 'image' ? (
                    <Image
                      src={item.video_url}
                      alt="icon"
                      className="mx-auto rounded-[10px]"
                      height={430}
                      width={242}
                    />
                  ) : item.video_url ? (
                    <video
                      controls
                      autoPlay
                      muted
                      playsInline
                      loop
                      className="w-[242px] mx-auto aspect-[9/16] rounded-[10px] object-cover"
                    >
                      <source src={item.video_url} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={`/images/home/blankVideo.png`}
                      alt="blankVideo"
                      className="mx-auto rounded-[10px]"
                      height={430}
                      width={242}
                      style={{ height: 'auto' }}
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      )}

      {/* nút toggle trên mobile */}
      {isMobile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: '15px',
            cursor: 'pointer',
          }}
          onClick={() => setExpanded((e) => !e)}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#6A6A6A', mr: 0 }}>
            {expanded ? '접기' : '펼쳐보기'}
          </Typography>
          <Icon
            icon="iconamoon:arrow-up-2-bold"
            style={{
              width: 24,
              height: 24,
              color: '#6A6A6A',
              aspectRatio: '1/1',
              transform: `rotate(${expanded ? 0 : 180}deg)`,
              transition: 'transform 0.3s ease-in-out',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default VideoPreview;
