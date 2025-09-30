import React, { useRef, useState } from 'react';
import { Box, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material';
import { NextSlideIconV2, PreviousSlideIconV2 } from '@/utils/icons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

const TooltipPreview: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const swiperRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  return (
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
        {title}
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
        {description}
      </Typography>
      <Box sx={{ overflow: 'hidden', mt: 3.75, position: 'relative' }}>
        {currentIndex > 0 && (
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              zIndex: 10,
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
            onClick={handlePrev}
          >
            <PreviousSlideIconV2 />
          </IconButton>
        )}
        {currentIndex < 1 && (
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              right: 0,
              zIndex: 10,
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
            onClick={handleNext}
          >
            <NextSlideIconV2 />
          </IconButton>
        )}
        <Box sx={{ flex: 'none', height: '100%' }}>
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            initialSlide={0}
            touchRatio={1}
            spaceBetween={0}
            slidesPerView={1}
            navigation={false}
            height={100}
            style={{ height: '100%' }}
          >
            <SwiperSlide
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: { xs: '200px', md: '242px' },
                  margin: '0 auto',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={'/images/products/preview-3.png'}
                  alt={'tooltip-3'}
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
            </SwiperSlide>
            <SwiperSlide
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: { xs: '200px', md: '242px' },
                  margin: '0 auto',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Image
                  src={'/images/products/preview-4.png'}
                  alt={'tooltip-3.1'}
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
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: '60px', md: '80px' },
                    left: { xs: '20px', md: '30px' },
                    transform: 'rotate(30deg)',
                    width: { xs: '80px', md: '103px' },
                    height: { xs: '80px', md: '103px' },
                  }}
                >
                  <Image
                    src={'/images/products/arrow.gif'}
                    alt={'tooltip-3-gif'}
                    width={103}
                    height={103}
                    quality={100}
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </Box>
              </Box>
            </SwiperSlide>
          </Swiper>
        </Box>
      </Box>
    </Box>
  );
};

export default TooltipPreview;
