import type React from 'react';
import { Typography, Box, Container, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_POLICY } from '@/utils/constant';

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md" className="font-pretendard sm:py-8 px-0 sm:px-6">
      <SeoHead {...SEO_DATA_POLICY} />
      <Typography variant="h4" component="h1" className="font-pretendard font-bold mb-6 hidden sm:block">
        개인정보 처리방침
      </Typography>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          보다플레이(주)(이하 "회사")은 이용자의 개인 정보를 매우 중요하게 생각하며 정보 통신서비스 제공자가 준수하여야
          하는 관련 법령 및 규정을 준수하고 있습니다.
        </Typography>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="h6"
          className="font-pretendard font-bold mb-2 mt-[20px] sm:mt-[50px] text-[12px] sm:text-[18px]"
          sx={{ color: { xs: '#686868' } }}
        >
          1. 수집하는 개인정보
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                회원가입 시에 '이메일, 비밀번호, 이름'를 필수항목으로 수집합니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                서비스 이용 과정에서 사용자가 프로필정보(회사명, 연락처)를 설정할 수 있습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                유료 서비스 이용을 위해 신용카드 결제 시에 '카드번호(일부), 카드사명' 등을 수집합니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                사용자가 회사와 연동 된 제 3자 애플리케이션(예: Google Drive)을 설치하는 과정에서 사용자의 '애플리케이션
                계정 정보'를 수집합니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                사용자가 회사와 연동 된 제 3자 서비스를 이용하는 과정에서 사용자의 'SNS 계정, 게시물 및 광고의 성과
                데이터, 광고 집행 정보'를 수집합니다.
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 아래의 방법을 통해 개인정보를 수집합니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 정보를 입력하는 경우
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                고객센터를 통한 상담 과정에서 웹페이지, 메일, 팩스, 전화 등
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                오프라인에서 진행되는 이벤트, 세미나 등
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                회사와 제휴한 외부 서비스나 단체로부터 개인정보를 제공 받은 경우 (이러한 경우에는 개인정보보호법에 따라
                제휴사에서 이용자에게 개인정보 제공 동의 등을 받은 후에 회사에 제공합니다.)
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            서비스 이용 과정에서 PC웹, 모바일 웹/앱 이용 과정에서 단말기정보(OS, 화면사이즈, 디바이스 아이디, 폰기종,
            단말기 모델명), IP주소, 쿠키(cookie), 방문일시, 부정이용기록, 서비스 이용 기록 등의 정보가 자동으로 생성되어
            수집 될 수 있습니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                쿠키(cookie)는 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에 보내는 아주 작은 크기의 텍스트
                파일입니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                쿠키는 이용자가 다시 웹사이트를 방문할 경우 웹사이트 서버가 PC에 저장된 쿠키의 내용을 읽어 이용자가
                설정한 서비스 이용환경을 유지하여 편리한 인터넷 서비스 이용을 제공할 수 있게 합니다. 또한 이용자의
                웹사이트 방문기록, 이용 형태 등을 분석하여 이용자의 취향과 관심에 특화된 서비스(광고 포함)을 제공하기
                위해 활용됩니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                이용자는 쿠키에 대한 선택권을 가지고 있으며, 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나,
                쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다. 다만, 쿠키의
                저장을 거부할 경우에는 로그인이 필요한 일부 서비스의 이용에 불편이 있을 수 있습니다.
              </li>
            </ol>
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="h6"
          className="font-pretendard font-bold mb-2 mt-[20px] sm:mt-[50px] text-[12px] sm:text-[18px]"
          sx={{ color: { xs: '#686868' } }}
        >
          2. 수집한 개인정보의 이용
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 회원관리, 서비스 개발, 서비스 운영 등을 위해 개인정보를 이용합니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                회원 식별/가입의사 확인, 부정이용 방지 등 회원관리
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                유료 서비스 제공에 따른 본인인증, 요금 결제
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                서비스 이용 기록, 접속 빈도 및 서비스 이용에 대한 통계 및 분석에 따른 맞춤형 콘텐츠 제공에 활용
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                이벤트 정보 및 참여 기회 제공, 광고성 정보 제공 등 마케팅 및 프로모션에 활용
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                보안, 프라이버시 보호 측면의 안전한 서비스 환경 구축
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                기존 서비스 개선, 신규 서비스 개발, 문의사항 처리, 공지사항 전달 등의 서비스 개발 및 운영
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                법령 및 이용약관을 위한하는 회원에 대한 이용제한 조치, 부정이용 행위를 포함한 서비스의 원활한 운영에
                지장을 주는 행위에 대한 방지 및 제제
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                소셜 미디어 공유, 광고 집행, 광고 결과 분석 등의 제 3자 연동 서비스의 제공
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            개인정보를 추가적인 이용・제공을 하는 경우가 있습니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                수집 목적과 합리적으로 관련된 범위에서는 법령에 따라 이용자의 동의 없이 개인정보를 이용하거나 제3자에게
                제공할 수 있으며, 이때 '당초 수집 목적과 관련성이 있는지, 수집한 정황 또는 처리 관행에 비추어 볼 때
                개인정보의 추가적인 이용 또는 제공에 대한 예측 가능성이 있는지, 이용자의 이익을 부당하게 침해하는지,
                가명처리 또는 암호화 등 안전성 확보에 필요한 조치를 하였는지'를 종합적으로 고려합니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                개인정보는 특정 개인을 알아볼 수 없도록 가명 처리하여 통계 작성, 과학적 연구, 공익적 기록 보존 등을
                위하여 이용할 수 있습니다. 이 때 가명정보는 재식별되지 않도록 추가정보와 분리하여 별도 저장·관리하고
                필요한 기술적·관리적 보호조치를 취합니다.
              </li>
            </ol>
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="h6"
          className="font-pretendard font-bold mb-2 mt-[20px] sm:mt-[50px] text-[12px] sm:text-[18px]"
          sx={{ color: { xs: '#686868' } }}
        >
          3. 개인정보의 제3자 제공 및 위탁
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 서비스 제공, 운영 및 개발을 목적으로 이용자의 개인정보를 제3자에게 제공하고 있습니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                회사는 더 나은 서비스 제공을 위해 필요한 업무 중 일부를 외부 업체에 위탁하고 있으며, 위탁 받은 업체가
                개인정보보호법에 따라 개인정보를 안전하게 처리하도록 필요한 사항을 규정하고 관리/감독하고 있습니다.
              </li>
            </ol>
          </li>
        </ol>

        <Box className="font-pretendard sm:ml-16 mt-4 mb-4">
          <Table className="font-pretendard border-collapse">
            <TableHead>
              <TableRow className="font-pretendard bg-gray-100">
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                  수탁 업체
                </TableCell>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                  위탁업무 내용
                </TableCell>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                  개인정보의 보유 및 이용기간
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                  AWS
                </TableCell>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200">
                  데이터 저장
                </TableCell>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200" rowSpan={8}>
                  회원 탈퇴 및 위탁계약 종료 시까지
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                  Google Analytics
                </TableCell>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200" rowSpan={2}>
                  사용데이터의 분석
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200"></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                  Meta
                </TableCell>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200" rowSpan={4}>
                  맞춤형 타겟팅 광고 서비스
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                  Google Display Network(GDN)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                  Tiktok
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                  YouTube
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200 font-bold">
                  토스페이먼츠
                </TableCell>
                <TableCell className="font-pretendard text-[12px] sm:text-base border border-gray-200">
                  결제 대행
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]" start={2}>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 이용자가 외부 제휴사의 서비스를 이용하는 경우 서비스 사용에 필요한 범위 내에서 이용자의 동의를 얻은
            후에 개인정보를 활용할 수 있습니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                단, 회사는 외부 제휴사를 통해 수집한 이용자의 개인정보를 다음의 목적으로 제3자에게 제공하지 않습니다.
                <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
                  <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                    이용자 개인정보의 직접 또는 정보판매 업체에 판매
                  </li>
                  <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">신용, 담보 등의 대출</li>
                  <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                    인터넷 사용 패턴, 관심사, 인구통계 등에 기반한 타겟 광고
                  </li>
                  <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                    리타겟 광고, 개인화 광고, 사용자 광고 등
                  </li>
                </ol>
              </li>
              <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                회사는 YouTube 계정의 정보(조회수, 좋아요, 싫어요, 댓글) 수집을 위해 Google API Client(YouTube Data
                API)를 이용합니다. 회사의 API접근을 원치 않는 경우 다음 링크{' '}
                <a
                  target="_blank"
                  href="https://myaccount.google.com/connections?filters=3,4&hl=ko"
                  className="font-pretendard text-blue-600 underline"
                >
                  Google Third-Party Apps &amp; Services
                </a>
                에서 권한을 해제할 수 있습니다. 이용자가 유튜브 서비스 이용 시, 유튜브와 구글의 정책 및 약관에 동의한
                것으로 간주합니다.
                <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
                  <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                    <a
                      target="_blank"
                      href="https://www.youtube.com/static?template=terms"
                      className="font-pretendard text-blue-600 underline"
                    >
                      YouTube 서비스 약관
                    </a>
                  </li>
                  <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                    <a
                      target="_blank"
                      href="https://www.youtube.com/intl/ALL_kr/howyoutubeworks/user-settings/privacy/"
                      className="font-pretendard text-blue-600 underline"
                    >
                      YouTube 개인 정보 보호 설정
                    </a>
                  </li>
                  <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                    <a
                      target="_blank"
                      href="https://developers.google.com/terms/api-services-user-data-policy"
                      className="font-pretendard text-blue-600 underline"
                    >
                      YouTube API 약관
                    </a>
                  </li>
                  <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                    <a
                      target="_blank"
                      href="https://policies.google.com/privacy"
                      className="font-pretendard text-blue-600 underline"
                    >
                      구글 개인정보 처리방침
                    </a>
                  </li>
                </ol>
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base sm:ml-4 leading-5 sm:leading-7">
            그리고 관련 법령에 의거해 회사에 개인정보 제출 의무가 발생한 경우, 재난, 감염병, 생명 위험을 초래하는
            사건사고, 급박한 재산 손실 등의 긴급상황이 발생하는 경우 이를 해소하기 위한 경우에 한하여 개인정보를
            제공하고 있습니다.
          </li>
        </ol>
      </Box>
      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="h6"
          className="font-pretendard font-bold mb-2 mt-[20px] sm:mt-[50px] text-[12px] sm:text-[18px]"
          sx={{ color: { xs: '#686868' } }}
        >
          4. AI/ML 모델 학습
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            톡탁은 AI 및/또는 ML 모델을 개발, 개선 또는 훈련하는 데 Google 사용자 데이터를 사용하지 않습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            Google Workspace API가 일반화/비개인화 AI 및/또는 ML 모델을 개발, 개선 또는 훈련하는 데 사용되지 않습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            톡탁에서 타사 AI 도구로 전송하는 Google 사용자 데이터의 내용 과 해당 전송이 일반화/비개인화 AI/ML 모델에는
            적용되지 않습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            추후 서비스를 개선/업그레이드를 하기 위해 사용자 데이터의 학습/훈련이 필요한 경우에는 개정 최소 30일 전에
            사전에 안내를 하겠습니다.
          </li>
        </ol>
      </Box>
      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="h6"
          className="font-pretendard font-bold mb-2 mt-[20px] sm:mt-[50px] text-[12px] sm:text-[18px]"
          sx={{ color: { xs: '#686868' } }}
        >
          5. 개인정보의 파기
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 원칙적으로 이용자가 회원 탈퇴 시 수집한 개인정보를 지체 없이 파기합니다. 단, 이용자에게 개인정보
            보관기간에 대해 별도의 동의를 얻은 경우, 또는 법령에서 일정 기간 정보보관 의무를 부과하는 경우에는 해당 기간
            동안 개인정보를 안전하게 보관합니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            법령(전자상거래 등에서의 소비자 보호에 관한 법률, 전자문서 및 전자거래 기본법, 통신비밀보호법 등)에서
            일정기간 정보의 보관을 규정하는 경우는 아래와 같습니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                계약 또는 청약철회 등에 관한 기록: 5년 보관
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                대금결제 및 재화 등의 공급에 관한 기록: 5년 보관
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                소비자의 불만 또는 분쟁처리에 관한 기록: 3년 보관
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                전자금융 거래에 관한 기록: 5년 보관
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                표시•광고에 관한 기록: 3년 보관
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                서비스 방문 기록: 3개월
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base sm:ml-4 leading-5 sm:leading-7">
            개인정보의 수집 및 이용 목적의 달성 또는 회원 탈퇴 등 파기 사유가 발생한 경우, 개인정보는 형태를 고려하여
            재생이 불가능한 방법으로 파기하고 있습니다. 전자적 파일 형태의 경우 복구 및 재생이 되지 않도록 기술적인
            방법을 이용하여 안전하게 삭제하며, 출력물 등은 분쇄하거나 소각하는 방식 등으로 파기합니다.
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="h6"
          className="font-pretendard font-bold mb-2 mt-[20px] sm:mt-[50px] text-[12px] sm:text-[18px]"
          sx={{ color: { xs: '#686868' } }}
        >
          6. 이용자 및 법정대리인의 권리
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, '회원탈퇴' 등을 통해 개인정보 수집 및
            이용에 대한 동의 철회를 요청할 수 있습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            이용자 및 법정 대리인의 권리는 '내 정보' 페이지 등에서 직접 처리 하거나, 서비스 '문의하기' 기능, 서면, 전화,
            이메일 등을 통해 요청할 수 있습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            개인정보 오류에 대한 정정을 요청하는 경우, 정정을 완료하기 전까지 해당 개인정보를 이용 또는 제공하지
            않습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            만 14세 미만 아동의 법정대리인은 아동의 개인정보를 조회하거나 수정 및 삭제, 처리정지, 수집 및 이용, 제공
            동의를 철회할 권리를 가집니다.
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="h6"
          className="font-pretendard font-bold mb-2 mt-[20px] sm:mt-[50px] text-[12px] sm:text-[18px]"
          sx={{ color: { xs: '#686868' } }}
        >
          7. 개인 정보 보호를 위한 회사의 노력
        </Typography>
        <Typography className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7 mb-2">
          회사는 이용자들의 소중한 개인정보 보호를 위해 다음의 노력을 하고 있습니다.
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            개인정보 암호화
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                이용자의 비밀번호 등 중요 정보는 암호화하여 보관하고 있으며, 또한 암호화 된 통신 구간을 이용하여
                네트워크 상에서도 안전하게 송수신하고 있습니다.
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            해킹, 바이러스 등에 대비한 대책
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                해킹이나 컴퓨터 바이러스 등에 의해 회원의 개인정보가 유출되거나 훼손되는 것을 막기 위해 외부로부터
                접근이 통제된 구역에 시스템을 설치하고 있으며, 출입통제 절차를 수립/운영하고 있습니다. 또한 개인정보
                훼손에 대비하여 자료를 수시고 백업하고 있고, 백신 프로그램을 설치하여 시스템이 최신 악성코드나
                바이러스에 감염되지 않도록 노력하고 있습니다.
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            개인정보 취급 직원의 최소화 및 교육
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                회사는 개인정보를 취급하는 직원을 최소한으로 제한하고 있으며, 관련 직원들에 대한 수시 교육을 실시하여
                개인정보 취급방침의 중요성을 인지시키고 있습니다. 또한 개인정보를 보관하는 데이터베이스 시스템과
                개인정보를 처리하는 시스템에 대한 비밀번호의 생성과 변경, 그리고 접근할 수 있는 권한에 대한 체계적인
                기준을 마련하여 적용하고 있습니다.
              </li>
            </ol>
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="h6"
          className="font-pretendard font-bold mb-2 mt-[20px] sm:mt-[50px] text-[12px] sm:text-[18px]"
          sx={{ color: { xs: '#686868' } }}
        >
          8. 개인정보 보호책임자 및 담당부서
        </Typography>
        <Typography className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7 mb-2 text-[#686868]">
          회사는 이용자의 개인정보 관련 문의사항 및 불만 처리 등을 위하여 아래와 같이 개인정보 보호책임자 및 담당부서를
          지정하고 있습니다.
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            개인정보 보호책임자 및 담당부서
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">이름: 김진</li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">소속 : CSO</li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">전화: 02-2071-0712</li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">메일: cso@bodaplay.ai</li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            기타 개인정보 침해에 대한 신고나 상담이 필요한 경우에 아래 기관에 문의 가능합니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                개인정보 침해 신고센터 :{' '}
                <a
                  target="_blank"
                  href="https://privacy.kisa.or.kr/"
                  className="font-pretendard text-blue-600 underline"
                >
                  https://privacy.kisa.or.kr
                </a>{' '}
                / (국번없이)118
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                대검찰청 사이버수사과 :{' '}
                <a target="_blank" href="https://spo.go.kr/" className="font-pretendard text-blue-600 underline">
                  https://spo.go.kr
                </a>{' '}
                / (국번없이)1301
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                경찰청 사이버안전국 :{' '}
                <a
                  target="_blank"
                  href="https://ecrm.police.go.kr/"
                  className="font-pretendard text-blue-600 underline"
                >
                  https://ecrm.police.go.kr
                </a>{' '}
                / (국번없이)182
              </li>
            </ol>
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868] ">
        <Typography
          variant="h6"
          className="font-pretendard font-bold mb-2 mt-[20px] sm:mt-[50px] text-[12px] sm:text-[18px]"
          sx={{ color: { xs: '#686868' } }}
        >
          9. 개정 전 고지 의무
        </Typography>
        <Typography className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7 mb-4">
          본 개인정보처리방침의 내용 추가, 삭제 및 수정이 있을 경우 개정 최소 7일 전에 사전에 안내를 하겠습니다. 다만,
          수집하는 개인정보의 항목, 이용목적의 변경 등과 같이 이용자 권리의 중대한 변경이 발생할 때에는 최소 30일 전에
          미리 알려드리겠습니다.
        </Typography>
        <Typography className="font-pretendard text-[12px] sm:text-base mb-2">공고일자 : 2025년 04월 11일</Typography>
        <Typography className="font-pretendard text-[12px] sm:text-base mb-2">시행일자 : 2025년 04월 11일</Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
