'use client';
import { useRef, useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Modal, Tab, Tabs, Typography } from '@mui/material';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { CloseIcon } from '@/utils/icons/icons';
import {
  IconBookmarkDark,
  IconChatDark,
  IconHeartDark,
  IconShareDark,
  IconAvatarWithBorder,
} from '@/utils/icons/engagements';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  type: number;
}

export default function TikTokImage({ data, open, onClose, type }: FacebookProps) {
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const pagination = {
    el: '.swiper-custom-pagination',
    clickable: true,
    renderBullet: (index: number, className: string) => `<span class="${className}"></span>`,
  };
  const navigation = {
    prevEl: '.swiper-custom-button-prev',
    nextEl: '.swiper-custom-button-next',
  };

  return (
    <>
      <style jsx global>{`
        .swiper-custom-pagination {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .swiper-custom-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          margin: 0;
          background: white;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .swiper-custom-pagination .swiper-pagination-bullet-active {
          opacity: 1;
          width: 8px;
          height: 8px;
        }

        .swiper-custom-button-prev,
        .swiper-custom-button-next {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .swiper-custom-button-prev:hover,
        .swiper-custom-button-next:hover {
          background: rgba(255, 255, 255, 0.9);
          color: #000000;
        }

        .swiper-custom-button-prev svg,
        .swiper-custom-button-next svg {
          width: 14px;
          height: 14px;
        }
      `}</style>
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
            <div className="flex flex-col sm:flex-row items-stretch !h-dvh sm:h-[90vh]">
              {/* Media Content */}
              <div className="sm:w-[800px] sm:px-20 bg-[#090909] relative">
                <Box className="sm:hidden absolute bottom-[20px] left-0 pr-[90px] sm:pr-0 z-[9999]">
                  <Box className="flex items-center justify-between pt-[14px] pl-[14px]">
                    <div className="flex items-center gap-4">
                      <Typography
                        className="font-pretendard text-sm font-bold leading-[16.71px] uppercase"
                        color="#FFFFFF"
                      >
                        TOKTAK
                      </Typography>
                    </div>
                  </Box>
                  <Box className="flex items-start justify-start gap-9 pl-[14px] pt-3">
                    <Box style={{ wordBreak: 'break-word' }}>
                      <Typography className="font-pretendard text-sm leading-[16.71px]" color="#FFFFFF">
                        {data?.title}{' '}
                        {data?.hashtag
                          ?.split('#')
                          .filter(Boolean)
                          .map((has, index) => <a key={index}>#{has.trim()} </a>)}
                      </Typography>
                      <Typography className="font-pretendard text-xs leading-3 mt-[14px]" color="#FFFFFF">
                        LA LA LAND(Part1) - Official Sound Studio
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="sm:hidden absolute flex flex-col items-center mt-5 gap-2.5 z-[9999] right-3 bottom-[100px]">
                  <Box className="flex flex-col items-center gap-2">
                    <IconAvatarWithBorder />
                    <IconHeartDark fill="#fff" />
                    <Typography className="text-xs font-medium" color="#fff">
                      4445
                    </Typography>
                  </Box>
                  <Box className="flex flex-col items-center gap-2">
                    <IconChatDark fill="#fff" />
                    <Typography className="text-xs font-medium" color="#fff">
                      64
                    </Typography>
                  </Box>
                  <Box className="justify-items-center">
                    <IconButton className="flex flex-col mb-1 gap-1">
                      <IconShareDark fill="#fff" />
                    </IconButton>
                    <Typography className="text-[10px] leading-3" color="#fff">
                      Share
                    </Typography>
                  </Box>
                </Box>
                <Box className="flex-none h-dvh sm:h-full relative">
                  <IconButton className="absolute top-2 right-2 sm:hidden z-[9999]" onClick={onClose}>
                    <CloseIcon width={28} height={28} />
                  </IconButton>
                  <Swiper
                    pagination={pagination}
                    navigation={navigation}
                    modules={[Pagination, Navigation]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                    initialSlide={0}
                    touchRatio={1}
                    spaceBetween={0}
                    slidesPerView={1}
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
                  {/* Custom pagination container with navigation buttons */}
                  <div className="absolute w-full bottom-4 flex items-center justify-center gap-4 z-10">
                    <div className="swiper-custom-button-prev">
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 1.71582L1 6.21582L5 10.7158"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="swiper-custom-pagination !w-fit"></div>
                    <div className="swiper-custom-button-next">
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M1 1.71582L5 6.21582L1 10.7158"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </Box>
              </div>

              {/* Content and Controls */}
              <div className="hidden w-[364px] sm:flex flex-col p-[14px]">
                <Box className="p-[14px] pb-5 bg-[#F8F8F8]">
                  <Box className="flex items-center justify-between">
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
                          보다플레이AI • 3-05
                        </Typography>
                      </div>
                    </div>
                  </Box>
                  <Box className="flex items-start justify-start gap-9 pt-3">
                    <Box style={{ wordBreak: 'break-word' }}>
                      <Typography className="font-pretendard text-sm leading-[20px]" color="#272727">
                        {data?.title}
                      </Typography>
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
                      <Typography className="font-pretendard text-[10px] leading-[11.93px] mt-5" color="#272727">
                        LA LA LAND(Part1) - Official Sound Studio
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="flex items-center mt-5 gap-2.5">
                  <Box className="flex items-center gap-2">
                    <IconHeartDark />
                    <Typography className="text-xs font-medium" color="#6A6A6A">
                      0
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <IconChatDark />
                    <Typography className="text-xs font-medium" color="#6A6A6A">
                      0
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <IconBookmarkDark />
                    <Typography className="text-xs font-medium" color="#6A6A6A">
                      0
                    </Typography>
                  </Box>
                </Box>
                <Box className="mt-5">
                  <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{
                      '& .MuiTab-root': {
                        minWidth: '50%',
                        padding: '8px 16px',
                        fontSize: '14px',
                        textTransform: 'none',
                      },
                      '& .Mui-selected': {
                        color: '#272727 !important',
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#272727',
                      },
                    }}
                  >
                    <Tab label="댓글 (0)" />
                    <Tab label="크리에이터 동영상" />
                  </Tabs>
                </Box>
              </div>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
