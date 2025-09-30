'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Box, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from './SampleTemplatesSwiper.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

interface SampleTemplate {
  id: string;
  iframe?: string;
  image?: string;
}

interface SampleTemplatesSwiperProps {
  sampleTemplates: SampleTemplate[];
  currentIndex: number;
  onSlideChange: (index: number) => void;
}

const DEFAULT_IMAGE = '/images/home/default-sample.png';
const DEFAULT_VIDEO = '/videos/home/default-video.mp4';

const SampleTemplatesSwiper: React.FC<SampleTemplatesSwiperProps> = ({
  sampleTemplates,
  currentIndex,
  onSlideChange,
}) => {
  const swiperRef = useRef<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State để track video loading errors và loading states
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [videoLoading, setVideoLoading] = useState<Set<string>>(new Set());

  // Handle video error
  const handleVideoError = (videoId: string) => {
    setVideoErrors((prev) => new Set(prev).add(videoId));
    setVideoLoading((prev) => {
      const newSet = new Set(prev);
      newSet.delete(videoId);
      return newSet;
    });
  };

  // Handle video load start
  const handleVideoLoadStart = (videoId: string) => {
    setVideoLoading((prev) => new Set(prev).add(videoId));
  };

  // Handle video load success
  const handleVideoLoadSuccess = (videoId: string) => {
    setVideoLoading((prev) => {
      const newSet = new Set(prev);
      newSet.delete(videoId);
      return newSet;
    });
  };

  // Handle image error
  const handleImageError = (imageIndex: number) => {
    setImageErrors((prev) => new Set(prev).add(imageIndex.toString()));
  };

  // Reset errors when sampleTemplates change
  useEffect(() => {
    setVideoErrors(new Set());
    setImageErrors(new Set());
    setVideoLoading(new Set());
  }, [sampleTemplates]);

  return (
    <Swiper
      modules={[Autoplay, Navigation]}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      initialSlide={currentIndex}
      touchRatio={1}
      spaceBetween={isMobile ? 10 : 20}
      slidesPerView={isMobile ? 3.3 : 7}
      loop={true}
      speed={500}
      navigation={false}
      centeredSlides={true}
      style={{
        padding: '50px 0 30px',
        display: 'flex',
        gap: isMobile ? '5px' : '10px',
        justifyContent: 'flex-end',
        maxHeight: isMobile ? '500px' : '550px',
      }}
    >
      {sampleTemplates.map((item, index) => {
        const videoId = `sample_video_${item.id}`;
        const imageIndex = index + 1;
        const hasVideoError = videoErrors.has(videoId);
        const hasImageError = imageErrors.has(imageIndex.toString());
        const isVideoLoading = videoLoading.has(videoId);

        return (
          <SwiperSlide
            key={`sample_${index}`}
            style={{
              position: 'relative',
              cursor: 'pointer',
              backgroundColor: '#FFFFFF',
              width: '100%',
              height: '80%',
              aspectRatio: '9/19',
              borderRadius: '8px',
              boxShadow: '0px 1.8px 13.53px 0px #0000001A',
              overflow: 'hidden',
              transform: `scale(${index === currentIndex ? '1.1' : '1'})`,
              transition: 'transform 0.3s ease-in-out',
              transformOrigin: 'bottom center',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            {item.iframe && !hasVideoError ? (
              <Box
                sx={{
                  mx: 'auto',
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '9/19',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  pb: { xs: 1, sm: 2 },
                }}
              >
                <Image
                  src={hasImageError ? DEFAULT_IMAGE : `/images/home/sample_${imageIndex}.png`}
                  alt={`Sample template ${imageIndex}`}
                  fill
                  className={styles['home-sample-image']}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    objectFit: 'cover',
                    width: '100%',
                  }}
                  loading="lazy"
                  quality={100}
                  priority={index === 0}
                  onError={() => handleImageError(imageIndex)}
                />
                {isVideoLoading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1,
                    }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                )}
                <video
                  id={videoId}
                  src={item.iframe}
                  width={index === currentIndex + 3 ? 255 : 190}
                  style={{
                    border: 'none',
                    width: '100% !important',
                    height: 'auto !important',
                    maxWidth: '100% !important',
                    aspectRatio: '9/16',
                    display: 'block',
                    margin: '0 auto',
                    borderRadius: '8px',
                  }}
                  className={`w-full ${isVideoLoading ? styles['video-loading'] : styles['video-loaded']} ${hasVideoError ? styles['video-error'] : ''}`}
                  muted
                  playsInline
                  autoPlay
                  loop
                  onLoadStart={() => handleVideoLoadStart(videoId)}
                  onCanPlay={() => handleVideoLoadSuccess(videoId)}
                  onError={() => handleVideoError(videoId)}
                  onAbort={() => handleVideoError(videoId)}
                />
              </Box>
            ) : (
              <Image
                src={hasImageError ? DEFAULT_IMAGE : `/images/home/sample_${imageIndex}.png`}
                alt={`Sample template ${imageIndex}`}
                fill
                className={`${styles['home-sample-image']} ${styles['home-sample-image-tooltip']}`}
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  margin: '0 auto',
                  width: '100%',
                  objectFit: 'cover',
                  boxShadow: '0px 1.8px 13.53px 0px #0000001A',
                }}
                quality={100}
                priority={index === 0}
                onError={() => handleImageError(imageIndex)}
              />
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default SampleTemplatesSwiper;
