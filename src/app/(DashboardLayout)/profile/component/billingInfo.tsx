'use client';

import { LocalStorageItems } from '@/../shared/constants';
import CardPopup from '@/app/(DashboardLayout)/components/popup/CardPopup';
import PaymentHistoryDialog from '@/app/(DashboardLayout)/components/popup/PaymentHistoryDialog';
import ProfileTooltip from '@/app/(DashboardLayout)/profile/component/tooltip';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import { User, login } from '@/app/lib/store/authSlice';
import { setSnsSettingsState } from '@/app/lib/store/snsSettingsSlice';
import { RootState } from '@/app/lib/store/store';
import { showCouponPopup } from '@/utils/custom/couponPopup';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { formatDateToYYYYMMDD } from '@/utils/helper/time';
import { Icon } from '@iconify/react';
import { Box, Button, Divider, Typography } from '@mui/material';
import API from '@service/api';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import moment from 'moment';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BuyPackagePopup from '../../components/popup/BuyPackagePopup';
import { formatNumberKR } from '@/utils/format';

const BillingInfo = ({ profile, getUserInfo }: { profile: User; getUserInfo: () => void }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const clientKey = process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY as string;
  // const cardInfo = user?.card_info || '';
  // const cardInfoArray = cardInfo ? JSON.parse(cardInfo) : [];
  // const cardInfoObj = cardInfoArray.length > 0 ? cardInfoArray[0] : {};
  const [openCardPopup, setOpenCardPopup] = useState(false);
  const [openHistoryPopup, setOpenHistoryPopup] = useState(false);
  const [cardList, setCardList] = useState([]);
  const [cardInfo, setCardInfo] = useState({});
  const [openBuyPackagePopup, setOpenBuyPackagePopup] = useState(false);
  // fetch SNS settings once
  const getSNSSettingsAPI = useRef(
    new API(`/api/v1/user/get-user-link-template`, 'GET', {
      success: (res) => {
        if (res.code === 200) {
          dispatch(setSnsSettingsState({ snsSettings: res.data }));
        }
      },
      error: () => { },
      finally: () => { },
    }),
  );

  const getProfile = useRef(
    new API(`/api/v1/auth/me`, 'GET', {
      success: (res) => {
        const data = res?.data;
        dispatch(login({ user: data }));
        localStorage.setItem('user_level', res?.data.level);
        localStorage.setItem('can_download', res?.data.can_download);
      },
      error: async (err) => {
        console.error('Failed to fetch profile:', err);
      },
      finally: () => { },
    }),
  );

  const useCouponAPI = useRef(
    new API(`/api/v1/coupon/used`, 'POST', {
      success: async (res) => {
        if (res?.code === 201) {
          showCouponPopup(res?.message, '', false, '확인', '', () => { }, 'fail_coupon');
          return;
        } else if (res?.code === 202) {
          showNoticeMUI(res?.message_title, res?.message, false, '확인', '', () => { });
          return;
        } else if (res?.code === 203) {
          showNotice(
            '🔒 본인 인증을 진행하시겠어요?',
            '초대 쿠폰을 사용하려면 본인 인증이 필요해요.😊',
            true,
            '확인',
            '취소',
            () => {
              router.push(`/auth/verification/nice_auth?redirect=${pathname}`);
            },
          );
          return;
        }
        getSNSSettingsAPI.current.call();
        await getUserInfo();
        getProfile.current.call();

        showCouponPopup(
          res?.message,
          '',
          false,
          '확인',
          '',
          () => {
            location.reload();
          },
          'success_coupon',
        );
      },
      error: () => {
        showCouponPopup(
          '유효하지 않은 쿠폰입니다.<br/>쿠폰 번호를 확인해 주세요😭',
          '',
          false,
          '확인',
          '',
          () => { },
          'fail_coupon',
        );
      },
    }),
  );

  const useCoupon = (code: string) => {
    useCouponAPI.current.config.data = { code };
    useCouponAPI.current.call();
  };

  const maskCreditCard = (cardNumber: string) => cardNumber.replace(/(\d{4})/g, '$1 ');

  const handleSaveCard = async (id?: number) => {
    // setLoading(true);

    try {
      const toss = await loadTossPayments(clientKey);
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
      showNoticeError('Lỗi khi tạo thanh toán', '', false, '확인', '취소', () => { });
    } finally {
      // setLoading(false);
    }
  };

  const getCardList = useRef(
    new API(`/api/v1/payment/cards`, 'GET', {
      success: (res) => {
        const data = res?.data;
        if (data) {
          setCardList(data);
          setCardInfo(data[0]);
          // const mock = [
          //   {
          //     id: 13,
          //     user_id: 3225,
          //     customer_key: null,
          //     method: null,
          //     billing_key: null,
          //     card_company: 'KB 국민카드',
          //     card_number: '2222333344445555',
          //     issuer_code: null,
          //     acquirer_code: null,
          //     card_type: null,
          //     owner_type: null,
          //     is_default: 1,
          //     description: null,
          //     created_at: '2025-08-16 15:48:21',
          //     updated_at: '2025-08-16 09:50:58',
          //   },
          //   {
          //     id: 4,
          //     user_id: 3225,
          //     customer_key: null,
          //     method: null,
          //     billing_key: null,
          //     card_company: 'KB 국민카드',
          //     card_number: '2222333344445555',
          //     issuer_code: null,
          //     acquirer_code: null,
          //     card_type: null,
          //     owner_type: null,
          //     is_default: 0,
          //     description: null,
          //     created_at: '2025-08-16 15:48:21',
          //     updated_at: '2025-08-16 09:50:58',
          //   },
          //   {
          //     id: 5,
          //     user_id: 3225,
          //     customer_key: null,
          //     method: null,
          //     billing_key: null,
          //     card_company: 'KB 국민카드',
          //     card_number: '2222333344445555',
          //     issuer_code: null,
          //     acquirer_code: null,
          //     card_type: null,
          //     owner_type: null,
          //     is_default: 0,
          //     description: null,
          //     created_at: '2025-08-16 15:48:21',
          //     updated_at: '2025-08-16 09:50:58',
          //   },
          // ];
          // setCardList(mock || []);
          // setCardInfo(mock[0]);
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
      },
    }),
  );

  useEffect(() => {
    const isShowBuyPackagePopup = localStorage.getItem('is_show_buy_package_popup');
    if (['FREE'].includes(profile?.subscription || '') && !isShowBuyPackagePopup) {
      setOpenBuyPackagePopup(true);
      localStorage.setItem('is_show_buy_package_popup', 'true');
    }
    getCardList.current.call();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 2, md: '190px' },
        py: { xs: 3, md: 0 },
      }}
    >
      {/* 현재 구독 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: { xs: 3, md: 0 },
        }}
      >
        <Box
          sx={{
            mb: 1,
            mt: { xs: 3, md: '60px' },
            flex: 1,
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'column' },
              alignItems: { xs: 'center', sm: 'start' },
              justifyContent: 'space-between',
            }}
          >
            <Typography fontWeight="bold" fontSize={16} color="#272727" sx={{ lineHeight: { xs: '22px', md: '24px' } }}>
              현재 구독
            </Typography>
            <Typography
              fontWeight="bold"
              fontSize={21}
              color="#4776EF"
              sx={{ mt: 1, lineHeight: { xs: '28px', md: '30px' } }}
            >
              {profile?.subscription_name_display?.subscription_name_lable}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'column' },
              alignItems: { xs: 'center', sm: 'start' },
              justifyContent: 'space-between',
              mt: 1,
            }}
          >
            <Typography
              fontWeight="bold"
              fontSize={{ xs: 20, sm: 28 }}
              color="#272727"
              sx={{ lineHeight: { xs: '28px', md: '38px' } }}
            >
              {profile?.subscription_name_display?.subscription_name}
            </Typography>

            {profile?.subscription !== 'FREE' && (
              <Typography
                fontSize={14}
                sx={{ mt: '10px', mb: '20px', lineHeight: { xs: '20px', sm: '17px' } }}
                color="#A4A4A4"
              >
                만료 기간 : {moment(profile?.subscription_expired).format('YYYY.MM.DD')}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: { xs: '100%', md: '250px' },
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              rowGap: '8px',
              columnGap: '5px',
              mt: '10px',
              alignItems: 'center',
            }}
          >
            <Typography
              component="div"
              fontWeight={600}
              fontSize={14}
              color="#272727"
              sx={{ display: 'flex', alignItems: 'center', lineHeight: '20px' }}
            >
              내보내기
              <ProfileTooltip text="더 많은 채널(최대 7개)에 자동 배포하고 싶다면<br/>플랜 업그레이드 혹은 추가 옵션을 사용해보세요!" />
            </Typography>
            <Typography fontWeight={600} fontSize={14} color="#686868" textAlign="right" sx={{ lineHeight: '20px' }}>
              {profile?.total_link_active}개 채널
            </Typography>

            <Typography
              fontWeight={600}
              fontSize={14}
              color="#272727"
              component="div"
              sx={{ display: 'flex', alignItems: 'center', lineHeight: '20px' }}
            >
              생성하기
              <ProfileTooltip text="상품 URL을 사용하여 콘텐츠(블로그 글,<br/>쇼츠 영상, 이미지)를 생성할 때 차감됩니다." />
            </Typography>
            <Typography
              fontWeight={600}
              fontSize={14}
              color="#686868"
              textAlign="right"
              sx={{
                lineHeight: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '6px', // khoảng cách giữa ảnh và text
              }}

              data-batch-remain={profile?.batch_remain}
              data-batch-total={profile?.batch_total}
            >
              <img
                src="/images/credit_token.png"
                alt="icon"
              />
              {formatNumberKR(profile?.batch_remain)}
            </Typography>
          </Box>
        </Box>

        <Button
          disableElevation
          variant="contained"
          size="large"
          sx={{
            width: { xs: '100%', sm: '158px' },
            height: '50px',
            borderRadius: { xs: '8px', sm: 999 },
            fontSize: '18px',
            fontWeight: '600',
            backgroundColor: '#4776EF',
            mt: { xs: 0, md: '60px' },
          }}
          onClick={() => {
            showCouponPopup('쿠폰 번호를 입력해 주세요', 'text', true, '등록하기', '취소', useCoupon);
          }}
        >
          쿠폰 등록
        </Button>
      </Box>
      <Divider sx={{ my: { xs: 2, sm: 7 } }} />
      {/* 결제 방식 */}
      <Box>
        <Typography fontWeight="bold" fontSize={16} color="#272727" sx={{ lineHeight: '24px' }}>
          결제 수단
        </Typography>
        <Typography
          fontSize={18}
          fontWeight={500}
          color="#686868"
          sx={{ mt: 2, lineHeight: { xs: '26px', md: '28px' } }}
        >
          결제 수단 등록 시, 결제일을 기준으로 주기적으로 자동 결제가 진행됩니다.
        </Typography>
        <Box className="flex gap-[20px] items-center mt-[15px]">
          {cardInfo?.card_number ? (
            <Box>
              <Typography
                fontSize={{ xs: 12, sm: 14 }}
                color="#6A6A6A"
                fontWeight={700}
                sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
              >
                {cardInfo?.card_company || ''}
              </Typography>
              <Typography
                fontSize={{ xs: 12, sm: 14 }}
                color="#A4A4A4"
                fontWeight={500}
                sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
              >
                {maskCreditCard(cardInfo?.card_number || '')}
              </Typography>
            </Box>
          ) : (
            <Typography
              fontSize={{ xs: 12, sm: 14 }}
              color="#6A6A6A"
              fontWeight={600}
              sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
            >
              결제 방식 추가
            </Typography>
          )}
          <Button
            disableElevation
            variant="contained"
            size="large"
            className={`w-[113px] h-[30px] !rounded-[6px] text-[12px] font-semibold px-0 pt-[9px] ${cardInfo?.card_number ? 'text-[#6A6A6A] border-solid border-[2px] border-[#E7E7E7] bg-transparent' : 'text-[#fff] bg-[#4776EF]'}`}
            onClick={(e) => {
              cardInfo?.card_number ? setOpenCardPopup(true) : handleSaveCard();
            }}
          >
            {cardInfo?.card_number ? '결제 수단 관리' : '결제 수단 등록하기'}
          </Button>
        </Box>
      </Box>
      <Divider sx={{ my: { xs: 2, sm: 7 } }} />
      {/* 청구 정보 */}
      <Box>
        <Typography fontWeight="bold" fontSize={16} color="#272727" sx={{ lineHeight: '24px' }}>
          청구 정보
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            rowGap: '15px',
            mt: '15px',
            maxWidth: { xs: '100%', md: '300px' },
          }}
        >
          {['이름', '이메일', '청구 주소', '세금 ID'].map((label, idx) => (
            <React.Fragment key={idx}>
              <Typography fontSize={16} color="#686868" fontWeight={500} sx={{ lineHeight: '24px' }}>
                {label}
              </Typography>
              <Typography fontSize={16} color="#686868" fontWeight={500} sx={{ lineHeight: '24px' }}>
                -
              </Typography>
            </React.Fragment>
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
            color: '#686868',
            fontSize: '18px',
            fontWeight: '500',
            cursor: 'pointer',
            mt: '30px',
            lineHeight: '26px',
          }}
        >
          <Icon icon="line-md:edit" height={20} />
          정보 업데이트
        </Box>
      </Box>
      <Divider sx={{ my: { xs: 2, sm: 7 } }} />
      {/* 상세 내역 */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography fontWeight="bold" fontSize={16} color="#272727" sx={{ lineHeight: '24px' }}>
            상세 내역
          </Typography>
          <Button
            disableElevation
            variant="contained"
            sx={{
              width: { xs: '40%', sm: '92px' },
              height: '30px',
              borderRadius: '6px',
              color: '#fff',
              backgroundColor: '#4776EF',
              fontSize: '12px',
              fontWeight: '600',
              px: 0,
              pt: '9px',
            }}
            onClick={(e) => {
              setOpenHistoryPopup(true);
            }}
          >
            결제 상세 내역
          </Button>
        </Box>
        {profile?.user_histories?.map((item, index) => (
          <Box
            key={`history_${index}`}
            sx={{
              display: 'flex',
              gap: 2,
              mt: 2,
              fontSize: 16,
              color: '#686868',
              lineHeight: '24px',
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: '250px' } }}>
              {formatDateToYYYYMMDD(item.object_start_time)} ~ {formatDateToYYYYMMDD(item.object_end_time)}
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '180px' } }}>
              <Typography component="div" sx={{ display: 'flex', alignItems: 'center', lineHeight: '24px' }}>
                {(() => {
                  const type = item.type?.trim();
                  if (type === 'USED_COUPON') return '쿠폰';
                  if (type === 'referral') return <span>{item.title}</span>;
                  if (type === 'payment') return <span>{item.title}</span>;
                  return item.title;
                })()}

                {(() => {
                  const type = item.type?.trim();
                  if (type === 'USED_COUPON') {
                    return <ProfileTooltip text={`${item.title} (${item.description || ''})`} />;
                  }
                  if (item.description) {
                    return <ProfileTooltip text={item.description} />;
                  }
                  return <span style={{ color: '#bbb', marginLeft: 4 }}>-</span>;
                })()}
              </Typography>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '100px' } }}>등록됨</Box>
            <Box sx={{ width: { xs: '100%', sm: '150px' } }}>
              {(() => {
                const type_2 = item.type_2?.trim();
                const type = item.type?.trim();
                if (type === 'payment') {
                  if (type_2 === 'ADDON') {
                    return `채널 추가 ${item.num_days}/${item.value}`;
                  } else {
                    return (
                      <Typography className="font-pretendard" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        크레딧
                        <Box
                          component="img"
                          src="/images/credit_token.png"
                          alt="icon"
                          sx={{ objectFit: 'contain' }}
                        />{item.value}
                      </Typography>
                    );
                  }
                } else {
                  return `생성하기 ${item.num_days}/${item.value}`;
                }


              })()}
            </Box>
          </Box>
        ))}
      </Box>
      <CardPopup
        cardList={cardList}
        open={openCardPopup}
        onClose={() => {
          getProfile.current.call();
          setOpenCardPopup(false);
        }}
        getCardList={() => getCardList.current.call()}
        onShowHistory={() => setOpenHistoryPopup(true)}
      />
      <PaymentHistoryDialog
        open={openHistoryPopup}
        onClose={() => {
          setOpenHistoryPopup(false);
          getProfile.current.call();
        }}
      />
      <BuyPackagePopup view="billingInfo" open={openBuyPackagePopup} onClose={() => setOpenBuyPackagePopup(false)} />
    </Box>
  );
};

export default BillingInfo;
