'use client';
import { useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { CloseIcon, MessengerIcon, MoreIcon, NotionIcon, SubwayMenuIcon } from '@/utils/icons/icons';
import { getFormattedDate } from '@/utils/helper/time';
import { IconComment, IconLike, IconShare } from '@/utils/icons/engagements';

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  type: number;
}

export default function FacebookVideo({ data, open, onClose, type }: FacebookProps) {
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
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[1164px] bg-white shadow-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch h-screen sm:h-[90vh]">
              {/* Media Content */}
              <div className="w-full h-[60vh] sm:w-[800px] sm:h-full sm:px-20 bg-[#090909] relative order-2 sm:order-1">
                <Box className="relative w-full sm:w-[450px] mx-auto h-full gap-[23.11px]">
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
                      <Box className="absolute bottom-[20px] left-0 hidden sm:block">
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
                      <Box className="hidden sm:flex flex-col gap-[30px] absolute bottom-[20px] -right-14">
                        <IconButton className="bg-[#272727] hover:bg-[#272727]">
                          <IconLike className="text-[#A4A4A4]" />
                        </IconButton>
                        <IconButton className="bg-[#272727] hover:bg-[#272727]">
                          <IconComment className="text-[#A4A4A4]" />
                        </IconButton>
                        <IconButton className="bg-[#272727] hover:bg-[#272727]">
                          <IconShare className="text-[#A4A4A4]" />
                        </IconButton>
                        <IconButton className="bg-[#272727] hover:bg-[#272727]">
                          <MoreIcon className="my-2.5 text-[#A4A4A4]" />
                        </IconButton>
                      </Box>
                    </Box>
                  ) : (
                    <Image src={`/images/home/blankVideo.png`} alt="icon" height={800} width={450} style={{ width: 'auto' }} />
                  )}
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
                <Box className="hidden sm:flex items-center justify-between py-[14px] px-[28px] mt-[30px] border-b border-[#EEEEEE]"></Box>
              </div>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
