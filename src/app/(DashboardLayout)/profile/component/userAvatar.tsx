import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { NextSlideIconV2, PreviousSlideIconV2 } from '@/utils/icons/icons';
import Image from 'next/image';

const UserAvatar = ({ avatarList = [] }: { avatarList: any[] }) => {
  const swiperRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAvatarList, setCurrentAvatarList] = useState<any[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (avatarList?.length > 1) {
      const tmpIndex = avatarList.length - 2;
      setCurrentIndex(tmpIndex);
      swiperRef.current?.slideTo?.(tmpIndex);
    }
    setCurrentAvatarList(avatarList);
  }, [avatarList]);

  const handlePrev = () => swiperRef.current?.slidePrev?.();
  const handleNext = () => swiperRef.current?.slideNext?.();

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: '100%', sm: 300, md: 400, lg: 477 },
        height: { xs: 461, sm: 500, md: 600, lg: 694 },
        boxShadow: { xs: '0px 0px 7.14px 0px #0000000D', sm: 'initial' },
        flexShrink: 0,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Previous Button */}
      {currentIndex > 0 && (
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            top: '45%',
            left: { xs: 1, sm: 2 },
            zIndex: 10,
          }}
        >
          <PreviousSlideIconV2 />
        </IconButton>
      )}

      {/* Next Button */}
      {currentIndex < (avatarList?.length ?? 1) - 1 && (
        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            top: '45%',
            right: { xs: 1, sm: 2 },
            zIndex: 10,
          }}
        >
          <NextSlideIconV2 />
        </IconButton>
      )}

      <Box sx={{ width: '100%', height: '100%' }}>
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          initialSlide={currentIndex}
          touchRatio={1}
          spaceBetween={0}
          slidesPerView={1}
          navigation={false}
          style={{ width: '100%', height: '100%' }}
        >
          {currentAvatarList?.map((avatar, index) => (
            <SwiperSlide key={index}>
              <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                <Image
                  src={avatar.url || '/images/home/blankImg.png'}
                  alt="User Avatar"
                  fill
                  sizes="(max-width: 600px) 100vw, 477px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default UserAvatar;
