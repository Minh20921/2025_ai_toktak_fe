'use client';

import { LocalStorageItems } from '@/../shared/constants';
import { showNotice } from '@/utils/custom/notice';
import { Box, CircularProgress } from '@mui/material';
import API from '@service/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function PayFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    const message = searchParams.get('message');

    const logFailure = new API('/api/v1/payment/save-card/fail', 'POST', {
      success: () => {
        showNotice('🥲 카드 등록에 문제가 생겼어요.', '올바른 정보인지 다시 확인해 주세요.', false, '확인', '', () => {
          router.push(localStorage.getItem(LocalStorageItems.CURRENT_PATHNAME) || `/payment`);
        });
      },
      error: (err) => {
        showNotice('🥲 카드 등록에 문제가 생겼어요.', '올바른 정보인지 다시 확인해 주세요.', false, '확인', '', () => {
          router.push(localStorage.getItem(LocalStorageItems.CURRENT_PATHNAME) || `/payment`);
        });
      },
    });

    logFailure.config.data = {
      code,
      message,
    };

    logFailure.call();
  }, [searchParams]);

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
