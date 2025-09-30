'use client';
import ProviderPlatform from '@/app/(DashboardLayout)/profile/ProviderPlatform';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store/store';
import TopToast from './layout/header/TopToast';
import Sidebar from './layout/vertical/sidebar/Sidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const [isNewUser, setIsNewUser] = React.useState(['NEW_USER', 'FREE'].includes(profile?.user?.subscription || ''));

  React.useEffect(() => {
    if (pathname === '/') {
      setIsNewUser(['NEW_USER', 'FREE'].includes(profile?.user?.subscription || ''));
    } else {
      setIsNewUser(false);
    }
  }, [profile?.user?.subscription, pathname]);
  return (
    <ProviderPlatform>
      {isNewUser && (
        <TopToast
          onClose={() => setIsNewUser(false)}
          message="지금 결제하면 첫 달 0원! 요금제 업그레이드하고 바로 수익화를 시작하세요."
        />
      )}
      <div
        className={`flex w-full transition-all duration-500`}
        style={{
          position: isNewUser ? 'relative' : 'static',
          height: isNewUser ? 'calc(100dvh - 48px)' : '100dvh',
          overflow: 'hidden',
          marginTop: isNewUser ? '48px' : '0',
        }}
      >
        <div className={`page-wrapper flex w-full `}>
          {/* Header/sidebar */}
          <Sidebar>
            <div className="body-wrapper">
              {/* <Header/> */}
              {/* Body Content  */}
              <div className={`mx-auto ${isNewUser ? 'pb-[48px]' : ''}`}>{children}</div>
            </div>
          </Sidebar>
        </div>
      </div>
    </ProviderPlatform>
  );
}
