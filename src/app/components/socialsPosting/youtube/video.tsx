'use client';
import { useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { CloseIcon, MoreIcon } from '@/utils/icons/icons';
import { IconCommentDark, IconLikeDark, IconShareDark } from '@/utils/icons/engagements';

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  type: number;
}

export default function YoutubeVideo({ data, open, onClose, type }: FacebookProps) {
  const [loading, setLoading] = useState(false);
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
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[954px] sm:h-[800px] bg-white shadow-lg overflow-hidden sm:p-5">
            <Box className="hidden sm:flex gap-2 mb-5 items-center text-[#272727]">
              <svg width="35" height="25" viewBox="0 0 35 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.75974 23.8935C9.65875 24.1047 13.6058 24.2104 17.4952 24.2104C21.3846 24.2104 25.3316 24.1047 29.2403 23.8935C32.3518 23.8358 34.5894 21.627 34.695 18.5155C35.0984 14.3284 35.0984 10.074 34.7143 5.89653L34.695 5.68526C34.599 2.58333 32.3518 0.384132 29.2403 0.316908C25.3412 0.105631 21.3942 0 17.5048 0C13.6154 0 9.66835 0.105631 5.75974 0.316908C2.6482 0.374529 0.410593 2.58333 0.304955 5.69486L0.285748 5.89653C-0.0983917 10.0837 -0.098392 14.3284 0.304955 18.5251C0.400989 21.6174 2.6482 23.8262 5.75974 23.8935ZM22.9706 12.3115L13.8281 7.16406V17.459L22.9706 12.3115Z"
                  fill="#272727"
                />
              </svg>
              <Typography className="text-base leading-[19.09px] font-bold font-pretendard">YouTube</Typography>
            </Box>
            <div className="flex flex-row gap-[108px] items-stretch sm:h-[calc(100%-87px)] sm:mt-2">
              {/* Media Content */}
              <div className="w-full sm:w-1/2 relative">
                <Box className="relative w-full h-dvh sm:w-[403px] sm:h-[716px] gap-[23.11px]">
                  <IconButton className="absolute top-2 right-2 sm:hidden z-[9999]" onClick={onClose}>
                    <CloseIcon width={28} height={28} />
                  </IconButton>
                  {data?.video_url ? (
                    <Box className="relative w-full h-full flex-none">
                      <video
                        controls={false}
                        playsInline
                        autoPlay
                        loop
                        controlsList="nodownload"
                        className="absolute inset-0 mx-auto w-full h-full object-cover sm:rounded-[10px]"
                      >
                        <source src={data?.video_url} type="video/mp4" />
                      </video>
                      <Box className="absolute bottom-[20px] left-0 pr-[90px] sm:pr-0">
                        <Box className="flex items-center justify-between pt-[14px] pl-[14px]">
                          <div className="flex items-center gap-4">
                            <Avatar src={'/images/rank/Rank-1.png?height=38&width=38'} />
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
                      <Box className="flex flex-col gap-2 absolute bottom-4 sm:bottom-0 right-4 sm:-right-14">
                        <Box className="justify-items-center">
                          <IconButton className="flex flex-col bg-[#F4F4F4] mb-1 gap-1">
                            <IconLikeDark />
                          </IconButton>
                          <Typography className="text-[10px] leading-3" color="#272727">
                            0
                          </Typography>
                        </Box>
                        <Box className="justify-items-center">
                          <IconButton className="flex flex-col bg-[#F4F4F4] mb-1 gap-1">
                            <IconLikeDark className="rotate-180" />
                          </IconButton>
                          <Typography className="text-[10px] leading-3" color="#272727">
                            싫어요
                          </Typography>
                        </Box>
                        <Box className="justify-items-center">
                          <IconButton className="flex flex-col bg-[#F4F4F4] mb-1 gap-1">
                            <IconCommentDark />
                          </IconButton>
                          <Typography className="text-[10px] leading-3" color="#272727">
                            0
                          </Typography>
                        </Box>
                        <Box className="justify-items-center">
                          <IconButton className="flex flex-col bg-[#F4F4F4] mb-1 gap-1">
                            <IconShareDark />
                          </IconButton>
                          <Typography className="text-[10px] leading-3" color="#272727">
                            공유
                          </Typography>
                        </Box>
                        <Box className="justify-items-center">
                          <IconButton className="flex flex-col bg-[#F4F4F4] sm:bg-transparent mb-1 gap-1 w-[38px] h-[38px]">
                            <MoreIcon className="rotate-90 text-[#272727]" />
                          </IconButton>
                        </Box>
                        <IconButton>
                          <Avatar src={'/images/rank/Rank-1.png?height=38&width=38'} />
                        </IconButton>
                      </Box>
                    </Box>
                  ) : (
                    <Image src={`/images/home/blankVideo.png`} alt="icon" height={800} width={450} style={{ width: 'auto' }}/>
                  )}
                </Box>
              </div>

              {/* Content and Controls */}
              <div className="w-1/2 relative hidden sm:block">
                <div className="w-[403px] flex flex-col h-[716px] border border-[#EEEEEE] rounded-[10px]">
                  <Box style={{ wordBreak: 'break-word' }}>
                    <Typography
                      className="font-pretendard font-bold text-base leading-[19.09px] border-b border-[#EEEEEE] py-[18px] px-5"
                      color="#272727"
                    >
                      설명
                    </Typography>
                    <Typography className="font-pretendard text-sm leading-[20px] flex-grow overflow-y-auto py-[18px] px-5">
                      {data?.description}
                      {data?.hashtag
                        ?.split('#')
                        .filter(Boolean)
                        .map((has, index) => <a key={index}>#{has.trim()} </a>)}
                    </Typography>
                  </Box>
                </div>
              </div>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
