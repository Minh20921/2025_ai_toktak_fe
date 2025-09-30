import type React from 'react';
import { Typography, Box, Container, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { getLogoText } from '../../../../../function/common';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_AI_POLICY } from '@/utils/constant';

const LOGO_TEXT = getLogoText();
const AITerms: React.FC = () => {
  const nameCompany = LOGO_TEXT == 'TOKTAK' ? '톡탁' : '보다 플레이';
  return (
    <Container maxWidth="md" className="font-pretendard sm:py-8 px-0 sm:px-6">
      <SeoHead {...SEO_DATA_AI_POLICY} />
      <Typography variant="h4" component="h1" className="font-pretendard font-bold hidden sm:block">
        AI 약관
      </Typography>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 1조 목적
        </Typography>
        <ul className="font-pretendard list-disc pl-5 sm:pl-8 space-y-2">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            이 약관은 {nameCompany} 내에서 제공하는 AI 기반 기능 및 결과물에 관하여 적용됩니다. 기존 이용약관 및 저작권
            정책에 추가적용 됩니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            사용자는 {nameCompany}에서 제공하는 AI {nameCompany}를 이용하기 전에 본 약관 및 이용약관의 제한 정책에 대해
            확인하고 준수할 책임이 있습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">본 약관은 회사에 의해 수시로 업데이트 될 수 있습니다.</li>
        </ul>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 2조 용어의 정의
        </Typography>
        <Typography className="font-pretendard text-[12px] sm:text-base mb-2">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            AI 기능: {nameCompany}이 제공하는 URL분석 기능, 텍스트 생성 기능을 포함한 AI 기반 모든 기능
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            AI 생성물: {nameCompany} 내에서 AI 기능을 통해 제공된 텍스트, 이미지 및 영상
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            기술 파트너: {nameCompany}이 AI 기능을 제공하기 위해 이용 중인 제 3자 {nameCompany} 제공 업체
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 3조 이용의 제한
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            이용약관에서 금지하고 있는 사항 외에도 다음과 같이 AI 생성물을 사용하는 것을 금지하고 있습니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                AI 생성물이 타인의 개인정보, 초상권, 퍼블리시티권 등을 위반하거나 침해하는 경우
              </li>
              <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">AI 생성물이 의학적 결과로 오해 될 수 있는 경우</li>
              <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">AI 생성물이 인간이 생성한 것으로 오해될 수 있는 경우</li>
              <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                AI 생성물을 사용자 자신이 창작한 것처럼 표현하여 사용하는 경우
              </li>
            </ol>
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 4조 사용자의 권리 및 의무
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            사용자는 AI 기능을 이용하기 위해 입력한 내용에 대한 책임이 있으며, AI 결과물에 대한 저작권은 회사나
            사용자에게 있지 않아 권리를 주장할 수 없습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            본 약관을 준수하지 않고 AI 결과물을 사용하여 발생하는 법적 책임은 사용자에게 있습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            사용자는 머신러닝 모델 또는 관련 기술을 개발하기 위해 AI 결과물을 사용할 수 없습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            사용자가 AI 결과물을 공유 및 게시하고자 할 때, 해당 결과물이 AI로 생성되었다는 점을 명확하게 표시할 것을
            권고합니다.
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 5조 회사의 권리 및 의무
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사가 제공하는 생성AI 결과물은 인공지능에 의해 생성되었으며, 당사는 생성AI 결과물의 정확성, 신뢰성 및
            대표성에 대해 어떤 보증이나 보장도 제공하지 않습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 사용자가 생성AI 결과물 사용시 발생하는 분쟁이나 피해에 대하여 책임지지 않습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 사용자가 입력한 텍스트 또는 사용자가 생성한 결과물에 대해 저작권을 주장하지 않습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 사용자의 생성AI 결과물을 {nameCompany}를 개선하기 위해 활용하거나, 마케팅 및 홍보 목적으로 사용할 수
            있습니다.
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 6조 기술 파트너
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 mb-4">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 생성AI 기반 {nameCompany}를 제공하기 위해 제 3자 {nameCompany} 제공 업체가 제공하는 기술모델을
            사용하고 있습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            사용자가 AI 기능 이용을 위해 입력한 데이터의 일부가 제3자 {nameCompany} 제공업체와 공유될 수 있으며, 제 3자
            제공업체는 이러한 데이터를 자사의 {nameCompany} 개선에 사용할 수 있습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            제 3자 {nameCompany} 제공업체에 공유되는 데이터에는 사용자의 개인 정보가 포함될 수 있으며, 사용자는 당사의
            개인정보처리방침이 해당 개인 정보 처리에 적용된다는 것에 동의합니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            제 3자 {nameCompany} 제공업체의 정책에 따라 사용자가 거주한 국가에 따라 개인정보 보호 수준이 동일하지 않을
            수 있습니다.
          </li>
        </ol>

        <Table className="font-pretendard border-collapse mb-6 text-[#686868]">
          <TableHead>
            <TableRow className="font-pretendard bg-gray-100">
              <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                제 3자 {nameCompany} 제공 업체
              </TableCell>
              <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-boldont-bold">공유 데이터</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-boldont-bold">Google</TableCell>
              <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200">
                사용자가 입력한 상품URL 속 일부 이미지
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-boldont-bold">Open AI, LLC</TableCell>
              <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200">
                사용자가 입력한 상품URL 속 일부 텍스트
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      <Box className="font-pretendard mt-8 text-[#686868]">
        <Typography className="font-pretendard text-[12px] sm:text-base mb-2">공고일자 : 2025년 04월 11일</Typography>
        <Typography className="font-pretendard text-[12px] sm:text-base mb-8">시행일자 : 2025년 04월 11일</Typography>
      </Box>
    </Container>
  );
};

export default AITerms;
