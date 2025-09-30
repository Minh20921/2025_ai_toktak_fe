'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { TREE_CONFIG } from '@/app/(DashboardLayout)/profile-link/components/const';

interface ScrollTriggerProps {
  groupId: string;
  depth: number;
  onLoadMore?: (groupId: string) => void;
}

export function ScrollTrigger({ groupId, depth, onLoadMore }: ScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);
  const paddingLeft = depth * TREE_CONFIG.INDENT_SIZE;

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          onLoadMore && onLoadMore(groupId);

          // Reset trigger after a delay
          setTimeout(() => {
            hasTriggered.current = false;
          }, 1000);
        }
      },
      {
        root: null,
        rootMargin: '100px', // Trigger 100px before element comes into view
        threshold: 0.1,
      },
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [groupId, onLoadMore]);

  return (
    <Box
      ref={triggerRef}
      sx={{
        marginLeft: `${paddingLeft}px`,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.3,
        fontSize: '12px',
        color: 'text.secondary',
      }}
    >
      {/* Optional: Show a subtle indicator */}⋯
    </Box>
  );
}
