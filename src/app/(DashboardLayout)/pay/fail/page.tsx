'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import API from '@service/api';
import { Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { showNoticeError } from '@/utils/custom/notice_error';
import { showCouponPopup } from '@/utils/custom/couponPopup';

export default function PayFailPage() {
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const code = searchParams.get('code');
    const message = searchParams.get('message');

    const logFailure = new API('/api/v1/payment/log/fail', 'POST', {
      success: () => {
        showCouponPopup(
          '🚫 결제가 실패했어요.',
          '결제 정보를 다시 확인해 주세요.<br/>문제가 지속되면 고객센터에 문의해 주세요!',
          false,
          '확인',
          '',
          () => {
          },
          'fail_coupon',
        );
      },
      error: (err) => console.error('로그 저장 실패:', err),
    });

    logFailure.config.data = {
      orderId,
      paymentKey,
      status_code: 400,
      fail_reason: message,
      fail_code: code,
    };

    logFailure.call();
  }, [searchParams]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" color="error">
        ❌ 결제에 실패하였습니다!
      </Typography>
      <Typography mt={2}>
        <strong>실패 사유:</strong> {searchParams.get('message') || '알 수 없는 오류'}
      </Typography>
      <Typography mt={1}>
        <strong>오류 코드:</strong> {searchParams.get('code') || '없음'}
      </Typography>
    </Box>
  );
}
