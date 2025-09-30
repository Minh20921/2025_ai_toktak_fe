'use client';
import { useRef, useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { CloseIcon, MoreIcon, NextSlideIcon, PreviousSlideIcon } from '@/utils/icons/icons';
import { IconComment, IconHeart } from '@/utils/icons/engagements';
import { getFormattedDate } from '@/utils/helper/time';

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  type: number;
}

export default function InstagramImage({ data, open, onClose, type }: FacebookProps) {
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
              <Box className="flex items-center justify-between py-[14px] px-[14px] sm:hidden">
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
                  <CloseIcon className="absolute -top-2 right-0" width={28} height={28} fill="#000" onClick={onClose} />
                </IconButton>
              </Box>
              {/* Media Content */}
              <div className="w-full sm:w-[640px] h-[50vh] sm:h-auto bg-[#090909] relative">
                {/* Ẩn nút Prev nếu là ảnh đầu tiên */}
                {currentIndex > 0 && (
                  <IconButton className="absolute top-[45%] left-5 z-10" onClick={handlePrev}>
                    <PreviousSlideIcon />
                  </IconButton>
                )}
                {/* Ẩn nút Next nếu là ảnh cuối cùng */}
                {currentIndex < (data?.images?.length ?? 1) - 1 && (
                  <IconButton className="absolute top-[45%] right-5 z-10" onClick={handleNext}>
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
                          className="object-contain sm:object-cover h-full sm:py-1"
                          alt={image || 'News Image'}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </div>

              {/* Content and Controls */}
              <div className="sm:w-[524px] flex flex-col relative">
                <Box className="hidden sm:flex items-center justify-between pt-2 pb-2.5 px-4 border-b border-[#EEEEEE]">
                  <div className="flex items-center gap-4">
                    <div className="relative inline-flex w-11 h-11">
                      {/* Gradient border */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 p-[3px]">
                        <div className="h-full w-full rounded-full bg-white"></div>
                      </div>
                      {/* Content */}
                      <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full">
                        <Avatar src={'/images/rank/Rank-1.png?height=36&width=36'} />
                      </div>
                    </div>
                    <div>
                      <Typography
                        className="font-pretendard text-sm font-bold leading-[16.71px] uppercase"
                        color="#272727"
                      >
                        TOKTAK
                      </Typography>
                    </div>
                  </div>
                  <IconButton>
                    <MoreIcon />
                  </IconButton>
                </Box>
                <Box className="sm:hidden w-full flex items-center justify-between py-[13px] px-[18px]">
                  <Box className="flex items-center gap-4">
                    <IconHeart color={'#272727'} />
                    <IconComment color={'#272727'} />
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11.3668 13.6317C11.1677 13.433 10.9305 13.2767 10.6693 13.1721L2.40891 9.85963C2.31028 9.82006 2.22612 9.75126 2.16772 9.66247C2.10932 9.57369 2.07948 9.46916 2.0822 9.36292C2.08492 9.25669 2.12008 9.15383 2.18295 9.06814C2.24581 8.98246 2.33339 8.91806 2.43391 8.88359L22.2256 2.11276C22.3179 2.07942 22.4178 2.07306 22.5135 2.09442C22.6093 2.11577 22.697 2.16397 22.7664 2.23336C22.8358 2.30275 22.884 2.39047 22.9054 2.48625C22.9267 2.58203 22.9204 2.68192 22.887 2.77422L16.1162 22.5659C16.0817 22.6664 16.0173 22.754 15.9316 22.8168C15.846 22.8797 15.7431 22.9149 15.6369 22.9176C15.5306 22.9203 15.4261 22.8905 15.3373 22.8321C15.2485 22.7737 15.1797 22.6895 15.1402 22.5909L11.8277 14.3284C11.7226 14.0674 11.5659 13.8305 11.3668 13.6317ZM11.3668 13.6317L22.7631 2.23776"
                        stroke="#272727"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Box>
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.16797 5.20703C4.16797 4.37823 4.49721 3.58337 5.08326 2.99732C5.66931 2.41127 6.46417 2.08203 7.29297 2.08203H17.7096C18.5384 2.08203 19.3333 2.41127 19.9193 2.99732C20.5054 3.58337 20.8346 4.37823 20.8346 5.20703V21.9029C20.8346 23.1737 19.3971 23.9133 18.3638 23.1747L12.5013 18.9872L6.6388 23.1747C5.60443 23.9143 4.16797 23.1747 4.16797 21.9039V5.20703ZM7.29297 4.16536C7.0167 4.16536 6.75175 4.27511 6.5564 4.47046C6.36105 4.66581 6.2513 4.93076 6.2513 5.20703V20.8914L11.593 17.0758C11.858 16.8864 12.1756 16.7846 12.5013 16.7846C12.827 16.7846 13.1446 16.8864 13.4096 17.0758L18.7513 20.8914V5.20703C18.7513 4.93076 18.6416 4.66581 18.4462 4.47046C18.2509 4.27511 17.9859 4.16536 17.7096 4.16536H7.29297Z"
                      fill="#272727"
                    />
                  </svg>
                </Box>
                <Box className="flex items-start justify-start gap-3 py-2.5 px-4">
                  <div className="relative flex-none hidden sm:inline-flex w-11 h-11">
                    {/* Gradient border */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 p-[3px]">
                      <div className="h-full w-full rounded-full bg-white"></div>
                    </div>
                    {/* Content */}
                    <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full">
                      <Avatar src={'/images/rank/Rank-1.png?height=36&width=36'} />
                    </div>
                  </div>
                  <Box style={{ wordBreak: 'break-word' }}>
                    <Typography
                      className="font-pretendard text-sm leading-[20px]"
                      color="#272727"
                      dangerouslySetInnerHTML={{
                        __html: data?.description || '',
                      }}
                    />
                    <Typography className="font-pretendard text-sm leading-[20px] mt-1.5 flex-grow overflow-y-auto">
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
                <Box className="hidden absolute bottom-[15%] w-full sm:flex items-center justify-between py-[13px] px-[18px] border-t border-[#EEEEEE]">
                  <Box className="flex items-center gap-4">
                    <IconHeart color={'#272727'} />
                    <IconComment color={'#272727'} />
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11.3668 13.6317C11.1677 13.433 10.9305 13.2767 10.6693 13.1721L2.40891 9.85963C2.31028 9.82006 2.22612 9.75126 2.16772 9.66247C2.10932 9.57369 2.07948 9.46916 2.0822 9.36292C2.08492 9.25669 2.12008 9.15383 2.18295 9.06814C2.24581 8.98246 2.33339 8.91806 2.43391 8.88359L22.2256 2.11276C22.3179 2.07942 22.4178 2.07306 22.5135 2.09442C22.6093 2.11577 22.697 2.16397 22.7664 2.23336C22.8358 2.30275 22.884 2.39047 22.9054 2.48625C22.9267 2.58203 22.9204 2.68192 22.887 2.77422L16.1162 22.5659C16.0817 22.6664 16.0173 22.754 15.9316 22.8168C15.846 22.8797 15.7431 22.9149 15.6369 22.9176C15.5306 22.9203 15.4261 22.8905 15.3373 22.8321C15.2485 22.7737 15.1797 22.6895 15.1402 22.5909L11.8277 14.3284C11.7226 14.0674 11.5659 13.8305 11.3668 13.6317ZM11.3668 13.6317L22.7631 2.23776"
                        stroke="#272727"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Box>
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.16797 5.20703C4.16797 4.37823 4.49721 3.58337 5.08326 2.99732C5.66931 2.41127 6.46417 2.08203 7.29297 2.08203H17.7096C18.5384 2.08203 19.3333 2.41127 19.9193 2.99732C20.5054 3.58337 20.8346 4.37823 20.8346 5.20703V21.9029C20.8346 23.1737 19.3971 23.9133 18.3638 23.1747L12.5013 18.9872L6.6388 23.1747C5.60443 23.9143 4.16797 23.1747 4.16797 21.9039V5.20703ZM7.29297 4.16536C7.0167 4.16536 6.75175 4.27511 6.5564 4.47046C6.36105 4.66581 6.2513 4.93076 6.2513 5.20703V20.8914L11.593 17.0758C11.858 16.8864 12.1756 16.7846 12.5013 16.7846C12.827 16.7846 13.1446 16.8864 13.4096 17.0758L18.7513 20.8914V5.20703C18.7513 4.93076 18.6416 4.66581 18.4462 4.47046C18.2509 4.27511 17.9859 4.16536 17.7096 4.16536H7.29297Z"
                      fill="#272727"
                    />
                  </svg>
                </Box>
              </div>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
