import { Draggable } from '@hello-pangea/dnd';
import { Box, Typography } from '@mui/material';
import { TREE_CONFIG } from '@/app/(DashboardLayout)/profile-link/components/const';

interface DropIndicatorProps {
  id: string;
  index: number;
  depth: number;
  parentId: string | null;
  isDraggingOver: boolean;
  isGroupEnd?: boolean;
  isLevelEnd?: boolean;
  isDragging: boolean; // New prop to know if any item is being dragged
}

export function DropIndicator({
  id,
  index,
  depth,
  parentId,
  isDraggingOver,
  isGroupEnd,
  isLevelEnd,
  isDragging,
}: DropIndicatorProps) {
  const paddingLeft = depth * TREE_CONFIG.INDENT_SIZE;

  // Only show when dragging and this specific indicator is being hovered
  if (!isDragging || !isDraggingOver) {
    return (
      <Draggable draggableId={id} index={index} isDragDisabled={true}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            sx={{
              marginLeft: `${paddingLeft}px`,
              height: 0,
              overflow: 'hidden',
            }}
          />
        )}
      </Draggable>
    );
  }

  // Determine what type of drop this represents
  const getDropMessage = () => {
    if (id.startsWith('drop-indicator-before-')) {
      return parentId ? 'Drop before item (in group)' : 'Drop before item';
    }

    if (id.startsWith('drop-indicator-after-')) {
      return parentId ? 'Drop into this group' : 'Drop after this group';
    }

    if (id === 'drop-indicator-end' || id.startsWith('drop-indicator-end-')) {
      return parentId ? 'Drop at end of group' : 'Drop at end of list';
    }

    return 'Drop here';
  };

  // Get appropriate styling based on drop type
  const getIndicatorStyle = () => {
    if (isGroupEnd && parentId) {
      // Inside group indicator
      return {
        backgroundColor: 'success.light',
        borderColor: 'success.main',
        color: 'success.main',
      };
    }

    if (isLevelEnd) {
      // End of level indicator
      return {
        backgroundColor: 'info.light',
        borderColor: 'info.main',
        color: 'info.main',
      };
    }

    // Regular before/after indicator
    return {
      backgroundColor: parentId ? 'secondary.light' : 'primary.light',
      borderColor: parentId ? 'secondary.main' : 'primary.main',
      color: parentId ? 'secondary.main' : 'primary.main',
    };
  };

  const style = getIndicatorStyle();

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={true}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            marginLeft: `${paddingLeft}px`,
            height: 48,
            borderRadius: 2,
            border: '2px dashed',
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            my: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${style.backgroundColor}, transparent)`,
              animation: 'shimmer 2s infinite',
              '@keyframes shimmer': {
                '0%': { left: '-100%' },
                '100%': { left: '100%' },
              },
            }}
          />

          {/* Drop message with icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 3,
              py: 1,
              backgroundColor: 'background.paper',
              borderRadius: 1,
              boxShadow: 2,
              border: '1px solid',
              borderColor: style.borderColor,
              zIndex: 1,
            }}
          >
            {/* Visual indicator dot */}
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: style.color,
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.7, transform: 'scale(1.2)' },
                },
              }}
            />

            {/* Drop message */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: style.color,
                whiteSpace: 'nowrap',
              }}
            >
              {getDropMessage()}
            </Typography>

            {/* Position indicator */}
            {parentId && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '10px',
                  fontStyle: 'italic',
                }}
              >
                (in group)
              </Typography>
            )}

            {/* Arrow indicator */}
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${style.color}`,
                animation: 'bounce 1s infinite',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-4px)' },
                },
              }}
            />
          </Box>
        </Box>
      )}
    </Draggable>
  );
}
