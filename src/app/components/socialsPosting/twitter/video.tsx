'use client';
import { useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { CloseIcon, MoreIcon } from '@/utils/icons/icons';
import { Twitter } from '@/utils/icons/socials';
import { IconComment, IconHeart, IconSend } from '@/utils/icons/engagements';

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  type: number;
}

export default function TwitterVideo({ data, open, onClose, type }: FacebookProps) {
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
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[498px] h-dvh sm:h-[95vh] bg-white shadow-lg overflow-hidden">
            <div className="flex items-center justify-center p-2 border-b border-[#EEEEEE]">
              <Twitter className="text-black" />
              <IconButton className="sm:hidden absolute top-4 right-2 z-[9999]" onClick={onClose}>
                <CloseIcon fill="#000" width={24} height={24} />
              </IconButton>
            </div>
            <div className="flex flex-col flex-1 p-6 sm:p-5 h-[calc(100%-70px)] overflow-y-scroll">
              {/* Content and Controls */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
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
                </div>
                <Box className="flex items-start justify-start gap-9 ">
                  <Box style={{ wordBreak: 'break-word' }}>
                    <Typography className="font-pretendard mt-3 text-sm" color="#272727">
                      {data?.description}
                    </Typography>
                    <Typography className="font-pretendard text-sm flex-grow overflow-y-auto mt-5">
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
              {/* Media Content */}
              <div className="w-full relative h-full mt-[20px] sm:mt-[85px] border border-[#EEEEEE] rounded-2xl">
                {data?.video_url ? (
                  <Box className="relative w-[258px] mx-auto h-full flex-none border rounded-[14.72px] border-[#EFEFEF]">
                    <video
                      playsInline
                      autoPlay
                      muted
                      loop
                      controlsList="nodownload"
                      className="absolute inset-0 mx-auto w-[258px] h-full object-cover"
                    >
                      <source src={data?.video_url} type="video/mp4" />
                    </video>
                    <Box className="flex flex-col gap-2 absolute bottom-[20px] -right-0">
                      <IconButton>
                        <IconHeart className="text-[#FFFFFF]" />
                      </IconButton>
                      <IconButton>
                        <IconComment className="text-[#FFFFFF]" />
                      </IconButton>
                      <IconButton>
                        <IconSend className="text-[#FFFFFF]" />
                      </IconButton>
                      <IconButton>
                        <MoreIcon className="text-[#FFFFFF]" />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <Image src={`/images/home/blankVideo.png`} alt="icon" height={458} width={258} style={{ width: 'auto' }}/>
                )}
              </div>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
