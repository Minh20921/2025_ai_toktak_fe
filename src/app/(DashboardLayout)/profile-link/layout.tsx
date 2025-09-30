import type React from 'react';
import { Providers } from '@/app/(DashboardLayout)/profile-link/layout/providers';
import './layout/profile.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Providers>{children}</Providers>;
}
