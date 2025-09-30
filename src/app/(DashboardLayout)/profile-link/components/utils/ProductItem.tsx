'use client';

import { DragHandlers, FlatItem, Product } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { TREE_CONFIG } from '@/app/(DashboardLayout)/profile-link/components/const';
import { formatNumberKR } from '@/utils/format';
import { EditIcon, TrashIcon } from '@/utils/icons/profileLink';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@iconify/react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';

interface ProductItemProps {
  item: FlatItem;
  index: number;
  isDraggingOver: boolean;
  handlers: DragHandlers;
  showCheckIcon?: boolean;
  isChecked?: boolean;
  checked?: boolean;
  onChecked?: (product: Product) => void;
}

export function ProductItem({
  item,
  index,
  isDraggingOver,
  handlers,
  showCheckIcon = false,
  isChecked = false,
  checked = false,
  onChecked,
}: ProductItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: {
      type: 'product-item',
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const paddingLeft = item.depth * TREE_CONFIG.INDENT_SIZE;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        marginLeft: `${paddingLeft}px`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1.5,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: '0px 8.87px 66.51px 0px #0000000D',
        transform: isDragging ? 'scale(1.02) rotate(1deg)' : 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 1,
        },
      }}
    >
      {/* Drag Handle */}
      <IconButton
        {...attributes}
        {...listeners}
        size="small"
        sx={{
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
          color: 'text.secondary',
        }}
      >
        <Icon icon="material-symbols:drag-indicator" />
      </IconButton>

      {/* Product Image */}
      <Avatar
        src={item.product?.product_image || '/placeholder.svg'}
        alt={item.product?.product_name}
        variant="rounded"
        sx={{ width: 50, height: 50 }}
      />

      {/* Product Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" noWrap>
          {item.name || 'Loading...'}
        </Typography>
        {item.product?.price && (
          <Typography variant="body2" color="text.secondary">
            {formatNumberKR(item.product.price)}
          </Typography>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton size="small" onClick={() => handlers.onEdit && handlers.onEdit(item.id)} sx={{ color: '#6A6A6A' }}>
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => handlers.onDelete && handlers.onDelete(item.id)}
          sx={{ color: '#6A6A6A' }}
        >
          <TrashIcon />
        </IconButton>
        {onChecked && (
          <IconButton
            size="small"
            onClick={() => onChecked(item.product!)}
            sx={{ color: checked ? '#6F6F6F' : '#272727' }}
          >
            <Icon icon={checked ? 'mdi:check-circle' : 'carbon:add-filled'} width={20} height={20} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
