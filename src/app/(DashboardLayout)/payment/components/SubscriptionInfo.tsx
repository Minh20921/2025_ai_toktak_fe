'use client';

import { Box, Typography } from '@mui/material';
import React, { useMemo } from 'react';

interface SubscriptionInfoProps {
  selectedPackage: string;
  packageTitle: string;
  subscriptionPeriod: string;
  nextPaymentDate: string;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({
  selectedPackage,
  packageTitle,
  subscriptionPeriod,
  nextPaymentDate,
}) => {
  const isCreditPackage = useMemo(() => !['BASIC', 'STANDARD'].includes(selectedPackage), [selectedPackage]);
  return (
    <Box className="bg-[#fff] rounded-[14px] p-[25px] font-pretendard w-full">
      <Box className="sm:text-[20px] text-[#090909] font-semibold">{isCreditPackage ? '결제 정보' : '구독 정보'}</Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          rowGap: '15px',
          mt: '15px',
          maxWidth: { xs: '100%', md: '300px' },
        }}
      >
        {[
          { label: isCreditPackage ? '결제 상품' : '구독 상품', value: packageTitle },
          { label: isCreditPackage ? '유효 기간' : '구독 기간', value: subscriptionPeriod },
          ...(!isCreditPackage ? [{ label: '다음 결제일', value: nextPaymentDate }] : []),
        ].map((item, idx) => (
          <React.Fragment key={idx}>
            <Typography
              fontSize={{ xs: 12, sm: 14 }}
              color="#6A6A6A"
              fontWeight={600}
              sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
            >
              {item.label}
            </Typography>
            <Typography
              fontSize={{ xs: 12, sm: 14 }}
              color="#6A6A6A"
              fontWeight={{ sm: 500 }}
              sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
            >
              {item.value}
            </Typography>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default SubscriptionInfo;
