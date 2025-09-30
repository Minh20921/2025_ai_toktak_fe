'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import iconClose from '@/../public/images/generation/close.png';
import Image from 'next/image';
import './style.css';
import { UpDownIcon } from '@/utils/icons/icons';
import { VideoImageAITemplate } from '../../@type/interface';

interface IDialogViewDetail {
  open: boolean;
  handleClose: () => void;
  setPrompt: React.Dispatch<React.SetStateAction<string | null>>;
  templates: VideoImageAITemplate[];
  openDialogId: number | null;
}
const DialogViewDetail = ({ open, handleClose, setPrompt, templates, openDialogId }: IDialogViewDetail) => {
  const theme = useTheme();
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (openDialogId !== null) {
      const index = templates.findIndex((item) => item.id === openDialogId);
      setActiveIndex(index >= 0 ? index : 0);
      swiperRef.current?.slideTo(index >= 0 ? index : 0);
    }
  }, [openDialogId, templates]);
  const mainTemplate = useMemo(() => templates[activeIndex] || null, [templates, activeIndex]);
  const handlePrev = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      swiperRef.current?.slideTo(newIndex);
    }
  };
  const handleNext = () => {
    if (activeIndex < templates.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      swiperRef.current?.slideTo(newIndex);
    }
  };
  return (
    <Dialog
      fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        sx: {
          width: '872px',
          maxWidth: '872px',
        },
      }}
      className="hide-scrollbar"
    >
      <DialogContent className="hide-scrollbar" sx={{ padding: '24px !important' }}>
        <Box>
          <Box className="flex items-center justify-between mb-[24px]">
            <Typography variant="h4" component="h1" className="font-pretendard font-bold sm:block text-[24px]">
              미리보기
            </Typography>
            <Image className="cursor-pointer" onClick={handleClose} src={iconClose} alt="iconClose" />
          </Box>
        </Box>
        {/* phần nội dung chính */}
        <Box display="flex" height="670px" className="gap-[24px]">
          {/* Cột trái (100px) */}

          <Box width="100px">
            <Box
              height="30px"
              bgcolor="#F6F7F9"
              className={`flex justify-center items-center cursor-pointer mb-[10px] 
                                ${activeIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
              onClick={handlePrev}
            >
              <UpDownIcon color="#232323" className={`transition-all duration-500 ease-in-out rotate-180`} />
            </Box>
            <Swiper
              direction="vertical"
              slidesPerView="auto"
              className="mySwiper w-[100px] h-[600px] box-border"
              spaceBetween={10}
              centeredSlides={true}
              centeredSlidesBounds={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                const viewCount = swiper.slidesPerViewDynamic();
              }}
            >
              {templates.map((item, index) => (
                <SwiperSlide key={item.id}>
                  <div onClick={() => setActiveIndex(index)} className="relative h-full">
                    <Image
                      width={97}
                      height={92}
                      className={`cursor-pointer 
                                        h-[92px] object-cover rounded-[12px]
                                         ${activeIndex === index ? 'border-[2px] border-[#4776EF]' : ''}`}
                      src={item?.thumbnail_url as string}
                      alt="iconClose"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <Box
              onClick={handleNext}
              height="30px"
              bgcolor="#F6F7F9"
              className={`flex justify-center items-center cursor-pointer ${
                activeIndex === templates.length - 1 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <UpDownIcon color="#232323" className={`transition-all duration-500 ease-in-out `} />
            </Box>
          </Box>
          {/* Cột phải (chia đôi) */}
          <Box flex={1} display="flex" className="gap-[10px]">
            <Box className="relative" flex={1}>
              {mainTemplate?.type?.toLowerCase().includes('video') ? (
                <video src={mainTemplate.url} controls className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Image fill src={mainTemplate?.url as string} alt="img" className="object-cover rounded-lg" />
              )}
            </Box>
            <Box flex={1} className=" relative flex items-center justify-center">
              <div>
                <Typography className="font-pretendard font-semibold text-[#7C7C7C]">Prompt</Typography>
                <Typography className="font-pretendard text-[#303030]">{mainTemplate?.prompt}</Typography>
              </div>
              <Button
                onClick={() => {
                  setPrompt(mainTemplate?.prompt);
                  handleClose();
                }}
                color="primary"
                disableElevation
                variant="contained"
                className="absolute bottom-[20px] right-[0px] 
                                rounded-[8px] bg-[#537EEF] py-[9px] px-[21px]
                                "
              >
                <Typography>프롬프트 사용하기</Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogViewDetail;
