import type React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { getLogoText } from '../../../../../function/common';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_COPYRIGHT } from '@/utils/constant';
const LOGO_TEXT = getLogoText();

const CopyrightPolicy: React.FC = () => {
  const nameCompany = LOGO_TEXT == 'TOKTAK' ? '톡탁' : '보다 플레이';

  return (
    <Container maxWidth="md" className="font-pretendard sm:py-8 px-0 sm:px-6">
      <SeoHead {...SEO_DATA_COPYRIGHT} />
      <Typography variant="h4" component="h1" className="font-pretendard font-bold hidden sm:block">
        저작권 정책
      </Typography>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 1조 목적
        </Typography>
        <Typography className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7 mb-4">
          "이 약관은 보다플레이(주)(이하 '회사'라 한다.)가 운영하는 {nameCompany} 웹사이트와 애플리케이션에서 제공하는
          템플릿 및 각종 콘텐츠에 대한 저작권을 규정하기 위한 것으로 {nameCompany}을 사용하는 사용자는 아래의 항목에
          동의한 것으로 간주합니다."
        </Typography>
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
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            {nameCompany} 서비스: {nameCompany} 서비스는 회사가 제공하는 SNS 콘텐츠(글, 템플릿, 디자인요소, 결과글,
            영상, 이미지 등), SNS 콘텐츠를 제작하는 도구를 포함하여 회사가 정한 방식에 따라 회원이 SNS 계정을 연결하여
            소셜 미디어에 포스팅, 광고 생성 및 운영, 성과 관리를 위한 제반 서비스 일체를 말합니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회원: {nameCompany} 서비스를 이용하기 위해 이용계약(회원가입) 과정에서 이용약관에 동의하고 {nameCompany}{' '}
            계정을 부여 받은 사람을 말합니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            템플릿: {nameCompany} 서비스에서 제공하는 정보 전달 목적의 미리 제작된 글, 영상, 이미지 결과물을 말합니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            디자인요소: 글, 영상, 이미지 결과물을 구성하는 단수 혹은 복수의 '동영상, 이미지, 텍스트, 폰트, 모션그래픽,
            음악, 컬러 등'과 같은 요소를 말합니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                회사는 {nameCompany} 서비스에서 제공하는 템플릿 혹은 {nameCompany} 에디터 내의 편집옵션을 통해
                디자인요소를 제공합니다. 사용자도 {nameCompany} 서비스 내 웹사이트 링크 분석, 파일 업로드, 회원 채널
                연결 등의 기능을 통해 디자인요소를 추가할 수 있습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                디자인 요소의 대표적인 예시
                <ol className="font-pretendard list-decimal mt-2 space-y-2">
                  <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                    템플릿에 사용된 샘플용 이미지, 동영상, 모션 효과, 도형
                  </li>
                  <li className="font-pretendard text-[12px] sm:text-base ml-4 sm:ml-8">
                    {nameCompany} 에디터에서 제공되는 음악, 폰트, 목소리
                  </li>
                </ol>
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            {nameCompany} 에디터: {nameCompany} 웹사이트에서 제공하는 글, 영상, 이미지 템플릿을 편집하는 소프트웨어를
            말합니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            결과 글, 영상, 이미지: 사용자가 제공된 템플릿을 {nameCompany} 에디터를 통해 제작한 결과물을 말합니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                사용자의 창작성이 가미 되지 않은 글, 영상, 이미지 결과물은 저작권법 및 관련 법령에 의하여 템플릿
                복제물로 판단됩니다.
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            스크랩핑: {nameCompany} 서비스에서 웹페이지 분석 기능을 제공하기 위해, 입력된 웹페이지 주소에 접속하여 해당
            페이지 내의 콘텐츠를 우리의 클라우드 서버로 가져오는 행위를 말합니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            광고 채널: {nameCompany} 서비스를 통해 광고가 노출되는 Meta, Tiktok 등의 디지털 광고 플랫폼을 말합니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회원 채널: 회원이 소유한 디지털 SNS 플랫폼의 계정을 말합니다. 사용자는 채널 연결 기능을 통해 소유한 디지털
            SNS 플랫폼의 계정을 {nameCompany} 회원 계정에 연결할 수 있습니다.
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 3조 콘텐츠 저작권
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            {nameCompany}에서 제공하는 모든 템플릿 및 개별 디자인 요소의 저작권은 회사가 소유하고 있거나 원저작자에
            사용허가를 받아 제공되고 있습니다. 아울러 제공되는 모든 템플릿 및 개별 디자인요소들은 국내 및 국제 저작권의
            보호를 받습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            본 저작권 정책 조항에서 사용자에게 명시적으로 부여되지 않은 모든 권리(저작권, 지적재산권 등)은 회사 및
            원저작자가 보유합니다.
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 4조 콘텐츠 활용 범위
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            사용자는 {nameCompany}에서 제작한 결과 글, 영상, 이미지를 인터넷/모바일 등에 자유롭게 게시, 공유, 배포 할 수
            있습니다. 다만 아래사항은 예외로 합니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                {nameCompany}에서 제공된 인물사진(이미지) 등을 외설적이거나 타인의 명예를 훼손할 수 잇는 경우에 사용할
                수 없으며, 성형외과/산부인과/비뇨기과 등에서 모델로 사용할 경우, 의료 시술의 비포와 애프터 용도로
                사용하거나, 시술 및 제품을 체험한 것처럼 오인하게 하거나, 얼굴/체형 등을 합성, 변형, 수정하여
                사용하거나, 허위사실을 기재하여 사용할 수 없습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                {nameCompany}에서 제공된 사진을 특정회사의 실제 상품으로 오인할 정도로 중대한 착오를 일으키도록
                사용하거나, 인물(모델) 사진을 왜곡하여 모델의 명예를 훼손하는 용도로 사용할 수 없습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                {nameCompany}에서 제공된 인물(모델) 사진은 사회 미풍양속을 저해하는 용도나, 고리대금업, 운세상담,
                사주풀이, 미팅알선, 결혼정보 등에 사용하는 것을 금합니다. 또한 특정 제품이나 서비스를 모델이 보증하는
                형식의 과대광고 등에 사용하거나, 모델의 신체 및 얼굴 등과 제3자의 사진을 합성하여 재가공하는 행위 등은
                할 수 없습니다.
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            사용자는 {nameCompany}에서 제공하는 콘텐츠(템플릿, 디자인요소, 결과 글, 영상, 이미지 등)를 이용할 때 아래
            내용을 준수해야 합니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                {nameCompany}에서 제공하는 모든 콘텐츠는 회사의 허락 없이 재라이센싱, 재판매할 수 없습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                {nameCompany}에서 제공하는 디자인 요소를 개별 단독으로는 다운로드 혹은 캡처/녹화 등을 통하여 복제하거나,
                이를 수정하여 사용할 수 없습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                {nameCompany}에서 제공하는 디자인 요소를 포함하여 제작된 결과 글, 영상, 이미지를 배타적 권리를 주장할 수
                있는 상표권이나, 저작권 등록 등에는 사용할 수 없습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                {nameCompany}에서 제공하는 디자인 요소를 포함하여 제작된 결과 글, 영상, 이미지를 저작권의 귀속을
                요구조건으로 하는 공모전 등에 출품할 수 없습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                {nameCompany}에서 제공하는 템플릿을 복제 및 수정하여, 이를 편집이 가능한 템플릿으로 재판매 할 수
                없습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                {nameCompany}에서 제공되는 모든 콘텐츠를 회사의 허락 없이 다른 서버에 미러링 할 수 없습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                템플릿 혹은 결과 글, 영상, 이미지에 포함된 워터마크, 회사의 로고, copyright 문구 등 회사에 의하여 삽입된
                표식을 제거할 수 없습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                사용자는 유료 요금제 이용 시 요금제에 표시된 사용 대상에 맞게 결제해야 합니다. 요금제 가격은{' '}
                {nameCompany}
                내에 공개된 가격 정책을 따릅니다. 만약 사용자가 요금제에 표시된 사용대상과 일치하지 않을 경우, 회사는
                서비스를 중단할 수 있으며, 이 때 사용자는 잔여기간에 따른 환불을 받을 수 없습니다.
              </li>
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                사용자는 {nameCompany} 에디터를 이용하여 제작한 결과 글, 영상, 이미지를 다른 편집도구(예) 포토샵,
                일러스트 등)에서 재편집할 수 없습니다. 단 다운 받은 결과 이미지를 다른 동영상 편집기에 원본 그대로
                삽입하거나 영상과 결합하여 사용할 수 있습니다. 또한 다운 받은 결과 영상을 다른 동영상 편집기에서 자막,
                더빙, 요소, 효과삽입과 같이 길이, 화면 자르기 및 붙이기 작업을 할 수 있습니다. 만약 이렇듯 다른 편집
                프로그램을 통해 재편집한 경우 이 때 제작된 파생물로 인하여 발생하는 문제에 대해 회사는 책임을 지지
                않습니다.
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 서비스의 안내 또는 마케팅을 목적으로 사용자가 {nameCompany} 서비스를 통해 제작한 결과 글, 영상,
            이미지의 일부 또는 전체를 활용할 수 있습니다. 사용자는 언제든지 해당 결과 글, 영상, 이미지 활용에 대해
            사용정지, 비공개 등의 조치를 요청할 수 있으며, 회사는 사용자의 요청을 지체없이 처리합니다.
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 5조 무료 공급자 콘텐츠
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            서비스에 콘텐츠를 제공하는 무료 공급자가 있을 수 있으며, 무료 공급자가 제공하는 콘텐츠의 경우 각 공급자가
            명시하는 저작권 정책을 준수하여 사용해야 합니다
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mb-6 text-[#686868]">
        <Typography
          variant="subtitle1"
          className="font-pretendard font-bold mb-4 text-[12px] sm:text-base"
          sx={{ color: { xs: '#686868' } }}
        >
          제 6조 면책
        </Typography>
        <ol className="font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]">
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            사용자가 {nameCompany} 서비스에 등록하거나 회사에게 제공한 글, 이미지, 영상, 폰트, 음악을 포함한 모든 유형의
            자료에 타인의 저작권을 침해하는 내용이 포함되는 경우, 이에 대한 모든 법적 책임은 회사에 있지 않고 이를
            등록하거나 제공한 사용자에게 있습니다.
            <ol className="font-pretendard list-decimal pl-6 sm:pl-20 mt-2 space-y-2">
              <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
                사용자가 입력한 웹페이지 주소를 스크랩핑하여 수집된 콘텐츠 또한 사용자가 등록한 자료로 간주되며, 해당
                자료의 저작권 침해와 관련된 모든 법적 책임은 사용자가 부담합니다.
              </li>
            </ol>
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            회사는 사용자가 제공한 자료의 저작권, 지적재산권과 관련하여 검증할 의무를 부담하지 않으며, 사용자가 제공한
            자료로 인해 발생하는 법적 분쟁 또는 손해에 대해 회사는 일체의 책임을 지지 않습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            사용자가 제작한 결과 글, 영상, 이미지의 내용에 대해 회사는 정확성이나 신뢰성을 보증하지 않으며, 이로 인해
            발생하는 모든 법적 책임은 회사에 있지 않고 이를 제작한 사용자에게 있습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            {nameCompany}에서 제공하는 템플릿 또는 개별 디자인요소에 저작권 계약의 종료 또는 범위 변경 등의 부득이한
            사유로 사용중지가 필요한 경우, 회사는 사용자에게 공지 또는 메일을 통해 이를 안내하고 다른 템플릿 또는
            디자인요소로 교체를 요청할 수 있습니다. 사용자에게 회사의 안내가 도달한 후 사용자가 해당 템플릿 또는
            디자인요소를 계속 사용하여 발생하는 문제에 대해 회사는 책임을 지지 않습니다.
          </li>
          <li className="font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7">
            본 약관 및 저작권 정책에서 벗어나는 방식으로 {nameCompany} 서비스에서 제공하는 콘텐츠를 활용하여 저작권
            분쟁이 발생하는 경우, 사용자는 보호를 받을 수 없으며 적발시 형사 처벌이나 민사상 손해 배상의 의무를 질 수
            있습니다. 또한 이로 인해 회사에 손해가 발생하는 경우 회사는 사용자에게 손해배상을 청구할 수 있습니다.
          </li>
        </ol>
      </Box>

      <Box className="font-pretendard mt-8 text-[#686868]">
        <Typography className="font-pretendard text-[12px] sm:text-base mb-2">공고일자 : 2025년 04월 11일</Typography>
        <Typography className="font-pretendard text-[12px] sm:text-base mb-8">시행일자 : 2025년 04월 11일</Typography>
      </Box>
    </Container>
  );
};

export default CopyrightPolicy;
