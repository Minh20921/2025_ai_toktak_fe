'use client';

import { showNotice } from '@/utils/custom/notice';
import { formatNumberKR } from '@/utils/format';
import { Box, Button, Dialog, DialogContent, DialogTitle, SxProps, Typography } from '@mui/material';
import API from '@service/api';
import React, { useEffect, useRef } from 'react';
import ProfileTooltip from '../../profile/component/tooltip';
import { PACKAGE_NAME } from './paymentTypes';

interface IRefundDetail {
  status: number;
  message: string;
  message_en: string;
  current_price: number;
  total_payment_with_addon?: number;
  base_day_price: number;
  used_days: number;
  used_money: number;
  total_money_rollback: number;
  package_name: PACKAGE_NAME;
  orgin_price: number;
  used_days_money: number;
  money_created_rollback: number;
  used_created: number;
  used_money_created: number;
  money_refund: number;
  total_link: number;
  days_remaining: number;
  origin_price: number | undefined;
  sns_addon: number;
  sns_money_used: number;
  sns_total_money: number;
  money_sns_refund: number;
  one_days_sns_price: number;
  total_addon_money: number;
  total_refund_money: number;
}

type RefundInfoData = {
  total_refund: {
    label: string;
    value: string; // e.g. '4,167원'
    package: { label: string; unit?: string; value: string };
  };
  deduction: {
    label: string;
    packageName?: string;
    detail: { label: string; unit?: string; value: string; lineThrough?: boolean }[];
  };
};

type RefundDetailData = {
  blocks: RefundInfoData[];
  totalExpectedRefund: string; // e.g. '10,767원'
};

type RefundDetailPopupProps = {
  open: boolean;
  onClose: () => void;
  data?: RefundDetailData;
  idRefund: number | null;
  afterRefund: () => void;

  // ✅ Thêm các props phân trang do cha điều khiển
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
};

const TooltipText = {
  [PACKAGE_NAME.BASIC]: `<span style="display: inline-block; padding-left:24px; padding-right:24px; white-space: nowrap;">
      배이직 요금제 기준<br/>- 콘텐츠 생성: 330원/건<br/>- 이용일 수: 997원/일 <br/>- 콘텐츠 생성 횟수와 이용일 수 중 더 큰 금액만 차감됩니다.
    </span>`,
  [PACKAGE_NAME.STANDARD]: `<span style="display: inline-block; padding-left:24px; padding-right:24px; white-space: nowrap;">
      스탠다드 요금제 기준<br/>- 콘텐츠 생성: 498원/건<br/>- 이용일 수: 764원/일 <br/>- 콘텐츠 생성 횟수와 이용일 수 중 더 큰 금액만 차감됩니다.
    </span>`,
  [PACKAGE_NAME.ADDON]: `<span style="display: inline-block; padding-left:24px; padding-right:24px; white-space: nowrap;">
      - 부가 상품의 경우 이용일 수 기준으로 차감됩니다.<br/>(결제금액÷이용일 수)
    </span>`,
};

const Row = ({
  left,
  center,
  right,
  prefix,
  sx,
  lineThrough,
}: {
  left: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  prefix?: boolean;
  sx?: SxProps;
  lineThrough?: boolean;
}) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 150px',
      alignItems: 'center',
      py: 0.75,
      columnGap: 2,
      position: 'relative',
      ...sx,
    }}
  >
    {lineThrough && (
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '55%',
          height: '1px',
          backgroundColor: '#6A6A6A',
          transform: 'translateY(-55%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    )}
    <Typography sx={{ fontSize: 14, position: 'relative', zIndex: 2, ...sx }}>
      {prefix ? '⌞ ' : ''}
      {left}
    </Typography>
    <Typography sx={{ fontSize: 14, position: 'relative', zIndex: 2, ...sx }}>{center}</Typography>
    <Typography sx={{ fontSize: 14, textAlign: 'right', position: 'relative', zIndex: 2, ...sx }}>{right}</Typography>
  </Box>
);

const RefundInfoBlock: React.FC<{ data: RefundInfoData }> = ({ data }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#090909' }}>{data.total_refund.label}</Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#4776EF' }}>{data.total_refund.value}</Typography>
      </Box>
      <Row
        left={data.total_refund.package.label}
        center={data.total_refund.package.unit}
        right={data.total_refund.package.value}
        sx={{
          width: '100%',
          fontWeight: 500,
          color: '#090909',
        }}
      />
      <Box sx={{ borderTop: '1px solid #E7E7E7', my: 0.5 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
        <Typography
          component="div"
          sx={{ fontSize: 14, fontWeight: 700, color: '#272727', display: 'flex', alignItems: 'center' }}
        >
          {data.deduction.label}
          <ProfileTooltip align="left" text={TooltipText[data.deduction.packageName as PACKAGE_NAME]} />
        </Typography>
      </Box>
      {data.deduction.detail.map((d, i) => (
        <Row
          key={`deduct-${i}`}
          left={d.label}
          center={d.unit}
          right={d.value}
          prefix
          lineThrough={d.lineThrough}
          sx={{
            width: '100%',
            fontWeight: d.lineThrough ? 500 : 700,
            color: '#6A6A6A',
          }}
        />
      ))}
    </Box>
  );
};

export default function RefundDetailPopup({
  open,
  onClose,
  idRefund,
  afterRefund,
  page,
  perPage,
  total,
  onPageChange,
}: RefundDetailPopupProps) {
  const [refundDetail, setRefundDetail] = React.useState<RefundDetailData>();
  const [calculateRefund, setCalculateRefund] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const getRefundRequestAPI = useRef(
    new API(`/api/v1/payment/refund/request`, 'POST', {
      success: (res) => {
        if (res?.code == 200) {
          showNotice('정상 환불되었습니다.', res?.message, false, '확인');
        } else {
          showNotice('환불 실패', res?.message, false, '확인');
        }
        afterRefund();
        onClose();
      },
      finally: () => {
        setLoading(false);
      },
    }),
  );

  const getCaculateRefundAPI = useRef(
    new API(`/api/v1/payment/calculate_refund_price`, 'POST', {
      success: (res) => {
        if (res?.code == 200) {
          setCalculateRefund(res?.data);
        } else {
          showNotice(res?.message, '', false, '확인');
        }
      },
    }),
  );
  useEffect(() => {
    if (calculateRefund) {
      const data: IRefundDetail = calculateRefund || ({} as any);
      let packageLabel = '';
      switch (data?.package_name) {
        case PACKAGE_NAME.BASIC:
          packageLabel = '베이직 요금제';
          break;
        case PACKAGE_NAME.STANDARD:
          packageLabel = '스탠다드 요금제';
          break;
        default:
          packageLabel = '';
          break;
      }

      const planRefund = Number(data?.total_money_rollback || 0);
      const addonRefund = Number((data as any)?.money_sns_refund || 0);
      const totalRefund = Number((data as any)?.total_refund_money || 0);
      const isLineThrough = Number(data?.used_days_money) > Number(data?.used_money_created);
      const blocks: RefundInfoData[] = [
        {
          total_refund: {
            label: '요금제 환불 예정 내역',
            value: `${formatNumberKR(planRefund)}원`,
            package: {
              label: packageLabel,
              unit: undefined,
              value: `${formatNumberKR(Number(data?.total_payment_with_addon || 0))}원`,
            },
          },
          deduction: {
            label: '요금제 차감 금액',
            packageName: data?.package_name,
            detail: [
              {
                label: '콘텐츠 생성 횟수',
                unit: `${Number(data?.used_created || 0)}회`,
                value: data?.used_money_created ? `-${formatNumberKR(Number(data?.used_money_created))}원` : '0원',
                lineThrough: !isLineThrough,
              },
              {
                label: '이용일 수',
                unit: `${Number(data?.used_days || 0)}일`,
                value: data?.used_days_money ? `-${formatNumberKR(Number(data?.used_days_money))}원` : '0원',
                lineThrough: isLineThrough,
              },
            ],
          },
        },
      ];

      if (Number(data?.sns_addon || 0) > 0 && data?.package_name == PACKAGE_NAME.BASIC) {
        blocks.push({
          total_refund: {
            label: '부가 상품 차감 내역',
            value: `${formatNumberKR(addonRefund)}원`,
            package: {
              label: 'SNS 채널 추가',
              unit: `${formatNumberKR(Number(data?.sns_addon))}개`,
              value: `${formatNumberKR(Number(data?.sns_total_money))}원`,
            },
          },
          deduction: {
            label: '부가 상품 차감 금액',
            packageName: PACKAGE_NAME.ADDON,
            detail: [
              {
                label: '이용일 수',
                unit: `${Number(data?.used_days || 0)}일`,
                value: data?.sns_money_used ? `-${formatNumberKR(data?.sns_money_used)}원` : '0원',
              },
            ],
          },
        });
      }

      setRefundDetail({
        blocks,
        totalExpectedRefund: `${formatNumberKR(totalRefund)}원`,
      });
    }
  }, [calculateRefund]);
  useEffect(() => {
    if (idRefund) {
      getCaculateRefundAPI.current.config.data = {
        payment_id: idRefund || undefined,
      };
      getCaculateRefundAPI.current.call();
    } else {
      getCaculateRefundAPI.current.cancel();
    }
  }, [idRefund]);

  const handleRefundSubmit = () => {
    setLoading(true);
    getRefundRequestAPI.current.config.data = {
      payment_id: idRefund || undefined,
    };
    getRefundRequestAPI.current.call();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '16px', p: '48px 53px' } } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '80px',
            height: '80px',
            border: 'none',
            backgroundColor: '#EF44441A',
            backdropFilter: 'blur(75px)',
            boxShadow: '0 0 60px 20px rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
            mb: 5,
          }}
        >
          <img src="/images/home/fail_coupon.gif" alt="icon" />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 21, color: '#090909', textAlign: 'center' }}>
          ⚠️ 환불 신청 전 꼭 확인해 주세요!
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {refundDetail?.blocks?.map((b, i) => (
            <React.Fragment key={`refund-block-${i}`}>
              <RefundInfoBlock data={b} />
              <Box sx={{ borderTop: '1px solid #090909', my: 0.5 }} />
            </React.Fragment>
          ))}

          {/* Total */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#090909' }}>총 환불 예정 금액</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#4776EF' }}>
              {refundDetail?.totalExpectedRefund}
            </Typography>
          </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={onClose}
              sx={{
                fontSize: 18,
                fontWeight: 600,
                background: '#E7E7E7',
                color: '#6A6A6A',
                borderRadius: '9999px',
                height: 50,
                boxShadow: 'none',
                '&:hover': { background: '#DCDCDC', boxShadow: 'none' },
              }}
            >
              취소
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleRefundSubmit}
              disabled={loading}
              sx={{
                fontSize: 18,
                fontWeight: 600,
                background: '#272727',
                color: '#FFFFFF',
                borderRadius: '9999px',
                height: 50,
                boxShadow: 'none',
                '&:hover': { background: '#1F1F1F', boxShadow: 'none' },
              }}
            >
              확인
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
