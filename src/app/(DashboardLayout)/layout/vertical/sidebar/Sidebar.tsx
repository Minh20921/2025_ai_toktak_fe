'use client';

import { RootState } from '@/app/lib/store/store';
import { getUserName } from '@/utils/helper/profile';
import { CloseIcon } from '@/utils/icons/icons';
import { Icon } from '@iconify/react';
import { Box, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from 'flowbite-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { getLogoText } from '../../../../../../function/common';
import NavCollapse from './NavCollapse';
import NavItems from './NavItems';
import SidebarContent, { MenuItem, SidebarContentBottom } from './Sidebaritems';
const LOGO_TEXT = getLogoText();

const SidebarLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();
  const profile = useSelector((state: RootState) => state.auth);
  const [sidebarBottom, setSidebarBottom] = useState<MenuItem[]>([]);
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const showMobileHeaderRef = useRef(showMobileHeader);
  const lastScrollTop = useRef(0);
  const scrollBoxRef = useRef<HTMLDivElement | null>(null);

  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [isOpen, setIsOpen] = useState(false);

  const viewHeaderMobilePaths = [
    '/rate-plan',
    '/guide/coupang',
    '/guide/ali',
    '/terms',
    '/policy',
    '/copyright',
    '/ai-policy',
  ];

  const isFirstLevel =
    [...SidebarContent, ...sidebarBottom]
      .flatMap((group) => group.children || [])
      .find((item) => item.url === pathname) || viewHeaderMobilePaths.includes(pathname);

  useEffect(() => {
    showMobileHeaderRef.current = showMobileHeader;
  }, [showMobileHeader]);

  useEffect(() => {
    if (!SidebarContentBottom.length) return;

    const updatedChildren = [
      ...(SidebarContentBottom[0].children || []).filter((child) => child.url !== '/profile'),
      {
        name: getUserName(profile?.user) || 'Login',
        icon: 'mingcute:user-4-fill',
        id: 'profile',
        url: '/profile',
        avatar: profile?.user?.avatar,
      },
    ];

    setSidebarBottom([
      {
        ...SidebarContentBottom[0],
        children: updatedChildren,
      },
    ]);
  }, [profile.user]);

  useEffect(() => {
    const container = scrollBoxRef.current;
    if (!container) return;

    let isListening = true;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;
      const scrollDelta = scrollTop - lastScrollTop.current;

      if (Math.abs(scrollDelta) < 20 || pathname === '/') return;

      // Scroll xuống
      if (scrollDelta > 0) {
        if (isAtBottom) {
          if (scrollTop > 10 && !showMobileHeaderRef.current) {
            setShowMobileHeader(true);
            showMobileHeaderRef.current = true;
          }
        } else if (scrollTop > 60 && showMobileHeaderRef.current) {
          setShowMobileHeader(false);
          showMobileHeaderRef.current = false;
        }
      } else {
        // Scroll lên
        if (!showMobileHeaderRef.current) {
          setShowMobileHeader(true);
          showMobileHeaderRef.current = true;
        }
        if (!isListening) {
          container.addEventListener('scroll', handleScroll);
          isListening = true;
        }
      }

      lastScrollTop.current = Math.max(scrollTop, 0);
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      if (isListening) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [pathname]);

  const renderSidebarContent = () => (
    <div className="font-pretendard w-full bg-white dark:bg-darkgray h-full">
      <Box className="flex justify-between sm:justify-center mb-[20px] sm:mb-0">
        <div
          onClick={() => {
            setIsOpen(false);
            router.push('/');
          }}
          className="px-[10px] pt-[10px] lg:pt-[25px] sm:pb-[10px] mr-[10px] text-[23px] md:text-[16px] lg:text-[30px] text-[#4776EF] font-bold cursor-pointer flex gap-[5px] items-center justify-center"
        >
          <Image
            src={'/images/logos/sidebar-logo.svg'}
            width={50}
            height={50}
            alt="logo"
            className="h-[28px] w-[28px] lg:h-[50px] lg:w-[50px]"
          />
          {LOGO_TEXT}
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 bg-white sm:hidden text-[#4776EF]">
          <CloseIcon fill="#4776EF" className="h-[25px] w-[25px]" />
        </button>
      </Box>
      <SimpleBar style={{ height: '100%', maxHeight: 'calc(100% - 85px)', paddingBottom: '12px' }}>
        <Sidebar.Items className="block sm:flex sm:flex-col sm:justify-between h-full">
          <Sidebar.ItemGroup>
            {SidebarContent.map((item, i) => (
              <React.Fragment key={`group-${i}`}>
                <Icon
                  icon="solar:menu-dots-bold"
                  className="text-ld block mx-auto mt-6 leading-6 dark:text-opacity-60 hide-icon"
                  height={23}
                />
                {item.children?.map((child) => (
                  <React.Fragment key={child.id}>
                    {child.children ? (
                      <div className="collpase-items">
                        <NavCollapse item={child} />
                      </div>
                    ) : (
                      <NavItems item={child} setIsOpen={setIsOpen} />
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </Sidebar.ItemGroup>

          <Sidebar.ItemGroup>
            {sidebarBottom.map((item, i) => (
              <React.Fragment key={`bottom-${i}`}>
                <h5 className="text-[#666C78] font-semibold text-sm caption">
                  <span className="hide-menu">{item.heading}</span>
                </h5>
                <Icon
                  icon="solar:menu-dots-bold"
                  className="text-ld block mx-auto mt-6 leading-6 dark:text-opacity-60 hide-icon"
                  height={23}
                />
                {item.children?.map((child) => (
                  <React.Fragment key={child.id}>
                    {child.children ? (
                      <div className="collpase-items">
                        <NavCollapse item={child} isBottom />
                      </div>
                    ) : (
                      <NavItems item={child} isBottom setIsOpen={setIsOpen} />
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </SimpleBar>
    </div>
  );

  return (
    <>
      {isXs &&
        (isFirstLevel ? (
          <Box
            className="flex fixed items-center justify-between w-screen pl-[20px] pr-[10px] py-[10px] bg-[#fff] z-[99]"
            sx={{
              top: showMobileHeader ? 0 : '-80px',
              transition: 'top 0.3s ease-in-out',
              willChange: 'top',
            }}
          >
            <div
              onClick={() => {
                setIsOpen(false);
                router.push('/');
              }}
              className="text-[23px] sm:text-[30px] text-[#4776EF] font-bold cursor-pointer flex gap-[5px] items-center justify-center"
            >
              <Image src={'/images/logos/sidebar-logo.svg'} width={38} height={38} alt="logo" />
              {LOGO_TEXT}
              <div className="text-[#4776EF] text-[10px] font-bold bg-[#F5F8FF] rounded-[16px] leading-[12px] px-[5px] mb-[-4px]">
                Beta
              </div>
            </div>
            <button onClick={() => setIsOpen(true)} className="p-2 bg-white text-[#4776EF]">
              <Icon icon="mdi:menu" width={24} />
            </button>
          </Box>
        ) : (
          <IconButton
            sx={{ position: 'absolute', top: { xs: '10px' }, left: { xs: '13px' }, p: 0, zIndex: 99 }}
            onClick={() => router.push('/')}
          >
            <Icon icon="ion:chevron-back" color="#090909" width={26} height={26} />
          </IconButton>
        ))}

      {isXs && (
        <Drawer open={isOpen} onClose={() => setIsOpen(false)} anchor="left">
          <Box className="h-full w-screen">
            <Sidebar className="menu-sidebar h-full w-full bg-white dark:bg-darkgray">{renderSidebarContent()}</Sidebar>
          </Box>
        </Drawer>
      )}

      {isSm && (
        <div className="font-pretendard">
          <Sidebar
            className="fixed w-[148px] menu-sidebar bg-white dark:bg-darkgray z-[10] overflow-hidden h-full"
            aria-label="Sidebar for small screens"
          >
            {renderSidebarContent()}
          </Sidebar>
        </div>
      )}

      {isMdUp && (
        <div className="font-pretendard">
          <Sidebar
            className="absolute top-0 left-0 w-60 menu-sidebar bg-white dark:bg-darkgray z-[10] overflow-hidden h-full"
            aria-label="Sidebar for medium and larger screens"
          >
            {renderSidebarContent()}
          </Sidebar>
        </div>
      )}

      <Box
        ref={scrollBoxRef}
        className="scroll-container"
        sx={{
          mt: { xs: showMobileHeader && isFirstLevel ? '50px' : 0, sm: 0 },
          height: { xs: showMobileHeader && isFirstLevel ? 'calc(100dvh - 50px)' : '100dvh', sm: '100dvh' },
          overflow: 'scroll',
        }}
      >
        <Box sx={{ mt: { xs: isFirstLevel ? '-50px' : 0, sm: 0 } }}>{children}</Box>
      </Box>
    </>
  );
};

export default SidebarLayout;
