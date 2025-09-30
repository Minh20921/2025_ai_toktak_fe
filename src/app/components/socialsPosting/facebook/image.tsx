'use client';
import { useRef, useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import {
  CloseIcon,
  MessengerIcon,
  MoreIcon,
  NextSlideIcon,
  NotionIcon,
  PreviousSlideIcon,
  SubwayMenuIcon,
} from '@/utils/icons/icons';
import { getFormattedDate } from '@/utils/helper/time';
import { IconCall, IconComment, IconLike, IconShare } from '@/utils/icons/engagements';

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  type: number;
}

export default function FacebookImage({ data, open, onClose, type }: FacebookProps) {
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
            <div className="flex flex-col sm:flex-row items-stretch h-screen sm:h-[90vh]">
              {/* Media Content */}
              <div className="w-full h-[60vh] sm:h-full sm:w-[800px] sm:px-20 bg-[#090909] relative order-2 sm:order-1">
                {/* Ẩn nút Prev nếu là ảnh đầu tiên */}
                {currentIndex > 0 && (
                  <IconButton className="absolute top-1/2 left-5 z-10" onClick={handlePrev}>
                    <PreviousSlideIcon />
                  </IconButton>
                )}
                {/* Ẩn nút Next nếu là ảnh cuối cùng */}
                {currentIndex < (data?.images?.length ?? 1) - 1 && (
                  <IconButton className="absolute top-1/2 right-5 z-10" onClick={handleNext}>
                    <NextSlideIcon />
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
                        className="w-full h-full sm:bg-gray-800 bg-opacity-50 cursor-pointer"
                      >
                        <Image
                          src={image || '/images/home/blankImg.png'}
                          fill
                          className="object-contain sm:object-cover sm:py-1 sm:h-full"
                          alt={image || 'News Image'}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </div>

              {/* Content and Controls */}
              <div className="h-[40vh] sm:h-full sm:w-[364px] flex flex-col order-1 sm:order-2 p-3 sm:p-0">
                <Box className="hidden sm:flex gap-2.5 justify-end items-center py-2.5 border-y border-[#EEEEEE] pr-[14px]">
                  <SubwayMenuIcon />
                  <MessengerIcon />
                  <NotionIcon />
                  <Image src={'/images/rank/Rank-1.png'} alt={'user-rank'} width={38} height={38} />
                </Box>
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
                      <Typography className="font-pretendard text-sm leading-[16.71px]" color="#A4A4A4">
                        {getFormattedDate()}
                      </Typography>
                    </div>
                  </div>
                  <IconButton>
                    <MoreIcon className="hidden sm:block" />
                    <CloseIcon className="sm:hidden absolute -top-6 -right-4" width={28} height={28} fill="#000" onClick={onClose}/>
                  </IconButton>
                </Box>
                <Box className="flex items-start justify-start gap-9 px-[14px] pt-3">
                  <Box style={{ wordBreak: 'break-word' }}>
                  <Typography
                      className="font-pretendard text-sm leading-[20px]"
                      color="#272727"
                      dangerouslySetInnerHTML={{
                        __html: data?.description || '',
                      }}
                    />
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
                  </Box>
                </Box>
                <Box className="hidden sm:flex items-center justify-between py-[14px] px-[28px] mt-[60px] border-y border-[#EEEEEE]">
                  <IconLike />
                  <IconComment />
                  <IconCall />
                  <IconShare />
                </Box>
              </div>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
