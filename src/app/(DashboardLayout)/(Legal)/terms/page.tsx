import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_TERM } from '@/utils/constant';
import { Box, Container, Typography } from '@mui/material';
import React from 'react';

// Common CSS classes for better management
const classes = {
  // Container and layout
  container: 'font-pretendard sm:py-8 px-0 sm:px-6',
  title: 'font-pretendard font-bold hidden sm:block',

  // Section styling
  section: 'font-pretendard mb-6',
  sectionTitle: 'font-pretendard font-bold mb-2 mt-[20px] sm:mt-[50px] text-[12px] sm:text-[18px]',
  sectionTitleColor: { color: { xs: '#686868' } },
  sectionDescription: 'font-pretendard mb-2 sm:ml-4 text-[12px] sm:text-[18px] text-[#686868]',

  // List styling
  listItem: 'font-pretendard text-[12px] sm:text-base leading-5 sm:leading-7',
  bulletList: 'font-pretendard list-disc pl-5 sm:pl-8 space-y-2 text-[#686868]',
  decimalList: 'font-pretendard list-decimal pl-5 sm:pl-8 space-y-2 text-[#686868]',
  alphaList: 'font-pretendard list-[lower-alpha] pl-6 sm:pl-20 my-30 space-y-2',
  romanList: 'font-pretendard ml-4 sm:ml-8 mt-1',
  romanListSx: { listStyleType: 'lower-roman', pl: 3 },

  // Link styling
  link: 'font-pretendard text-blue-600 underline',

  // Footer styling
  footer: 'font-pretendard mt-8 text-[#686868]',
  footerText: 'font-pretendard text-[12px] sm:text-base sm:ml-4',
  footerTextLast: 'font-pretendard text-[12px] sm:text-base sm:ml-4 mb-8',
};

const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="md" className={classes.container}>
      <SeoHead {...SEO_DATA_TERM} />
      <Typography variant="h4" component="h1" className={classes.title}>
        이용 약관
      </Typography>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 1조 목적
        </Typography>
        <ul className={classes.bulletList}>
          <li className={classes.listItem}>
            이 약관은 톡탁 서비스의 이용과 관련하여 톡탁 서비스를 제공하는 보다플레이(주)(이하 '회사')과 이를 이용하는
            회원과의 관계를 설명하고, 서비스 제공 과정에서 행해지는 회사의 정책적·기술적 조치에 대해 설명합니다. 아울러
            톡탁 서비스에서 제공하는 디지털 콘텐츠(이하 '콘텐츠')를 이용함에 회원이 숙지해야 할 저작권 정책을 포함하고
            있습니다.
          </li>
          <li className={classes.listItem}>
            본 약관은 회원이 톡탁 서비스를 이용하는데 필요한 권리, 의무 및 책임사항, 이용조건 및 절차, 콘텐츠 저작권 등
            기본적인 사항을 규정하고 있으니, 조금만 시간을 내서 주의 깊게 읽어주시기 바랍니다.
          </li>
        </ul>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 2조 이용약관의 효력 및 변경
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            이 약관은 톡탁 서비스 화면에 게시하거나 기타의 방법으로 공지하고, 이 약관에 동의한 모든 회원에게 그 효력이
            발생합니다.
          </li>
          <li className={classes.listItem}>
            회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다. 본 약관이 변경되는
            경우 회사는 변경사항을 시행일자 최소 7일 전부터 회원에게 사전 안내하는 것을 원칙으로 합니다. 다만 피치
            못하게 회원에게 불리할 수 있는 중대한 내용의 약관 변경의 경우에는 최소한 30일 전부터 사전 유예기간을 두고
            공지하고 별도의 전자적 수단(전자메일, 서비스 내 알림 등)을 통해 개별적으로 알릴 것입니다.
          </li>
          <li className={classes.listItem}>
            회사가 전항에 따라 변경사항을 안내하였을 때 회원이 개정 약관 시행일 7일 후까지 거부 의사를 표시하지 아니하면
            변경된 약관을 승인한 것으로 봅니다. 회원은 개정약관에 동의하지 않을 경우 이용계약을 해지(회원 탈퇴)할 수
            있습니다.
          </li>
          <li className={classes.listItem}>
            회사의 유료 서비스 이용 회원의 경우 회사가 별도로 정한 약관 및 정책이 있을 경우 이를 따릅니다.
          </li>
          <li className={classes.listItem}>
            이 약관에서 규정되지 않은 사항에 관해서는 관련 법령 또는 법령상 관례에 따릅니다.
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 3조 용어의 정의
        </Typography>
        <Typography className={classes.sectionDescription}>
          이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            톡탁 서비스: 톡탁 서비스는 회사가 제공하는 SNS 콘텐츠(글, 이미지, 영상, 템플릿, 디자인요소 등) 또는 SNS
            콘텐츠를 제작하는 도구를 포함하여 회사가 정한 방식에 따라 회원의 SNS 계정을 연결하여 제작된 SNS 콘텐츠를
            포스팅, 광고, 홍보, 계정 성장, 운영, 성과 관리를 위한 제반 서비스 일체를 말합니다.
          </li>
          <li className={classes.listItem}>
            회원: 톡탁 서비스를 이용하기 위해 이용계약(회원가입) 과정에서 본 약관에 동의하고 톡탁 계정을 부여 받은
            사람을 말합니다.
          </li>
          <li className={classes.listItem}>
            템플릿: 톡탁 서비스에서 제공하는 정보 전달 목적의 미리 제작된 글, 영상, 이미지 결과물을 말합니다.
          </li>
          <li className={classes.listItem}>
            디자인요소: 글, 영상, 이미지 결과물을 구성하는 단수 혹은 복수의 '동영상, 이미지, 텍스트, 폰트, 모션그래픽,
            음악, 컬러 등'과 같은 요소를 말합니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                회사는 톡탁 서비스에서 제공하는 템플릿 혹은 톡탁 에디터 내의 편집 기능을 통해 디자인 요소를 제공합니다.
                사용자도 톡탁 서비스 내 웹사이트 링크 분석, 파일 업로드, 회원 채널 연결 등의 기능을 통해 디자인 요소를
                추가할 수 있습니다.
              </li>
              <li className={classes.listItem}>
                디자인 요소의 대표적인 예시
                <Box component="ol" className={classes.romanList} sx={classes.romanListSx}>
                  <li className={classes.listItem}>템플릿에 사용된 샘플용 글, 이미지, 동영상, 모션 효과, 도형</li>
                  <li className={classes.listItem}>톡탁 에디터에서 제공되는 목소리, 음악, 폰트</li>
                </Box>
              </li>
            </ol>
          </li>
          <li className={classes.listItem}>
            톡탁 에디터: 톡탁 웹사이트에서 제공하는 글, 영상, 이미지 템플릿을 편집하는 소프트웨어를 말합니다.
          </li>
          <li className={classes.listItem}>
            결과 글, 영상, 이미지: 사용자가 제공된 템플릿을 톡탁 에디터를 통해 제작한 결과물을 말합니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                사용자의 창작성이 가미되지 않은 글, 영상, 이미지 결과물은 저작권법 및 관련 법령에 따라 템플릿 복제물로
                판단됩니다.
              </li>
            </ol>
          </li>
          <li className={classes.listItem}>
            스크랩핑: 톡탁 서비스에서 웹페이지 분석 기능을 제공하기 위해, 입력된 웹페이지 주소에 접속하여 해당 페이지
            내의 콘텐츠를 우리의 클라우드 서버로 가져오는 행위를 말합니다.
          </li>
          <li className={classes.listItem}>
            채널: 톡탁 서비스를 통해 노출되는 Meta, YouTube, Tiktok 등의 디지털 SNS 플랫폼을 말합니다.
          </li>
          <li className={classes.listItem}>
            회원 채널: 회원이 소유한 디지털 SNS 플랫폼의 계정을 말합니다. 사용자는 채널 연결 기능을 통해 소유한 디지털
            SNS 플랫폼의 계정을 톡탁 회원 계정에 연결할 수 있습니다.
          </li>
          <li className={classes.listItem}>
            확장 서비스 : 톡탁 회원을 대상으로 제공되는 추가 서비스(톡탁 맞춤형 등) 입니다.
          </li>
          <li className={classes.listItem}>
            톡탁 크레딧(C) : ‘톡탁 크레딧’은 회원이 디지털 콘텐츠(영상, 이미지, 블로그 등) 생성, 음성 변환 등 톡탁
            서비스 내 유료 기능을 이용하기 위해 사용할 수 있는 회사 전용의 선불형 디지털 이용권을 말합니다. 크레딧은
            회사가 정한 기준에 따라 사용 시 자동 차감되며, 현금으로 환불되거나 제3자에게 양도할 수 없습니다. 다만,
            유상으로 지급된 크레딧(구독 또는 패키지형)에 대해서는 관련 법령 및 회사 환불 정책에 따라 일정 조건 하에
            환불이 가능할 수 있습니다. 크레딧의 사용, 유효기간, 환불, 차감 순서 등에 관한 세부 사항은 제9조, 제10조 또는
            별도 고지된 정책에 따릅니다.
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 4조 서비스 이용계약의 성립
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            톡탁 서비스 이용신청은 회원가입 과정에서 이 약관에 동의한다는 의사표시(동의함을 선택)와 함께 일정 정보를
            입력하는 방식으로 이루어집니다.
          </li>
          <li className={classes.listItem}>
            톡탁 서비스 이용계약은 회사가 사용자가 입력한 일정 정보를 인증한 후 가입을 승낙함으로써 체결됩니다.
          </li>
          <li className={classes.listItem}>
            확장 서비스를 이용하기 위해서는 톡탁 회원으로 가입해야 합니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>톡탁 서비스 혹은 확장 서비스에서 회원 가입을 통해 가능합니다.</li>
              <li className={classes.listItem}>
                회원이 확장 서비스를 이용하는 과정에서 생성된 콘텐츠는 편의를 위해 톡탁 서비스와 자동으로 연동될 수
                있습니다.
              </li>
            </ol>
          </li>
          <li className={classes.listItem}>본 약관은 확장 서비스에도 동일하게 적용됩니다.</li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 5조 이용의 제한
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            회사는 아래 사항을 엄격하게 금지하고 있으며 해당 활동이 감지되는 경우, 해당 회원의 서비스 이용을 일부 또는
            전부를 일시 또는 영구히 제한하거나 톡탁계정을 삭제하는 등 적절한 조치를 할 수 있습니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>회사가 이 약관에 의해 이전에 해당 톡탁 계정을 삭제하였던 경우</li>
              <li className={classes.listItem}>
                회원가입 신청 시 필요한 정보를 입력하지 않거나 허위의 정보를 입력한 경우
              </li>
              <li className={classes.listItem}>타인의 이메일을 이용하여 회원가입 한 경우</li>
              <li className={classes.listItem}>
                사회의 안녕과 질서, 미풍양속을 저해할 목적으로 서비스를 이용하는 경우
              </li>
              <li className={classes.listItem}>
                인종, 성별, 성적지향, 종교, 정치적 견해, 사항 등의 차별적 목적으로 서비스를 이용하는 경우
              </li>
              <li className={classes.listItem}>
                이용 행태가 현행 법령에 어긋나거나, 운영 정책 등 회사가 정한 기준에 반하는 점이 있는 경우
              </li>
            </ol>
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 6조 톡탁 서비스 제공
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            회사는 톡탁 서비스를 365일, 24시간 안정적으로 제공하기 위하여 최선의 노력을 다합니다. 다만, 아래의 경우
            서비스의 일부 또는 전부를 일시 또는 영구히 제한하거나 중지할 수 있습니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>서비스용 설비의 유지·보수 등을 위한 정기 또는 임시 점검의 경우</li>
              <li className={classes.listItem}>
                정전, 제반 설비의 장애 또는 이용량의 폭주 등으로 서비스를 제공하기 위한 설비용량에 현실적인 여유가 없는
                경우
              </li>
              <li className={classes.listItem}>
                파트너사와의 계약 종료, 정부의 명령/규제, 서비스/회원 정책 변경 등 회사의 제반 사정으로 서비스를 유지할
                수 없는 경우
              </li>
              <li className={classes.listItem}>서비스 제공을 위한 기술에 심각한 문제가 있다고 판단되는 경우</li>
              <li className={classes.listItem}>천재지변, 국가비상사태 등 불가항력의 사유가 있는 경우</li>
            </ol>
          </li>
          <li className={classes.listItem}>
            회사는 톡탁 서비스 운영 또는 개선을 위해 상당한 필요성이 있는 경우 서비스의 전부 또는 일부를 수정, 변경 또는
            종료할 수 있습니다. 무료로 제공되는 서비스의 전부 또는 일부를 수정, 변경 또는 종료하게 된 경우 관련 법령에
            특별한 규정이 없는 한 별도의 보상을 하지 않습니다.
          </li>
          <li className={classes.listItem}>
            위의 두 조항에 따라 서비스를 중단하거나 변경할 때에 회사는 예측 가능한 경우 상당기간 전에 이를 안내하며,
            만약 예측 불가능한 경우라면 사후 지체 없이 상세히 설명하고 안내합니다. 또한, 서비스 중단의 경우에는 사용자의
            콘텐츠를 백업할 수 있도록 합리적이고 충분한 기회를 제공하도록 합니다.
          </li>
          <li className={classes.listItem}>
            회사는 사용자의 의견을 소중하게 생각합니다. 사용자는 언제든지 고객센터를 통해 의견을 개진할 수 있습니다.
            회사는 합리적인 범위 내에서 가능한 그 처리과정 및 결과를 사용자에게 안내합니다.
          </li>
          <li className={classes.listItem}>
            톡탁 서비스 사용자 전체에 대한 공지는 7일 이상 서비스 공지사항란에 게시함으로써 효력이 발생합니다.
            사용자에게 중대한 영향을 미치는 사항의 경우에는 전자메일, 서비스 내 알림 또는 기타 적절한 전자적 수단을 통해
            개별적으로 안내합니다.
          </li>
          <li className={classes.listItem}>
            회사는 톡탁의 웹페이지 분석 서비스를 제공하는 과정에서 사용자가 입력한 웹페이지 주소에 접속하여 콘텐츠를
            스크랩핑 하고, 이를 가공하여 사용자에게 제공할 수 있습니다.
          </li>
          <li className={classes.listItem}>
            회사는 더 나은 톡탁 서비스의 제공을 위하여 사용자에게 서비스의 이용과 관련된 각종 고지, 관리 메세지 및 기타
            광고를 포함한 다양한 정보를 서비스화면 내에 표시하거나 이메일로 전송할 수 있습니다.
          </li>
          <li className={classes.listItem}>
            회사는 사용자가 제작한 결과 글, 영상, 이미지, 업로드한 이미지, 동영상, 음악 등이 다음에 해당하는 경우, 사전
            통지 없이 삭제하거나 이동 또는 등록을 거부할 수 있습니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                다른 사용자 또는 제삼자에게 심한 모욕을 주거나 중상모략으로 명예를 손상시키는 내용인 경우
              </li>
              <li className={classes.listItem}>
                청소년보호법에 위반되는 내용의 정보, 문장, 도형 등을 게시하거나 링크 시키는 경우
              </li>
              <li className={classes.listItem}>
                타인의 지식재산권을 침해하거나 모욕, 사생활 침해 또는 명예훼손 등 타인의 권리를 침해하는 내용이 확인되는
                경우
              </li>
              <li className={classes.listItem}>범죄와 결부 된다고 객관적으로 인정되는 내용일 경우</li>
              <li className={classes.listItem}>기타 관계 법령에 어긋난다고 판단되는 경우</li>
            </ol>
          </li>
          <li className={classes.listItem}>
            회사가 제공하는 서비스는 아래의 [서비스 이용 권장 사양]이 충족되어야 정상적인 제공이 가능하며, 해당 사양에
            충족되지 못한 사유로 사용자가 서비스 이용의 이의를 제기할 시 회사는 책임을 지지 않습니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                [서비스 이용 권장 사양]
                <Box component="ol" className={classes.romanList} sx={classes.romanListSx}>
                  <li className={classes.listItem}>운영체제(OS): 컴퓨터(PC), 모바일(Android OS, IOS)</li>
                  <li className={classes.listItem}>
                    웹 브라우저: 크롬 브라우저를 권장함 (Internet Explorer를 제외한 대부분의 브라우저에서 사용이
                    가능하나, 일부기능이 동작하지 않을 수 있습니다.)
                  </li>
                </Box>
              </li>
            </ol>
          </li>
          <li className={classes.listItem}>
            회사는 톡탁 서비스를 개선하고 향상 시키기 위해 회원의 서비스 사용 이력, 제작한 결과 글, 영상, 이미지, SNS
            포스팅 내역 및 성과 데이터를 익명화 된 형태로 수집하여 분석에 활용할 수 있습니다.
          </li>
          <li className={classes.listItem}>
            회사는 원활한 톡탁 서비스 제공 및 품질 향상을 위하여 사용자의 활동 기록(서비스 이용 이력, 콘텐츠 제작 및
            전송 내역 등)을 최대 3개월간 보관하며, 보관 기간이 경과한 기록은 관련 법령에 따른 의무 보관 사유가 없는 한
            지체 없이 안전하게 삭제합니다. 따라서 보관 기간이 지난 이후에는 해당 기록의 복구 또는 확인이 불가능하며,
            이에 대한 별도의 책임을 부담하지 않습니다.
          </li>
          <li className={classes.listItem}>
            회사는 회원의 톡탁 서비스 이용 사실을 소개하기 위한 목적으로 회원의 기업명, 브랜드명, 로고, 결과 글, 영상,
            이미지를 별도의 비용 없이 게시할 수 있습니다. 다만, 회원의 요청 시 상호 협의 하에 게시를 중단하거나 수정하여
            다시 게재할 수 있습니다.
          </li>
          <li className={classes.listItem}>
            회원 채널에서 발생하는 채널 지출금액(광고 집행 비용)은 회원과 비용을 부과하는 디지털 광고 플랫폼 사업자의
            책임 하에 있으며, 회사는 일체의 책임을 지지 않습니다.
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 7조 개인정보의 보호
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            회사는 서비스의 원활한 제공을 위하여 회원이 동의한 목적과 범위 내에서만 개인정보를 수집·이용하며, 개인정보
            보호 관련 법령에 따라 안전하게 관리합니다.
          </li>
          <li className={classes.listItem}>
            회사가 개인정보를 안전하게 처리하기 위하여 기울이는 노력이나 기타 자세한 사항은{' '}
            <a href="/policy" className={classes.link}>
              톡탁 개인정보처리방침
            </a>
            에서 확인하실 수 있습니다.
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 8조 회원의 의무
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            톡탁 계정은 회원 본인만 이용할 수 있으며, 타인에게 이용을 허락할 수도 없습니다. 또한, 회원은 서비스의
            이용권한, 기타 이용계약상 지위를 타인에게 판매·양도·대여 또는 담보로 제공할 수 없습니다.
          </li>
          <li className={classes.listItem}>
            회원은 타인이 자신의 톡탁 계정을 무단으로 이용할 수 없도록 직접 비밀번호를 관리해야 합니다. 본인의
            비밀번호는 어떠한 경우에도 회사는 물론 그 어떤 다른 사람에게도 알려서는 안 됩니다. 만약 무단 이용이
            발견된다면, 고객센터를 통해 회사에 알려 적절한 조치를 취하게 할 수 있습니다.
          </li>
          <li className={classes.listItem}>
            회원은 톡탁 서비스 내 '내 정보' 관리화면에서 언제든지 등록된 정보를 열람하고 수정할 수 있습니다. 다만,
            회원의 식별을 위한 아이디(ID) 등 일부 정보는 수정이 불가능할 수 있으며, 일부 정보는 수정을 위해 추가적인
            본인확인 절차가 필요할 수 있습니다.
          </li>
          <li className={classes.listItem}>
            회원은 서비스에 등록한 정보에 변경이 있을 때, 톡탁 서비스에서 직접 수정하거나 고객센터를 통해 변경사항을
            회사에 알려야 합니다. 변경사항을 적시에 수정하지 않아 발생한 문제에 대해 회사는 책임을 부담하지 않습니다.
          </li>
          <li className={classes.listItem}>
            무료 회원 중 톡탁 서비스 이용기록이 1년 이상 없는 경우 해당 회원은 비활성 상태로 분류됩니다. 비활성 상태로
            분류되면 해당 계정이 제작한 글, 영상, 이미지 일체, 업로드한 미디어 파일 일체, 생성한 이미지 파일 일체, 소셜
            포스팅 예약 목록, 회원 채널 연결 목록 일체의 데이터가 삭제되며, 삭제된 데이터는 복구가 불가능합니다.
            사용자는 정기적으로 발송되는 비활성 상태 변경예정 안내를 확인하고, 서비스에 로그인하여 활성 상태를 유지할 수
            있습니다.
          </li>
          <li className={classes.listItem}>
            회원은 광고 채널의 서비스 이용약관 및 광고 정책을 준수하여야 합니다. 회사는 회원이 본 약관에 명시된 광고
            채널 정책의 조항을 위반하는 경우 본 약관을 해지하거나 톡탁 서비스에 대한 접근을 금지할 수 있습니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                Meta 매체 이용 시 "회원"은{' '}
                <a
                  target="_blank"
                  href="https://transparency.fb.com/ko-kr/policies/ad-standards/?source=https%3A%2F%2Fwww.facebook.com%2Fpolicies_center%2Fads"
                  className={classes.link}
                >
                  메타 광고 정책
                </a>
                에서 명시하고 있는 Meta의 광고 정책을 준수합니다.
              </li>
              <li className={classes.listItem}>
                Meta 매체 이용 시 "회원"은{' '}
                <a target="_blank" href="https://www.facebook.com/legal/terms" className={classes.link}>
                  메타 서비스 약관
                </a>
                에서 명시하고 있는 Meta의 이용 약관을 준수합니다.
              </li>
              <li className={classes.listItem}>
                Instagram 매체 이용 시 "회원"은{' '}
                <a target="_blank" href="https://www.instagram.com/about/legal/terms/api" className={classes.link}>
                  인스타그램 이용 약관
                </a>
                에서 명시하고 있는 Instagram 이용 약관을 준수합니다.
              </li>
              <li className={classes.listItem}>
                YouTube 매체 이용 시 "회원"은{' '}
                <a target="_blank" href="https://www.youtube.com/static?template=terms" className={classes.link}>
                  YouTube 이용 약관
                </a>
                에서 명시하고 있는 YouTube 이용 약관을 준수합니다.
              </li>
              <li className={classes.listItem}>
                YouTube 매체 이용 시 "회원"은{' '}
                <a
                  target="_blank"
                  href="https://support.google.com/adspolicy/answer/10249050?hl=ko"
                  className={classes.link}
                >
                  YouTube 광고 정책
                </a>
                에서 명시하고 있는 YouTube 광고 정책을 준수합니다.
              </li>
              <li className={classes.listItem}>
                Tiktok 채널 이용 시 "회원"은{' '}
                <a
                  target="_blank"
                  href="https://www.tiktok.com/legal/page/row/terms-of-service/en"
                  className={classes.link}
                >
                  Tiktok 이용 약관
                </a>
                에서 명시하고 있는 Tiktok의 이용 약관을 준수합니다.
              </li>
              <li className={classes.listItem}>
                Tiktok 채널 이용 시 "회원"은{' '}
                <a
                  target="_blank"
                  href="https://ads.tiktok.com/help/article/advertising-on-tiktok-first-things-to-note?lang=en"
                  className={classes.link}
                >
                  Tiktok 광고 정책
                </a>
                에서 명시하고 있는 Tiktok의 광고 정책을 준수합니다.
              </li>
            </ol>
          </li>
          <li className={classes.listItem}>
            회원은 다음에 해당하는 행위를 하여서는 안됩니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                계정 생성과 이용 시 금지하는 활동
                <ul className="font-pretendard list-disc pl-8 mt-2 space-y-2">
                  <li className={classes.listItem}>
                    타인의 개인정보 또는 기기를 도용·탈취하거나 허위의 정보를 입력하여 계정과 아이디(이하 '계정'으로
                    통칭)를 생성·이용·탈퇴하는 행위
                  </li>
                  <li className={classes.listItem}>
                    상업적·홍보·광고·악의적 목적으로 시스템의 취약점을 이용하거나, 비정상적으로 계정을
                    생성·이용·탈퇴하는 행위
                  </li>
                  <li className={classes.listItem}>
                    컴퓨터 소프트웨어, 하드웨어, 전기통신 장비의 정상적인 가동을 방해·파괴하거나, 할 수 있는 방법으로
                    서비스에 접근·이용하는 행위
                  </li>
                  <li className={classes.listItem}>
                    타인의 계정을 취득하기 위해 구매·양수·교환을 시도하거나 이를 타인에게 알선하는 행위
                  </li>
                  <li className={classes.listItem}>
                    정상적인 서비스 이용으로 볼 수 없는 다량의 계정 생성 및 반복적인 계정 생성과 탈퇴 행위 등 및 이와
                    유사한 행위
                  </li>
                </ul>
              </li>
              <li className={classes.listItem}>
                서비스 이용 시 금지하는 활동
                <ul className="font-pretendard list-disc pl-8 mt-2 space-y-2">
                  <li className={classes.listItem}>
                    청소년보호법 또는 형법에 위반되는 저속, 음란한 내용의 정보, 문장, 도형, 음향, 동영상을 전송, 게시 및
                    이를 톡탁 서비스를 통해 타인에게 유포하는 행위
                  </li>
                  <li className={classes.listItem}>
                    타인의 지식재산권을 침해하거나 모욕, 사생활 침해 또는 명예훼손 등 타인의 권리를 침해하는 내용을
                    이용하거나, 이를 위해 서비스를 이용하는 행위
                  </li>
                  <li className={classes.listItem}>
                    컴퓨터 소프트웨어, 하드웨어, 전기통신 장비의 정상적인 가동을 방해·파괴하거나, 할 수 있는 행위
                  </li>
                  <li className={classes.listItem}>
                    관련 법령상 금지되거나 형사처벌의 대상이 되는 행위나 이를 위한 동기부여 및 실행에 도움을 주기 위해
                    서비스를 이용하는 행위
                  </li>
                  <li className={classes.listItem}>
                    청소년에게 유해한 과도한 신체 노출이나 음란한 행위를 묘사하는 행위
                  </li>
                  <li className={classes.listItem}>
                    서비스의 명칭 또는 회사의 임직원이나 운영진을 사칭하여 다른 이용자를 속이거나 이득을 취하는 등
                    피해와 혼란을 주는 행위
                  </li>
                  <li className={classes.listItem}>
                    욕설·비속어·은어 등의 사용 및 그 외 상식과 사회 통념에 반하는 비정상적인 행위
                  </li>
                  <li className={classes.listItem}>
                    회사가 허용하지 않은 악의적인 방법으로 서비스를 이용하는 등 서비스의 정상적인 운영을 방해하는 행위
                  </li>
                  <li className={classes.listItem}>기타 관계 법령에 어긋나는 행위</li>
                </ul>
              </li>
            </ol>
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 9조 유료 서비스의 결제 및 이용
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            톡탁 서비스를 구성하는 개별 서비스 대부분은 무료로 이용할 수 있습니다. 다만, 무료 회원은 특정 개별 서비스
            또는 개별 서비스 내 일부 하위 기능 이용에 제한이 있고, 또한 결과 글, 영상, 이미지의 활용에도 제약이
            있습니다. 유료 회원의 경우에도 이용 중인 요금제에 따라 서비스 기능 및 결과 글, 영상, 이미지 활용 범위에
            차등이 있을 수 있습니다. 유료 및 무료 서비스 이용에 관한 세부사항은 톡탁 서비스에 공개한 별도의 요금제
            규정을 따릅니다.
          </li>
          <li className={classes.listItem}>
            회원은 회사가 제공하는 결제수단으로 유료 서비스를 이용할 수 있으며, 각종 프로모션이나 이벤트 등을 통하여
            발행된 이용권, 프로모션 코드 등을 이용하여 유료 서비스를 이용할 수 있습니다.
          </li>
          <li className={classes.listItem}>톡탁 유료 서비스는 이용요금 선결제 후 이용을 원칙으로 합니다.</li>
          <li className={classes.listItem}>
            톡탁 유료 서비스는 '정기결제형 상품'으로 회원이 미리 지정한 결제수단을 통해 1개월 혹은 1년 단위로 이용요금이
            자동으로 결제되고 이용기간이 자동 갱신됩니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                결제 정보 변경, 신용카드 및 휴대전화의 분실, 만료, 통신사 변경, 기타의 사유로 정기결제가 이루어지지 않을
                경우 회원에게 별도의 고지 없이 유료 서비스 이용이 정지될 수 있습니다. 회원의 이용요금 미납 등 귀책사유로
                인한 정기결제 중지 및 이에 따른 유료 서비스 이용 정지로 인한 손해에 대해 회사는 책임을 지지 않습니다.
              </li>
            </ol>
          </li>
          <li className={classes.listItem}>
            회원은 정해진 절차에 따라 언제든 회사에 정기결제 중지를 요청할 수 있으며, 이 경우 선 결제된 이용기간
            종료일까지 유료 서비스를 이용할 수 있습니다.
          </li>
          <li className={classes.listItem}>
            회사는 회원의 유료 서비스 체험을 위해 무료 체험 기간이 포함된 유료 서비스 상품을 회원에게 제안할 수
            있습니다. 이 경우 회사는 해당 상품이 무료 체험 기간이 포함된 유료 서비스임을 설명하고, 무료 체험 기간에
            회원은 언제든지 상품 이용 계약을 해지할 수 있으며 이 기간에는 요금이 청구되지 않는다는 사실을 회원이 충분히
            인지할 수 있도록 설명합니다.
          </li>
          <li className={classes.listItem}>
            회원은 유료 서비스 이용 중 채널을 추가할 수 있으며, 채널 추가 시 해당 결제 주기 내 남은 일수를 기준으로 추가
            요금이 일할 계산되어 즉시 결제됩니다.
          </li>
          <li className={classes.listItem}>
            베이직 요금제 이용 시 유료로 최대 2개까지 채널을 추가할 수 있으며, 전체 채널 수는 3개를 초과할 수 없습니다.
          </li>
          <li className={classes.listItem}>
            회원은 서비스 이용 중 상위 요금제로 업그레이드할 수 있으며, 업그레이드 신청 시점부터 변경된 요금제가 즉시
            적용됩니다.
          </li>
          <li className={classes.listItem}>
            요금제 업그레이드 시, 이전 요금제에서 사용한 일수와 새로운 요금제 적용 기간을 기준으로 차액이 일할 계산되어
            추가 결제됩니다. 차액은 신규 요금제 정가에서 기존 요금제 잔여금(일할 계산된 금액)을 차감한 금액으로
            산정됩니다.
          </li>
          <li className={classes.listItem}>
            회원은 결제 주기 종료일 이전에 하위 요금제로 변경(다운그레이드) 신청할 수 있으며, 변경된 요금제는 다음
            결제일부터 적용됩니다. 현재 결제 주기 동안에는 기존 요금제 기준의 서비스가 유지됩니다.
          </li>
          <li className={classes.listItem}>
            회사는 채널 추가, 요금제 변경 또는 할인 적용과 관련된 상세 조건 및 요금 기준을 서비스 내 고지사항 또는 별도
            정책을 통해 안내하며, 회원은 이에 동의한 후 이용을 진행합니다.
          </li>
          <li className={classes.listItem}>
            추천인 제도
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                회원은 가입 시 1회에 한해 추천인 코드를 입력할 수 있으며, 이후 추천인 변경은 불가능합니다.
              </li>
              <li className={classes.listItem}>
                추천 보상: 회사는 추천인 및 피추천인에게 일정 조건을 충족한 경우, 크레딧 등 보상을 제공할 수도 있으며,
                해당 보상의 지급 기준 및 범위는 회사 정책 또는 개별 프로모션 고지에 따릅니다. 회사는 사전 고지 없이 이를
                변경, 중단, 회수할 수 있습니다.
              </li>
              <li className={classes.listItem}>
                동일 IP, 결제 수단, 전화번호 등으로 중복 가입이 확인되는 경우, 추천인 혜택은 회수되며 해당 계정은 제한될
                수 있습니다.
              </li>
            </ol>
          </li>
          <li className={classes.listItem}>
            쿠폰 및 프로모션 코드의 이용
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                회사는 회원에게 유료 서비스 이용을 위하여 일정 조건에 따라 쿠폰 또는 프로모션 코드를 발급할 수 있습니다.
              </li>
              <li className={classes.listItem}>
                쿠폰은 발급일로부터 1년간 유효하며, 별도로 정해진 경우 쿠폰에 명시된 유효기간이 우선 적용됩니다.
                유효기간 내에 등록하지 않은 쿠폰은 자동으로 소멸되며, 소멸된 쿠폰은 복구, 환불 또는 연장이 불가합니다.
              </li>
              <li className={classes.listItem}>
                쿠폰은 현금으로 환불되거나 타인에게 양도할 수 없으며, 유료 서비스 이용 시에만 사용할 수 있습니다.
              </li>
              <li className={classes.listItem}>
                회원은 쿠폰의 유효기간, 사용 조건 및 등록 방법을 회사가 정한 절차에 따라 확인하고 사용하여야 하며,
                미사용으로 인한 불이익은 회사가 책임지지 않습니다.
              </li>
              <li className={classes.listItem}>
                회사는 쿠폰의 오·남용, 부정사용 또는 관련 법령 위반 소지가 있다고 판단되는 경우 사전 고지 없이 해당
                쿠폰을 회수하거나 사용을 제한할 수 있습니다.
              </li>
              <li className={classes.listItem}>
                회사는 쿠폰을 크레딧으로 전환 지급할 수 있으며, 전환된 크레딧의 성격(유상/이벤트), 유효기간 및 사용
                조건은 전환 시점의 별도 정책에 따릅니다. 단, 회사는 전환 방식 및 유효기간을 사전 고지 없이 변경할 수
                있습니다.
              </li>
            </ol>
          </li>
          <li className={classes.listItem}>
            요금제 변경에 따른 콘텐츠 및 채널 제한 정책
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                스탠다드 요금제에서 베이직 요금제로 변경될 경우, 콘텐츠 배포 방식은 기존의 '영상 + 이미지' 에서 1종만
                배포 가능한 방식으로 전환됩니다. 이 경우 기본 콘텐츠 형식은 영상으로 설정되며, 회원은 필요 시 직접
                이미지로 변경할 수 있습니다.
              </li>
              <li className={classes.listItem}>
                또한, 요금제 변경에 따라 SNS 채널 연결 수에도 제한이 발생합니다. 스탠다드 요금제는 최대 7개의 SNS 채널
                연결이 가능하지만, 베이직 요금제는 1개 채널만 연결할 수 있습니다. 이 경우 회사는 기존 연결된 채널 중
                다음의 우선순위에 따라 자동으로 1개 채널을 설정합니다:
              </li>
              <li className={classes.listItem}>
                유튜브 &gt; 인스타그램 &gt; 틱톡 &gt; 쓰레드 &gt; X(구 트위터) &gt; 페이스북 &gt; 블로그
              </li>
            </ol>
            해당 채널은 회원이 직접 변경할 수 있으며, 나머지 채널은 자동으로 비활성화됩니다.
          </li>
          <li className={classes.listItem}>
            톡탁 크레딧
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                ‘톡탁 크레딧’(이하 ‘크레딧’)은 회사 단일 서비스에서만 사용 가능한 전용 이용권으로, 크레딧은 회사가 정한
                정책에 따라 특정 서비스 사용 시 차감되며, 차감 기준 및 크레딧 가치 산정은 회사의 정책에 따릅니다.
              </li>
              <li className={classes.listItem}>
                크레딧은 생성 요청이 접수되어 디지털 콘텐츠 제공이 개시되는 시점에 차감되며, 회원이 중도 이탈하더라도
                회사는 백그라운드에서 생성을 계속 진행하고 완료 결과를 임시저장함에 저장할 수 있습니다.
                시스템·네트워크·외부 API 오류로 결과가 전혀 생성되지 않은 것이 확인되는 경우에 한하여 사용된 크레딧을
                복구할 수 있습니다.
              </li>
              <li className={classes.listItem}>
                유효기간
                <ul className="font-pretendard list-disc pl-5 sm:pl-8 space-y-2 text-[#686868]">
                  <li className={classes.listItem}>
                    이벤트 크레딧(무상/프로모션): 지급일로부터 7일 ~ 30일, 환불 불가.
                  </li>
                  <li className={classes.listItem}>구독 크레딧(정기 플랜 지급): 지급일로부터 30일, 이월 불가.</li>
                  <li className={classes.listItem}>패키지 크레딧(추가 구매): 지급일로부터 1년.</li>
                  <li className={classes.listItem}>쿠폰 전환: 전환 시 고지된 유형·유효기간 적용.</li>
                </ul>
              </li>
              <li className={classes.listItem}>
                차감 순서: 크레딧은 유효기간이 먼저 도래하는 순서(FEFO)로 자동 사용되며, 동일 만료일에는 이벤트/프로모션
                → 유상(구독→패키지) 순으로 사용됩니다.
              </li>
              <li className={classes.listItem}>
                크레딧은 현금 환급 또는 제3자 양도·양수·대여·담보 제공이 불가하며, 회사가 승인하지 않는 방식으로 사용할
                수 없습니다.
              </li>
              <li className={classes.listItem}>
                회사는 보너스가 포함된 패키지로 크레딧을 판매할 수 있습니다. 환불 시에는 유상·무상을 합한 ‘총 지급
                크레딧’을 기준으로 비례 산정하며, 상세 산식은 제10조를 따릅니다.
              </li>
              <li className={classes.listItem}>
                본 크레딧은 전자금융거래법상 선불전자지급수단 등록 대상과 구별되며, 가맹점 확대 또는 발행 규모 확대 등
                사업 구조 변경 시 관련 법령에 따라 재검토될 수 있습니다.
              </li>
            </ol>
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 10조 환불
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            회원은 구매 후 사용내역이 없는 경우 결제일부터 7일 이내에 이용신청을 철회할 수 있습니다. 이 경우 회사는
            회사가 부담하였거나 부담할 부대비용, 수수료를 공제하고 환불합니다.
          </li>
          <li className={classes.listItem}>
            이벤트 혹은 보상 등을 통해 무료/무상으로 지급된 유료 서비스 내역은 환불 대상에서 제외됩니다.
          </li>
          <li className={classes.listItem}>
            이용신청의 철회는 서비스 내의 문의하기, 전화, 전자메일(cs@bodaplay.ai) 등을 통해 고객센터에 접수 가능합니다.
            철회 신청 의사가 회사에 도달하는 시점부터 그 효력이 발생하고, 회사는 의사표시가 확인되면 지체 없이 그 사실을
            회원에게 알리도록 합니다.
          </li>
          <li className={classes.listItem}>
            회사는 환불 금액이 있을 경우, 원칙적으로 유료회원의 해당 의사표시를 수령한 날로부터 3영업일 이내에 결제수단
            별 사업자에게 대금의 청구 정지 내지 취소를 요청하고, 유료회원이 결제한 동일 결제수단으로 환불함을 원칙으로
            합니다. 단, 회사가 사전에 유료회원에게 전자 메일, 서비스 홈페이지로 공지한 경우 및 아래의 경우와 같이 개별
            결제 수단별 환불 방법, 환불 가능 기간 등이 차이가 있을 수 있습니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                신용카드 등 수납 확인이 필요한 결제수단의 경우에는 수납 확인일로부터 3영업일 이내
              </li>
              <li className={classes.listItem}>
                결제수단 별 사업자가 회사와의 약정을 통하여 사전에 대금 청구 정지 내지 결제 취소 가능 기한 등을 미리
                정하여 둔 경우로 해당 기한을 지난 환불의 경우
              </li>
              <li className={classes.listItem}>
                유료회원이 환불 처리에 필요한 정보 내지 자료를 회사에 즉시 제공하지 않는 경우(현금 환불 시 신청인의 계좌
                및 신분증 사본을 제출하지 아니하거나, 타인 명의의 계좌를 제공하는 경우 등)
              </li>
              <li className={classes.listItem}>해당 회원의 명시적 의사표시가 있는 경우</li>
            </ol>
          </li>
          <li className={classes.listItem}>
            서비스 중도 해지 시, 사용일수 및 콘텐츠 사용량을 기준으로 각각 공제하며, 더 큰 금액을 차감한 뒤 잔여액을
            환불합니다. 사용량이 많을 경우 환불금액이 없거나 적을 수 있으며, 이용량이 90% 이상일 경우 환불이 불가합니다.
          </li>
          <li className={classes.listItem}>
            부가서비스(SNS 채널 추가 등) 환불
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                추가 SNS 채널은 결제와 동시에 즉시 이용이 개시되는 디지털 콘텐츠형 서비스로, 단독 환불은 제공되지
                않습니다.
              </li>
              <li className={classes.listItem}>
                회원이 요금제를 해지하는 경우에 한하여, 해당 요금제와 함께 부가서비스의 미사용 잔여기간을 기준으로 일할
                계산하여 환불합니다.
              </li>
              <li className={classes.listItem}>
                회사는 결제 화면에 “SNS 채널 추가는 단독 환불이 불가하며, 요금제 해지 시에만 잔여기간 환불 가능”함을
                명확하게 표시하여 회원이 충분히 인지할 수 있도록 안내합니다.
              </li>
            </ol>
          </li>
          <li className={classes.listItem}>
            톡탁 크레딧 환불
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                ‘톡탁 크레딧’은 회원이 디지털 콘텐츠(영상·이미지·블로그 세트 또는 유료 음성 변환 등)를 생성하기 위해
                구매하는 선불형 디지털 이용권입니다. 콘텐츠 생성 요청이 접수되어 디지털 콘텐츠 제공이 개시된 이후에는
                전자상거래법 제17조 제2항 제5호에 따라 청약철회 또는 환불이 제한됩니다.
              </li>
              <li className={classes.listItem}>
                공통 환불 원칙 <br />
                결제 7일 내 ‘사용 이력 없음’: 100% 환불(구독/패키지 공통).
                <ul className="font-pretendard list-disc pl-5 sm:pl-8 space-y-2 text-[#686868]">
                  <li className={classes.listItem}>이벤트 크레딧: 환불 불가(기간 경과 시 자동 소멸).</li>
                  <li className={classes.listItem}>
                    환불 수단: 결제일 1년 이내는 카드 부분취소, 1년 경과 시 환불 불가
                  </li>
                  <li className={classes.listItem}>
                    반올림 규칙: 본 조의 모든 금액 산정은 최종 합계 후 원 단위 ‘올림’ 처리합니다.
                  </li>
                </ul>
              </li>
              <li className={classes.listItem}>
                구독 크레딧(정책형 부분 환불) — 중도 사용 시에도 환불 가능
                <ul className="font-pretendard list-disc pl-5 sm:pl-8 space-y-2 text-[#686868]">
                  <li className={classes.listItem}>잔여일수 금액 = 구독 월정가 × (잔여일수 / 30)</li>
                  <li className={classes.listItem}>잔여생성 금액 = 구독 월정가 × (잔여 생성수 / 제공 생성수)</li>
                  <li className={classes.listItem}>SNS 추가 잔여일수 금액 = Σ[추가채널 월정액 × (잔여일수 / 30)]</li>
                  <li className={classes.listItem}>
                    잔여가치 = 잔여일수 금액과 잔여생성 금액 중 더 큰 금액을 공제한 잔여가치를 환불합니다.
                  </li>
                  <li className={classes.listItem}>환불액(구독) = 잔여가치 + SNS 추가 잔여일수 금액.</li>
                  <li className={classes.listItem}>환불 승인 시 해당 구독은 즉시 종료(해지)됩니다.</li>
                </ul>
              </li>

              <li className={classes.listItem}>
                플랜 변경(베이직 → 스탠다드)
                <ul className="font-pretendard list-disc pl-5 sm:pl-8 space-y-2 text-[#686868]">
                  <li className={classes.listItem}>할인금액(크레딧) = 잔여가치 + SNS 추가 잔여일수 금액.</li>
                  <li className={classes.listItem}>
                    업그레이드 결제금액 = 스탠다드 월정가 − 할인금액(즉시 적용, 결제 주기 재시작, 원 단위 올림).
                  </li>
                </ul>
              </li>
              <li className={classes.listItem}>
                패키지 크레딧
                <ul className="font-pretendard list-disc pl-5 sm:pl-8 space-y-2 text-[#686868]">
                  <li className={classes.listItem}>
                    결제 7일 내 환불 요청 시, 사용분을 공제한 비례 환불을 적용합니다.
                  </li>
                  <li className={classes.listItem}>산식: 환불액 = 결제금액 − (사용⚡ × (결제금액 ÷ 총지급⚡)).</li>
                  <li className={classes.listItem}>결제 7일 경과 후 환불은 제한됩니다(법정 사유 예외).</li>
                </ul>
              </li>
              <li className={classes.listItem}>
                환불이 완료되면 해당 크레딧은 회원 지갑에서 소급 회수되며, 이후 해당 크레딧으로 생성된 콘텐츠의
                복구·반환·보상은 청구할 수 없습니다.
              </li>
              <li className={classes.listItem}>
                본 조의 세부 기준(산식, 절차 등)은 제9조 및 회사가 별도로 공지하는 크레딧 정책에 따르며, 회사는 운영상
                필요에 따라 조정할 수 있습니다.
              </li>
              <li className={classes.listItem}>
                무상 또는 프로모션 크레딧은 유효기간이 7일 ~ 30일이며, 환불 대상에서 제외됩니다. 유효기간 경과 시 별도
                고지 없이 자동 소멸될 수 있으며, 회사는 이에 대해 별도의 복구나 보상을 제공하지 않습니다.
              </li>
            </ol>
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 11조 과오금
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            회사는 유료서비스 결제와 관련하여 과오금이 발생한 경우 이용대금의 결제와 동일한 방법으로 과오금 전액을
            환불합니다. 다만, 동일한 방법으로 환불이 불가능할 때는 이를 사전에 고지합니다.
          </li>
          <li className={classes.listItem}>
            회사의 귀책사유로 과오금이 발생한 경우 과오금 전액을 환불합니다. 단, 회원의 귀책사유로 과오금이 발생한 경우,
            회사가 과오금을 환불하는데 소요되는 비용은 합리적인 범위 내에서 이용자가 부담하여야 하며, 회사는 해당 비용을
            차감 후 과오금을 환불할 수 있습니다.
          </li>
          <li className={classes.listItem}>
            회사는 회원이 주장하는 과오금에 대해 환불을 거부할 경우, 정당하게 유료서비스 요금이 부과되었음을 입증할
            책임을 집니다.
          </li>
          <li className={classes.listItem}>
            회사는 과오금의 세부 환불절차 및 기타 사항에 대하여 다음과 같이 「콘텐츠이용자보호지침」이 정하는 바에
            따릅니다.
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 12조 저작권 정책
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            톡탁에서 제공하는 모든 템플릿 및 개별 디자인 요소의 저작권은 회사가 소유하고 있거나 원저작자에 사용허가를
            받아 제공되고 있습니다. 아울러 제공되는 모든 템플릿 및 개별 디자인요소들은 국내 및 국제 저작권의 보호를
            받습니다.
          </li>
          <li className={classes.listItem}>
            회사는 서비스의 안내 또는 마케팅을 목적으로 회원이 톡탁 서비스를 통해 제작한 결과 글, 영상, 이미지의 일부
            또는 전체를 활용할 수 있습니다. 회원은 언제든지 해당 결과 글, 영상, 이미지 활용에 대해 사용정지, 비공개 등의
            조치를 요청할 수 있으며, 회사는 회원의 요청을 지체 없이 처리합니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>
                회원이 톡탁을 통해 제작한 콘텐츠가 ① 유튜브 등 외부 플랫폼에 공개 상태로 업로드되었거나, ② 도매꾹 상품
                URL을 기반으로 제작된 경우, 당사는 해당 콘텐츠를 보다플레이(주), (주)지앤지커머스 및 관계사 사이트의
                상품페이지 또는 홍보채널에 임베드(embed) 방식 또는 원본 파일 형태로 노출·활용할 수 있습니다.
              </li>
              <li className={classes.listItem}>
                원본 파일 형태의 활용에는 복제, 편집, 가공, 배포, 전송, 공중송신, 전시 등의 행위가 포함되며, 이는 상품
                홍보, 마케팅, 광고, 판매 촉진 등의 목적으로 사용할 수 있습니다. 단, 회원은 언제든 노출 중지를 요청할 수
                있으며, 요청 시 즉시 반영됩니다.
              </li>
              <li className={classes.listItem}>
                회원은 도매꾹 상품 URL을 기반으로 제작된 콘텐츠의 경우, 해당 상품의 공급사가 제공한 자료를 활용함에
                따라, 원저작권자가 해당 자료의 사용을 허락했음을 확인하고 동의합니다.
              </li>
            </ol>
          </li>
          <li className={classes.listItem}>회원은 회사가 공개한 별도의 저작권 정책에 따라 서비스를 이용해야 합니다.</li>
          <li className={classes.listItem}>
            본 약관 및 저작권 정책에서 벗어나는 방식으로 톡탁 서비스에서 제공하는 콘텐츠를 활용하여 저작권 분쟁이
            발생하는 경우, 회원은 보호를 받을 수 없으며 적발시 형사 처벌이나 민사상 손해 배상의 의무를 질 수 있습니다.
            또한, 이로 인해 회사에 손해가 발생하는 경우 회사는 회원에게 손해배상을 청구할 수 있습니다.
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 13조 계약 변경 및 해지
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            회원이 톡탁 서비스 이용을 더 이상 원치 않는 때에는 언제든지 서비스 내 제공되는 기능을 이용하여 이용계약의
            해지(회원 탈퇴) 신청을 할 수 있으며, 회사는 법령이 정하는 바에 따라 지체 없이 처리합니다. 다만, 유료
            서비스를 이용 중인 회원의 경우 유료 서비스 이용 기간이 종료된 후 이용계약 해지를 신청할 수 있습니다.
          </li>
          <li className={classes.listItem}>
            이용계약이 해지되면 법령 및 개인정보 처리방침에 따라 회원 정보를 보유할 수 있는 경우를 제외하고는 계정 정보
            및 회원이 제작한 글, 영상, 이미지 일체를 포함한 회원의 모든 데이터는 삭제되며, 삭제된 데이터는 복구가
            불가능합니다.
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 14조 분쟁의 해결
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            본 약관 또는 톡탁 서비스는 대한민국 법령에 따라 규정되고 이행됩니다. 서비스 이용과 관련하여 회사와 사용자
            간에 분쟁이 발생하면 이의 해결을 위해 성실히 협의할 것입니다. 그럼에도 해결되지 않으면 민사소송법상의
            관할법원에 소를 제기할 수 있습니다.
          </li>
        </ol>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6" className={classes.sectionTitle} sx={classes.sectionTitleColor}>
          제 15조 손해배상
        </Typography>
        <ol className={classes.decimalList}>
          <li className={classes.listItem}>
            회사는 법령상 허용되는 한도 내에서 서비스와 관련하여 본 약관에 명시되지 않은 어떠한 구체적인 사항에 대한
            약정이나 보증을 하지 않습니다. 또한, 회사는 사용자가 서비스 내에서 제작한 결과 글, 영상, 이미지의 제3자
            저작권 침해 여부, 신뢰도, 정확성 등에 대해서는 보증을 하지 않으며, 회사의 과실 없이 발생한 여러분의 손해에
            관하여는 책임을 부담하지 아니합니다.
          </li>
          <li className={classes.listItem}>
            회사는 회사의 과실로 인하여 여러분이 손해를 입게 될 경우 본 약관 및 관련 법령에 따라 여러분의 손해를
            배상하겠습니다. 다만 회사는 회사의 과실 없이 발생한 아래와 같은 손해에 관하여는 책임을 부담하지 않습니다.
            또한, 회사는 법률상 허용되는 한도 내에서 간접 손해, 특별 손해, 결과적 손해, 징계적 손해, 및 징벌적 손해에
            관한 책임을 부담하지 않습니다.
            <ol className={classes.alphaList}>
              <li className={classes.listItem}>천재지변 또는 이에 준하는 불가항력의 상태에서 발생한 손해</li>
              <li className={classes.listItem}>사용자의 고의 또는 과실로 인하여 서비스를 이용할 수 없어 발생한 손해</li>
              <li className={classes.listItem}>
                제3자가 불법적으로 회사의 서버에 접속·이용하거나, 악성프로그램을 전송 또는 유포함으로써 발생한 손해
              </li>
              <li className={classes.listItem}>
                전송된 데이터의 생략, 누락, 파괴 등으로 발생한 손해, 명예훼손 등 제3자가 서비스를 이용하는 과정에서
                발생한 손해
              </li>
              <li className={classes.listItem}>
                광고 채널을 연결해 광고를 집행하는 과정에서 사용자의 데이터 오차나 착오로 인해 발생한 손해
              </li>
              <li className={classes.listItem}>기타 회사의 고의 또는 과실이 없는 사유로 인해 발생한 손해</li>
            </ol>
          </li>
          <li className={classes.listItem}>
            회사는 사용자 상호 간 및 사용자와 제삼자 상호 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며,
            이에 따른 손해를 배상할 책임도 없습니다.
          </li>
          <li className={classes.listItem}>
            톡탁의 웹사이트 및 애플리케이션은 하드웨어 및 소프트웨어적인 오류가 발생할 수 있습니다. 회사는 최선을 다하여
            오류의 발생을 막기 위하여 노력하겠으나, 오류의 발생으로 인한 작업물의 유실에 따른 피해에 대하여 회사는
            책임을 지지 않습니다.
          </li>
        </ol>
      </Box>

      <Box className={classes.footer}>
        <Typography className={classes.footerText}>공고일자 : 2025년 04월 11일</Typography>
        <Typography className={classes.footerTextLast}>
          시행일자 : 2025년 04월 11일
          <br />
          8월 28일 update
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfService;
