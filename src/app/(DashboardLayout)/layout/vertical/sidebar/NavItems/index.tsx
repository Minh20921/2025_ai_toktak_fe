'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ChildItem } from '../Sidebaritems';
import { Sidebar } from 'flowbite-react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RootState } from '@/app/lib/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { Box, IconButton, Typography, Divider } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import ProfileTooltip from '@/app/(DashboardLayout)/profile/component/tooltip';
import moment from 'moment';
import API from '@service/api';
import { AppDispatch } from '@/app/lib/store/store';
import { setNotificationState } from '@/app/lib/store/notificationSlice';
import BottomPopupMobile from '@/app/(DashboardLayout)/components/popup/BottomPopupMobile';
import { getLogoText } from '../../../../../../../function/common';
import APIV2 from '@service/api_v2';
import { encodeUserId } from '@/utils/encrypt';
import { formatNumberKR } from '@/utils/format';

const UserMenu = ({
  setFixedProfileMenu,
  setProfileMenu,
  setIsOpen,
}: {
  setFixedProfileMenu: (value: boolean) => void;
  setProfileMenu: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  return (
    <Box className="p-[15px]">
      <Typography className="font-medium text-[16px] !font-pretendard ml-[1px]" color="#272727">
        {auth.user?.email}
      </Typography>
      <Box
        className="h-[172px] w-full sm:h-[143px] sm:w-[236px] p-[15px] rounded-[6px] leading-[50px] z-50 bg-[#F8F8F8] mt-[10px] cursor-pointer"
        onClick={(e) => {
          setFixedProfileMenu(false);
          setProfileMenu(false);
          setIsOpen(false);
          router.push('/profile?tabIndex=1');
          e.preventDefault();
        }}
      >
        <Typography className="font-bold text-[16px] !font-pretendard" color="#4776EF">
          {auth.user?.subscription_name}
        </Typography>
        <Typography className="!text-[12px] !font-pretendard" color="#A4A4A4">
          {auth.user?.subscription === 'FREE'
            ? '사용중인 플랜이 없어요.'
            : `만료 기간 : ${moment(auth.user?.subscription_expired).format('YYYY.MM.DD')}`}
        </Typography>
        <Divider style={{ borderColor: 'white' }} className="my-[20px] sm:mt-[10px] sm:mb-[10px]" />
        <Box className="grid grid-flow-row grid-cols-2 gap-[5px] mt-[10px] items-center">
          <Typography
            variant="subtitle2"
            color="#272727"
            fontWeight="semibold"
            fontSize={14}
            className="flex items-center !font-pretendard leading-[17px]"
          >
            내보내기
            <ProfileTooltip text="더 많은 채널(최대 7개)에 자동 배포하고 싶다면<br/>플랜 업그레이드 혹은 추가 옵션을 사용해보세요!" />
          </Typography>
          <Typography
            className="!font-pretendard"
            variant="subtitle2"
            color="#686868"
            fontWeight="semibold"
            fontSize={14}
            textAlign="right"
          >
            {auth.user?.total_link_active}개 채널
          </Typography>
          <Typography
            variant="subtitle2"
            color="#272727"
            fontWeight="semibold"
            fontSize={14}
            className="flex items-center !font-pretendard leading-[17px]"
          >
            생성하기
            <ProfileTooltip text="상품 URL을 사용하여 콘텐츠(블로그 글,<br/>쇼츠 영상, 이미지)를 생성할 때 차감됩니다." />
          </Typography>

          <Typography
            className="!font-pretendard"
            variant="subtitle2"
            color="#686868"
            fontWeight="semibold"
            fontSize={14}
            textAlign="right"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '6px', // khoảng cách giữa icon và text
            }}
            data-batch-remain={auth.user?.batch_remain}
            data-batch-total={auth.user?.batch_total}
          >
            <img
              src="/images/credit_token.png"
              alt="token"

            /> {formatNumberKR(auth.user?.batch_remain)}
          </Typography>


        </Box>
      </Box>
      <Box
        className="h-[39px] w-[236px] px-[15px] rounded-[6px] leading-[50px] z-50 hover:bg-[#F6F7F9] mt-[10px] flex gap-[5px] items-center cursor-pointer"
        onClick={(e) => {
          setFixedProfileMenu(false);
          setProfileMenu(false);
          setIsOpen(false);
          router.push('/profile');
          e.preventDefault();
        }}
      >
        <Icon icon={'mingcute:user-4-fill'} onClick={() => { }} className="cursor-pointer" width={19} height={19} />
        <Typography
          className="!font-pretendard"
          variant="subtitle2"
          color="#666C78"
          fontWeight="semibold"
          fontSize={14}
        >
          내 정보
        </Typography>
      </Box>
    </Box>
  );
};
interface NavItemsProps {
  item: ChildItem;
  isBottom?: boolean;
  setIsOpen: (value: boolean) => void;
}
const LOGO_TEXT = getLogoText();
const NavItems: React.FC<NavItemsProps> = ({ item, isBottom = false, setIsOpen = () => { } }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const auth = useSelector((state: RootState) => state.auth);
  const notification = useSelector((state: RootState) => state.notification);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showProfileMenu, setProfileMenu] = useState(false);
  const [showFixedProfileMenu, setFixedProfileMenu] = useState(false);

  useEffect(() => {
    const checkTooltip = typeof window !== 'undefined' && localStorage.getItem('tooltip_profile');
    setShowTooltip(!checkTooltip);
  }, []);

  const listComingSoon = LOGO_TEXT == 'TOKTAK' ? ['created'] : ['created', 'guide', 'form'];
  const handleCloseTooltip = () => {
    localStorage.setItem('tooltip_profile', '1');
    setShowTooltip(false);
  };

  useEffect(() => {
    if (item.url != pathname) {
      setFixedProfileMenu(false);
      setProfileMenu(false);
    }
  }, [pathname]);

  const updateNotificationAPI = useRef(
    new APIV2(`/api/v1/notification/update_read_notification`, 'POST', {
      success: (res) => {
        dispatch(
          setNotificationState({
            notification: 0,
          }),
        );
      },
      error: (err) => { },
      finally: () => { },
    }),
  );

  return (
    <Box className="relative">
      <Sidebar.Item
        href={listComingSoon.includes(item.id) ? '#' : item.url}
        target={item.target}
        as={Link}
        className={`${item.url == pathname
          ? isBottom
            ? 'text-[#666C78] bg-[#F6F7F9] font-bold'
            : '!text-[#4776EF] bg-[#EFF5FF] font-bold'
          : 'text-[#666C78] bg-transparent group/link font-semibold'
          } ${isBottom ? 'hover:text-[#666C78] hover:bg-[#F6F7F9]' : 'hover:text-[#4776EF] hover:bg-[#EFF5FF]'} rounded-[6px] relative`}
        onClick={(e: any) => {
          if (item.id == 'profile' && auth.user) {
            const tmpFixedProfileMenu = !showFixedProfileMenu;
            setFixedProfileMenu(tmpFixedProfileMenu);
            if (!tmpFixedProfileMenu) {
              setProfileMenu(false);
            }
            e.preventDefault();
            return;
          }
          setIsOpen(false);
          if (item.id == 'notification' && auth.user) {
            updateNotificationAPI.current.config.data = {
              user_id: encodeUserId(auth.user?.id || 0),
            };
            updateNotificationAPI.current.call();
          }
        }}
        onMouseEnter={(e) => {
          item.id == 'profile' && setProfileMenu(true);
          // e.preventDefault();ss
        }}
        onMouseLeave={() => {
          item.id == 'profile' && setProfileMenu(false);
        }}
      >
        <span className="flex gap-3 align-center items-center truncate">
          {item.icon ? (
            <Icon icon={item.icon} className={`${item.color}`} height={24}></Icon>
          ) : (
            <span
              className={`${item.url == pathname
                ? 'dark:bg-white rounded-full mx-1.5 group-hover/link:bg-[#EFF5FF] bg-[#EFF5FF] h-[6px] w-[6px]'
                : 'h-[6px] w-[6px] bg-darklink dark:bg-white rounded-full mx-1.5 group-hover/link:bg-[#EFF5FF]'
                } `}
            ></span>
          )}
          {item.id == 'notification' && notification.total > 0 && (
            <Box className="absolute left-[34px] top-[10px] h-[7px] w-[7px] rounded-full bg-[#4776EF]" />
          )}
          <span className="sm:max-w-[100px] overflow-hidden hide-menu">{item.name}</span>
          {listComingSoon.includes(item.id) && (
            <Image
              src="/images/backgrounds/tag-comingsoon.png"
              alt="commingsoon"
              width={48}
              height={23}
              quality={100}
            />
          )}
          {item.id == 'notification' && notification.total > 0 && (
            <Box className="absolute right-[20px] h-[24px] rounded-[6px] bg-[#EFF5FF] text-[#4776EF] text-[12px] px-[8px] content-center">
              {notification.total < 100 ? notification.total : '99+'}
            </Box>
          )}
          {item.id == 'profile' && auth.user && (
            <img src="/images/profile/dot.svg" className="absolute right-[20px] hidden sm:block" />
          )}
          {item.id == 'profile' && auth.user && (showProfileMenu || showFixedProfileMenu) && (
            <>
              <Box
                style={{
                  boxShadow: '0px 4.62px 34.62px 0px #0000001A',
                }}
                className="hidden sm:block h-[253px] w-[264px] fixed md:bottom-[30px] md:top-auto top-[620px] left-[220px] rounded-[6px] leading-[50px] z-[99999] bg-[#FFFFFF]"
                onMouseEnter={() => {
                  item.id == 'profile' && auth.user && setProfileMenu(true);
                }}
                onMouseLeave={() => {
                  item.id == 'profile' && auth.user && setProfileMenu(false);
                }}
              >
                <UserMenu
                  setFixedProfileMenu={setFixedProfileMenu}
                  setProfileMenu={setProfileMenu}
                  setIsOpen={setIsOpen}
                />
              </Box>
              <BottomPopupMobile
                open={showProfileMenu || showFixedProfileMenu}
                onClose={() => {
                  setFixedProfileMenu(false);
                  setProfileMenu(false);
                }}
              >
                <UserMenu
                  setFixedProfileMenu={setFixedProfileMenu}
                  setProfileMenu={setProfileMenu}
                  setIsOpen={setIsOpen}
                />
              </BottomPopupMobile>
            </>
          )}
        </span>
      </Sidebar.Item>
      {item.id == 'profile' &&
        auth.user &&
        auth.user.level == 0 &&
        showTooltip &&
        auth.user?.subscription !== 'FREE' && (
          <Box
            style={{
              backgroundImage: 'url(/images/upload/tooltipProfile.png)',
              backgroundRepeat: 'no-repeat',
            }}
            className="h-[58px] w-[289px] py-2 left-[5px] sm:fixed absolute bottom-[40px] sm:bottom-[100px] lg:bottom-14 sm:left-10 sm:top-auto text-center text-[#fff] text-[18px] font-bold leading-[50px] z-[99999] rounded-md tooltip-animate"
          >
            <Typography className="font-pretendard font-semibold text-xs" color="#FFFFFF">
              SNS 연결 해주세요🚨 수익 기회를 놓치고 있어요!
            </Typography>
            <Typography className="font-pretendard font-semibold text-xs" color="#A4A4A4">
              (닫으면 1주일 간 표시되지 않아요.)
            </Typography>
            <IconButton className="absolute -top-3 -right-6" onClick={handleCloseTooltip}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8" fill="#E7E7E7" />
                <path
                  d="m8 8.816-2.86 2.858a.55.55 0 0 1-.408.16.55.55 0 0 1-.409-.16.55.55 0 0 1-.16-.408q0-.248.16-.408l2.859-2.859-2.859-2.858a.55.55 0 0 1-.16-.408q0-.248.16-.409a.55.55 0 0 1 .409-.16q.247 0 .408.16L8 7.183l2.859-2.859a.55.55 0 0 1 .408-.16q.248 0 .409.16.16.161.16.409a.55.55 0 0 1-.16.408L8.816 8l2.858 2.859q.16.16.16.408a.55.55 0 0 1-.16.409.55.55 0 0 1-.408.16.55.55 0 0 1-.408-.16z"
                  fill="#6A6A6A"
                />
              </svg>
            </IconButton>
          </Box>
        )}
    </Box>
  );
};

export default NavItems;
