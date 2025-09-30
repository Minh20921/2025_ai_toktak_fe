'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Box, IconButton, Typography, Chip, CircularProgress } from '@mui/material';
import { DragHandlers, FlatItem } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { TREE_CONFIG } from '@/app/(DashboardLayout)/profile-link/components/const';
import { EditIcon, IconEdit, TrashIcon } from '@/utils/icons/profileLink';
import { IconDragDrop, IconTrash } from '@tabler/icons-react';
import { MoreIcon } from '@/utils/icons/icons';
import { Icon } from '@iconify/react';

interface GroupItemProps {
  item: FlatItem;
  index: number;
  isDraggingOver: boolean;
  handlers: DragHandlers;
}

export function GroupItem({ item, index, isDraggingOver, handlers }: GroupItemProps) {
  const paddingLeft = item.depth * TREE_CONFIG.INDENT_SIZE;
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            marginLeft: `${paddingLeft}px`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0px 8.87px 66.51px 0px #0000000D',

            transform: snapshot.isDragging ? 'scale(1.02) rotate(1deg)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: 1,
            },
          }}
        >
          {/* Drag Handle */}
          <IconButton
            {...provided.dragHandleProps}
            size="small"
            sx={{
              cursor: 'grab',
              '&:active': { cursor: 'grabbing' },
              color: 'text.secondary',
            }}
          >
            <Icon icon="material-symbols:drag-indicator" />
          </IconButton>

          {/* Group Title */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {item.name} {!!item.itemCount && `(${item.itemCount})`}
              </Typography>
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
              {item.loading && <CircularProgress size={16} />}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {item.hasChildren && (
              <IconButton
                size="small"
                onClick={() => handlers.onToggle && handlers.onToggle(item.id)}
                sx={{
                  color: '#6A6A6A',
                  transform: item.isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.2s ease-in-out',
                }}
              >
                <Icon icon="ep:arrow-down-bold" />
              </IconButton>
            )}
          </Box>
        </Box>
      )}
    </Draggable>
  );
}
