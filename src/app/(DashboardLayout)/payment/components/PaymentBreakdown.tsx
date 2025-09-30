'use client';

import { formatNumberKR } from '@/utils/format';
import { Box, Divider, Typography } from '@mui/material';
import React from 'react';

export interface PaymentItem {
  label: string;
  value: string | number;
  isDiscount?: boolean;
  isPaid?: boolean;
}

interface PaymentBreakdownProps {
  items: PaymentItem[];
  amount: number;
}

const PaymentBreakdown: React.FC<PaymentBreakdownProps> = ({ items, amount }) => {
  return (
    <Box className="bg-[#fff] rounded-[14px] p-[25px] font-pretendard w-full">
      <Box className="sm:text-[20px] text-[#090909] font-semibold">결제 금액</Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          rowGap: '15px',
          mt: '15px',
          maxWidth: { xs: '100%', md: '100%' },
        }}
      >
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <Typography
              fontSize={{ xs: 12, sm: 14 }}
              color={item.isDiscount ? '#4776EF' : '#6A6A6A'}
              fontWeight={600}
              sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
            >
              {item.label}
            </Typography>
            <Typography
              fontSize={{ xs: 12, sm: 14 }}
              color={item.isDiscount ? '#4776EF' : '#6A6A6A'}
              fontWeight={500}
              sx={{
                lineHeight: { xs: '12px', sm: '24px' },
                textDecorationLine: item?.isPaid ? 'line-through' : 'none',
              }}
              textAlign="right"
            >
              {`${item.isDiscount ? '-' : ''}${item.value}`}원
            </Typography>
          </React.Fragment>
        ))}
        <Divider sx={{ width: '100%' }} />
        <Divider sx={{ width: '100%' }} />
        <React.Fragment key="amount">
          <Typography
            fontSize={{ xs: 12, sm: 14 }}
            color="#6A6A6A"
            fontWeight={700}
            sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
          >
            결제 금액
          </Typography>
          <Typography
            fontSize={{ xs: 12, sm: 14 }}
            color="#6A6A6A"
            fontWeight={700}
            sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
            textAlign="right"
          >
            {formatNumberKR(amount)}원
          </Typography>
        </React.Fragment>
      </Box>
    </Box>
  );
};

export default PaymentBreakdown;
