'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
  Modifier,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

// Import hook tích hợp
import { useDragAndDropWithRedux } from '@/app/(DashboardLayout)/profile-link/components/hooks/useDragAndDropWithRedux';
import { SortableTreeItem } from '@/app/(DashboardLayout)/profile-link/components/utils/SortableTreeItem';
import { TreeNode } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { RootState } from '@/app/lib/store/store';

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
};

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};

export default function ProductManagerExample() {
  const dispatch = useDispatch();
  const { treeNodes } = useSelector((state: RootState) => state.profile);

  // Sử dụng hook tích hợp useDragAndDropWithRedux
  const {
    activeId,
    overId,
    projected,
    items: flattenedItems,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    isInvalidDrop,
    // Thêm các tính năng từ Redux
    dragState,
    productChanges,
    formattedProductsForAPI,
    formattedGroupsForAPI,
  } = useDragAndDropWithRedux({
    treeNodes,
    onTreeChange: (newTree) => {
      // Cập nhật tree trong Redux
      dispatch({ type: 'profile/updateTreeState', payload: newTree });
    },
    onCollapseAllGroups: (tree) => {
      // Logic collapse all groups
      return tree;
    },
    onSaveCollapsedState: (tree) => {
      // Lưu trạng thái collapsed
      const collapsedState: Record<string, boolean> = {};
      const extractCollapsedState = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.type === 'group') {
            collapsedState[node.id] = !node.isOpen;
            if (node.children) {
              extractCollapsedState(node.children);
            }
          }
        });
      };
      extractCollapsedState(tree);
      return collapsedState;
    },
    onUpdateCollapsedStates: (state) => {
      // Cập nhật trạng thái collapsed
      dispatch({ type: 'profile/updateCollapsedStates', payload: state });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);
  const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;

  // Handlers cho các actions
  const handlers = {
    onToggle: (id: string) => {
    },
    onEdit: (id: string) => {
    },
    onDelete: (id: string) => {
    },
    onLoadMore: (groupId: string) => {
    },
  };

  // Hàm xử lý save
  const handleSave = async () => {
    try {

      // Gọi API với data đã được format
      // await productAPI.updateProductsMulti(formattedProductsForAPI);
      // await productAPI.updateGroup(formattedGroupsForAPI);

      // Commit changes trong Redux
      dispatch(commitProductChanges());

    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Hàm xử lý cancel
  const handleCancel = () => {
    dispatch(clearProductChanges());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Product Manager Example
      </Typography>

      {/* Hiển thị trạng thái drag */}
      {dragState.isDragging && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2">
            Dragging: {activeId} → {overId}
          </Typography>
        </Box>
      )}

      {/* Hiển thị thay đổi pending */}
      {productChanges.pendingChanges && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
          <Typography variant="body2">
            Pending changes: {productChanges.movedProducts.length} products moved,{' '}
            {productChanges.reorderedGroups.length} groups reordered
          </Typography>
        </Box>
      )}

      {/* Buttons */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSave} disabled={!productChanges.pendingChanges}>
          Save Changes
        </Button>
        <Button variant="outlined" onClick={handleCancel} disabled={!productChanges.pendingChanges}>
          Cancel Changes
        </Button>
      </Box>

      {/* Drag and Drop Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
          <Box sx={{ minHeight: 400, border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {flattenedItems.map((item) => {
                const depth = item.id === activeId && projected ? projected.depth : item.depth;

                return (
                  <SortableTreeItem
                    key={item.id}
                    id={item.id}
                    depth={depth}
                    indentationWidth={20}
                    indicator={true}
                    collapsed={item.isCollapsed}
                    onCollapse={
                      item.type === 'group' && item.hasChildren ? () => handlers.onToggle(item.id) : undefined
                    }
                    value={item.id}
                    item={item}
                    handlers={handlers}
                    isDraggingOver={overId === item.id}
                    isInvalidDrop={isInvalidDrop(item)}
                  />
                );
              })}
            </Box>
          </Box>
        </SortableContext>

        {/* Drag Overlay */}
        {activeId &&
          activeItem &&
          createPortal(
            <DragOverlay dropAnimation={dropAnimation} modifiers={[adjustTranslate]}>
              <SortableTreeItem
                id={activeId}
                depth={activeItem.depth}
                clone
                value={activeId}
                item={activeItem}
                handlers={handlers}
                isDraggingOver={false}
                indentationWidth={20}
              />
            </DragOverlay>,
            document.body,
          )}
      </DndContext>

      {/* Debug Info */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Debug Info
        </Typography>
        <Typography variant="body2">Active ID: {activeId || 'None'}</Typography>
        <Typography variant="body2">Over ID: {overId || 'None'}</Typography>
        <Typography variant="body2">Items count: {flattenedItems.length}</Typography>
        <Typography variant="body2">Tree nodes count: {treeNodes.length}</Typography>
      </Box>
    </Box>
  );
}
