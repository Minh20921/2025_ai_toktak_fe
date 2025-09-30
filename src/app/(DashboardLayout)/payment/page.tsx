'use client';

import SeoHead from '@/app/components/SeoHead';
import { login } from '@/app/lib/store/authSlice';
import { RootState } from '@/app/lib/store/store';
import { SEO_DATA_PAYMENT } from '@/utils/constant';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { formatNumberKR } from '@/utils/format';
import { Icon } from '@iconify/react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import API from '@service/api';
import moment from 'moment';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfoNotice from './components/InfoNotice';
import PackageSelector from './components/PackageSelector';
import PaymentBreakdown, { PaymentItem } from './components/PaymentBreakdown';
import PaymentMethod from './components/PaymentMethod';
import SubscriptionInfo from './components/SubscriptionInfo';
export interface PackageItem {
  name: string;
  title: string;
  price: number;
  price_origin: number;
  credits: number;
  bonusPercent?: string;
  disabled?: boolean;
}
export interface PackageGroup {
  main: PackageItem[];
  credit: PackageItem[];
}
export type PackageName = 'BASIC' | 'STANDARD' | 'PACKAGE_10' | 'PACKAGE_30' | 'PACKAGE_50' | 'PACKAGE_100';

const Payment: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedPackage, setSelectedPackage] = useState<PackageName | undefined>(undefined); // index into flattened group (main followed by credit)
  const [subscriptionPeriod, setSubscriptionPeriod] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');

  const [calculateResult, setCalculateResult] = useState({
    price: 0,
    discount: 0,
    discount_welcome: 0,
    amount: 0,
    new_package_price: 0,
    new_package_price_origin: 0,
    upgrade_price: 0,
  });
  const [addonResult, setAddonResult] = useState({
    price: 0,
    basic_price: 0,
    amount: 0,
    addon_price: 0,
    discount: 0,
  });
  const [extraPrice, setExtraPrice] = useState(0);
  const [addedSns, setAddedSns] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cardList, setCardList] = useState<any[]>([]);

  const getCardList = useRef(
    new API(`/api/v1/payment/cards`, 'GET', {
      success: (res) => {
        const data = res?.data;
        if (data?.length > 0) {
          setCardList(data);
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
      },
    }),
  );

  useEffect(() => {
    getCardList.current.call();
  }, []);
  const fetchUserProfile = async () => {
    const getProfile = new API(`/api/v1/auth/me`, 'GET', {
      success: (res) => {
        const data = res?.data;
        dispatch(login({ user: data }));
        localStorage.setItem('user_level', res?.data.level);
        localStorage.setItem('can_download', res?.data.can_download);
      },
      error: async (err) => {
        console.error('Failed to fetch profile:', err);
      },
      finally: () => {},
    });
    getProfile.call();
  };
  const handleClickBtn = () => {
    if (loading) return;
    setLoading(true);
    if (
      (user?.subscription === 'BASIC' || user?.subscription === 'NEW_USER') &&
      selectedPackage === 'BASIC' &&
      addedSns
    ) {
      buyAddonAPI.config.data = {
        addon_count: addedSns,
      };
      buyAddonAPI.call();
      return;
    } else if (['PACKAGE_10', 'PACKAGE_30', 'PACKAGE_50', 'PACKAGE_100'].includes(selectedPackage || '')) {
      buyPackagePaymentAPI.config.data = {
        package_name: selectedPackage,
      };
      buyPackagePaymentAPI.call();
    } else {
      newPaymentAPI.config.data = {
        package_name: selectedPackage,
        addon_count: addedSns,
      };
      newPaymentAPI.call();
    }
  };

  const [packageList, setPackageList] = useState<PackageGroup>({
    main: [],
    credit: [],
  });

  const getPackageAPI = new API('/api/v1/payment/rate-plan', 'GET', {
    success: (res, customData) => {
      if (res?.code == 200) {
        const data = res?.data;
        setPackageList({
          main: [
            {
              name: 'BASIC',
              title: data['BASIC'].pack_name_display,
              price_origin: data['BASIC'].price_origin,
              price: data['BASIC'].price,
              credits: data['BASIC'].total_credit,
              disabled: ['BASIC', 'STANDARD', 'BUSINESS'].includes(customData?.user?.subscription || ''),
            },
            {
              name: 'STANDARD',
              title: data['STANDARD'].pack_name_display,
              price_origin: data['STANDARD'].price_origin,
              price: data['STANDARD'].price,
              credits: data['STANDARD'].total_credit,
              disabled: ['STANDARD', 'BUSINESS'].includes(customData?.user?.subscription || ''),
            },
          ],

          credit: [
            {
              name: 'PACKAGE_10',
              title: '입문용 패키지',
              price_origin: data['PACKAGE_10'].price_origin,
              price: data['PACKAGE_10'].price,
              credits: data['PACKAGE_10'].total_credit,
            },
            {
              name: 'PACKAGE_30',
              title: '실속 있는 소액 패키지',
              price_origin: data['PACKAGE_30'].price_origin,
              price: data['PACKAGE_30'].price,
              credits: data['PACKAGE_30'].total_credit,
              bonusPercent: '5',
            },
            {
              name: 'PACKAGE_50',
              title: '가장 많이 선택한 패키지',
              price_origin: data['PACKAGE_50'].price_origin,
              price: data['PACKAGE_50'].price,
              credits: data['PACKAGE_50'].total_credit,
              bonusPercent: '10',
            },
            {
              name: 'PACKAGE_100',
              title: 'AI 극대화 고효율 패키지',
              price_origin: data['PACKAGE_100'].price_origin,
              price: data['PACKAGE_100'].price,
              credits: data['PACKAGE_100'].total_credit,
              bonusPercent: '20',
            },
          ],
        });

        const tmpExtraPrice = data['BASIC']?.addon?.EXTRA_CHANNEL?.price;
        if (tmpExtraPrice) {
          setExtraPrice(tmpExtraPrice);
        }
        // getPaymentInfoAPI.config.data = {
        //   package_name: 'BASIC',
        // };
        // getPaymentInfoAPI.call();
      } else {
        showNoticeError(res?.message, '', false, '확인', '취소', () => {
          // setLoading(false);
        });
        return;
      }
    },
    error: (err) => {
      showNoticeError('오류', '정보 업데이트에 실패했습니다.', false, '확인');
    },
    finally: () => {},
  });

  const getPaymentInfoAPI = new API('/api/v1/payment/calculate_upgrade_price', 'POST', {
    success: (res) => {
      if (res?.code == 200) {
        const data = res?.data;
        setSubscriptionPeriod(
          `${moment(data?.start_date, 'YYYY-MM-DD').format('YYYY.MM.DD')} ~ ${moment(data?.end_date, 'YYYY-MM-DD').format('YYYY.MM.DD')}`,
        );
        setNextPaymentDate(moment(data.next_date_payment, 'YYYY-MM-DD').format('YYYY.MM.DD'));
        setCalculateResult(data);
      } else {
        showNoticeError(res?.message, '', false, '확인', '취소', () => {
          // setLoading(false);
        });
        return;
      }
    },
    error: (err) => {
      showNoticeError('오류', '정보 업데이트에 실패했습니다.', false, '확인');
    },
    finally: () => {},
  });

  const newPaymentAPI = new API('/api/v1/payment/create_new_payment', 'POST', {
    success: (res) => {
      if (res?.code == 200) {
        let payment_status = res?.data?.payment?.status;
        if (payment_status == 'PAID') {
          let title = '';
          let message = '';
          let package_name = res?.data?.payment?.package_name;
          switch (package_name) {
            case 'ADDON':
              title = '🎉 SNS 채널 추가가 완료됐어요!';
              message = '더 많은 채널로 당신의 세상을 넓혀보세요.';
              break;
            case 'BASIC':
              title = '🎉 베이직 플랜 가입이 완료됐어요!';
              message = '지금부터 편하게 이용해 보세요.';
              break;
            case 'STANDARD':
              title = '🎉 스탠다드 플랜 가입이 완료됐어요!';
              message = '지금부터 모든 기능을 자유롭게 이용해 보세요.';
              break;
            case 'PACKAGE_10':
              title = `<span style="display: flex; align-items: center;"><img src="/images/welcom_payment.png" alt="FlashIcon" style="width: 41px; height: 30px; vertical-align: middle;" /> 100 결제가 완료되었어요!</span>`;
              message = '지금 바로, 무한한 아이디어를 생성해 보세요.';
              break;
            case 'PACKAGE_30':
              title = `<span style="display: flex; align-items: center;"><img src="/images/welcom_payment.png" alt="FlashIcon" style="width: 41px; height: 30px; vertical-align: middle;" /> 315 결제가 완료되었어요!</span>`;
              message = '지금 바로, 무한한 아이디어를 생성해 보세요.';
              break;
            case 'PACKAGE_50':
              title = `<span style="display: flex; align-items: center;"><img src="/images/welcom_payment.png" alt="FlashIcon" style="width: 41px; height: 30px; vertical-align: middle;" /> 550 결제가 완료되었어요!</span>`;
              message = '지금 바로, 무한한 아이디어를 생성해 보세요.';
              break;
            case 'PACKAGE_100':
              title = `<span style="display: flex; align-items: center;"><img src="/images/welcom_payment.png" alt="FlashIcon" style="width: 41px; height: 30px; vertical-align: middle;" /> 1,200 결제가 완료되었어요!</span>`;
              message = '지금 바로, 무한한 아이디어를 생성해 보세요.';
              break;
            default:
              title = res?.message_title;
              message = res?.message;
              break;
          }
          showNotice(title, message, false, '확인', '취소', () => {
            fetchUserProfile();
            router.push(`/`);
          });
        }
      } else {
        showNoticeError(
          '🥲 결제시 문제가 발생했어요.',
          '다른 결제 수단을 선택해 다시 시도해 주세요.',
          false,
          '확인',
          '',
          () => {
            // setLoading(false);
          },
        );
        return;
      }
    },
    error: (err) => {
      showNoticeError('오류', '정보 업데이트에 실패했습니다.', false, '확인');
    },
    finally: () => {
      setLoading(false);
    },
  });

  const buyPackagePaymentAPI = new API('/api/v1/payment/create_new_package_payment', 'POST', {
    success: (res) => {
      if (res?.code == 200) {
        let payment_status = res?.data?.payment?.status;
        if (payment_status == 'PAID') {
          let title = '';
          let message = '';
          let package_name = res?.data?.payment?.package_name;
          switch (package_name) {
            case 'PACKAGE_10':
              title = `<span style="display: flex; align-items: center;"><img src="/images/welcom_payment.png" alt="FlashIcon" style="width: 41px; height: 30px; vertical-align: middle;" /> 100 결제가 완료되었어요!</span>`;
              message = '지금 바로, 무한한 아이디어를 생성해 보세요.';
              break;
            case 'PACKAGE_30':
              title = `<span style="display: flex; align-items: center;"><img src="/images/welcom_payment.png" alt="FlashIcon" style="width: 41px; height: 30px; vertical-align: middle;" /> 315 결제가 완료되었어요!</span>`;
              message = '지금 바로, 무한한 아이디어를 생성해 보세요.';
              break;
            case 'PACKAGE_50':
              title = `<span style="display: flex; align-items: center;"><img src="/images/welcom_payment.png" alt="FlashIcon" style="width: 41px; height: 30px; vertical-align: middle;" /> 550 결제가 완료되었어요!</span>`;
              message = '지금 바로, 무한한 아이디어를 생성해 보세요.';
              break;
            case 'PACKAGE_100':
              title = `<span style="display: flex; align-items: center;"><img src="/images/welcom_payment.png" alt="FlashIcon" style="width: 41px; height: 30px; vertical-align: middle;" /> 1,200 결제가 완료되었어요!</span>`;
              message = '지금 바로, 무한한 아이디어를 생성해 보세요.';
              break;
            default:
              title = res?.message_title;
              message = res?.message;
              break;
          }
          showNotice(title, message, false, '확인', '취소', () => {
            fetchUserProfile();
            router.push(`/`);
          });
        }
      } else {
        showNoticeError(
          '🥲 결제시 문제가 발생했어요.',
          '다른 결제 수단을 선택해 다시 시도해 주세요.',
          false,
          '확인',
          '',
          () => {
            // setLoading(false);
          },
        );
        return;
      }
    },
    error: (err) => {
      showNoticeError('오류', '정보 업데이트에 실패했습니다.', false, '확인');
    },
    finally: () => {
      setLoading(false);
    },
  });

  const priceCheckAPI = new API('/api/v1/payment/addon/price_check', 'GET', {
    success: (res) => {
      if (res?.code == 200) {
        setAddonResult(res?.data);
      } else {
        showNoticeError(res?.message, '', false, '확인', '취소', () => {
          // setLoading(false);
        });
        return;
      }
    },
    error: (err) => {
      showNoticeError('오류', '정보 업데이트에 실패했습니다.', false, '확인');
    },
    finally: () => {},
  });

  const buyAddonAPI = new API('/api/v1/payment/buy_addon', 'POST', {
    success: (res) => {
      if (res?.code == 200) {
        showNotice(
          '🎉 SNS 채널 추가가 완료됐어요!',
          '더 많은 채널로 당신의 세상을 넓혀보세요.',
          false,
          '확인',
          '',
          () => {
            window.location.href = '/';
          },
        );
        fetchUserProfile();
      } else {
        showNoticeError(res?.message, '', false, '확인', '취소', () => {
          // setLoading(false);
        });
        return;
      }
    },
    error: (err) => {
      showNoticeError('오류', '정보 업데이트에 실패했습니다.', false, '확인');
    },
    finally: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    const p = searchParams.get('package');
    if (!p) return;
    // find index in flattened list
    const group = [...(packageList?.main || []), ...(packageList?.credit || [])];
    const idx = group.findIndex((g) => g.name.toUpperCase() === p.toUpperCase());
    if (idx >= 0) setSelectedPackage(group[idx].name as PackageName);
  }, [searchParams, packageList]);

  useEffect(() => {
    if (selectedPackage) {
      getPaymentInfoAPI.config.data = {
        package_name: selectedPackage.toUpperCase(),
        addon_count: selectedPackage === 'BASIC' && user?.subscription === 'BASIC' ? addedSns : undefined,
      };
      getPaymentInfoAPI.call();
    }
  }, [selectedPackage]);

  useEffect(() => {
    const tmpAddedSns = searchParams.get('addedSns');
    if (tmpAddedSns) {
      setAddedSns(parseInt(tmpAddedSns));
      priceCheckAPI.setUrl(`/api/v1/payment/addon/price_check?addon_count=${parseInt(tmpAddedSns)}`);
      priceCheckAPI.call();
    }
  }, [searchParams.get('addedSns'), packageList]);

  useEffect(() => {
    if (user) {
      getPackageAPI.call({ user: user });
    }
  }, [user]);

  const getPaymentList = (): PaymentItem[] => {
    if (selectedPackage === 'BASIC') {
      if (addedSns && user?.subscription === 'BASIC') {
        return [
          {
            label: `SNS 채널 추가 ${addedSns}개`,
            value: formatNumberKR(extraPrice * addedSns),
          },
          ...(addonResult?.discount
            ? [
                {
                  label: 'SNS 채널 추가 할인',
                  value: formatNumberKR(addonResult.discount),
                  isDiscount: true,
                },
              ]
            : []),
        ];
      }
      return [
        {
          label:
            packageList.main?.find((item) => item.name === selectedPackage)?.title ||
            packageList.credit?.find((item) => item.name === selectedPackage)?.title ||
            '',
          value: formatNumberKR(calculateResult?.new_package_price_origin || 0),
          isPaid: true,
        },
        ...(addedSns > 0
          ? [
              {
                label: `채널 ${addedSns}개 추가`,
                value: formatNumberKR(extraPrice * addedSns),
              },
            ]
          : []),
        ...(calculateResult?.discount_welcome
          ? [
              {
                label: '프로모션 할인',
                value: formatNumberKR(calculateResult?.discount_welcome || 0),
                isDiscount: true,
              },
            ]
          : []),
      ];
    }
    return [
      {
        label:
          packageList.main?.find((item) => item.name === selectedPackage)?.title ||
          packageList.credit?.find((item) => item.name === selectedPackage)?.title ||
          '',
        value: formatNumberKR(calculateResult?.new_package_price_origin || 0),
        isPaid: !!calculateResult?.discount_welcome,
      },
      ...(calculateResult?.discount_welcome
        ? [
            {
              label: '프로모션 할인',
              value: formatNumberKR(calculateResult?.discount_welcome || 0),
              isDiscount: true,
            },
          ]
        : []),
      ...(calculateResult?.discount
        ? [
            {
              label: '업그레이드 리워드',
              value: formatNumberKR(calculateResult?.discount || 0),
              isDiscount: true,
            },
          ]
        : []),
    ];
  };

  return (
    <>
      <SeoHead {...SEO_DATA_PAYMENT} />
      <Box className="font-pretendard sm:px-10 bg-[#F8F8F8] min-h-screen w-full mx-auto sm:py-[40px]">
        <Box className="w-full absolute top-0 z-[999] sm:mx-0 sm:relative leading-[47px] sm:leading-[36px] text-[16px] font-semibold sm:text-[30px] text-[#090909] mb-[20px] sm:mb-[40px] sm:font-bold text-center bg-[#fff] sm:text-left sm:bg-transparent border-b-[1px] border-b-[#F1F1F1] sm:border-b-0">
          <IconButton
            sx={{
              position: 'absolute',
              top: { xs: '10px' },
              left: { xs: '13px' },
              zIndex: 1000,
              p: 0,
              display: { sm: 'none' },
              cursor: 'pointer',
            }}
            onClick={() => router.push('/rate-plan')}
            className="flex-1"
          >
            <Icon icon="ion:chevron-back" color="#090909" width={26} height={26} />
          </IconButton>
          결제 진행
        </Box>
        {selectedPackage && (
          <Box className="w-full flex flex-col gap-[20px] sm:flex-row sm:gap-[10px] justify-center sm:mb-30 px-[20px] sm:px-0 pb-[100px] sm:pb-0">
            <Box>
              <PackageSelector
                packageList={packageList}
                selectedPackageIndex={selectedPackage}
                onChange={(name) => setSelectedPackage(name)}
                addedSns={addedSns}
              />
            </Box>
            <Box className="space-y-[20px] sm:space-y-[10px] w-full sm:w-[487px]">
              <SubscriptionInfo
                selectedPackage={selectedPackage}
                packageTitle={
                  selectedPackage == 'BASIC' && user?.subscription === 'BASIC' && !!addedSns
                    ? 'SNS 채널 추가 플랜'
                    : packageList.main?.find((item) => item.name === selectedPackage)?.title ||
                      packageList.credit?.find((item) => item.name === selectedPackage)?.title ||
                      ''
                }
                subscriptionPeriod={subscriptionPeriod}
                nextPaymentDate={nextPaymentDate}
              />
              <PaymentBreakdown
                items={getPaymentList()}
                amount={
                  (addedSns > 0 && selectedPackage === 'BASIC' ? addonResult?.price : calculateResult?.price) || 0
                }
              />
              <PaymentMethod
                selectedPackage={selectedPackage}
                cardList={cardList}
                getCardList={() => getCardList.current.call()}
              />
              <Typography className="text-xs text-[#6A6A6A] mx-6 !mt-4 !mb-1.5 font-pretendard">
                ※ 본 상품은 디지털 콘텐츠로, 결제 즉시 크레딧이 지급되며 사용 시 환불이 제한됩니다. <br /> 결제를
                진행하면 이에 동의한 것으로 간주됩니다.
              </Typography>
              <Button
                disableElevation
                variant="contained"
                size="large"
                className="fixed bottom-0 w-[calc(100%-40px)] sm:relative sm:w-full h-[50px] rounded-[6px] sm:rounded-[14px] px-0 pt-[9px] bg-[#4776EF]"
                onClick={(e) => {
                  handleClickBtn();
                }}
                disabled={loading || !cardList.find((item: any) => item.is_default === 1)}
              >
                {loading ? (
                  <Image
                    src="/images/home/loading-dot.gif"
                    width={100}
                    height={50}
                    alt="loading"
                    className="object-cover"
                  />
                ) : (
                  <Typography className="text-[16px] font-medium sm:text-[12px] sm:font-semibold text-[#fff]">
                    {formatNumberKR(
                      (addedSns > 0 && selectedPackage === 'BASIC' ? addonResult?.price : calculateResult?.price) || 0,
                    )}
                    원 결제
                  </Typography>
                )}
              </Button>

              <InfoNotice />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Payment;
