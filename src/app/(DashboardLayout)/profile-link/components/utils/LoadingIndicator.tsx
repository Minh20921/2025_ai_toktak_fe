import { TREE_CONFIG } from '@/app/(DashboardLayout)/profile-link/components/const';
import { Spinner } from 'flowbite-react';

interface LoadingIndicatorProps {
  depth: number;
}

export function LoadingIndicator({ depth }: LoadingIndicatorProps) {
  const paddingLeft = depth * TREE_CONFIG.INDENT_SIZE;

  return (
    <div style={{ marginLeft: `${paddingLeft}px` }} className="py-4 flex items-center justify-center">
      <Spinner className="h-5 w-5 mr-2" />
      <span className="text-sm text-gray-500">로딩 중...</span>
    </div>
  );
}
