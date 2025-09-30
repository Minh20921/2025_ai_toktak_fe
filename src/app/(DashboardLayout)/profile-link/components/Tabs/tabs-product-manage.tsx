'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { IconAdd, IconChecked, IconNonCheck } from '@/utils/icons/profileLink';
import LayoutSelector from '@/app/(DashboardLayout)/profile-link/components/utils/LayoutSelector';
import ProductAddForm from '@/app/(DashboardLayout)/profile-link/components/utils/ProductAddForm';
import GroupAddForm from '@/app/(DashboardLayout)/profile-link/components/utils/GroupAddForm';
import { useProductTree } from '@/app/(DashboardLayout)/profile-link/components/hooks/useProductTree';
import { useDragAndDropWithRedux } from '@/app/(DashboardLayout)/profile-link/components/hooks/useDragAndDropWithRedux';
import { collapseAllGroups, saveCollapsedState } from '@/app/(DashboardLayout)/profile-link/components/utils/treeUtils';
import { LayoutOption } from '@/app/(DashboardLayout)/profile-link/components/const';
import { toast } from '@/app/components/common/Toast';
import ProductEditDialog from '@/app/(DashboardLayout)/profile-link/components/utils/ProductEditDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setFieldName, updateNodeTitleAndLayout, updateProduct } from '@/app/lib/store/profileSlice';
import { Product, TreeNode, FlatItem } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import GroupEditDialog from '@/app/(DashboardLayout)/profile-link/components/utils/GroupEditDialog';
import { profileAPI } from '@/app/(DashboardLayout)/profile-link/api/profile';
import { RootState } from '@/app/lib/store/store';
import { TooltipIcon } from '@/utils/icons/advanced';

// DND Kit imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
  DropAnimation,
  defaultDropAnimation,
  Modifier,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

// Import dnd-kit utilities
import { flattenTreeForDndKit } from '@/app/(DashboardLayout)/profile-link/components/utils/dndKitUtils';
import { SortableTreeItem } from '@/app/(DashboardLayout)/profile-link/components/utils/SortableTreeItem';
import { showNotice } from '@/utils/custom/notice';
import { useSocket } from '@/app/hooks/useSocket';

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
};

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};
function useDeepCompareEffect(callback: () => void, deps: any[]) {
  const prevDepsRef = useRef<any[]>();

  if (!prevDepsRef.current || JSON.stringify(prevDepsRef.current) !== JSON.stringify(deps)) {
    prevDepsRef.current = deps;
  }

  useEffect(callback, [prevDepsRef.current]);
}

export function removeChildrenOf(items: FlatItem[], ids: string[], activeItemType?: 'group' | 'product') {
  const excludeParentIds = [...ids];

  // Nếu đang kéo group
  if (activeItemType === 'group') {
    // Tìm ID của group đang được kéo
    const activeGroupId = ids.find((id) => {
      const activeItem = items.find((item) => item.id === id);
      return activeItem?.type === 'group';
    });

    return items.filter((item) => {
      if (item.parentId && excludeParentIds.includes(item.parentId)) {
        // KHÔNG loại bỏ children của group đang được kéo
        if (activeGroupId && item.parentId === activeGroupId) {
          return true; // Giữ lại children của group đang kéo
        }
        return false; // Loại bỏ children của các group khác bị collapse
      }
      return true;
    });
  }

  // Nếu đang kéo product hoặc không có activeItemType
  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      return false; // Loại bỏ tất cả children
    }
    return true;
  });
}

// Client-side only wrapper component
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

export default function ProductManager() {
  const dispatch = useDispatch();
  const [addOpen, setAddOpen] = useState(false);
  const [openGroupForm, setOpenGroupForm] = useState(false);
  const profile = useSelector((state: RootState) => state.profile);

  const {
    treeNodes,
    loading,
    handleToggle,
    handleLoadMore,
    handleDelete,
    handleEdit,
    handleAddGroup,
    handleMoveNode,
    initializeData,
    setTreeNodes,
    updateNodeCollapsedStates,
  } = useProductTree();

  // Sử dụng useDragAndDropWithRedux - hook tích hợp sẵn với Redux
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
    onTreeChange: setTreeNodes,
    onCollapseAllGroups: collapseAllGroups,
    onSaveCollapsedState: saveCollapsedState,
    onUpdateCollapsedStates: updateNodeCollapsedStates,
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingGroup, setEditingGroup] = useState<TreeNode | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Listen for socket events
  const [flattenedItemData, setFlattenedItemData] = useState<any>([]);
  const socket = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL!);
  useDeepCompareEffect(() => {
    if (flattenedItems.length) {
      setFlattenedItemData(flattenedItems);
    }
  }, [flattenedItems]);

  useEffect(() => {
    if (!socket) return;

    socket.on("product_count_updated", (data: any) => {
      setFlattenedItemData((prev: any[]) =>
        prev.map((item: any) =>
          item.type === "product" && item.product?.id === data.product_id
            ? { ...item, product: { ...item.product, counts: data.count } }
            : item
        )
      );
    });

    return () => {
      socket.off("product_count_updated");
    };
  }, [socket]);

  // Check if component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px minimum distance before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 2000, // 2000ms (2s) delay before activation for mobile
        tolerance: 5, // 5px tolerance for touch movement
      },
    }),
    useSensor(KeyboardSensor, {
      // Add keyboard support for accessibility
      coordinateGetter: (event, args) => {
        return {
          x: 0,
          y: 0,
        };
      },
    }),
  );

  // Custom activation constraint for mobile
  const customActivationConstraint = {
    delay: 2000,
    tolerance: 5,
    distance: 8,
  };

  // Add scroll prevention effect
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (activeId) {
        e.preventDefault();
      }
    };

    // Add event listeners for touch events
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', preventScroll, { passive: false });

    // Add CSS to prevent scroll when dragging
    if (activeId) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.userSelect = 'none';
      document.body.style.setProperty('-webkit-user-select', 'none');
      document.body.style.setProperty('-moz-user-select', 'none');
      document.body.style.setProperty('-ms-user-select', 'none');
      // Prevent scrolling on html element as well
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.touchAction = 'none';

      // Add global CSS class to prevent scroll
      document.body.classList.add('dragging-active');
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
      document.body.style.setProperty('-webkit-user-select', '');
      document.body.style.setProperty('-moz-user-select', '');
      document.body.style.setProperty('-ms-user-select', '');
      document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';

      // Remove global CSS class
      document.body.classList.remove('dragging-active');
    }

    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('touchstart', preventScroll);
      // Reset body styles
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
      document.body.style.setProperty('-webkit-user-select', '');
      document.body.style.setProperty('-moz-user-select', '');
      document.body.style.setProperty('-ms-user-select', '');
      document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';
      // Remove global CSS class
      document.body.classList.remove('dragging-active');
    };
  }, [activeId]);

  const handlers = {
    onToggle: handleToggle,
    onEdit: (id: string) => {
      // Only pass activeId if it's a group
      const activeGroupId =
        activeId && flattenedItems.find((item) => item.id === activeId)?.type === 'group' ? activeId : undefined;
      const flat = flattenTreeForDndKit(treeNodes, null, 0, activeGroupId);
      const found = flat.find((node) => node.id === id);
      if (found?.type === 'product' && found.product) {
        setEditingProduct(found.product);
      } else if (found?.type === 'group') {
        setEditingGroup(treeNodes.find((node) => node.id === id)!);
      }
    },
    onDelete: handleDelete,
    onLoadMore: handleLoadMore,
  };

  // Debug touch sensor activation
  useEffect(() => {
    const handleDragStart = (event: any) => {
      console.log('Drag started after delay:', event);
    };

    // Listen for drag start events
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);

  const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;

  const handleCollapse = (id: string) => {
    handleToggle(id);
  };
  return (
    <ClientOnly>
      <Box sx={{ px: { xs: 2, md: 5 }, pt: 4, pb: { xs: 12, md: 5 } }}>
        <Typography fontWeight={600} mb={1}>
          레이아웃
        </Typography>
        <LayoutSelector />

        {/* Price Toggle */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mt={2}>
          <Typography fontWeight={600}>상품 관리</Typography>
          <Box component="div" sx={{ display: 'flex', alignItems: 'center', mb: 0, mt: '21px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<IconNonCheck />}
                  checkedIcon={<IconChecked />}
                  checked={!!profile.site_setting.show_price}
                  onChange={(_event, checked) => {
                    if (checked) {
                      showNotice(
                        '자동으로 불러온 가격은 </br> 실제 가격과 다를 수 있어요!',
                        '🚨 꼭 확인하고 수정해주세요',
                        true,
                        '확인',
                        '취소',
                        () => {
                          dispatch(setFieldName({ field: 'site_setting.show_price', value: 1 }));
                        },
                      );
                    } else {
                      dispatch(setFieldName({ field: 'site_setting.show_price', value: 0 }));
                    }
                  }}
                  sx={{
                    color: '#E7E7E7',
                    '&.Mui-checked': {
                      color: '#4776EF',
                    },
                  }}
                />
              }
              sx={{ mr: 0 }}
              label={
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '13px',
                    lineHeight: '16px',
                    fontWeight: 'normal',
                  }}
                  color="#686868"
                >
                  자동으로 가격 불러오기
                </Typography>
              }
            />
            <Tooltip
              title={
                <Typography
                  sx={{
                    fontSize: '12px',
                    whiteSpace: 'pre-line',
                    textAlign: 'center',
                    fontWeight: 600,
                    lineHeight: '15px',
                  }}
                >
                  상품 가격 자동 불러오기 여부를 선택하세요.
                  <br />
                  알리 상품은 자동 불러오기 불가하며,
                  <br />
                  가격 변동 시 수동 수정이 필요합니다.
                </Typography>
              }
              placement="bottom"
              arrow
              PopperProps={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [-40, 8],
                    },
                  },
                ],
              }}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#FFFFFF',
                    color: '#4776EF',
                    border: '1px solid #4776EF',
                    borderRadius: '999px',
                    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                    padding: '10px 42px',
                    mt: '0px !important',
                  },
                },
                arrow: {
                  sx: {
                    color: '#FFFFFF',
                    '&::before': {
                      border: '1px solid #4776EF',
                    },
                  },
                },
              }}
              open={tooltipOpen}
              disableHoverListener={isMobile}
              disableFocusListener={isMobile}
              disableTouchListener={isMobile}
            >
              <IconButton
                sx={{ p: 1, pb: '10px' }}
                onClick={() => {
                  if (isMobile) setTooltipOpen((prev) => !prev);
                }}
                onMouseEnter={() => {
                  if (!isMobile) setTooltipOpen(true);
                }}
                onMouseLeave={() => {
                  if (!isMobile) setTooltipOpen(false);
                }}
              >
                <TooltipIcon className="w-4 h-4" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        {/* Buttons */}
        <Stack direction="row" spacing={2} my={2}>
          <Button
            variant="outlined"
            startIcon={<Icon icon="ic:round-plus" />}
            onClick={() => setAddOpen(true)}
            sx={{
              width: '60%',
              border: '2px solid #E7E7E7',
              borderRadius: '8px',
            }}
          >
            상품 추가하기
          </Button>
          <Button
            variant="outlined"
            startIcon={<Icon icon="material-symbols:home-storage-outline-rounded" />}
            onClick={() => setOpenGroupForm(true)}
            sx={{
              width: '40%',
              border: '2px solid #E7E7E7',
              borderRadius: '8px',
            }}
          >
            그룹 추가
          </Button>
        </Stack>

        {editingProduct && (
          <ProductEditDialog
            open
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSubmit={(updated) => {
              dispatch(updateProduct({ id: updated.id, data: updated }));
            }}
          />
        )}
        {editingGroup && (
          <GroupEditDialog
            open
            groupId={editingGroup.id}
            initialTitle={editingGroup.title!}
            initialLayout={(editingGroup.titleType as LayoutOption) || 'left'}
            initialProducts={(editingGroup.children || [])
              .filter((n) => n.type === 'product' && n.product)
              .map((n) => n.product!)}
            onClose={() => setEditingGroup(null)}
          />
        )}

        {/* Product Groups */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          measuring={measuring}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          // Add modifiers to prevent scroll
          modifiers={[adjustTranslate]}
          // Add auto-scroll configuration
          autoScroll={{
            enabled: false, // Disable auto-scroll
          }}
        >
          <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
            <Box
              sx={{
                minHeight: 400,
                borderRadius: 2,
                p: 0,
                transition: 'all 0.2s ease',
                // Prevent touch scrolling while dragging
                touchAction: activeId ? 'none' : 'auto',
                // Prevent text selection during drag
                userSelect: activeId ? 'none' : 'auto',
                WebkitUserSelect: activeId ? 'none' : 'auto',
                MozUserSelect: activeId ? 'none' : 'auto',
                msUserSelect: activeId ? 'none' : 'auto',
                // Prevent scrolling on mobile only when dragging
                overflow: activeId ? 'hidden' : 'visible',
                // Add position relative for proper drag handling
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  // Prevent scroll when dragging
                  touchAction: activeId ? 'none' : 'auto',
                  // Add overflow hidden to prevent scroll only when dragging
                  overflow: activeId ? 'hidden' : 'visible',
                }}
              >
                {flattenedItemData.map((item: any) => {
                  const depth = item.id === activeId && projected ? projected.depth : item.depth;

                  return (
                    <SortableTreeItem
                      key={item.id}
                      id={item.id}
                      depth={depth}
                      indentationWidth={20}
                      indicator={true}
                      collapsed={item.isCollapsed}
                      onCollapse={item.type === 'group' && item.hasChildren ? () => handleCollapse(item.id) : undefined}
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

          {isMounted &&
            activeId &&
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

        <ProductAddForm open={addOpen} onClose={() => setAddOpen(false)} />
        <GroupAddForm open={openGroupForm} onClose={() => setOpenGroupForm(false)} />
      </Box>
    </ClientOnly>
  );
}
