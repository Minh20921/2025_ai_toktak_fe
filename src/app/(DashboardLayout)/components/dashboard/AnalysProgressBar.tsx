import Image from 'next/image';
import { Box, Divider } from '@mui/material';

const AnalysProgressBar = ({ step = 1 }: { step?: number }) => {
  const stepLabels = ['상품 링크 분석 중', 'COMMENT 생성', 'HASHTAG 추출', '바이럴 콘텐츠 생성'];
  const stepLabelsMobile = [
    '상품 링크 <br/>분석 중',
    'COMMENT <br/>생성',
    'HASHTAG <br/>추출',
    '바이럴 콘텐츠 <br/>생성',
  ];

  return (
    <>
      <Box className="hidden sm:flex col-span-12 border-b-[2px] border-b-[#F1F1F1] justify-center pb-[-10px]">
        {stepLabels.map((label: string, index: number) => (
          <Box key={`progress_${index}`} className={`flex`}>
            {index > 0 &&
              (step >= index - 1 ? (
                <Box className="content-end">
                  <img
                    src={`/images/home/dot${step === index - 1 ? '_loading.gif' : '.svg'}`}
                    className={`${step === index - 1 ? 'h-[27px] mb-[20px]' : 'h-[4px] w-[43px] mb-[22px]'} mx-[15px]`}
                  />
                </Box>
              ) : (
                <Box className="w-[73px]" />
              ))}
            <Box className="flex gap-[10px] items-center">
              <Image
                src={`/images/home/${step > index ? 'done' : step === index ? 'doing' : 'notDo'}_progress.svg`}
                width={20}
                height={20}
                alt=""
              />
              <Box
                className={`pt-[20px] pb-[15px] text-[18px] mb-[-2px]${step === index ? ' border-b-[3px] border-b-[#537EEF] bg-[#fff]' : ''}`}
                style={{
                  color: step > index ? '#537EEF' : step === index ? '#525252' : '#CAD0E7',
                }}
              >
                {label}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Box className="relative flex sm:hidden col-span-12 justify-between pb-[-10px] mt-[70px]">
        <Divider
          sx={{
            height: '2px',
            width: `${((step + 0.6) / 4) * 100}vw`,
            position: 'absolute',
            left: '-20px',
            zIndex: 10,
          }}
          color="#4776EF"
        />
        <Divider
          sx={{
            height: '1px',
            width: `${((4 - step - 0.5) / 4) * 100}vw`,
            position: 'absolute',
            right: '-20px',
            zIndex: 10,
          }}
          color="#F1F1F1"
        />

        {stepLabelsMobile.map((label: string, index: number) => (
          <Box key={`progress_${index}`} className={`flex relative w-1/5 sm:w-auto justify-center`}>
            <Box
              className={`text-center pt-[20px] pb-[15px] text-[10px] mb-[-2px]`}
              style={{
                color: step >= index ? '#537EEF' : '#CAD0E7',
              }}
              dangerouslySetInnerHTML={{
                __html: label,
              }}
            />
            <Box
              className={`text-[10px] text-center text-[#fff] leading-[10px] content-center absolute top-[-7px] left-[40%] h-[16px] w-[16px] z-[50] rounded-full ${step > index ? 'bg-[#537EEF]' : step === index ? 'border-[#4776EF] border-solid border-[3px] bg-[#fff]' : 'bg-[#CAD0E7]'}`}
            >
              {step > index ? (
                <svg width="16" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.82423 0.574405C7.93678 0.686983 8 0.839651 8 0.998836C8 1.15802 7.93678 1.31069 7.82423 1.42327L3.32458 5.92292C3.26512 5.98239 3.19452 6.02957 3.11682 6.06176C3.03912 6.09395 2.95584 6.11052 2.87174 6.11052C2.78763 6.11052 2.70435 6.09395 2.62665 6.06176C2.54895 6.02957 2.47835 5.98239 2.41889 5.92292L0.183273 3.6877C0.125935 3.63232 0.0802012 3.56608 0.0487386 3.49284C0.0172761 3.41959 0.000715333 3.34082 2.26663e-05 3.26111C-0.000670001 3.1814 0.0145194 3.10235 0.0447043 3.02857C0.0748893 2.95479 0.119465 2.88776 0.175832 2.8314C0.232198 2.77503 0.299226 2.73045 0.373004 2.70027C0.446782 2.67008 0.525832 2.6549 0.605543 2.65559C0.685254 2.65628 0.764029 2.67284 0.837271 2.7043C0.910514 2.73577 0.976757 2.7815 1.03213 2.83884L2.87154 4.67824L6.97497 0.574405C7.03072 0.518619 7.09692 0.474365 7.16978 0.444171C7.24264 0.413978 7.32073 0.398438 7.3996 0.398438C7.47847 0.398438 7.55657 0.413978 7.62943 0.444171C7.70229 0.474365 7.76848 0.518619 7.82423 0.574405Z"
                    fill="white"
                  />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default AnalysProgressBar;
