'use client';
import { showNotice } from '@/utils/custom/notice';
import { Box, Button, Dialog, DialogContent, DialogTitle, Pagination, Typography } from '@mui/material';
import API from '@service/api';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import RefundDetailPopup from './RefundDetailPopup';
import { PACKAGE_NAME } from './paymentTypes';

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDING = 'REFUNDING',
  REFUNDED = 'REFUNDED',
}
export const PackageName = {
  BASIC: '베이직',
  STANDARD: '스탠다드',
  ADDON: 'SNS 채널 추가',
  PACKAGE_10: '10개 패키지',
  PACKAGE_30: '30개 패키지',
  PACKAGE_50: '50개 패키지',
  PACKAGE_100: '100개 패키지',
};
export type PaymentHistoryItem = {
  amount: number;
  approved_at: string;
  created_at: string;
  current_user_subscription: keyof typeof PACKAGE_NAME;
  customer_name: string;
  description: string;
  email: string;
  end_date: string;
  fail_reason: string | null;
  id: number;
  is_renew: number;
  method: string;
  package_name: keyof typeof PACKAGE_NAME;
  parent_id: number;
  payment_data: string;
  payment_date: string;
  payment_method: string;
  payment_status: string | null;
  price: number;
  requested_at: string;
  start_date: string;
  status: PaymentStatus;
  total_create: number;
  total_link: number;
  updated_at: string;
};

type PaymentHistoryDialogProps = {
  open: boolean;
  onClose: () => void;
};

const chipStyles = {
  base: {
    width: 'fit-content',
    minWidth: '80px',
    textAlign: 'center',
    display: 'inline-block',
    padding: '2.5px 12px',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '14px',
    cursor: 'pointer',
  } as React.CSSProperties,
  sale: {
    background: '#4776EF',
    color: '#fff',
  } as React.CSSProperties,
  refund: {
    background: '#A4A4A4',
    color: '#fff',
  } as React.CSSProperties,
  refundRequest: {
    background: '#4776EF',
    color: '#fff',
  } as React.CSSProperties,
};

const isPaidStatus = (item: PaymentHistoryItem): boolean => {

  let package_name = item?.package_name;
  let payment_method = item?.payment_method;
  if (['PACKAGE_10', 'PACKAGE_30', 'PACKAGE_50', 'PACKAGE_100'].includes(package_name) && payment_method === 'FREE') {
    return false
  }

  const today = moment().format('YYYY-MM-DD');
  const startDate = moment(item?.start_date).format('YYYY-MM-DD');
  const endDate = moment(item?.end_date).format('YYYY-MM-DD');
  const isInRange = today >= startDate && today <= endDate;

  return isInRange && item?.status === PaymentStatus.PAID;
};

const isPackageRefundable = (item: PaymentHistoryItem): boolean => {
  const refundablePackages = ['PACKAGE_10', 'PACKAGE_30', 'PACKAGE_50', 'PACKAGE_100'];
  return refundablePackages.includes(item?.package_name as PACKAGE_NAME);
};

const isNonRenewablePackage = (item: PaymentHistoryItem): boolean => {
  // Package credit fail,
  return item?.is_renew === 0 && item?.package_name !== PACKAGE_NAME.ADDON;
};

const canRequestRefund = (item: PaymentHistoryItem): boolean => {
  if (!isPaidStatus(item)) {
    return false;
  }
  console.log('detail', isPackageRefundable(item), isNonRenewablePackage(item));
  return isPackageRefundable(item) || isNonRenewablePackage(item);
};

const getRefundStatusText = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.REFUNDING:
      return '환불 처리중';
    case PaymentStatus.REFUNDED:
      return '환불 완료';
    default:
      return '';
  }
};

export default function PaymentHistoryDialog({ open, onClose }: PaymentHistoryDialogProps) {
  const [items, setItems] = useState<PaymentHistoryItem[]>([]);
  const [refundDetailPopupOpen, setRefundDetailPopupOpen] = useState<number | null>(null);

  // ✅ State phân trang
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const getHistoryAPI = useRef(
    new API(`/api/v1/payment/get_histories`, 'GET', {
      success: (res) => {
        // Chuẩn hoá payload tuỳ backend
        const payload = res?.data ?? res ?? {};
        // Dữ liệu
        setItems(payload?.data || []);
        // Số liệu phân trang (fallback an toàn)
        setTotal(payload?.total_pages);
        setPage(payload?.page ?? page);
        setPerPage(payload?.per_page ?? perPage);
      },
    }),
  );

  const getInvoiceAPI = useRef(
    new API(`/api/v1/payment/get_bill_payment`, 'GET', {
      success: (res) => {
        if (res?.data?.receipt_url) {
          window.open(res?.data?.receipt_url, '_blank');
        } else {
          showNotice(
            '뭔가 잘못됐어',
            '송장을 가져오는 중에 오류가 발생했습니다. 나중에 다시 시도해 주세요.',
            false,
            '확인',
          );
        }
      },
    }),
  );

  const callGetHistory = (p = page, pp = perPage) => {
    getHistoryAPI.current.config.params = { page: p, per_page: pp };
    getHistoryAPI.current.call();
  };

  useEffect(() => {
    if (open) {
      // Mở dialog -> load trang 1
      callGetHistory(1, perPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleViewInvoice = (it: PaymentHistoryItem) => {
    getInvoiceAPI.current.config.params = {
      payment_id: it?.id,
    };
    getInvoiceAPI.current.call();
  };

  const handleRefundRequest = (it: PaymentHistoryItem) => {
    showNotice(
      '⚠️ 환불 신청 전 꼭 확인해 주세요!',
      '결제일로부터 7일 이내, 사용 내역이 없는 경우에만 전액 환불이 가능해요.<br />사용일수나 콘텐츠 사용량에 따라 일부 금액이 공제될 수 있어요.<br />사용량이 많을 경우, 환불 금액이 적거나 환불이 불가능할 수 있어요.',
      true,
      '환불 신청',
      '취소',
      () => {
        setRefundDetailPopupOpen(it?.id);
      },
      'fail_coupon.gif',
    );
  };

  const renderRefundButton = (item: PaymentHistoryItem) => {
    // Show refund request button if eligible
    console.log(`canRequestRefund: ${item.package_name}`, canRequestRefund(item));
    if (canRequestRefund(item)) {
      return (
        <Button
          variant="contained"
          onClick={() => handleRefundRequest(item)}
          style={{
            ...chipStyles.base,
            ...chipStyles.refundRequest,
          }}
        >
          환불 신청
        </Button>
      );
    }

    // Show refund status if in refunding/refunded state
    const statusText = getRefundStatusText(item.status);
    if (statusText) {
      return (
        <span
          style={{
            ...chipStyles.base,
            ...chipStyles.refund,
          }}
        >
          {statusText}
        </span>
      );
    }

    return null;
  };

  // ✅ Đổi trang từ Popup -> gọi lại API ở cha
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    callGetHistory(nextPage, perPage);
  };

  return (
    <React.Fragment>
      <RefundDetailPopup
        idRefund={refundDetailPopupOpen}
        open={!!refundDetailPopupOpen}
        onClose={() => setRefundDetailPopupOpen(null)}
        afterRefund={() => {
          callGetHistory(page, perPage);
        }}
        // ✅ Truyền props phân trang xuống Popup
        page={page}
        perPage={perPage}
        total={total}
        onPageChange={handlePageChange}
      />

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
      >
        <DialogTitle sx={{ p: { xs: 3, sm: 5 }, pb: 0 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: 16, sm: 20 },
              textAlign: 'center',
              color: '#272727',
            }}
          >
            결제 상세 내역
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 3, sm: 5 } }}>
          {items?.length ? (
            <Box sx={{ display: 'grid', rowGap: { xs: 2.5, sm: 3.5 } }}>
              {items?.map((it, idx) => (
                <Box
                  key={`payment-row-${idx}`}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '220px 1fr 120px 80px 80px' },
                    alignItems: 'center',
                    gap: { xs: 1, sm: 3 },
                  }}
                >
                  <Typography sx={{ fontSize: { xs: 14, sm: 16 }, color: '#686868' }}>
                    {moment(it?.start_date).format('YYYY.MM.DD')}~{moment(it?.end_date).format('YYYY.MM.DD')}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 14, sm: 16 }, color: '#686868' }}>
                    {PackageName[it?.package_name as keyof typeof PACKAGE_NAME]}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 14, sm: 16 }, color: '#686868' }}>
                    {moment(it?.end_date).isBefore(moment(), 'day') ? '만료됨' : '등록됨'}
                  </Typography>

                  {[PaymentStatus.PAID, PaymentStatus.REFUNDED, PaymentStatus.REFUNDING].includes(it?.status) && (
                    <Box
                      onClick={() => handleViewInvoice(it)}
                      component="span"
                      style={{
                        ...chipStyles.base,
                        ...chipStyles.sale,
                        ...([PaymentStatus.PAID, PaymentStatus.REFUNDED, PaymentStatus.REFUNDING].includes(it?.status)
                          ? { visibility: 'visible' }
                          : { visibility: 'hidden' }),
                      }}
                    >
                      매출 전표
                    </Box>
                  )}

                  {renderRefundButton(it)}
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                py: 10,
                gap: 5,
              }}
            >
              <Box
                sx={{
                  width: '80px',
                  height: '80px',
                  border: 'none',
                  backgroundColor: '#4776EF14',
                  backdropFilter: 'blur(75px)',
                  boxShadow: '0 0 60px 20px rgba(59,130,246,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '9999px',
                }}
              >
                <img src="/images/home/ring.svg" alt="icon" />
              </Box>
              <Typography sx={{ fontSize: { xs: 14, sm: 16 }, color: '#686868' }}>
                결제 상세 내역이 없습니다.
              </Typography>
            </Box>
          )}

          {/* ✅ Pagination: điều khiển bởi cha, đổi trang sẽ gọi getHistoryAPI ở cha */}
          {total > 1 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination count={total} page={page} onChange={(_e, v) => handlePageChange(v)} />
            </Box>
          )}

          <Box sx={{ mt: { xs: 4, sm: 6 }, display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                background: '#272727',
                borderRadius: '99px',
                px: 4,
                py: 1.5,
                '&:hover': { background: '#1F1F1F' },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 18,
                height: '42px',
                minWidth: '102px',
              }}
            >
              확인
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
