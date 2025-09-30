'use client';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { NoticeWebcomeNewUserMobile } from './noticeWebcomeNewUserMobile';

const Content = () => (
  <Box sx={{ textAlign: 'left', fontSize: '14px', color: '#686868', lineHeight: '1.6', fontFamily: 'var(--font-pretendard)' }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
      <Box>
        <Typography sx={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', fontFamily: 'var(--font-pretendard)', color: '#686868' }}>
          ■ 수집 항목
        </Typography>
        <Typography sx={{ marginLeft: '17px', fontSize: '14px', fontFamily: 'var(--font-pretendard)', color: '#686868' }}>
          - 이메일 주소 및 휴대전화번호(문자 수신 선택 시)
        </Typography>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
      <Box>
        <Typography sx={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', fontFamily: 'var(--font-pretendard)', color: '#686868' }}>
          ■ 수집 및 이용 목적
        </Typography>
        <Typography sx={{ marginLeft: '17px', fontSize: '14px', fontFamily: 'var(--font-pretendard)', color: '#686868' }}>
          - 톡탁의 이벤트, 무료 강의, 신규 기능 등 광고성 정보를 이메일·문자 등으로 안내하기 위함
        </Typography>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
      <Box>
        <Typography sx={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', fontFamily: 'var(--font-pretendard)', color: '#686868' }}>
          ■ 보유 및 이용 기간
        </Typography>
        <Box sx={{ marginLeft: '17px' }}>
          <Typography sx={{ fontSize: '14px', fontFamily: 'var(--font-pretendard)', color: '#686868' }}>
            - 별도 동의 철회시까지 또는 회원 탈퇴 시까지
          </Typography>
          <Typography sx={{ marginLeft: '9px', color: '#686868', fontSize: '14px', fontFamily: 'var(--font-pretendard)' }}>
            * 단, 관련 법령에 따라 일정 기간 보관이 필요한 경우, 해당 법령을 따릅니다.
          </Typography>
        </Box>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
      <Box>
        <Typography sx={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', fontFamily: 'var(--font-pretendard)', color: '#686868' }}>
          ■ 수신 거부 안내
        </Typography>
        <Typography sx={{ marginLeft: '17px', fontSize: '14px', fontFamily: 'var(--font-pretendard)', color: '#686868' }}>
          - 언제든지 [내 정보] &gt; [마케팅 수신 설정]에서 동의 여부를 변경하실 수 있으며, 수신을 거부하셔도 서비스 이용에는 제한이 없습니다.
        </Typography>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
      <Box>
        <Typography sx={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', fontFamily: 'var(--font-pretendard)', color: '#686868' }}>
          ■ 문자 전송 시 유의사항
        </Typography>
        <Typography sx={{ marginLeft: '17px', fontSize: '14px', fontFamily: 'var(--font-pretendard)', color: '#686868' }}>
          - 문자 전송은 전기통신사업법 및 관련 법령에 따라 야간 시간대(21시~08시)에는 제한될 수 있습니다.
        </Typography>
      </Box>
    </Box>

    <Box sx={{ marginTop: '20px', fontSize: '12px', color: '#A4A4A4', lineHeight: '1.5' }}>
      <Typography sx={{ fontSize: '12px', color: '#A4A4A4', marginBottom: '4px', fontFamily: 'var(--font-pretendard)' }}>
        * 광고성 정보 발송을 위해 필요한 경우, 일부 업무를 외부 전문 업체에 위탁할 수 있습니다.
      </Typography>
      <Typography sx={{ fontSize: '12px', color: '#A4A4A4', fontFamily: 'var(--font-pretendard)' }}>
        * 위탁이 발생하는 경우, 수탁자의 명칭 및 위탁 업무 내용은 이용약관의 개인정보처리방침에서 확인하실 수 있습니다.
      </Typography>
    </Box>
  </Box>
)

export const noticeWebcomeNewUser = (
  successCallback?: () => void,
) => {
  const fixedTitle = '마케팅 수신 정보 동의';
  const fixedHtml = `
    <div style="text-align:left; font-size:14px; color:#686868; line-height:1.6; font-family: var(--font-pretendard);">
      <div style="margin-bottom:16px;">
        <div style="font-weight:600; margin-bottom:8px; font-size:14px; color:#686868;">■ 수집 항목</div>
        <div style="margin-left:0; font-size:14px; color:#686868;">- 이메일 주소 및 휴대전화번호(문자 수신 선택 시)</div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-weight:600; margin-bottom:8px; font-size:14px; color:#686868;">■ 수집 및 이용 목적</div>
        <div style="margin-left:0; font-size:14px; color:#686868;">
          - 톡탁의 이벤트, 무료 강의, 신규 기능 등 광고성 정보를 이메일·문자 등으로 안내하기 위함
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-weight:600; margin-bottom:8px; font-size:14px; color:#686868;">■ 보유 및 이용 기간</div>
        <div style="margin-left:0;">
          <div style="font-size:14px; color:#686868;">- 별도 동의 철회시까지 또는 회원 탈퇴 시까지</div>
          <div style="font-size:14px; color:#686868;">* 단, 관련 법령에 따라 일정 기간 보관이 필요한 경우, 해당 법령을 따릅니다.</div>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-weight:600; margin-bottom:8px; font-size:14px; color:#686868;">■ 수신 거부 안내</div>
        <div style="margin-left:0; font-size:14px; color:#686868;">
          - 언제든지 [내 정보] > [마케팅 수신 설정]에서 동의 여부를 변경하실 수 있으며, 수신을 거부하셔도 서비스 이용에는 제한이 없습니다.
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <div style="font-weight:600; margin-bottom:8px; font-size:14px; color:#686868;">■ 문자 전송 시 유의사항</div>
        <div style="margin-left:0; font-size:14px; color:#686868;">
          - 문자 전송은 전기통신사업법 및 관련 법령에 따라 야간 시간대(21시~08시)에는 제한될 수 있습니다.
        </div>
      </div>

      <div style="margin-top:20px; font-size:14px; color:#686868; line-height:1.5;">
        <div style="font-size:14px; color:#686868; margin-bottom:4px;">
          * 광고성 정보 발송을 위해 필요한 경우, 일부 업무를 외부 전문 업체에 위탁할 수 있습니다.
        </div>
        <div style="font-size:14px; color:#686868;">
          * 위탁이 발생하는 경우, 수탁자의 명칭 및 위탁 업무 내용은 이용약관의 개인정보처리방침에서 확인하실 수 있습니다.
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);

  const closeModal = () => {
    root.unmount();
    container.remove();
  };
  const handleConfirm = () => {
    closeModal();
    successCallback && successCallback();
  };

  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  const shell = (node: React.ReactNode) => <StyledEngineProvider injectFirst>{node}</StyledEngineProvider>;

  root.render(
    shell(
      isMobile ? (
        <NoticeWebcomeNewUserMobile
          title={fixedTitle}
          html={fixedHtml}
          showCancelButton={false}
          confirmButtonText={'확인'}
          cancelButtonText={''}
          onClose={closeModal}
          onConfirm={handleConfirm}
          icon={''}
          icon_url={''}
        />
      ) : (
        <Dialog
          open
          onClose={(_event, reason) => {
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
              closeModal();
            }
          }}
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              borderRadius: '30px',
              p: '48px 53px',
              maxWidth: '658px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            },
          }}
        >
          <DialogTitle
            sx={{
              fontSize: '21px',
              lineHeight: '30px',
              color: '#090909',
              pt: 0,
              px: 0,
              fontFamily: 'var(--font-pretendard)',
              fontWeight: 600,
              textAlign: 'left',
            }}
          >
            {fixedTitle}
          </DialogTitle>

          <DialogContent
            sx={{
              px: 0,
              pb: 3,
              flexGrow: 1,
              overflowY: 'auto',
            }}
          >
            <Content />
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', p: 0 }}>
            <Button
              onClick={handleConfirm}
              disableRipple
              disableElevation
              sx={{
                borderRadius: '9999px',
                fontSize: '18px',
                fontFamily: 'var(--font-pretendard)',
                fontWeight: 600,
                lineHeight: '21px',
                backgroundColor: '#272727',
                color: '#fff',
                height: '50px',
                width: '180px',
              }}
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>
      ),
    ),
  );
};
