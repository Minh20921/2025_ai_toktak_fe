'use client';

import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import IconBell from '@/../public/images/generation/SSSS.svg';
import { UpDownIcon } from '@/utils/icons/icons';
import imgCheck from '@/../public/images/generation/SVG.png';

interface IDialogExceedCredit {
  open: boolean;
  handleClose: () => void;
}
const plans = [
  {
    title: '스탠다드',
    priceOld: '월 89,900원',
    priceNew: '월 29,900원',
    features: ['콘텐츠 생성 개수 180개/월', '생성 콘텐츠 종류 3개', 'SNS 배포 채널 7개 (모두)'],
  },
  {
    title: '베이직',
    priceOld: '월 29,900원',
    priceNew: '월 9,900원',
    features: ['콘텐츠 생성 개수 90개/월', '생성 콘텐츠 종류 3개', 'SNS 배포 채널 1개'],
  },
];
const DialogExceedCredit = ({ open, handleClose }: IDialogExceedCredit) => {
  const theme = useTheme();
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);
  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <Dialog
      fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        sx: {
          width: '472px',
          maxWidth: '472px',
        },
      }}
      className="hide-scrollbar"
    >
      <DialogContent className="hide-scrollbar" sx={{ padding: '24px !important' }}>
        <Box>
          <Box className="flex items-center justify-center mb-[24px] mt-[-60px] overflow-hidden">
            <IconBell />
          </Box>
        </Box>
        <Box className="mt-[-80px]">
          <Box className="flex flex-col items-center justify-center mb-[24px]">
            <Typography className="text-[21px] font-semibold text-[#090909] mb-[2px] text-center">
              🚀 가능성은 무한대로!
            </Typography>
            <Typography className="text-[14px] text-[#A4A4A4] mb-[2px] text-center">
              요금제 업그레이드하고 더 많은 생성과 SNS 배포,{' '}
            </Typography>
            <Typography className="text-[14px] text-[#A4A4A4] mb-[2px] text-center">수익화를 즐겨 보세요.</Typography>
          </Box>
          <Box className="flex flex-col gap-[12px]">
            {plans.map((plan, i) => (
              <Box
                key={i}
                className={`transition-all duration-300 overflow-hidden 
                ${openIndexes.includes(i) ? 'p-[24px]' : 'px-[24px] py-[12px]'}
                border border-[#E7E7E7] rounded-[5px] flex flex-col gap-[12px]`}
              >
                <Box className="flex justify-between items-center cursor-pointer" onClick={() => toggleOpen(i)}>
                  <Typography className="text-[16px] font-bold text-[#272727]">{plan.title}</Typography>
                  <UpDownIcon
                    className={`transition-transform duration-500 ${openIndexes.includes(i) ? 'rotate-180' : ''}`}
                  />
                </Box>

                <div
                  className={`transition-all duration-300 overflow-hidden`}
                  style={{
                    maxHeight: openIndexes.includes(i) ? '500px' : '0px',
                    opacity: openIndexes.includes(i) ? 1 : 0,
                  }}
                >
                  <ul className="flex flex-col gap-[10px] mt-2">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="text-[#6A6A6A] flex items-center gap-2">
                        <Image src={imgCheck} alt="imgCheck" />
                        <span>{f}</span>
                      </li>
                    ))}
                    <li>
                      <span className="line-through text-[#6A6A6A]">{plan.priceOld}</span>
                      <span className="font-bold text-[#4776EF] ml-2">{plan.priceNew}</span>
                    </li>
                  </ul>
                </div>
              </Box>
            ))}
          </Box>

          <Button
            color="primary"
            disableElevation
            variant="contained"
            className="relative flex w-full h-[50px] 
                    flex-none !rounded-full font-pretendard items-center
                    bg-[#4776EF] my-[12px]
                    "
            onClick={() => {}}
          >
            <span>요금제 업그레이드 하기</span>
          </Button>
          <Button
            color="primary"
            disableElevation
            variant="contained"
            className="relative flex w-full h-[50px] 
                    flex-none !rounded-full font-pretendard items-center
                    bg-[#E7E7E7] text-[#6A6A6A]
                    "
            onClick={() => {}}
          >
            <span>지금 플랜 유지하기</span>
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogExceedCredit;
