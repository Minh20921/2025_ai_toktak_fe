'use client';
import { LocalStorageItems } from '@/../shared/constants';
import type { RootState } from '@/app/lib/store/store';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  Drawer,
  Modal,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import API from '@service/api';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface CardPopupProps {
  cardList?: any[];
  open: boolean;
  onClose: () => void;
  getCardList: () => void;
  isRefundButton?: boolean;
  onShowHistory?: () => void;
}
const enum CANCEL_TYPE {
  PACKAGE = 'PACKAGE',
  ADDON = 'ADDON',
}

export default function CardPopup({
  cardList = [],
  open,
  onClose,
  getCardList = () => {},
  isRefundButton = true,
  onShowHistory = () => {},
}: CardPopupProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const clientKey = process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY as string;
  const [selectedCard, setSelectedCard] = useState(-1);
  const [showCancelContent, setShowCancelContent] = useState<CANCEL_TYPE | undefined>(undefined);
  const [calculateRefund, setCalculateRefund] = useState<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const maskCreditCard = (cardNumber: string) => cardNumber.replace(/(\d{4})/g, '$1 ');

  const getCaculateRefundAPI = useRef(
    new API(`/api/v1/payment/calculate_refund_price`, 'POST', {
      success: (res) => {
        if (res?.code === 200) {
          setCalculateRefund(res?.data);
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
      },
    }),
  );

  useEffect(() => {
    if (cardList.length > 0) setSelectedCard(cardList.find((item: any) => item?.is_default === 1)?.id);
  }, [cardList]);

  useEffect(() => {
    if (open) {
      setShowCancelContent(undefined);
      getCaculateRefundAPI.current.call();
    } else {
      getCaculateRefundAPI.current.cancel();
    }
  }, [open]);

  const saveCardDefaultAPI = useRef(
    new API(`/api/v1/payment/save-default-card-by-id`, 'POST', {
      success: (res) => {
        if (res?.code === 200) {
          showNotice('👏 변경사항이 저장되었습니다.', '요금제를 등록하고 더 많은 기능을 즐겨 보세요.', false, '확인');
          getCardList();
          onClose();
        } else {
          showNoticeError(res?.message, '', false, '확인', '취소', () => {}, 'fail_coupon');
          return;
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
      },
    }),
  );

  const deleteCardAPI = useRef(
    new API(`/api/v1/payment/delete-card-by-id`, 'POST', {
      success: (res) => {
        if (res?.code === 200) {
          getCardList();
        } else {
          showNoticeError(res?.message, '', false, '확인', '취소', () => {}, 'fail_coupon');
          return;
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
      },
    }),
  );

  const cancelPackageAPI = useRef(
    new API(`/api/v1/payment/user_unsubscribe`, 'POST', {
      success: (res) => {
        if (res?.code === 200) {
          showNotice('정상 해지되었습니다.', res?.message, false, '확인', '취소', () => {
            onShowHistory();
            onClose();
          });
        } else {
          showNoticeError(res?.message, '', false, '확인', '취소', () => {}, 'fail_coupon');
          return;
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
      },
      finally: () => {
        setLoading(false);
      },
    }),
  );

  const handleSaveCard = async () => {
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
        });
    } catch (error) {
      console.error(error);
      showNoticeError('Lỗi khi tạo thanh toán', '', false, '확인', '취소', () => {});
    } finally {
      // setLoading(false);
    }
  };

  const saveCardDefault = () => {
    saveCardDefaultAPI.current.config.data = { id: selectedCard };
    saveCardDefaultAPI.current.call();
  };

  const deleteCard = (id: number) => {
    showNotice(
      '🥲 카드를 삭제하시겠습니까?',
      '다시 추가하기 전까지 이 결제수단을 사용할 수 없어요.',
      true,
      '확인',
      '취소',
      () => {
        deleteCardAPI.current.config.data = { id };
        deleteCardAPI.current.call();
      },
    );
  };

  const handleCancelPackage = () => {
    if (user?.subscription === 'BASIC' && user?.total_link_active > 1) {
      showNotice(
        '🥲 이대로 해지하시려고요?',
        'SNS 채널 추가만 해제하시겠습니까?',
        true,
        'SNS 채널 추가 해지',
        '플랜 전체 해지',
        () => {
          setShowCancelContent(CANCEL_TYPE.ADDON);
        },
        undefined,
        () => {
          setShowCancelContent(CANCEL_TYPE.PACKAGE);
        },
      );
    } else if (['BASIC', 'STANDARD', 'BUSINESS'].includes(user?.subscription || '')) {
      showNotice(
        '🥲 이대로 해지하시려고요?',
        '모든 혜택들을 이용할 수 없게 돼요. 그래도 해지하시겠어요?',
        true,
        '확인',
        '취소',
        () => {
          setShowCancelContent(CANCEL_TYPE.PACKAGE);
        },
      );
    }
  };

  const cancelPackage = () => {
    setLoading(true);
    cancelPackageAPI.current.call();
  };

  const Content = (
    <Box
      sx={{
        width: '100%',
        borderRadius: { xs: 0, sm: '30px' },
        backgroundColor: 'white',
        boxShadow: 3,
        p: '30px',
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', sm: 'stretch' },
          position: 'relative',
          mx: 'auto',
        }}
      >
        <Typography
          sx={{
            color: '#090909',
            fontSize: { xs: '18px', sm: '21px' },
            fontWeight: 600,
            textAlign: 'center',
            mt: { xs: 0, sm: '10px' },
          }}
        >
          결제 수단 관리
        </Typography>

        <Box
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'center' },
            width: '100%',
            gap: 2,
          }}
        >
          {cardList.map((cardInfo, index) => {
            return (
              <Box
                key={`card-info-${index}`}
                className="flex gap-[20px] items-center justify-between mt-[15px]"
                sx={{
                  alignItems: { xs: 'start', sm: 'center' },
                  width: '100%',
                  gap: 2,
                  mt: { xs: '32px', sm: '50px' },
                  border: `solid 2px ${selectedCard === cardInfo?.id ? '#4776EF' : '#E7E7E7'}`,
                  borderRadius: '5px',
                  padding: '25px 30px 25px 20px',
                }}
              >
                <Box className="flex">
                  <Box className="w-fit flex items-center justify-center relative">
                    <Checkbox
                      sx={{
                        color: '#E7E7E7',
                        '& .PrivateSwitchBase-input': {
                          width: '100%',
                          height: '100%',
                        },
                        '&.Mui-checked': {
                          color: '#4776EF',
                        },
                      }}
                      checked={selectedCard === cardInfo?.id}
                      onChange={(event) => setSelectedCard(cardInfo?.id)}
                      inputProps={{
                        'aria-labelledby': cardInfo?.id.toString(),
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      fontSize={{ xs: 12, sm: 14 }}
                      color="#6A6A6A"
                      fontWeight={700}
                      sx={{ lineHeight: { xs: '12px', sm: '24px' } }}
                    >
                      {cardInfo?.card_company || ''}
                      {selectedCard === cardInfo?.id && (
                        <span className="text-[#4776EF] text-[10px] bg-[#E5EFFD] rounded-[5px] p-1 ml-2">기본</span>
                      )}
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
                </Box>
                <Button
                  disableElevation
                  variant="contained"
                  size="large"
                  className={`w-[69px] h-[28px] !rounded-[6px] text-[12px] font-semibold px-0 pt-[9px] ${cardInfo ? 'text-[#6A6A6A] border-solid border-[2px] border-[#E7E7E7] bg-transparent' : 'text-[#fff] bg-[#4776EF]'}`}
                  onClick={(e) => {
                    deleteCard(cardInfo?.id);
                  }}
                >
                  <Icon
                    icon={'tabler:trash'}
                    onClick={() => {}}
                    className="cursor-pointer mr-1"
                    width={20}
                    height={20}
                  />
                  삭제
                </Button>
              </Box>
            );
          })}
        </Box>

        {/* BUTTONS */}
        <Box sx={{ width: '100%', mt: '25px', display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
          <Box sx={{ width: '50%', display: 'flex', gap: '16px' }}>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: { xs: 500, sm: 600 },
                px: 0,
                pt: '9px',
                color: '#4776EF',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={handleSaveCard}
            >
              결제 수단 추가하기
            </Typography>
            {['BASIC', 'STANDARD', 'BUSINESS'].includes(user?.subscription || '') && isRefundButton && (
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: { xs: 500, sm: 600 },
                  px: 0,
                  pt: '9px',
                  color: '#A4A4A4',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={handleCancelPackage}
              >
                해지하기
              </Typography>
            )}
          </Box>
          <Box sx={{ width: '50%', display: 'flex', gap: '5px', justifyContent: 'end' }}>
            <Button
              disableElevation
              variant="contained"
              size="large"
              sx={{
                width: '45px',
                height: '30px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: { xs: 500, sm: 600 },
                px: 0,
                pt: '9px',
                backgroundColor: '#E7E7E7',
                color: '#6A6A6A',
                '&:hover': {
                  backgroundColor: '#dcdcdc',
                },
              }}
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              disableElevation
              variant="contained"
              aria-label="save"
              size="large"
              sx={{
                width: '92px',
                height: '30px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: { xs: 500, sm: 600 },
                px: 0,
                pt: '9px',
                backgroundColor: '#4776EF',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#4776EF',
                },
              }}
              onClick={saveCardDefault}
            >
              변경 사항 저장
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  type PricingFeatureProps = {
    children: React.ReactNode;
    showBadge?: boolean;
  };

  const OptimizationBadge: React.FC = () => {
    return (
      <span
        className="self-center px-3.5 pt-1 pb-px m-auto text-xs font-semibold leading-3 text-center text-blue-500 whitespace-nowrap
      border border-[#4776EF] bg-[background: #4776EF1A] bg-opacity-20 rounded-full"
      >
        최적화
      </span>
    );
  };

  const PricingFeature: React.FC<PricingFeatureProps> = ({ children, showBadge }) => {
    return (
      <div className="flex items-center gap-2.5">
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.14773 9.2328C3.14773 5.86024 5.88173 3.12625 9.25429 3.12625C12.6269 3.12625 15.3608 5.86024 15.3608 9.2328C15.3608 12.6054 12.6269 15.3394 9.25429 15.3394C5.88173 15.3394 3.14773 12.6054 3.14773 9.2328ZM9.25429 1.59961C5.03859 1.59961 1.62109 5.0171 1.62109 9.2328C1.62109 13.4485 5.03859 16.866 9.25429 16.866C13.4699 16.866 16.8875 13.4485 16.8875 9.2328C16.8875 5.0171 13.4699 1.59961 9.25429 1.59961ZM12.0651 8.26423C12.3733 7.97653 12.3899 7.49353 12.1023 7.18534C11.8146 6.87715 11.3316 6.86049 11.0234 7.14813L8.27289 9.7153L7.48516 8.98007C7.17697 8.69245 6.69395 8.70909 6.4063 9.01732C6.11866 9.32547 6.13531 9.8085 6.4435 10.0962L7.75208 11.3175C8.04534 11.5912 8.50043 11.5912 8.7937 11.3175L12.0651 8.26423Z"
            fill="#495057"
          />
        </svg>
        <div className="my-auto text-base leading-[25.17px] basis-auto text-[#6A6A6A]">{children}</div>
        {showBadge && <OptimizationBadge />}
      </div>
    );
  };

  const GiftFeature: React.FC<PricingFeatureProps> = ({ children, showBadge }) => {
    return (
      <div className="flex items-center gap-2.5">
        <img src="/images/gift.png" alt="" />
        <div className="my-auto text-base leading-[25.17px] basis-auto text-[#6A6A6A]">{children}</div>
        {showBadge && <OptimizationBadge />}
      </div>
    );
  };

  const PackageDesc = (type: string = 'FREE', totalLinkActive: number = 0) => {
    if (type === 'BASIC') {
      return showCancelContent === CANCEL_TYPE.PACKAGE ? (
        <div className="border-solid border-[1px] border-[#E7E7E7] rounded-[5px] p-4 mt-2">
          <Typography
            sx={{
              color: '#090909',
              fontSize: '16px',
              fontWeight: 700,
              // mt: { xs: 0, sm: '10px' },
            }}
          >
            베이직
          </Typography>
          <div className="">
            <PricingFeature>
              <span>콘텐츠 생성 개수</span>
              <span className="font-bold"> 90개</span>
              <span>/월</span>
              <br></br>
              <span>(상품 30개×영상/이미지/블로그)</span>
            </PricingFeature>
          </div>

          <div className="mt-2.5">
            <PricingFeature>
              <span>생성 콘텐츠 종류</span>
              <span className="font-bold"> 3개</span>
            </PricingFeature>
          </div>

          <div className="mt-2.5">
            <PricingFeature>
              <span>SNS 배포 채널</span>
              <span className="font-bold"> 1개</span>(선택)
            </PricingFeature>
          </div>

          <div className="mt-2.5">
            <PricingFeature>
              <span>SNS당 자동 게시 콘텐츠 수</span>
              <span className="font-bold"> 1개</span>
            </PricingFeature>
          </div>
          <div className="mt-2.5">
            <PricingFeature>
              <span>업로드 방식</span>
              <span className="font-bold"> 자동</span>
            </PricingFeature>
          </div>
          <div className="mt-2.5">
            <PricingFeature>
              <span>멀티링크 제공</span>
            </PricingFeature>
          </div>

          <div className="mt-1">
            <PricingFeature>콘텐츠 다운로드 무제한</PricingFeature>
          </div>

          <div className="mt-1">
            <GiftFeature> 친구 추천 시 최대 90일 무료</GiftFeature>
          </div>
        </div>
      ) : (
        <div className="border-solid border-[1px] border-[#E7E7E7] rounded-[5px] p-4 mt-2">
          <Typography
            sx={{
              color: '#090909',
              fontSize: '16px',
              fontWeight: 700,
              // mt: { xs: 0, sm: '10px' },
            }}
          >
            베이직
          </Typography>
          <div className="">
            <PricingFeature>
              <span>SNS 채널 추가 상품과 연결이 끊어집니다.</span>
            </PricingFeature>
          </div>
        </div>
      );
    }
    return (
      <>
        <div className="border-solid border-[1px] border-[#E7E7E7] rounded-[5px] p-4 mt-2">
          <Typography
            sx={{
              color: '#090909',
              fontSize: '16px',
              fontWeight: 700,
              // mt: { xs: 0, sm: '10px' },
            }}
          >
            스탠다드
          </Typography>
          <div className="">
            <div className="">
              <PricingFeature>
                <span>콘텐츠 생성 개수</span>
                <span className="font-bold"> 180개</span>
                <span>/월</span>
                <br></br>
                <span>(상품 60개×영상/이미지/블로그)</span>
              </PricingFeature>
            </div>
            <div className="mt-2.5">
              <PricingFeature>
                <span>생성 콘텐츠 종류 </span>
                <span className="font-bold"> 3개</span>
              </PricingFeature>
            </div>
            <div className="mt-2.5">
              <PricingFeature>
                <span>SNS 배포 채널</span>
                <span className="font-bold"> 7개</span>
                <span>(모두)</span>
              </PricingFeature>
            </div>

            <div className="mt-2.5">
              <PricingFeature>
                <span>SNS당 자동 게시 콘텐츠 수</span>
                <span className="font-bold"> 2개</span>
              </PricingFeature>
            </div>

            <div className="mt-2.5">
              <PricingFeature>
                <span>업로드 방식</span>
                <span className="font-bold"> AI 자동</span>
              </PricingFeature>
            </div>
            <div className="mt-2.5">
              <PricingFeature>
                <span>멀티링크 제공</span>
              </PricingFeature>
            </div>

            <div className="mt-1">
              <PricingFeature>콘텐츠 다운로드 무제한</PricingFeature>
            </div>
            <div className="mt-2.5">
              <PricingFeature>AI 바이럴 영상</PricingFeature>
            </div>
            <div className="mt-2.5">
              <PricingFeature>AI 바이럴 문구</PricingFeature>
            </div>
            <div className="mt-2.5">
              <GiftFeature>친구 추천 시 최대 90일 무료(베이직)</GiftFeature>
            </div>
          </div>
        </div>
      </>
    );
  };

  const CancelContent = (
    <Box
      sx={{
        width: '100%',
        borderRadius: { xs: 0, sm: '30px' },
        backgroundColor: 'white',
        boxShadow: 3,
        p: '30px',
        mx: 'auto',
        maxHeight: '100%',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', sm: 'stretch' },
          position: 'relative',
          mx: 'auto',
        }}
      >
        <Typography
          sx={{
            color: '#090909',
            fontSize: { xs: '18px', sm: '21px' },
            fontWeight: 600,
            textAlign: 'center',
            mt: { xs: 0, sm: '10px' },
          }}
        >
          결제 수단 해지하기
        </Typography>

        <Box
          sx={{
            fontSize: '16px',
            textAlign: 'center',
            fontWeight: 700,
            width: '100%',
            gap: 2,
            mt: '30px',
          }}
        >
          지금 해지하면
          <br />
          혜택이 모두 사라져요
        </Box>

        {PackageDesc(user?.subscription, user?.total_link_active)}

        <Box className="flex flex-col justify-center items-center mt-[30px]">
          <Icon icon={'streamline-color:calendar-star-flat'} onClick={() => {}} className="" width={52} height={52} />
          <Box
            sx={{
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 700,
              width: '100%',
              color: '#272727',
              gap: 2,
              mt: '20px',
            }}
          >
            김톡탁님, 다음 결제일 까지
            <br />
            아직 <span className="text-[#4776EF]">{calculateRefund?.remaining_days}일</span> 남았어요!
          </Box>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 500,
              px: 0,
              pt: '9px',
              color: '#6A6A6A',
            }}
          >
            남은 기간 동안 혜택을 더 이용해보고 결정하세요.
          </Typography>
          <Typography
            sx={{
              display: 'flex',
              fontSize: '14px',
              fontWeight: 600,
              alignItems: 'center',
              px: 0,
              pt: '30px',
              color: '#272727',
            }}
          >
            <Icon icon={'si:info-fill'} className="mr-1 text-[#E7E7E7]" width={14} height={14} />
            요금제 해지는 이용 종료일 전까지는 언제든지 이용 가능해요
          </Typography>
        </Box>

        {/* BUTTONS */}
        <Box sx={{ width: '100%', mt: '15px' }}>
          <Button
            variant="contained"
            aria-label="save"
            size="large"
            sx={{
              width: '100%',
              height: '40px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: { xs: 500, sm: 600 },
              px: 0,
              pt: '9px',
              backgroundColor: '#4776EF',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#4776EF',
              },
            }}
            onClick={() => {
              // setShowCancelContent(false);
              onClose();
            }}
          >
            내가 받고 있는 혜택 유지하기
          </Button>
          <Button
            variant="contained"
            aria-label="save"
            size="large"
            sx={{
              width: '100%',
              height: '40px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: { xs: 500, sm: 600 },
              px: 0,
              pt: '9px',
              mt: '10px',
              backgroundColor: '#E7E7E7',
              color: '#6A6A6A',
              '&:hover': {
                backgroundColor: '#E7E7E7',
              },
            }}
            onClick={cancelPackage}
            disabled={loading}
          >
            내가 받고 있는 혜택 포기하기
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Loading Modal */}
      <Modal className="w-screen flex items-center justify-center" open={loading} onClose={() => setLoading(false)}>
        <CircularProgress />
      </Modal>

      {/* Main Modal or Drawer */}
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={onClose}
          PaperProps={{ sx: { borderTopLeftRadius: 12, borderTopRightRadius: 12 } }}
        >
          {showCancelContent ? CancelContent : Content}
        </Drawer>
      ) : (
        <Dialog
          open={open}
          onClose={() => {}}
          aria-labelledby="sns-dialog"
          maxWidth="xs"
          fullWidth
          scroll="body"
          PaperProps={{
            style: {
              borderRadius: 30,
              padding: 0,
            },
          }}
        >
          {showCancelContent ? CancelContent : Content}
        </Dialog>
      )}
    </>
  );
}
