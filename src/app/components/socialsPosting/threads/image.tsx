'use client';
import { useRef, useState } from 'react';
import {
  Divider,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { CloseIcon, MoreIcon } from '@/utils/icons/icons';
import { Threads } from '@/utils/icons/socials';
import { IconComment, IconHeart } from '@/utils/icons/engagements';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IconRepeat } from '@tabler/icons-react';

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  type: number;
}

export default function ThreadsImage({ data, open, onClose, type }: FacebookProps) {
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[892px] h-dvh sm:h-[800px] bg-white shadow-lg overflow-hidden">
            <div className="relative flex items-center justify-center p-2 border-b border-[#EEEEEE]">
              <Threads className="text-black" />
              <IconButton className="sm:hidden absolute top-4 right-2 z-[9999]" onClick={onClose}>
                <CloseIcon fill="#000" width={24} height={24} />
              </IconButton>
            </div>
            <div className="flex flex-col flex-1 py-4 h-[calc(100%-70px)] overflow-y-scroll">
              {/* Content and Controls */}
              <div className="flex flex-col">
                <div className="flex items-start justify-between px-5 sm:px-30">
                  <div className="flex items-start gap-2.5">
                    <Avatar src={'/images/rank/Rank-1.png?height=38&width=38'} />
                    <div className="flex flex-col">
                      <div className={'flex items-center gap-2.5'}>
                        <Typography
                          className="font-pretendard text-sm font-bold leading-[16.71px] uppercase"
                          color="#272727"
                        >
                          TOKTAK
                        </Typography>
                        <Typography className="font-pretendard text-sm leading-[16.71px] uppercase" color="#A4A4A4">
                          19시간 전
                        </Typography>
                      </div>
                      <Box className="flex items-start justify-start gap-9 ">
                        <Box style={{ wordBreak: 'break-word' }}>
                          <Typography
                            className="font-pretendard mt-3 text-sm"
                            color="#272727"
                            dangerouslySetInnerHTML={{
                              __html: data?.description || '',
                            }}
                          />
                          <Typography className="font-pretendard text-sm flex-grow overflow-y-auto mt-[18px]">
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
                    </div>
                  </div>
                  <IconButton className="hidden sm:block">
                    <MoreIcon />
                  </IconButton>
                </div>
              </div>
              {/* Media Content */}
              <div className="w-full sm:h-[500px] relative mt-30 pl-[70px] pr-[20px] sm:pl-[80px] sm:pr-0">
                <Box className="flex-none sm:h-full relative">
                  <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    initialSlide={0}
                    touchRatio={1}
                    spaceBetween={20}
                    slidesPerView={isMobile ? 1 : 2}
                    height={100}
                    className="h-full"
                  >
                    {data?.images?.map((image: string, index: number) => (
                      <SwiperSlide key={image || index} className="w-full sm:h-full cursor-pointer">
                        <Image
                          src={image || '/images/home/blankImg.png'}
                          width={400}
                          height={500}
                          className="object-contain sm:object-cover sm:h-full sm:py-1 rounded-[10px] sm:rounded-none"
                          alt={image || 'News Image'}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
                <Box className="flex items-center gap-30 mt-5">
                  <IconHeart color={isMobile ? '#000' : '#A4A4A4'} />
                  <IconComment color={isMobile ? '#000' : '#A4A4A4'} />
                  <IconRepeat color={isMobile ? '#000' : '#A4A4A4'} />
                  <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.3668 14.3446C11.1677 14.1459 10.9305 13.9896 10.6693 13.885L2.40891 10.5725C2.31028 10.5329 2.22612 10.4642 2.16772 10.3754C2.10932 10.2866 2.07948 10.1821 2.0822 10.0758C2.08492 9.96958 2.12008 9.86672 2.18295 9.78103C2.24581 9.69535 2.33339 9.63096 2.43391 9.59648L22.2256 2.82565C22.3179 2.79231 22.4178 2.78595 22.5135 2.80731C22.6093 2.82866 22.697 2.87686 22.7664 2.94625C22.8358 3.01564 22.884 3.10336 22.9054 3.19914C22.9267 3.29492 22.9204 3.39481 22.887 3.48711L16.1162 23.2788C16.0817 23.3793 16.0173 23.4669 15.9316 23.5297C15.846 23.5926 15.7431 23.6278 15.6369 23.6305C15.5306 23.6332 15.4261 23.6034 15.3373 23.545C15.2485 23.4866 15.1797 23.4024 15.1402 23.3038L11.8277 15.0413C11.7226 14.7803 11.5659 14.5434 11.3668 14.3446ZM11.3668 14.3446L22.7631 2.95065"
                      stroke={isMobile ? '#000' : '#A4A4A4'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
