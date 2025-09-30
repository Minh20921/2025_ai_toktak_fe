'use client';

import { formatNumberKR } from '@/utils/format';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React from 'react';
import { FlashIcon } from '../../rate-plan/icons';
import { PackageGroup, PackageName } from '../page';

interface PackageSelectorProps {
  packageList: PackageGroup;
  selectedPackageIndex: PackageName;
  onChange: (name: PackageName) => void;
  addedSns: number;
}

interface PackageOptionLabelProps {
  title: string;
  priceOrigin: number;
  price: number;
  credits: number;
  isSelected: boolean;
}

const PackageOptionLabel: React.FC<PackageOptionLabelProps> = ({ title, priceOrigin, price, credits, isSelected }) => {
  return (
    <Box className="flex items-center justify-between py-4 px-2 w-full">
      <Box>
        <Typography className="text-sm font-bold" color={isSelected ? '#4776EF' : '#A4A4A4'}>
          {title}
        </Typography>
        <Box className="flex items-center gap-1 mt-1">
          <Typography className="line-through text-[#A4A4A4] text-[14px]">
            {formatNumberKR(priceOrigin)}원/월
          </Typography>
          <Typography className="text-sm font-bold" style={{ color: isSelected ? '#4776EF' : '#A4A4A4' }}>
            {formatNumberKR(price)}원/월
          </Typography>
          <Box
            className={`${isSelected ? 'bg-[#EFF5FF] text-[#4776EF]' : 'bg-[#F4F4F4] text-[#A4A4A4]'} rounded-[5px] h-[22px] px-1 py-[2.5px] flex items-center text-sm font-medium ml-1`}
          >
            <FlashIcon width={12} height={12} color={isSelected ? '#4776EF' : '#A4A4A4'} />
            {formatNumberKR(credits)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface CreditOptionLabelProps {
  title: string;
  priceOrigin: number;
  credits: number;
  isSelected: boolean;
}

const CreditOptionLabel: React.FC<CreditOptionLabelProps> = ({ title, priceOrigin, credits, isSelected }) => {
  return (
    <Box className="flex items-center justify-between py-4 px-2 w-full">
      <Box>
        <Typography className="text-sm font-bold" color={isSelected ? '#4776EF' : '#A4A4A4'}>
          {title}
        </Typography>
        <Box className="flex items-center gap-1 mt-1">
          <Typography className="text-sm font-medium mt-1">{formatNumberKR(priceOrigin)}원</Typography>
          <Box
            className={`${isSelected ? 'bg-[#EFF5FF] text-[#4776EF]' : 'bg-[#F4F4F4] text-[#A4A4A4]'} rounded-[5px] h-[22px] px-1 py-[2.5px] flex items-center text-sm font-medium ml-1`}
          >
            <FlashIcon width={12} height={12} color={isSelected ? '#4776EF' : '#A4A4A4'} /> {formatNumberKR(credits)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const PackageSelector: React.FC<PackageSelectorProps> = ({ packageList, selectedPackageIndex, onChange, addedSns }) => {
  return (
    <Box className="relative bg-[#fff] rounded-[14px] p-[10px] sm:p-[25px] font-pretendard w-full sm:w-[355px] text-center sm:text-left">
      <FormControl component="fieldset" className="flex mt-[5px] sm:mt-[5px]">
        <RadioGroup
          value={selectedPackageIndex}
          onChange={(e) => onChange(e.target.value as PackageName)}
          className="w-full gap-[15px] sm:gap-[10px] flex flex-col"
        >
          {/* Main group */}
          <Box>
            <Box className="text-[20px] text-[#090909] font-semibold">요금제</Box>
            <Box className="mt-2 text-sm text-[#686868]">SNS 커머스 마케터를 위한 플랜</Box>
            <Box className="mt-7 space-y-2">
              {packageList.main.map((item, index) => {
                let disabled = false;
                if (item.name === 'BASIC' && item.disabled) {
                  if (!addedSns) {
                    disabled = true;
                  } else {
                    disabled = false;
                  }
                } else if (item.disabled) {
                  disabled = true;
                }
                return (
                  <FormControlLabel
                    key={`main-${item.name}`}
                    value={item.name}
                    control={<Radio sx={{ '&.Mui-checked': { color: '#4776EF' } }} size="small" />}
                    disabled={disabled}
                    className={`mx-0 w-full rounded-[12px] outline ${
                      selectedPackageIndex === item.name ? 'outline-2 outline-[#4776EF]' : 'outline-1 outline-[#E7E7E7]'
                    }`}
                    label={
                      <PackageOptionLabel
                        title={item.title}
                        priceOrigin={item.price_origin}
                        price={item.price}
                        credits={item.credits}
                        isSelected={selectedPackageIndex === item.name}
                      />
                    }
                  />
                );
              })}
            </Box>
          </Box>

          {/* Divider */}
          <Box className="h-[1px] bg-[#F1F1F1] my-[14px]" />

          {/* Credit group */}
          <Box>
            <Box className="text-[20px] text-[#090909] font-semibold">패키지 크레딧</Box>
            <Box className="mt-2 text-sm text-[#686868]">더 많이, 더 멋지게. 콘텐츠 완성을 위한 크레딧</Box>
            <Box className="mt-7 space-y-2">
              {packageList.credit.map((item, idx) => {
                return (
                  <FormControlLabel
                    key={`credit-${item.name}`}
                    value={item.name}
                    control={<Radio sx={{ '&.Mui-checked': { color: '#4776EF' } }} size="small" />}
                    className={`mx-0 w-full rounded-[12px] outline ${
                      selectedPackageIndex === item.name ? 'outline-2 outline-[#4776EF]' : 'outline-1 outline-[#E7E7E7]'
                    }`}
                    label={
                      <CreditOptionLabel
                        title={item.title}
                        priceOrigin={item.price_origin}
                        credits={item.credits}
                        isSelected={selectedPackageIndex === item.name}
                      />
                    }
                  />
                );
              })}
            </Box>
          </Box>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default PackageSelector;
