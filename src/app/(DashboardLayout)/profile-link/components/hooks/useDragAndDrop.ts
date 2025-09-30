import { useState, useRef, useMemo, useEffect } from 'react';
import { DragStartEvent, DragMoveEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { FlatItem, TreeNode } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import {
  flattenTreeForDndKit,
  buildTreeFromFlattened,
  getProjection,
  removeChildrenOf,
  isValidDropOperation,
  moveGroupWithChildrenToPosition,
  validateTreeStructure,
} from '@/app/(DashboardLayout)/profile-link/components/utils/dndKitUtils';

interface UseDragAndDropProps {
  treeNodes: TreeNode[];
  onTreeChange: (newTree: TreeNode[]) => void;
  onCollapseAllGroups?: (tree: TreeNode[]) => TreeNode[];
  onSaveCollapsedState?: (tree: TreeNode[]) => Record<string, boolean>;
  onUpdateCollapsedStates?: (state: Record<string, boolean>) => void;
}

export function useDragAndDrop({
  treeNodes,
  onTreeChange,
  onCollapseAllGroups,
  onSaveCollapsedState,
  onUpdateCollapsedStates,
}: UseDragAndDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [savedCollapsedState, setSavedCollapsedState] = useState<Record<string, boolean> | null>(null);
  const [originalTreeState, setOriginalTreeState] = useState<TreeNode[] | null>(null);
  const [activeItemType, setActiveItemType] = useState<'group' | 'product' | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [autoOpenedGroups, setAutoOpenedGroups] = useState<Set<string>>(new Set());
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  const [pendingOpenGroupId, setPendingOpenGroupId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moveSuccessful = useRef(false);
  const flattenedItems = flattenTreeForDndKit(treeNodes, null, 0, activeGroupId || undefined);
 
  const collapsedItems = flattenedItems.reduce<string[]>(
    (acc, { isCollapsed, id }) => (isCollapsed ? [...acc, id] : acc),
    [],
  );

  // Sử dụng flattenedItems cho tất cả các thao tác để đảm bảo tính nhất quán
  const items = flattenedItems;

  // Đảm bảo không có duplicate items trước khi sử dụng
  const uniqueItems = items.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

  if (uniqueItems.length !== items.length) {
    console.warn('Duplicate items found in useDragAndDrop, using unique items:', {
      originalCount: items.length,
      uniqueCount: uniqueItems.length,
    });
  }

  const projected = activeId && overId ? getProjection(uniqueItems, activeId, overId, offsetLeft, 20) : null;


  // Dọn dẹp timeout khi component unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }
    };
  }, []);

  // Hàm helper để kiểm tra xem một item có phải là con của group không
  const isChildOfGroup = (itemId: string, groupId: string): boolean => {
    const item = uniqueItems.find((item) => item.id === itemId);
    if (!item) return false;

    // Con trực tiếp
    if (item.parentId === groupId) return true;

    // Kiểm tra xem có phải là con lồng nhau không (đệ quy)
    if (item.parentId) {
      return isChildOfGroup(item.parentId, groupId);
    }

    return false;
  };

  // Hàm helper để kiểm tra xem chúng ta có đang hover qua group hoặc con của nó không
  const isHoveringOverGroupOrChildren = (overId: string | null, groupId: string): boolean => {
    if (!overId) return false;

    // Hover trực tiếp qua group
    if (overId === groupId) return true;

    // Hover qua con của group
    return isChildOfGroup(overId, groupId);
  };

  // Hàm để tự động mở/đóng groups
  const handleAutoGroupToggle = (overId: string | null) => {
    if (!overId || activeItemType !== 'product') {
      // Xóa hovered group nếu không hover qua group hoặc con của nó
      if (hoveredGroupId) {
        setHoveredGroupId(null);
        setPendingOpenGroupId(null);

        // Xóa open timeout
        if (openTimeoutRef.current) {
          clearTimeout(openTimeoutRef.current);
          openTimeoutRef.current = null;
        }

        // Đặt timeout để đóng group sau một khoảng thời gian ngắn
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
        closeTimeoutRef.current = setTimeout(() => {
          if (autoOpenedGroups.has(hoveredGroupId)) {
            const updatedTree = treeNodes.map((node) => {
              if (node.id === hoveredGroupId) {
                return { ...node, isOpen: false };
              }
              return node;
            });
            onTreeChange(updatedTree);
            setAutoOpenedGroups((prev) => {
              const newSet = new Set(Array.from(prev));
              newSet.delete(hoveredGroupId);
              return newSet;
            });
          }
        }, 10); // 10ms delay
      }
      return;
    }

    const overItem = uniqueItems.find((item) => item.id === overId);
    if (!overItem) return;

    // Kiểm tra xem có hover qua group không
    if (overItem.type === 'group') {
      const groupId = overItem.id;
      const isCurrentlyOpen = !overItem.isCollapsed;

      // Xóa các timeout trước đó
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      // Cập nhật hovered group
      setHoveredGroupId(groupId);

      // Nếu group đang đóng và chúng ta hover qua nó, đặt timeout để mở nó
      if (!isCurrentlyOpen) {
        // Xóa bất kỳ open timeout nào đang tồn tại
        if (openTimeoutRef.current) {
          clearTimeout(openTimeoutRef.current);
        }

        // Đặt pending open group
        setPendingOpenGroupId(groupId);

        // Đặt timeout để mở group sau 0.2 giây
        openTimeoutRef.current = setTimeout(() => {
          setAutoOpenedGroups((prev) => new Set(Array.from(prev).concat(groupId)));

          // Cập nhật tree để mở group
          const updatedTree = treeNodes.map((node) => {
            if (node.id === groupId) {
              return { ...node, isOpen: true };
            }
            return node;
          });
          onTreeChange(updatedTree);

          // Xóa pending open group
          setPendingOpenGroupId(null);
        }, 200); // 0.2 giây delay
      }
      return;
    }

    // Kiểm tra xem có hover qua product thuộc về group không
    if (overItem.type === 'product' && overItem.parentId) {
      const parentGroupId = overItem.parentId;

      // Tìm parent group
      const parentGroup = uniqueItems.find((item) => item.id === parentGroupId && item.type === 'group');
      if (parentGroup) {
        const isCurrentlyOpen = !parentGroup.isCollapsed;

        // Xóa các timeout trước đó
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }

        // Cập nhật hovered group thành parent group
        setHoveredGroupId(parentGroupId);

        // Nếu parent group đang đóng, đặt timeout để mở nó
        if (!isCurrentlyOpen) {
          // Xóa bất kỳ open timeout nào đang tồn tại
          if (openTimeoutRef.current) {
            clearTimeout(openTimeoutRef.current);
          }

          // Đặt pending open group
          setPendingOpenGroupId(parentGroupId);

          // Đặt timeout để mở parent group sau 2 giây
          openTimeoutRef.current = setTimeout(() => {
            setAutoOpenedGroups((prev) => new Set(Array.from(prev).concat(parentGroupId)));

            // Cập nhật tree để mở parent group
            const updatedTree = treeNodes.map((node) => {
              if (node.id === parentGroupId) {
                return { ...node, isOpen: true };
              }
              return node;
            });
            onTreeChange(updatedTree);

            // Xóa pending open group
            setPendingOpenGroupId(null);
          }, 2000); // 2 giây delay
        }
        return;
      }
    }

    // Kiểm tra xem chúng ta có đang hover qua con của group hiện tại đang hover không
    if (hoveredGroupId && isHoveringOverGroupOrChildren(overId, hoveredGroupId)) {
      // Xóa timeout để giữ group mở
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      return;
    }

    // Nếu hover qua product không thuộc về group nào, xóa hovered group
    if (overItem.type === 'product' && !overItem.parentId) {
      if (hoveredGroupId) {
        setHoveredGroupId(null);
        setPendingOpenGroupId(null);

        // Xóa open timeout
        if (openTimeoutRef.current) {
          clearTimeout(openTimeoutRef.current);
          openTimeoutRef.current = null;
        }

        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
        closeTimeoutRef.current = setTimeout(() => {
          if (autoOpenedGroups.has(hoveredGroupId)) {
            const updatedTree = treeNodes.map((node) => {
              if (node.id === hoveredGroupId) {
                return { ...node, isOpen: false };
              }
              return node;
            });
            onTreeChange(updatedTree);
            setAutoOpenedGroups((prev) => {
              const newSet = new Set(Array.from(prev));
              newSet.delete(hoveredGroupId);
              return newSet;
            });
          }
        }, 10);
      }
    }
  };

  // Hàm để đóng các group đã tự động mở
  const closeAutoOpenedGroups = () => {
    if (autoOpenedGroups.size === 0) return;

    const updatedTree = treeNodes.map((node) => {
      if (autoOpenedGroups.has(node.id)) {
        return { ...node, isOpen: false };
      }
      return node;
    });
    onTreeChange(updatedTree);
    setAutoOpenedGroups(new Set());
    setHoveredGroupId(null);
    setPendingOpenGroupId(null);

    // Xóa timeouts
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id.toString());
    setOverId(active.id.toString());
    setOffsetLeft(0);
    moveSuccessful.current = false;
    setAutoOpenedGroups(new Set()); // Reset auto-opened groups
    setHoveredGroupId(null); // Reset hovered group
    setPendingOpenGroupId(null); // Reset pending open group

    // Xóa bất kỳ timeout nào đang tồn tại
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    // Sao lưu trạng thái tree hiện tại để khôi phục khi có lỗi
    const backupState = JSON.parse(JSON.stringify(treeNodes));
    setOriginalTreeState(backupState);

    const draggedItem = items.find((item) => item.id == active.id.toString());

    // Đặt loại item đang active để xử lý children đúng cách
    if (draggedItem) {
      if (draggedItem.type == 'group' || draggedItem.type == 'product') {
        setActiveItemType(draggedItem.type);
        // Đặt active group ID nếu đang kéo group
        if (draggedItem.type === 'group') {
          setActiveGroupId(draggedItem.id);
        }
      }
    }

    // Chỉ collapse groups nếu đang kéo group
    if (draggedItem && draggedItem.type == 'group' && onCollapseAllGroups && onSaveCollapsedState) {
      const currentState = onSaveCollapsedState(treeNodes);
      setSavedCollapsedState(currentState);
      onTreeChange(onCollapseAllGroups(treeNodes));
    }

    // Chỉ set cursor nếu document có sẵn (client-side)
    if (typeof document !== 'undefined') {
      document.body.style.setProperty('cursor', 'grabbing');
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    // Tính toán tổng offset từ khi bắt đầu drag
    const newOffsetLeft = offsetLeft + event.delta.x;
    setOffsetLeft(newOffsetLeft);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const newOverId = event.over?.id?.toString() ?? null;
    setOverId(newOverId);

    // Xử lý auto group toggle
    handleAutoGroupToggle(newOverId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;


    // Tính toán projected với offsetLeft thay vì event.delta.x
    const currentProjected =
      active.id.toString() && over?.id.toString()
        ? getProjection(uniqueItems, active.id.toString(), over.id.toString(), offsetLeft, 20)
        : null;

    // Đóng các group đã tự động mở trước khi reset state
    closeAutoOpenedGroups();

    // Kiểm tra xem chúng ta có thao tác drop hợp lệ không
    if (currentProjected && over) {
      const { depth, parentId } = currentProjected;

      // Làm việc trực tiếp với flattened items để đơn giản hóa
      const clonedItems = JSON.parse(JSON.stringify(uniqueItems)) as FlatItem[];

      const overIndex = clonedItems.findIndex(({ id }) => id == over.id.toString());
      const activeIndex = clonedItems.findIndex(({ id }) => id == active.id.toString());
      const activeTreeItem = clonedItems[activeIndex];
      const overItem = clonedItems[overIndex];

      // Kiểm tra xem items có được tìm thấy không
      if (activeIndex === -1) {
        moveSuccessful.current = false;
        resetState();
        return;
      }

      if (overIndex === -1) {
        moveSuccessful.current = false;
        resetState();
        return;
      }

      // Tìm effective over item (có thể là parent group nếu hovering over child)
      let effectiveOverItem = overItem;
      if (overItem && overItem.type === 'product' && overItem.parentId) {
        const parentGroup = clonedItems.find((item) => item.id === overItem.parentId && item.type === 'group');
        if (parentGroup && !parentGroup.isCollapsed) {
          effectiveOverItem = parentGroup;
        }
      }

      // Xác thực thao tác drop trước khi áp dụng thay đổi
      if (!isValidDropOperation(activeTreeItem, effectiveOverItem, depth)) {
        moveSuccessful.current = false;
        resetState();
        return;
      }

      try {
        // Nếu đang kéo group, di chuyển group và tất cả con của nó cùng nhau
        if (activeTreeItem.type == 'group') {
          // Di chuyển group với children sử dụng utility function
          const movedItems = moveGroupWithChildrenToPosition(
            clonedItems,
            activeTreeItem.id,
            overIndex,
            depth,
            parentId,
          );

          const newItems = buildTreeFromFlattened(movedItems, originalTreeState || treeNodes);
          onTreeChange(newItems);
          moveSuccessful.current = true;
        } else {
          // Đối với products, xử lý từng trường hợp kéo rõ ràng
          

          // Xác định loại thao tác kéo
          const isRootToRoot = !activeTreeItem.parentId && !parentId;
          const isRootToGroup = !activeTreeItem.parentId && parentId;
          const isGroupToGroup = activeTreeItem.parentId && parentId;
          const isGroupToRoot = activeTreeItem.parentId && !parentId;

         

          // Sử dụng arrayMove để di chuyển item
          const movedItems = arrayMove(clonedItems, activeIndex, overIndex);

          // Kiểm tra duplicate ngay sau arrayMove
          checkForDuplicates(movedItems, 'after arrayMove');

          // Tạo snapshot của dữ liệu tại thời điểm log
          const snapshotAfterArrayMove = movedItems.map((item) => ({
            id: item.id,
            parentId: item.parentId,
            type: item.type,
            depth: item.depth,
          }));


          // Cập nhật depth và parentId cho item đã di chuyển
          const movedItem = movedItems.find((item) => item.id === activeTreeItem.id);


          if (movedItem) {
            // Đảm bảo depth = 0 khi parentId = null (root level)
            let finalDepth = depth;
            let finalParentId = parentId;

            // Kiểm tra nếu effective over type là group thì xử lý theo dragOffset
            if (effectiveOverItem && effectiveOverItem.type === 'group') {
              // Tính toán dragDepth từ offset
              const dragDepth = Math.round(offsetLeft / 20); // 20 là indentationWidth

              if (dragDepth === 0) {
                // Nếu dragDepth = 0, đặt ở root level
                finalDepth = 0;
                finalParentId = null;
              } else if (dragDepth >= 1) {
                // Nếu dragDepth >= 1, đặt trong group
                finalDepth = 1;
                finalParentId = effectiveOverItem.id;
              } else {
                // Sử dụng depth từ getProjection
                finalDepth = depth;
                finalParentId = depth === 0 ? null : effectiveOverItem.id;
              }
            } else if (isGroupToRoot) {
              // Khi kéo từ group ra root, đảm bảo depth = 0
              finalDepth = 0;
              finalParentId = null;
            } else if (finalParentId === null) {
              // Khi parentId = null, đảm bảo depth = 0
              finalDepth = 0;
            } else {
              // Sử dụng depth từ getProjection cho các trường hợp khác
              finalDepth = depth;
            }

            // Cập nhật trực tiếp item được tìm thấy
            Object.assign(movedItem, {
              depth: finalDepth,
              parentId: finalParentId,
              originalIndex: 0, // Temporary value, will be calculated after update
            });

            // Cập nhật group_id của product nếu đây là product
            if (movedItem.product) {
              // Nếu parentId = null (root level), group_id = '0'
              // Nếu parentId có giá trị (trong group), group_id = parentId
              movedItem.product.group_id = finalParentId || '0';
              
            }

             

            // Tính calculatedOriginalIndex SAU KHI đã cập nhật movedItem
            let calculatedOriginalIndex: number;

            if (isRootToRoot) {
              // Root to Root: Tính index trong danh sách root items
              const rootItems = movedItems.filter((item) => !item.parentId);
              calculatedOriginalIndex = rootItems.indexOf(movedItem);
            } else if (isRootToGroup) {
              // Root to Group: Tính index trong danh sách items của group đích

              // Tạo snapshot của dữ liệu tại thời điểm log
              const snapshotBeforeUpdate = movedItems.map((item) => ({
                id: item.id,
                parentId: item.parentId,
                type: item.type,
                depth: item.depth,
              }));


              // Log từng item một cách rõ ràng
              snapshotBeforeUpdate.forEach((item, index) => {
              });

              // Tạo array parentId và log từng bước
              const parentIdArray = snapshotBeforeUpdate.map((item) => item.parentId);
              parentIdArray.forEach((parentId, index) => {
              });

              // Tính calculatedOriginalIndex dựa trên movedItem đã được cập nhật, không phải snapshot
              const groupItems = movedItems.filter((item) => item.parentId === parentId);
              calculatedOriginalIndex = groupItems.indexOf(movedItem);
            } else if (isGroupToGroup) {
              // Group to Group: Tính index trong danh sách items của group đích
              const groupItems = movedItems.filter((item) => item.parentId === parentId);
              calculatedOriginalIndex = groupItems.indexOf(movedItem);
            } else if (isGroupToRoot) {
              // Group to Root: Tính index trong danh sách root items
              const rootItems = movedItems.filter((item) => !item.parentId);
              calculatedOriginalIndex = rootItems.indexOf(movedItem);
            } else {
              // Fallback: Sử dụng index toàn bộ danh sách
              calculatedOriginalIndex = movedItems.indexOf(movedItem);
            }

            // Cập nhật lại originalIndex với giá trị đúng
            movedItem.originalIndex = calculatedOriginalIndex;


            // Log sau khi cập nhật để so sánh
            const snapshotAfterUpdate = movedItems.map((item) => ({
              id: item.id,
              parentId: item.parentId,
              type: item.type,
              depth: item.depth,
            }));

          }


          // Kiểm tra duplicate sau khi cập nhật
          checkForDuplicates(movedItems, 'after update');

          // Đảm bảo không có duplicate items trước khi build tree
          const uniqueItems = movedItems.filter(
            (item, index, self) => index === self.findIndex((t) => t.id === item.id),
          );

          if (uniqueItems.length !== movedItems.length) {
            console.warn('Duplicate items detected, removing duplicates:', {
              originalCount: movedItems.length,
              uniqueCount: uniqueItems.length,
            });
          }

          // Thêm kiểm tra bổ sung để đảm bảo không có duplicate
          const itemIds = new Set<string>();
          const finalUniqueItems = uniqueItems.filter((item) => {
            if (itemIds.has(item.id)) {
              console.warn('Duplicate item found and removed:', item.id);
              return false;
            }
            itemIds.add(item.id);
            return true;
          });

          const newItems = buildTreeFromFlattened(finalUniqueItems, originalTreeState || treeNodes);

          // Debug tree structure
          debugTreeStructure(newItems, 'after buildTreeFromFlattened');

          // Validate tree structure
          const validation = validateTreeStructure(newItems);
          if (!validation.isValid) {
            console.error('Tree validation failed:', validation.issues);
            moveSuccessful.current = false;
            resetState();
            return;
          }

          onTreeChange(newItems);
          moveSuccessful.current = true;
        }
      } catch (error) {
        moveSuccessful.current = false;
        resetState();
        return;
      }
    } else {
      moveSuccessful.current = false;
    }

    // Luôn reset state ở cuối
    resetState();
  };

  const handleDragCancel = () => {
    // Đóng các group đã tự động mở trước khi reset state
    closeAutoOpenedGroups();
    resetState();
  };

  const resetState = () => {

    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setActiveItemType(null);
    setActiveGroupId(null);

    // Khôi phục trạng thái tree gốc nếu move không thành công
    if (!moveSuccessful.current && originalTreeState) {
      onTreeChange(originalTreeState);
    }

    // Khôi phục trạng thái collapse
    if (savedCollapsedState && onUpdateCollapsedStates) {
      if (moveSuccessful.current) {
        onUpdateCollapsedStates(savedCollapsedState);
      }
      setSavedCollapsedState(null);
    }

    setOriginalTreeState(null);

    // Chỉ reset cursor nếu document có sẵn (client-side)
    if (typeof document !== 'undefined') {
      document.body.style.setProperty('cursor', '');
    }

  };

  const isInvalidDrop = (item: FlatItem) => {
    if (!activeId || !overId || !projected) return false;

    // Lọc ra các collapsed items để validation, nhưng giữ lại active item
    const visibleItems = uniqueItems.filter((item) => !item.isCollapsed || item.id === activeId);
    const activeItem = visibleItems.find((i) => i.id == activeId);
    if (!activeItem) return false;

    return !isValidDropOperation(activeItem, item, projected.depth);
  };

  // Function để kiểm tra và log duplicate items
  const checkForDuplicates = (items: FlatItem[], context: string) => {
    const itemIds = items.map((item) => item.id);
    const uniqueIds = new Set(itemIds);

    if (itemIds.length !== uniqueIds.size) {
      const duplicates = itemIds.filter((id, index) => itemIds.indexOf(id) !== index);
      console.warn(`Duplicate items found in ${context}:`, {
        totalItems: itemIds.length,
        uniqueItems: uniqueIds.size,
        duplicateIds: Array.from(new Set(duplicates)),
        allItems: items.map((item) => ({ id: item.id, type: item.type, parentId: item.parentId })),
      });
      return true;
    }
    return false;
  };

  // Function để debug tree structure
  const debugTreeStructure = (treeNodes: TreeNode[], context: string) => {
     
  };


  // Thêm debug để kiểm tra duplicate items
  const itemIds = uniqueItems.map((item) => item.id);
  const uniqueIds = new Set(itemIds);
  if (itemIds.length !== uniqueIds.size) {
    const duplicates = itemIds.filter((id, index) => itemIds.indexOf(id) !== index);
    console.warn('Duplicate items found in useDragAndDrop:', {
      totalItems: itemIds.length,
      uniqueItems: uniqueIds.size,
      duplicateIds: Array.from(new Set(duplicates)),
      allItems: uniqueItems.map((item) => ({ id: item.id, type: item.type, parentId: item.parentId })),
    });
  }

  return {
    activeId,
    overId,
    projected,
    items: uniqueItems,
    activeItemType,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    isInvalidDrop,
  };
}
