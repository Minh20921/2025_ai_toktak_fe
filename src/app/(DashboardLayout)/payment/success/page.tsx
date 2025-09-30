'use client';

import { LocalStorageItems } from '@/../shared/constants';
import { showNotice } from '@/utils/custom/notice';
import { Box, CircularProgress } from '@mui/material';
import API from '@service/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function PaySuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const customerKey = searchParams.get('customerKey');
    const authKey = searchParams.get('authKey');

    if (!customerKey || !authKey) {
      showNotice('🥲 카드 등록에 문제가 생겼어요.', '올바른 정보인지 다시 확인해 주세요.', false, '확인', '', () => {
        router.push(localStorage.getItem(LocalStorageItems.CURRENT_PATHNAME) || `/payment`);
      });
      return;
    }

    const onSuccessSaveCard = new API('/api/v1/payment/save-card', 'POST', {
      success: (res) => {
        if (res?.code === 200) {
          showNotice(
            '👏 카드 등록을 성공했습니다.',
            '요금제를 등록하고 더 많은 기능을 즐겨 보세요.',
            false,
            '확인',
            '',
            () => {
              router.push(localStorage.getItem(LocalStorageItems.CURRENT_PATHNAME) || `/payment`);
              router.refresh();
            },
          );
        } else {
          showNotice(
            '🥲 카드 등록에 문제가 생겼어요.',
            '올바른 정보인지 다시 확인해 주세요.',
            false,
            '확인',
            '',
            () => {
              router.push(localStorage.getItem(LocalStorageItems.CURRENT_PATHNAME) || `/payment`);
            },
          );
        }
      },
      error: () => {
        showNotice('🥲 카드 등록에 문제가 생겼어요.', '올바른 정보인지 다시 확인해 주세요.', false, '확인', '', () => {
          router.push(localStorage.getItem(LocalStorageItems.CURRENT_PATHNAME) || `/payment`);
        });
      },
      finally: () => {},
    });
    onSuccessSaveCard.config.data = {
      customerKey,
      authKey,
    };

    onSuccessSaveCard.call();
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
