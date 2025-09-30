import React from 'react';
import EmptyState from '@/app/(DashboardLayout)/history/components/empty';

const PrivatePost: React.FC = () => {
  return <EmptyState label="서비스 준비 중입니다." showButton={false} />;
};
export default PrivatePost;
