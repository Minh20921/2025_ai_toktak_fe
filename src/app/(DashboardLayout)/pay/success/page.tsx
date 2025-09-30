'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography, CircularProgress, Box } from '@mui/material';
import API from '@service/api';
import { showNoticeError } from '@/utils/custom/notice_error';

export default function PaySuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const paymentId = searchParams.get('payment_id');

    if (!paymentKey || !orderId || !amount) {
      setStatus('fail');
      setMessage('Thiếu thông tin thanh toán từ URL');
      return;
    }

    const confirmPayment = new API('/api/v1/payment/confirm', 'POST', {
      success: (res) => {
        if (res?.code === 200) {
          let package_name = res?.data.payment.package_name;
          let message = '';
          let message_title = '';
          if (package_name == 'ADDON') {
            message = '🎉 멀티 채널 추가가 완료됐어요!';
            message_title = '더 많은 채널로 당신의 세상을 넓혀보세요 😊';
          } else if (package_name == 'BASIC') {
            message = '지금부터 편하게 이용해 보세요 🌟';
            message_title = '🎉 베이직 플랜 가입이 완료됐어요!';
          } else if (package_name == 'STANDARD') {
            message = '지금부터 모든 기능을 자유롭게 이용해 보세요 😊';
            message_title = '🎉 스탠다드 플랜 가입이 완료됐어요!';
          } else if (package_name == 'BUSINESS') {
            message = '지금부터 모든 기능을 자유롭게 이용해 보세요 😊';
            message_title = '🎉 스탠다드 플랜 가입이 완료됐어요!';
          }

          showNoticeError(message, message_title, false, '확인', '', () => {
            router.push(`/rate-plan`);
          });
        } else {
          showNoticeError(
            '🚫 결제가 실패했어요.',
            '결제 정보를 다시 확인해 주세요.<br>문제가 지속되면 고객센터에 문의해 주세요!',
            false,
            '확인',
            '',
            () => {
              router.push(`/rate-plan`);
            },
          );
        }
      },
      error: () => {
        showNoticeError(
          '🚫 결제가 실패했어요.',
          '결제 정보를 다시 확인해 주세요.<br>문제가 지속되면 고객센터에 문의해 주세요!',
          false,
          '확인',
          '',
          () => {
            router.push(`/rate-plan`);
          },
        );
      },
      finally: () => {},
    });

    confirmPayment.config.data = {
      paymentKey,
      orderId,
      amount: parseInt(amount),
      payment_id: paymentId ? parseInt(paymentId) : undefined,
    };

    confirmPayment.call();
  }, [searchParams]);

  return (
    <Box sx={{ padding: 4 }}>
      {status === 'loading' ? (
        <CircularProgress />
      ) : (
        <Typography variant="h5" color={status === 'success' ? 'green' : 'red'}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
