'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Typography, Avatar, Chip, CircularProgress } from '@mui/material';
import { Icon } from '@iconify/react';
import { DragHandlers, FlatItem } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { TREE_CONFIG } from '@/app/(DashboardLayout)/profile-link/components/const';
import { EditIcon, TrashIcon } from '@/utils/icons/profileLink';
import { formatCount } from './formatCount';

interface SortableTreeItemProps {
  id: string;
  depth: number;
  indentationWidth: number;
  indicator?: boolean;
  collapsed?: boolean;
  onCollapse?: () => void;
  onRemove?: () => void;
  clone?: boolean;
  childCount?: number;
  value: string;
  item: FlatItem;
  handlers: DragHandlers;
  isDraggingOver: boolean;
  isInvalidDrop?: boolean;
}

export function SortableTreeItem({
  id,
  depth,
  indentationWidth,
  indicator,
  collapsed,
  onCollapse,
  onRemove,
  clone,
  childCount,
  value,
  item,
  handlers,
  isDraggingOver,
  isInvalidDrop,
}: SortableTreeItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type: 'tree-item',
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const paddingLeft = depth * indentationWidth;

  // Handle product items
  if (item.type === 'product') {
    return (
      <Box
        ref={setNodeRef}
        style={style}
        sx={{
          marginLeft: `${paddingLeft}px`,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          backgroundColor: isInvalidDrop ? '#D6E2FF' : 'white',
          borderRadius: 2,
          boxShadow: isInvalidDrop ? '0px 8.87px 66.51px 0px #D6E2FF' : '0px 8.87px 66.51px 0px #0000000D',
          transform: isDragging ? 'scale(1.02) rotate(1deg)' : 'none',
          transition: 'all 0.2s ease',
          opacity: clone ? 0.5 : 1,
          border: isInvalidDrop ? '2px dashed #D6E2FF' : 'none',
          touchAction: isDragging ? 'none' : 'auto',
          userSelect: isDragging ? 'none' : 'auto',
          WebkitUserSelect: isDragging ? 'none' : 'auto',
          MozUserSelect: isDragging ? 'none' : 'auto',
          msUserSelect: isDragging ? 'none' : 'auto',
          WebkitTouchCallout: isDragging ? 'none' : 'auto',
          WebkitTapHighlightColor: isDragging ? 'transparent' : 'auto',
          position: 'relative',
          pointerEvents: isDragging ? 'none' : 'auto',
          '&:hover': {
            boxShadow: isInvalidDrop ? '0px 8.87px 66.51px 0px #D6E2FF' : 1,
          },
        }}
      >
        {/* Drag Handle */}
        <Box
          {...attributes}
          {...listeners}
          sx={{
            cursor: 'grab',
            color: 'text.secondary',
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '100%',
            minHeight: '48px',
            pointerEvents: 'auto',
            position: 'relative',
            '-webkit-touch-callout': 'none',
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none',
            '&:active': {
              cursor: 'grabbing',
              touchAction: 'none',
            },
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Icon icon="material-symbols:drag-indicator" width={20} height={20} />
        </Box>

        {/* Product Image */}
        <Avatar
          src={item.product?.product_image || '/placeholder.svg'}
          alt={item.product?.product_name}
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        />

        {/* Product Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap color="#686868" fontSize={14} fontWeight={500}>
            {item.name || 'Loading...'}
          </Typography>
          {item.product?.price && (
            <Typography variant="body2" color="#686868" fontSize={14} fontWeight={600}>
              {item.product.price}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {
            <Typography component="span" color="#4776EF" fontSize={14} fontWeight={700}>
              {formatCount(item?.product?.counts)}
            </Typography>
          }
          <IconButton
            size="small"
            onClick={() => handlers.onEdit && handlers.onEdit(item.id)}
            sx={{ color: '#6A6A6A' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handlers.onDelete && handlers.onDelete(item.id)}
            sx={{ color: '#6A6A6A' }}
          >
            <TrashIcon />
          </IconButton>
        </Box>
      </Box>
    );
  }

  // Handle group items
  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        marginLeft: `${paddingLeft}px`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        backgroundColor: isInvalidDrop ? 'error.light' : 'white',
        borderRadius: 2,
        boxShadow: isInvalidDrop ? '0px 8.87px 66.51px 0px #D6E2FF' : '0px 8.87px 66.51px 0px #0000000D',
        transform: isDragging ? 'scale(1.02) rotate(1deg)' : 'none',
        transition: 'all 0.2s ease',
        opacity: clone ? 0.5 : 1,
        touchAction: isDragging ? 'none' : 'auto',
        userSelect: isDragging ? 'none' : 'auto',
        WebkitUserSelect: isDragging ? 'none' : 'auto',
        MozUserSelect: isDragging ? 'none' : 'auto',
        msUserSelect: isDragging ? 'none' : 'auto',
        WebkitTouchCallout: isDragging ? 'none' : 'auto',
        WebkitTapHighlightColor: isDragging ? 'transparent' : 'auto',
        position: 'relative',
        pointerEvents: isDragging ? 'none' : 'auto',
        '&:hover': {
          boxShadow: isInvalidDrop ? '0px 8.87px 66.51px 0px #D6E2FF' : 1,
        },
      }}
    >
      {/* Drag Handle */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'grab',
          color: 'text.secondary',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '100%',
          minHeight: '48px',
          pointerEvents: 'auto',
          position: 'relative',
          '-webkit-touch-callout': 'none',
          '-webkit-user-select': 'none',
          '-khtml-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none',
          '&:active': {
            cursor: 'grabbing',
            touchAction: 'none',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Icon icon="material-symbols:drag-indicator" width={20} height={20} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Group Title */}
        <Box sx={{ minWidth: 0 }} display="flex" alignItems="center" gap={1}>
          <Typography component="span" color="#272727" fontSize={14} fontWeight={600}>
            {item.name}
          </Typography>
          {item.itemCount !== undefined && (
            <Typography component="span" color="#272727" fontSize={14} fontWeight={600}>
              ({item.itemCount})
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton
            size="small"
            onClick={() => handlers.onEdit && handlers.onEdit(item.id)}
            sx={{ color: '#6A6A6A' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handlers.onDelete && handlers.onDelete(item.id)}
            sx={{ color: '#6A6A6A' }}
          >
            <TrashIcon />
          </IconButton>
        </Box>

        {/* Child Count Badge */}
        {childCount && childCount > 0 && (
          <Chip
            label={childCount}
            size="small"
            sx={{
              backgroundColor: 'primary.light',
              color: 'primary.main',
              fontWeight: 600,
            }}
          />
        )}
      </Box>
      {/* Collapse Button */}
      {onCollapse && (
        <IconButton size="small" onClick={onCollapse} sx={{ color: 'text.secondary' }}>
          <Icon icon={collapsed ? 'material-symbols:expand-more' : 'material-symbols:expand-less'} />
        </IconButton>
      )}
    </Box>
  );
}
