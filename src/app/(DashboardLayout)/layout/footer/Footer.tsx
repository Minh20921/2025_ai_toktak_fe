'use client';
import { Box, Container, Typography, Link, Stack, Divider } from '@mui/material';
import { Blog, Facebook, Instagram, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';

const Footer = () => {
  return (
    <Box className="footer bg-white pt-[50px] sm:pt-[30px] pb-[30px] sm:pb-[30px] text-[#C5CAD1] font-pretendard text-sm :w-[calc(100vw-50px)] xl:w-[calc(100vw-320px)] z-[20]">
      <Container maxWidth="xl">
        <Box className="flex flex-col space-y-0.5">
          <Typography
            variant="body2"
            className="text-[#C5CAD1] font-pretendard text-[10px] sm:text-sm leading-4 sm:leading-6 space-x-2.5 text-center sm:text-left order-2 sm:order-1 mt-[20px] sm:mt-0"
          >
            <span>보다플레이(주)</span>
            <span>대표 : 모영일</span>
            <span>사업자등록번호 : 217-88-02512</span>
            <br className="sm:hidden" />
            <span>통신판매업신고번호 : 제2023-서울영등포-2859호</span>
            <br className="sm:hidden" />
            <span>호스팅서비스 : Amazon Web Service(AWS)</span>
          </Typography>

          <Typography
            variant="body2"
            className="text-[#C5CAD1] font-pretendard text-[10px] sm:text-sm leading-4 sm:leading-6 space-x-2.5 text-center sm:text-left order-3 sm:order-2"
          >
            <span>EMAIL : cs@bodaplay.ai TEL : 02-2071-0716</span>
            <br className="sm:hidden" /> <span className="hidden sm:inline"> | </span>
            <span>서울특별시 국제금융로 6길 30, 506호</span>
            <br className="sm:hidden" />
            <span>Copyright © Allrights reserved bodaplay.ai</span>
          </Typography>

          <Box className="lg:flex justify-between items-center order-1 sm:order-3">
            <Box className="flex justify-between md:gap-[30px]">
              <Link
                href="/terms"
                className="text-[#C5CAD1] font-pretendard text-[13px] sm:text-sm leading-6 hover:text-gray-700 no-underline"
              >
                이용 약관
              </Link>
              <Link
                href="/policy"
                className="text-[#C5CAD1] font-pretendard text-[13px] sm:text-sm leading-6 hover:text-gray-700 no-underline"
              >
                개인정보 처리방침
              </Link>
              <Link
                href="/copyright"
                className="text-[#C5CAD1] font-pretendard text-[13px] sm:text-sm leading-6 hover:text-gray-700 no-underline"
              >
                저작권 정책
              </Link>
              <Link
                href="/ai-policy"
                className="text-[#C5CAD1] font-pretendard text-[13px] sm:text-sm leading-6 hover:text-gray-700 no-underline"
              >
                AI약관
              </Link>
            </Box>

            <Stack direction="row" className="text-[#C5CAD1] font-pretendard hidden sm:flex gap-[10px] justify-center">
              <Link
                href="https://www.youtube.com/@toktak_official"
                target="_blank"
                className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-red-600"
              >
                <Youtube className="w-[30px] h-[30px]" color="#272727" />
              </Link>
              <Link
                href="https://www.instagram.com/toktak_official_/"
                target="_blank"
                className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-pink-600"
              >
                <Instagram className="w-[30px] h-[30px]" color="#272727" />
              </Link>
              <Link
                href="https://www.facebook.com/profile.php?id=61575980720268&sk=about"
                target="_blank"
                className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-blue-600"
              >
                <Facebook className="w-[30px] h-[30px]" color="#272727" />
              </Link>
              <Link
                href="https://www.tiktok.com/@toktak_official"
                target="_blank"
                className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-gray-700"
              >
                <TikTok className="w-[30px] h-[30px]" color="#272727" />
              </Link>
              <Link
                href="https://www.threads.com/@toktak_official_"
                target="_blank"
                className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-gray-700"
              >
                <Threads className="w-[30px] h-[30px]" color="#272727" />
              </Link>
              <Link
                href="https://x.com/toktak_official"
                target="_blank"
                className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-blue-400"
              >
                <Twitter className="w-[30px] h-[30px]" color="#272727" />
              </Link>
              <Link
                href="https://blog.naver.com/toktak_official"
                target="_blank"
                className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-gray-700"
              >
                <Blog className="w-[30px] h-[30px]" color="#272727" />
              </Link>
            </Stack>
          </Box>
        </Box>
        <Stack
          direction="row"
          className="text-[#C5CAD1] font-pretendard flex gap-[10px] justify-center sm:hidden mt-[30px] sm:mt-0"
        >
          <Link
            href="https://www.youtube.com/@toktak_official"
            target="_blank"
            className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-red-600"
          >
            <Youtube className="w-[30px] h-[30px]" color="#272727" />
          </Link>
          <Link
            href="https://www.instagram.com/toktak_official_/"
            target="_blank"
            className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-pink-600"
          >
            <Instagram className="w-[30px] h-[30px]" color="#272727" />
          </Link>
          <Link
            href="https://www.facebook.com/profile.php?id=61575980720268&sk=about"
            target="_blank"
            className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-blue-600"
          >
            <Facebook className="w-[30px] h-[30px]" color="#272727" />
          </Link>
          <Link
            href="https://www.tiktok.com/@toktak_official"
            target="_blank"
            className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-gray-700"
          >
            <TikTok className="w-[30px] h-[30px]" color="#272727" />
          </Link>
          <Link
            href="https://www.threads.com/@toktak_official_"
            target="_blank"
            className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-gray-700"
          >
            <Threads className="w-[30px] h-[30px]" color="#272727" />
          </Link>
          <Link
            href="https://x.com/toktak_official"
            target="_blank"
            className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-blue-400"
          >
            <Twitter className="w-[30px] h-[30px]" color="#272727" />
          </Link>
          <Link
            href="https://blog.naver.com/toktak_official"
            target="_blank"
            className="text-[#C5CAD1] font-pretendard bg-[#F6F7F9] rounded-full w-30 h-30 hover:text-gray-700"
          >
            <Blog className="w-[30px] h-[30px]" color="#272727" />
          </Link>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
