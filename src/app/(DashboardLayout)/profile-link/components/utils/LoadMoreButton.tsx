'use client';

import { TREE_CONFIG } from '@/app/(DashboardLayout)/profile-link/components/const';
import { Button } from '@mui/material';

interface LoadMoreButtonProps {
  id: string;
  depth: number;
  loading?: boolean;
  onLoadMore: (groupId: string) => void;
}

export function LoadMoreButton({ id, depth, loading, onLoadMore }: LoadMoreButtonProps) {
  const paddingLeft = depth * TREE_CONFIG.INDENT_SIZE;
  const groupId = id.replace('load-more-', '');

  return (
    <div style={{ marginLeft: `${paddingLeft}px` }} className="py-2">
      <Button variant="outlined" size="small" className="w-full" onClick={() => onLoadMore(groupId)} disabled={loading}>
        더 보기
      </Button>
    </div>
  );
}
