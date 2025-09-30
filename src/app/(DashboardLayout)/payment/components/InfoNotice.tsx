'use client';

import { Box, Typography } from '@mui/material';

const InfoNotice: React.FC = () => {
  return (
    <Box className="font-pretendard text-[12px] leading-[1.7] w-full px-6 pt-[30px]">
      <Typography variant="inherit" component="b" fontWeight={700} className="font-pretendard">
        이용 안내
      </Typography>
      <Box
        component="ul"
        className="list-none pl-0 space-y-[2px] [&>li]:flex [&>li]:items-start [&>li]:gap-1 [&>li]:before:content-['-'] [&>li]:before:shrink-0"
      >
        <li>구독 플랜은 결제일 기준 자동 갱신 되며, 해지 전까지 동일 조건으로 계속 결제됩니다.</li>
        <li>
          플랜 해지 시 당월 결제된 요금은 환불 되지 않습니다. 단, 결제 후 7일 이내 크레딧 사용 이력이 없는 경우 전액
          환불 됩니다.
        </li>
        <li>구독 크레딧은 지급일로부터 30일간 유효하며, 이월되지 않고 만료 시 자동 소멸됩니다.</li>
        <li>패키지 크레딧은 결제 즉시 충전 및 사용이 가능하며, 결제일로부터 1년간 유효합니다.</li>
        <li>크레딧은 콘텐츠 생성 개시 시점에 차감되며, 결과 미생성 확인 시 자동 복구됩니다.</li>
        <li>크레딧은 콘텐츠 생성(영상·이미지·블로그), 보이스, 템플릿 등 부가 기능에 사용됩니다.</li>
        <li>
          지급된 크레딧은 일부 양도·현금 전환이 불가하며, 운영 정책에 따라 크레딧 지급 수량 및 조건은 변경될 수
          있습니다.
        </li>
        <li>할인 및 프로모션은 한시적으로 제공되며, 운영 정책에 따라 변경 또는 종료될 수 있습니다.</li>
      </Box>

      <Box className="h-[1px] bg-[#EAEAEA] my-4" />

      <Typography variant="inherit" component="b" fontWeight={700} className="font-pretendard">
        환불 안내
      </Typography>
      <Box component="ul" className="list-none pl-0 space-y-[2px]  [&>li]:before:content-['-'] ">
        <li>
          모든 상품은 선불형 디지털 콘텐츠 입니다. 결제일로부터 7일 이내 사용 이력이 없는 경우에 한해 환불이 가능합니다.
        </li>
        <li>
          사용 이력이 있는 경우:
          <ul className="list-disc pl-5 mt-1 space-y-[2px]">
            <li>
              구독 크레딧: ‘사용일수’ 기준 차감액과 ‘이용 크레딧’ 기준 차감액을 각각 계산한 뒤, 둘 중 큰 차감액을 차감
              후 환불액이 산정됩니다.
            </li>
            <li>패키지 크레딧: 지급된 전체 크레딧 수량과 실제 사용량을 기준으로 비례 차감 후 환불액이 산정됩니다.</li>
          </ul>
        </li>
        <li>이벤트 크레딧(무상/프로모션)은 환불 대상이 아니며, 지급일로부터 30일 경과 시 자동 소멸됩니다.</li>
        <li>
          SNS 채널 추가 서비스는 결제 즉시 이용이 시작되는 디지털 콘텐츠로, 단독 환불은 불가합니다. 단, 베이직 플랜 해지
          시에 한하여, 남은 기간을 기준으로 플랜과 함께 일할 계산하여 환불됩니다.
        </li>
        <li>환불 수단: 결제일 1년 이내는 카드 부분취소, 1년 경과 시 회원 명의 계좌 환불로 처리됩니다.</li>
      </Box>
    </Box>
  );
};

export default InfoNotice;
