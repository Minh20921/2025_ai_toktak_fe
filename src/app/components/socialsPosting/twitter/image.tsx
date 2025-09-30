'use client';
import { useRef, useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { CloseIcon, MoreIcon } from '@/utils/icons/icons';
import { IconBookmark, IconComment, IconHeart, IconUpload, RepeatIcon, IconSend } from '@/utils/icons/engagements';
import { formatTimeNow } from '@/utils/helper/time';
import { Twitter } from '@/utils/icons/socials';

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  type: number;
}

export default function TwitterImage({ data, open, onClose, type }: FacebookProps) {
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <>
      <Modal className="w-screen flex items-center justify-center" open={loading} onClose={() => setLoading(false)}>
        <CircularProgress />
      </Modal>
      <Modal open={open} onClose={onClose} aria-labelledby="facebook-instagram-modal">
        <Box className="absolute inset-0">
          {/* Close Button */}
          <IconButton className="absolute top-2 right-2" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[1164px] bg-white shadow-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch h-dvh sm:h-[90vh]">
              <div className="flex sm:hidden items-center justify-center p-2 border-b border-[#EEEEEE]">
                <Twitter className="text-black" />
                <IconButton className="sm:hidden absolute top-4 right-2 z-[9999]" onClick={onClose}>
                  <CloseIcon fill="#000" width={24} height={24} />
                </IconButton>
              </div>
              {/* Media Content */}
              <div className="w-[800px] px-20 bg-[#090909] relative">
                {/* Ẩn nút Prev nếu là ảnh đầu tiên */}
                {currentIndex > 0 && (
                  <IconButton className="absolute top-1/2 left-5 z-10" onClick={handlePrev}>
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12.7158L19 12.7158M5 12.7158L11 6.71582M5 12.7158L11 18.7158"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </IconButton>
                )}
                {/* Ẩn nút Next nếu là ảnh cuối cùng */}
                {currentIndex < (data?.images?.length ?? 1) - 1 && (
                  <IconButton className="absolute top-1/2 right-5 z-10" onClick={handleNext}>
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 12.7158L5 12.7158M19 12.7158L13 18.7158M19 12.7158L13 6.71582"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </IconButton>
                )}
                <Box className="flex-none h-full relative">
                  <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                    initialSlide={0}
                    touchRatio={1}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={false}
                    height={100}
                    className="h-full"
                  >
                    {data?.images?.map((image: string, index: number) => (
                      <SwiperSlide
                        key={image || index}
                        className="w-full h-full bg-gray-800 bg-opacity-50 cursor-pointer"
                      >
                        <Image
                          src={image || '/images/home/blankImg.png'}
                          fill
                          className="object-cover h-full py-1"
                          alt={image || 'News Image'}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </div>

              {/* Content and Controls */}
              <div className="w-full sm:w-[364px] flex flex-col p-3 sm:p-0">
                <Box className="flex items-center justify-between pt-[14px] px-[14px]">
                  <div className="flex items-center gap-4">
                    <Avatar src={'/images/rank/Rank-1.png?height=38&width=38'} />
                    <div>
                      <Typography
                        className="font-pretendard text-sm font-bold leading-[16.71px] uppercase"
                        color="#272727"
                      >
                        TOKTAK
                      </Typography>
                      <Typography className="font-pretendard text-sm leading-[16.71px] uppercase" color="#A4A4A4">
                        @TOKTAK
                      </Typography>
                    </div>
                  </div>
                  <IconButton>
                    <MoreIcon />
                  </IconButton>
                </Box>
                <Box className="flex items-start justify-start gap-9 pt-3 px-[14px]">
                  <Box style={{ wordBreak: 'break-word' }}>
                    <Typography className="font-pretendard text-sm leading-[20px]" color="#272727">
                      {data?.description}
                    </Typography>
                    <Typography className="font-pretendard text-sm leading-[20px] mt-5 flex-grow overflow-y-auto">
                      {data?.hashtag
                        ?.split('#')
                        .filter(Boolean)
                        .map((has, index) => (
                          <a key={index} className="hover:underline text-link">
                            #{has.trim()}{' '}
                          </a>
                        ))}
                    </Typography>
                    <Typography
                      className="hidden sm:block font-pretendard text-base leading-[19.09px] mt-[60px]"
                      color="#878787"
                    >
                      {formatTimeNow()} • 4,928Views
                    </Typography>
                  </Box>
                </Box>
                <Box className="hidden sm:flex items-center justify-between px-[14px] mt-5 py-[16.08px] border-y border-[#EEEEEE]">
                  <Box className="flex items-center gap-2">
                    <IconComment className="text-[#A4A4A4]" />
                    <Typography className="text-xs" color="#878787">
                      0
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <RepeatIcon className="text-[#A4A4A4]" />
                    <Typography className="text-xs" color="#878787">
                      0
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <IconHeart className="text-[#A4A4A4]" />
                    <Typography className="text-xs" color="#878787">
                      0
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <IconBookmark className="text-[#A4A4A4]" />
                    <Typography className="text-xs" color="#878787">
                      0
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <IconUpload className="text-[#A4A4A4]" />
                  </Box>
                </Box>
              </div>
              <div className="sm:hidden w-[calc(100%-60px)] relative h-full mt-[10px] mb-[30px] border border-[#EEEEEE] rounded-2xl mx-[30px]">
                <Swiper
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                  initialSlide={0}
                  touchRatio={1}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation={false}
                  height={100}
                  className="h-full w-[221px]"
                >
                  {data?.images?.map((image: string, index: number) => (
                    <SwiperSlide
                      key={image || index}
                      className="w-full h-full bg-gray-800 bg-opacity-50 cursor-pointer"
                    >
                      <Image
                        src={image || '/images/home/blankImg.png'}
                        fill
                        className="object-cover h-full"
                        alt={image || 'News Image'}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
