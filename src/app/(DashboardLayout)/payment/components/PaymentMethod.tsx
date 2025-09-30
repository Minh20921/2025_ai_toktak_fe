'use client';

import { RootState } from '@/app/lib/store/store';
import { showNoticeError } from '@/utils/custom/notice_error';
import { maskCreditCard } from '@/utils/format';
import { Box, Button, Typography } from '@mui/material';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LocalStorageItems } from '../../../../../shared/constants';
import CardPopup from '../../components/popup/CardPopup';
interface PaymentMethodProps {
  selectedPackage: string;
  cardList: any[];
  getCardList: () => void;
}
const PaymentMethod: React.FC<PaymentMethodProps> = ({ selectedPackage, cardList, getCardList }) => {
  const [openCardPopup, setOpenCardPopup] = useState(false);
  const [cardActive, setCardActive] = useState<any>({});
  const user = useSelector((state: RootState) => state.auth.user);
  const clientKey = process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY as string;

  useEffect(() => {
    setCardActive(cardList.find((item: any) => item.is_default === 1) || cardList[0]);
  }, [cardList]);

  const handleSaveCard = async (id?: number) => {
    // setLoading(true);

    try {
      const toss = await loadTossPayments(clientKey);
      console.log(window.location);
      localStorage.setItem(LocalStorageItems.CURRENT_PATHNAME, window.location.pathname + window.location.search);
      await toss
        .requestBillingAuth('카드', {
          customerKey: user?.referral_code || '',
          customerEmail: user?.email || '',
          customerName: user?.name || '',
          successUrl: `${window.location.origin}/payment/success`,
          failUrl: `${window.location.origin}/payment/fail`,
        })
        .catch((error) => {
          console.error('Toss payment error:', error?.message || error);
          // showNoticeError(
          //   '🔔 결제가 취소되었습니다.',
          //   '언제든 다시 진행하 실 수 있어요. 😊',
          //   false,
          //   '확인',
          //   '',
          //   () => {
          //     deletePayment.config.data = {
          //       payment_id: "" +payment_id + "",
          //     };

          //     deletePayment.call();
          //   },
          // );
        });
    } catch (error) {
      console.error(error);
      showNoticeError('Lỗi khi tạo thanh toán', '', false, '확인', '취소', () => {});
    } finally {
      // setLoading(false);
    }
  };
  return (
    <Box className="bg-[#fff] rounded-[14px] p-[25px] font-pretendard w-full">
      <CardPopup
        cardList={cardList}
        open={openCardPopup}
        onClose={() => setOpenCardPopup(false)}
        getCardList={() => getCardList()}
        isRefundButton={false}
      />
      <Box className="flex justify-between">
        <Box className="sm:text-[20px] text-[#090909] font-semibold">결제 수단</Box>
        {['BASIC', 'STANDARD'].includes(selectedPackage) && (
          <Box className="sm:text-[12px] text-[#6A6A6A]">
            결제 수단 등록 시, 결제일을 기준으로 주기적으로 자동 결제가 진행됩니다.
          </Box>
        )}
      </Box>
      <Box className="flex justify-between items-center mt-[15px]">
        {cardActive?.card_number ? (
          <Box>
            <Typography
              fontSize={{ xs: 12, sm: 14 }}
              color="#6A6A6A"
              fontWeight={700}
              sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
            >
              {cardActive?.card_company || ''}
            </Typography>
            <Typography
              fontSize={{ xs: 12, sm: 14 }}
              color="#A4A4A4"
              fontWeight={500}
              sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
            >
              {maskCreditCard(cardActive?.card_number || '')}
            </Typography>
          </Box>
        ) : (
          <Typography
            fontSize={{ xs: 12, sm: 14 }}
            color="#6A6A6A"
            fontWeight={600}
            sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
          >
            결제 수단을 등록해 주세요.
          </Typography>
        )}
        <Button
          disableElevation
          variant="contained"
          size="large"
          className={`w-[113px] h-[30px] !rounded-[6px] text-[12px] font-semibold px-0 pt-[9px] ${cardActive?.card_number ? 'text-[#6A6A6A] border-solid border-[2px] border-[#E7E7E7] bg-transparent' : 'text-[#fff] bg-[#4776EF]'}`}
          onClick={() => (cardActive?.card_number ? setOpenCardPopup(true) : handleSaveCard())}
        >
          {cardActive?.card_number ? '결제 수단 변경' : '결제 수단 등록하기'}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentMethod;
