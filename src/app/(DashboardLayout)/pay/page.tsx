'use client';

import { useEffect, useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import API from '@service/api';
import { showNoticeError } from '@/utils/custom/notice_error';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PayPage() {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchParams = useSearchParams();
  const clientKey = process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY as string;

  const router = useRouter();
  useEffect(() => {
    const param = searchParams.get('payment_id');
    if (param) {
      const id = parseInt(param);
      handlePay(id); // Gọi luôn với id đã có
    }
  }, [searchParams]);

  const handlePay = async (id?: number) => {
    setLoading(true);

    try {
      const payment_id = id ?? 0;
      const lang = navigator.language.startsWith('en') ? 'en' : navigator.language.startsWith('ja') ? 'ja' : 'ko';

      const getPayment = new API('/api/v1/payment/get_detail', 'POST', {
        success: async (res) => {
          if (res?.code === 201) {
            showNoticeError(res?.message, '', false, '확인', '취소', () => {});
            return;
          }

          const orderId = res?.data.payment.order_id;
          const amount = res?.data.payment.price;
          const customerName = res?.data.payment.customer_name;
          const orderName = res?.data.payment.description;
          const toss = await loadTossPayments(clientKey);

          await toss
            .requestPayment('카드', {
              amount,
              orderId,
              orderName,
              customerName,
              successUrl: `${window.location.origin}/pay/success`,
              failUrl: `${window.location.origin}/pay/fail`,
            })
            .catch((error) => {
              console.error('Toss payment error:', error?.message || error);
              showNoticeError(
                '🔔 결제가 취소되었습니다.',
                '언제든 다시 진행하 실 수 있어요. 😊',
                false,
                '확인',
                '',
                () => {
                  deletePayment.config.data = {
                    payment_id: "" +payment_id + "",
                  };

                  deletePayment.call();
                },
              );
            });
        },
        error: (err) => {
          console.error(err);
          showNoticeError(
            '🚫 결제가 실패했어요.',
            '결제 정보를 다시 확인해 주세요.문제가 지속되면 고객센터에 문의해 주세요!',
            false,
            '확인',
            '',
            () => {
              deletePayment.config.data = {
                payment_id: payment_id,
              };

              deletePayment.call();
            },
          );
        },
        finally: () => {},
      });

      getPayment.config.data = {
        payment_id,
      };

      await getPayment.call();
    } catch (error) {
      console.error(error);
      showNoticeError('Lỗi khi tạo thanh toán', '', false, '확인', '취소', () => {});
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = new API('/api/v1/payment/delete_pending', 'POST', {
    success: async (res) => {
      if (res?.code === 201) {
      }
      router.push(`/`);
    },
    error: (err) => {
      console.error(err);
      showNoticeError(
        '🚫 결제가 실패했어요.',
        '결제 정보를 다시 확인해 주세요.문제가 지속되면 고객센터에 문의해 주세요!',
        false,
        '확인',
        '',
        () => {
          router.push(`/`);
        },
      );
    },
    finally: () => {},
  });

  return <div style={{ padding: 40 }}></div>;
}
