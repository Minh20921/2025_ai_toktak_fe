'use client';
import React, { useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import API from '@service/api';
import { toast } from '@/app/components/common/Toast';
import { showNoticeError } from '@/utils/custom/notice_error';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';

const Shorten = () => {
  const [url, setUrl] = useState('');
  const [short_url, setShortUrl] = useState('');
  const getMakeShotten = useRef(
    new API('/api/v1/shorten/create', 'POST', {
      success: (res) => {
        if (res?.code == 200) {
          toast.success(res?.message);

          setShortUrl(res?.data?.short_url);
        } else {
          showNoticeError(res?.message, '', false, '확인');
        }
      },
      error: (res) => {
        console.log(res);
        showNoticeError(res?.message, '', false, '확인');
      },
    }),
  );
  const handleRenderLink = async () => {
    getMakeShotten.current.config.data = {
      original_url: url,
    };
    await getMakeShotten.current.call();
  };

  const handleCopy = async () => {
    if (!short_url) {
      toast.error('복사할 URL이 없습니다!');
      return;
    }

    try {
      await navigator.clipboard.writeText(short_url);
      toast.success('URL이 복사되었습니다!');
    } catch (error) {
      console.error('복사 오류:', error);
      toast.error('복사에 실패했습니다!');
    }
  };

  return (
    <Box className="font-pretendard py-30 px-10">
      <h1 className="text-ld text-[50px] mt-[140px] mb-[44px] text-center text-[#0045FF]">
        톡!
        <span className="text-ld text-[30px] mb-6 px-4 text-[#090909]">누르면, 수익이</span>
        탁!
      </h1>

      <Box
        className="col-span-12 mt-[64px] h-[70px] mx-[156px] pl-[40px] pr-[10px] rounded-[37px] flex items-center bg-[#FFFFFF] "
        style={{ boxShadow: '0px 4.11px 30.84px 0px #0000001A' }}
      >
        <input
          className="w-[80%] h-[70px] outline-none text-[18px] font-semibold flex-1 text-[#5F5F5F] placeholder:text-[#C5CAD1] px-[10px]"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="상품 URL을 사용해 콘텐츠를 만들어보세요."
        />

        <Button
          color="primary"
          target="_blank"
          href=""
          variant="contained"
          size="large"
          className="w-[144px] h-[50px] ml-30 !rounded-[37px] !bg-[#4776EF] !text-[19px] !font-semibold disabled:text-white"
          onClick={handleRenderLink}
        >
          생성하기
        </Button>
      </Box>
      <Box
        className="col-span-12 mt-[64px] h-[70px] mx-[156px] pl-[40px] pr-[10px] rounded-[37px] flex items-center bg-[#FFFFFF] "
        style={{ boxShadow: '0px 4.11px 30.84px 0px #0000001A' }}
      >
        <input
          className="w-[80%] h-[70px] outline-none text-[18px] font-semibold flex-1 text-[#5F5F5F] placeholder:text-[#C5CAD1] px-[10px]"
          value={short_url}
          onChange={(e) => setShortUrl(e.target.value)}
          placeholder="상품 URL을 사용해 콘텐츠를 만들어보세요."
        />

        <Button
          color="primary"
          target="_blank"
          href=""
          variant="contained"
          size="large"
          className="w-[144px] h-[50px] ml-30 !rounded-[37px] !bg-[#4776EF] !text-[19px] !font-semibold disabled:text-white"
          onClick={handleCopy}
        >
          <Icon icon={'solar:copy-bold'} />
        </Button>
      </Box>
    </Box>
  );
};

export default Shorten;
