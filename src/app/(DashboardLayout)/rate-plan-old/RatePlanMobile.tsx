'use client';

import { RootState } from '@/app/lib/store/store';
import { formatNumberKR } from '@/utils/format';
import { Icon } from '@iconify/react';
import { Box, Button, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

type TabType = 'personal' | 'business';

const RatePlanMobile = ({ tab = 0 }: { tab: number }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [maxAddedSns, setMaxAddedSns] = useState(0);

  const initPackageList = [
    {
      name: 'free',
      title: '무료',
      subTitle: 'SNS 수익화, 지금 시작해보세요.',
      price: 0,
      discount: 24000,
      multiChannelDiscount: 0,
      finalPrice: 5000,
      description1: [
        '콘텐츠 생성 <b>15개</b>/월 (상품 5개*콘텐츠 3종)',
        '생성된 콘텐츠 <b>다운로드 가능</b>',
        '배포 방식 <b>수동</b>',
      ],
      description2: null,
      btnLabel: '나의 현재 플랜',
      isDisabled: true,
      action: () => {},
    },
    {
      name: 'basic',
      title: '베이직',
      subTitle: 'SNS 홍보를 처음 시작하는 분',
      price: 29900,
      discount: 24000,
      multiChannelDiscount: 0,
      finalPrice: 5000,
      description1: [
        '콘텐츠 생성 개수 <b>90개</b>/월(상품 30개*콘텐츠 3종)',
        '생성 콘텐츠 종류 <b>3개</b>',
        'SNS당 자동 게시 콘텐츠 수 <b>1개</b>',
        '콘텐츠 배포 채널 <b>1개</b>(선택)',
        '배포 방식 <b>자동</b>(클릭 시 즉시)',
      ],
      description2: ['SNS 도달률 기본 노출'],
      btnLabel:
        user?.subscription === 'FREE'
          ? '베이직 이용하기'
          : user?.subscription === 'BASIC' || user?.subscription === 'NEW_USER'
            ? '나의 현재 플랜'
            : '채널 추가하기',
      action: () => handleClickBtn(),
    },
    {
      name: 'standard',
      title: '스탠다드',
      subTitle: 'SNS를 더 빠르게 성장시키고 싶은 분',
      price: 89900,
      discount: 60000,
      multiChannelDiscount: 2945,
      finalPrice: 5000,
      description1: [
        '콘텐츠 생성 개수 <b>180개</b>/월(상품 60개*콘텐츠 3종)',
        '생성 콘텐츠 종류 <b>3개</b>',
        'SNS당 자동 게시 콘텐츠 수 <b>1개</b>(AI 최적화)',
        '콘텐츠 배포 채널 <b>7개</b>(모두)',
        '배포 방식 <b>자동</b>(AI 예약 배포)',
      ],
      description2: [
        'AI 바이럴 영상 기능',
        'AI 바이럴 문구 기능',
        'SNS 도달률 AI 최적화 적용(준비 중)',
        'SNS 예약 업로드 가능(준비 중)',
      ],
      btnLabel: '스탠다드 이용하기',
      action: () => handleClickBtn(),
    },
  ];
  const [packageList, setPackageList] = useState(initPackageList);
  const [addedSns, setAddedSns] = useState(0);

  useEffect(() => {
    setPackageList(
      tab === 0
        ? initPackageList
        : [
            {
              name: 'business',
              title: '기업형 스탠다드',
              subTitle: '브랜드, 플랫폼, 에이전시 고객을 위한 플랜',
              price: 89900,
              discount: 0,
              multiChannelDiscount: 2945,
              finalPrice: 5000,
              description1: [
                '콘텐츠 생성 개수 <b>90개</b>/월(상품 30개*콘텐츠 3종)',
                '생성 콘텐츠 종류 <b>3개</b>',
                'SNS당 자동 게시 콘텐츠 수 <b>2개</b>(AI 최적화)',
                '콘텐츠 배포 채널 <b>7개</b>(모두)',
                '배포 방식 <b>자동</b>(클릭 시 즉시)',
              ],
              description2: [
                'AI 바이럴 영상 기능',
                'AI 바이럴 문구 기능',
                'SNS 도달률 AI 최적화 적용(준비 중)',
                'SNS 예약 업로드 가능(준비 중)',
              ],
              btnLabel: '컨설팅 신청',
              action: () => {
                window.open('https://forms.gle/kgZLFSGXTkdABZox7', '_blank');
              },
            },
          ],
    );
    setSelectedPackage(0);
  }, [tab]);

  useEffect(() => {
    setMaxAddedSns(3 - (user?.total_link_active || 1));
  }, [user?.total_link_active]);

  useEffect(() => {
    setPackageList(
      tab === 0
        ? initPackageList
        : [
            {
              name: 'business',
              title: '기업형 스탠다드',
              subTitle: '브랜드, 플랫폼, 에이전시 고객을 위한 플랜',
              price: 89900,
              discount: 0,
              multiChannelDiscount: 2945,
              finalPrice: 5000,
              description1: [
                '콘텐츠 생성 개수 <b>90개</b>/월(상품 30개*콘텐츠 3종)',
                '생성 콘텐츠 종류 <b>3개</b>',
                'SNS당 자동 게시 콘텐츠 수 <b>2개</b>(AI 최적화)',
                '콘텐츠 배포 채널 <b>7개</b>(모두)',
                '배포 방식 <b>자동</b>(클릭 시 즉시)',
              ],
              description2: [
                'AI 바이럴 영상 기능',
                'AI 바이럴 문구 기능',
                'SNS 도달률 AI 최적화 적용(준비 중)',
                'SNS 예약 업로드 가능(준비 중)',
              ],
              btnLabel: '컨설팅 신청',
              action: () => {
                window.open('https://forms.gle/kgZLFSGXTkdABZox7', '_blank');
              },
            },
          ],
    );
  }, [selectedPackage, addedSns]);

  const handleClickBtn = () => {
    router.push(user?.subscription !== 'BASIC' ? '/payment' : `/payment?addedSns=${addedSns}`);
  };

  return (
    <Box className="sm:hidden font-pretendard bg-[#fff] px-[20px] sm:bg-[#F8F8F8] min-h-screen w-full mx-auto sm:py-[40px]">
      <FormControl component="fieldset" className="flex mt-[15px] sm:mt-[25px]">
        <RadioGroup
          value={packageList[selectedPackage]?.name}
          onChange={(e) => {
            setSelectedPackage(packageList.findIndex((item) => item?.name === e.target.value));
          }}
          className="w-full gap-[10px] flex-nowrap"
        >
          {packageList?.map((item: any, index: number) => (
            <Box>
              <FormControlLabel
                key={item.name}
                value={item.name}
                control={
                  <Radio
                    sx={{
                      '&.Mui-checked': {
                        color: '#4776EF',
                      },
                      // display: { xs: 'none', sm: 'block' },
                    }}
                    size="small"
                  />
                }
                sx={{
                  '&>.MuiTypography-root': {
                    width: 'calc(100% - 40px)',
                  },
                }}
                className={`mx-0 px-[10px] py-[16px] w-full sm:h-auto sm:justify-start rounded-[8px] border-solid${selectedPackage == index ? ' border-[1.5px] sm:border-[2px] border-[#4776EF]' : ' border-[1px] border-[#E7E7E7]'}`}
                label={
                  <Box className={`w-full`}>
                    <Box className={`flex justify-between py-[7px] w-full`}>
                      <Typography className="text-[16px] font-pretendard font-bold" color="#272727">
                        {item.title}
                      </Typography>
                      <Typography className="text-[16px] text-right font-pretendard font-medium">
                        <span className={`font-bold ${selectedPackage == index ? 'text-[#4776EF]' : 'text-[#272727]'}`}>
                          {item.name === 'business'
                            ? '영업팀 문의'
                            : item.price === 0
                              ? '한시적 Free'
                              : `${formatNumberKR(item.price - item.discount)}원`}
                        </span>
                        {item.name !== 'business' && <span>/월</span>}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box className={`flex justify-between py-[7px] sm:py-[24px] w-full`}>
                      <Typography className="text-[12px] font-pretendard text-clip" color="#6A6A6A">
                        {item.subTitle}
                      </Typography>
                      {item.price > 0 && (
                        <Typography className="text-[11px] text-right font-pretendard line-through" color="#6A6A6A">
                          {formatNumberKR(item.price)}원/월
                        </Typography>
                      )}
                    </Box>
                  </Box>
                }
              />
              {index === 1 && (
                <Box className="px-[10px] pt-[10px]">
                  {user?.total_link_active === 2 && (
                    <Box
                      className={`text-[#272727] text-[16px] font-medium${addedSns >= maxAddedSns ? ' order-2' : ' order-1'}`}
                    >
                      채널 1개 구독 중
                    </Box>
                  )}
                  <Box className="flex justify-between w-full">
                    <Box className="flex items-center gap-[5px]">
                      <span
                        className={`text-[#272727] text-[16px] font-medium${addedSns >= maxAddedSns ? ' order-2' : ' order-1'}`}
                      >
                        채널 {addedSns}개 추가
                      </span>
                      <span
                        className={`h-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer relative${addedSns >= 2 ? ' order-1' : ' order-2'}`}
                        onClick={() => {
                          setAddedSns((prev) => prev + (addedSns >= maxAddedSns ? -1 : 1));
                        }}
                      >
                        <Icon
                          icon={addedSns >= maxAddedSns ? 'lineicons:minus-circle' : 'lineicons:plus-circle'}
                          height={24}
                        />
                      </span>
                    </Box>
                    <Box className="flex items-center">
                      <span className="text-[#4776EF] font-bold text-[16px] mr-1">{2500 * addedSns}원</span>
                      /월
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </RadioGroup>
      </FormControl>
      <Box className="space-y-2 px-[20px] mt-[30px]">
        {packageList[selectedPackage].description1.map((item) => (
          <Box className="flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.33854 10.0013C3.33854 6.3194 6.32331 3.33464 10.0052 3.33464C13.6871 3.33464 16.6719 6.3194 16.6719 10.0013C16.6719 13.6832 13.6871 16.668 10.0052 16.668C6.32331 16.668 3.33854 13.6832 3.33854 10.0013ZM10.0052 1.66797C5.40283 1.66797 1.67188 5.39893 1.67188 10.0013C1.67188 14.6036 5.40283 18.3346 10.0052 18.3346C14.6075 18.3346 18.3385 14.6036 18.3385 10.0013C18.3385 5.39893 14.6075 1.66797 10.0052 1.66797ZM13.0738 8.94389C13.4103 8.6298 13.4285 8.10249 13.1145 7.76604C12.8004 7.42958 12.273 7.41139 11.9366 7.72542L8.93379 10.5281L8.07381 9.72539C7.73735 9.41139 7.21003 9.42955 6.89599 9.76605C6.58197 10.1025 6.60015 10.6298 6.93661 10.9439L8.36521 12.2772C8.68538 12.576 9.18221 12.576 9.50238 12.2772L13.0738 8.94389Z"
                fill="#4776EF"
              />
            </svg>
            <Typography
              className="text-[12px] font-pretendard text-clip"
              color="#6A6A6A"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          </Box>
        ))}
        {packageList[selectedPackage]?.description2 && <Divider />}
        {packageList[selectedPackage]?.description2 &&
          packageList[selectedPackage].description2?.map((item) => (
            <Box className="flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.33854 10.0013C3.33854 6.3194 6.32331 3.33464 10.0052 3.33464C13.6871 3.33464 16.6719 6.3194 16.6719 10.0013C16.6719 13.6832 13.6871 16.668 10.0052 16.668C6.32331 16.668 3.33854 13.6832 3.33854 10.0013ZM10.0052 1.66797C5.40283 1.66797 1.67188 5.39893 1.67188 10.0013C1.67188 14.6036 5.40283 18.3346 10.0052 18.3346C14.6075 18.3346 18.3385 14.6036 18.3385 10.0013C18.3385 5.39893 14.6075 1.66797 10.0052 1.66797ZM13.0738 8.94389C13.4103 8.6298 13.4285 8.10249 13.1145 7.76604C12.8004 7.42958 12.273 7.41139 11.9366 7.72542L8.93379 10.5281L8.07381 9.72539C7.73735 9.41139 7.21003 9.42955 6.89599 9.76605C6.58197 10.1025 6.60015 10.6298 6.93661 10.9439L8.36521 12.2772C8.68538 12.576 9.18221 12.576 9.50238 12.2772L13.0738 8.94389Z"
                  fill="#4776EF"
                />
              </svg>
              <Typography
                className="text-[12px] font-pretendard text-clip"
                color="#6A6A6A"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </Box>
          ))}
      </Box>
      <Box className="bg-[#fff] py-[15px] fixed bottom-0 w-full">
        <Button
          disableElevation
          disabled={packageList[selectedPackage || 0].isDisabled}
          variant="contained"
          size="large"
          className=" w-[calc(100%-40px)] sm:relative sm:w-full h-[50px] rounded-[6px] sm:rounded-[14px] text-[16px] font-medium sm:text-[12px] sm:font-semibold px-0 pt-[9px] text-[#fff]"
          sx={{
            backgroundImage: 'linear-gradient(to right, #4776EF, #AD50FF)',
            '&.Mui-disabled': {
              backgroundImage: 'none',
              backgroundColor: '#E7E7E7 !important',
              color: '#6A6A6A',
            },
          }}
          onClick={packageList[selectedPackage]?.action}
        >
          {packageList[selectedPackage || 0].btnLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default RatePlanMobile;
