'use client';

import { formatNumberKR } from '@/utils/format';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { FlashIcon } from './icons';

type CreditPack = {
  id: string;
  title: string;
  credits: number;
  price: number;
  bonusPercent?: number; // e.g., 10 -> +10%
  highlight?: boolean; // 가장 많이 선택
};

const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'PACKAGE_10',
    title: '입문용 패키지',
    credits: 100,
    price: 10000,
  },
  {
    id: 'PACKAGE_30',
    title: '실속 있는 소액 패키지',
    credits: 315,
    price: 30000,
    bonusPercent: 5,
  },
  {
    id: 'PACKAGE_50',
    title: '가장 많이 선택한 패키지',
    credits: 550,
    price: 50000,
    bonusPercent: 10,
    highlight: true,
  },
  {
    id: 'PACKAGE_100',
    title: 'AI 극대화 효율 패키지',
    credits: 1200,
    price: 100000,
    bonusPercent: 20,
  },
];

const PackRow: React.FC<{
  pack: CreditPack;
  selected: boolean;
  onSelect: () => void;
}> = ({ pack, selected, onSelect }) => {
  const perCredit = useMemo(() => (pack.price > 0 ? pack.price / pack.credits : 0), [pack.price, pack.credits]);
  const router = useRouter();
  const onClickPackCredit = () => {
    router.push(`/payment?package=${pack.id}`);
  };
  return (
    <Box
      onClick={onSelect}
      className={`w-full text-left rounded-[12px] border-none outline transition-all duration-200 mt-3 first:mt-0 cursor-pointer px-2.5 py-3 ${selected
        ? 'bg-[#F3F6FF] outline-2 outline-[#4776EF]'
        : 'bg-white  outline-1 outline-[#E9ECEF] hover:outline-[#D8D8D8]'
        }`}
      sx={{ border: '1px solid' }}
    >
      <Box className="flex items-center gap-2 flex-wrap">
        <Box
          className={`inline-flex items-center gap-0 text-[13px] leading-[22px] px-2.5 py-0 rounded-[5px] h-[22px] ${selected ? 'bg-[#4776EF] text-[#EFF5FF]' : 'bg-[#EFF5FF] text-[#4776EF]'
            }`}
        >
          <FlashIcon width={12} height={12} color={selected ? '#EFF5FF' : '#4776EF'} />
          {formatNumberKR(pack.credits)}
          {pack.bonusPercent ? `(+${pack.bonusPercent}%)` : ''}
        </Box>
        <Box
          className={`inline-flex items-center text-[13px] leading-[22px] px-2.5 py-0 rounded-[5px] h-[22px] ${selected ? 'bg-[#4776EF] text-[#EFF5FF]' : 'bg-[#EFF5FF] text-[#4776EF]'}`}
        >
          <FlashIcon width={12} height={12} color={selected ? '#EFF5FF' : '#4776EF'} />
          1={formatNumberKR(perCredit.toFixed(2))}원
        </Box>
      </Box>

      <Box className="flex items-center justify-between mt-3">
        <Box>
          <Typography
            className={`text-[14px] leading-[26px] font-semibold ${selected ? 'text-[#272727]' : 'text-[#6A6A6A]'}`}
          >
            {pack.highlight && '⭐ '}
            {pack.title}
          </Typography>
          <Typography className="mt-1 text-[20px] font-extrabold leading-[24px] text-[#4776EF]">
            {formatNumberKR(pack.price)}원
          </Typography>
        </Box>
        <Button
          disableElevation
          variant={selected ? 'contained' : 'outlined'}
          size="medium"
          className={`rounded-full h-[36px] text-[14px] font-semibold ${selected ? '!bg-[#4776EF]' : ''}`}
          sx={{
            px: 1,
            color: selected ? '#fff' : '#4776EF',
            gap: 0,
            maxWidth: 125,
            width: '100%',
            borderRadius: 9999,
            ...(selected
              ? {
                background: 'linear-gradient(93.17deg, #4B59ED 6.12%, #2432CC 99.53%)',
                border: 'none',
                '&:hover': {
                  filter: 'brightness(0.95)',
                },
              }
              : {
                border: '1.5px solid #4776EF',
                '&:hover': {
                  background: '#EFF5FF',
                },
              }),
          }}
          onClick={onClickPackCredit}
        >
          <FlashIcon width={12} height={12} color={selected ? '#EFF5FF' : '#4776EF'} />
          {formatNumberKR(pack.credits)} 충전하기
        </Button>
      </Box>
    </Box>
  );
};

const PackageCredit: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('');

  return (
    <Box
      className="relative rounded-[14px] p-[2px] group hover:scale-105 transition duration-200"
      style={{
        background: 'linear-gradient(105.17deg, #4776EF 9.01%, #AD50FF 107.8%)',
        boxShadow: '0px 5.28px 39.63px 0px #0000001A',
      }}
    >
      <article className="rate-card relative w-full shrink-0 bg-white rounded-[14px] ">
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            transform: 'translateY(-50%)',
            left: 30,
            zIndex: 1,
            background: 'linear-gradient(105.17deg, #4776EF 9.01%, #AD50FF 107.8%)',
            px: 1.25,
            borderRadius: 999,
            color: '#fff',
            fontSize: 12,
            fontWeight: 500,
            lineHeight: '26px',
          }}
        >
          인기 상품
        </Box>

        <div className="absolute top-10 right-10 w-[61px] h-[61px] flex items-center justify-center rounded-full bg-[#AA51FF]/10 backdrop-blur-[30px] shadow-[0_0_30px_2px_rgba(170,81,255,0.2)]">
          <Image
            src="/images/rate/tag-credit.png"
            alt="tag-credit"
            width={44}
            height={45}
            className="object-contain"
          />
        </div>

        <Box className="flex flex-col p-5 sm:p-6 w-full h-full text-[#6A6A6A]">
          <Typography className="font-bold text-2xl leading-[29px] text-[#272727] mt-3">패키지 크레딧</Typography>
          <Typography className="mt-2.5 text-base text-[#A4A4A4]">
            콘텐츠로 만들고 싶은
            <br /> 아이디어가 많다면?
          </Typography>
          <Typography className="mt-2.5 text-base text-[#4776EF]">
            지금 크레딧 충전하고,
            <br /> 원하는 만큼 더 생성해 보세요.
          </Typography>

          <Box className="mt-4">
            {CREDIT_PACKS.map((pack) => (
              <PackRow
                key={pack.id}
                pack={pack}
                selected={selectedId === pack.id}
                onSelect={() => setSelectedId(pack.id)}
              />
            ))}
          </Box>

          <Box className="mt-4">
            <Typography className="text-[14px] leading-[17px] text-[#A4A4A4] flex items-center gap-1">
              <FlashIcon width={12} height={12} color="#4776EF" /> 사용처: 영상·이미지·블로그 생성(1회=
              <FlashIcon width={12} height={12} color="#4776EF" /> 6)
            </Typography>
            <Typography className="text-[14px] ml-[60px] leading-[17px] text-[#A4A4A4] mt-1">
              유료 보이스·템플릿 등 부가 기능
            </Typography>
          </Box>
        </Box>
      </article>
    </Box>
  );
};

export default PackageCredit;
