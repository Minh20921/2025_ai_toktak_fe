'use client';
import React, { useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Modal, Tab, Tabs, Typography } from '@mui/material';
import Image from 'next/image';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { CloseIcon } from '@/utils/icons/icons';
import {
  IconBookmarkDark,
  IconChatDark,
  IconHeartDark,
  IconShareDark,
  IconAvatarWithBorder,
} from '@/utils/icons/engagements';

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  type: number;
}

export default function TikTokVideo({ data, open, onClose, type }: FacebookProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
            <div className="flex flex-col sm:flex-row items-stretch !h-dvh sm:h-[90vh]">
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
              {/* Media Content */}
              <div className="sm:w-[800px] sm:px-20 bg-[#090909] relative">
                <Box className="relative sm:w-[450px] mx-auto h-dvh sm:h-full gap-[23.11px]">
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
                        className="absolute inset-0 mx-auto w-full h-full object-contain sm:object-cover sm:py-1"
                      >
                        <source src={data?.video_url} type="video/mp4" />
                      </video>
                    </Box>
                  ) : (
                    <Image src={`/images/home/blankVideo.png`} alt="icon" height={800} width={450} style={{ width: 'auto' }}/>
                  )}
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
                <Box className="hidden sm:flex items-center mt-5 gap-2.5">
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
