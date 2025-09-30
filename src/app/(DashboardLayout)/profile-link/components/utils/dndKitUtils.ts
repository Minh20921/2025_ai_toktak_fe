import { FlatItem, TreeNode } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { arrayMove } from '@dnd-kit/sortable';

export function flattenTreeForDndKit(
  nodes: TreeNode[],
  parentId: string | null = null,
  depth = 0,
  activeGroupId?: string,
): FlatItem[] {
  const result: FlatItem[] = [];
  const seenIds = new Set<string>(); // Thêm Set để theo dõi IDs đã thấy

  nodes.forEach((node, originalIndex) => {
    // Kiểm tra xem ID đã tồn tại chưa
    if (seenIds.has(node.id)) {
      console.warn('Duplicate node found in flattenTreeForDndKit, skipping:', node.id);
      return;
    }
    seenIds.add(node.id);

    const flatItem: FlatItem = {
      id: node.id,
      name: node.type === 'group' ? node.title || '' : node.product?.product_name || '',
      type: node.type,
      depth,
      parentId,
      hasChildren: !!(node.children && node.children.length > 0),
      isCollapsed: !node.isOpen,
      product: node.product,
      originalIndex,
      itemCount: node.type === 'group' ? node.children?.length || 0 : undefined,
    };

    result.push(flatItem);

    // Chỉ flatten children nếu:
    // 1. Group đang mở (isOpen), VÀ
    // 2. Group này KHÔNG phải là group đang được drag
    const shouldFlattenChildren =
      node.type === 'group' && node.children && node.children.length > 0 && node.isOpen && node.id !== activeGroupId;

    if (shouldFlattenChildren && node.children) {
      const childItems = flattenTreeForDndKit(node.children, node.id, depth + 1, activeGroupId);
      // Kiểm tra duplicate trong children trước khi thêm vào result
      childItems.forEach((childItem) => {
        if (!seenIds.has(childItem.id)) {
          seenIds.add(childItem.id);
          result.push(childItem);
        } else {
          console.warn('Duplicate child item found, skipping:', childItem.id);
        }
      });
    }
  });

  // Kiểm tra và log duplicate items
  const itemIds = result.map((item) => item.id);
  const uniqueIds = new Set(itemIds);

  if (itemIds.length !== uniqueIds.size) {
    const duplicates = itemIds.filter((id, index) => itemIds.indexOf(id) !== index);
    console.warn('Duplicate items found in flattenTreeForDndKit:', {
      totalItems: itemIds.length,
      uniqueItems: uniqueIds.size,
      duplicateIds: Array.from(new Set(duplicates)),
      allItems: result.map((item) => ({ id: item.id, type: item.type, parentId: item.parentId })),
    });
  }

  return result;
}

function findNodeInTree(tree: TreeNode[], id: string): TreeNode | undefined {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeInTree(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export function buildTreeFromFlattened(flattenedItems: FlatItem[], originalTree?: TreeNode[]): TreeNode[] {
  const tree: TreeNode[] = [];
  const map = new Map<string, TreeNode>();

  // Kiểm tra và loại bỏ duplicate items trước khi xử lý
  const uniqueFlattenedItems = flattenedItems.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id),
  );

  if (uniqueFlattenedItems.length !== flattenedItems.length) {
    console.warn('Duplicate items found in flattenedItems, removing duplicates:', {
      originalCount: flattenedItems.length,
      uniqueCount: uniqueFlattenedItems.length,
    });
  }

  // Thêm kiểm tra bổ sung để đảm bảo không có duplicate
  const itemIds = new Set<string>();
  const finalUniqueItems = uniqueFlattenedItems.filter((item) => {
    if (itemIds.has(item.id)) {
      console.warn('Duplicate item found and removed in buildTreeFromFlattened:', item.id);
      return false;
    }
    itemIds.add(item.id);
    return true;
  });

  // Sort items by depth and original position to maintain order
  const sortedItems = [...finalUniqueItems].sort((a, b) => {
    if (a.depth !== b.depth) {
      return a.depth - b.depth;
    }
    // If same depth, maintain original order
    return (a.originalIndex || 0) - (b.originalIndex || 0);
  });

  // First pass: create all nodes
  sortedItems.forEach((item) => {
    // Kiểm tra xem node đã tồn tại chưa
    if (map.has(item.id)) {
      console.warn('Duplicate node found, skipping:', item.id);
      return;
    }

    const node: TreeNode = {
      id: item.id,
      type: item.type === 'group' ? 'group' : 'product',
      title: item.name,
      isOpen: !item.isCollapsed,
      children: [], // Luôn bắt đầu với children rỗng
      product: item.product,
      parentId: item.parentId || undefined,
    };
    map.set(item.id, node);
  });

  // Second pass: build tree structure
  sortedItems.forEach((item) => {
    const node = map.get(item.id);
    if (!node) return;

    // Kiểm tra xem node đã được thêm vào tree chưa
    const alreadyInTree = tree.some((treeNode) => treeNode.id === node.id);
    if (alreadyInTree) {
      console.warn('Node already in tree, skipping:', node.id);
      return;
    }

    if (item.parentId) {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children = parent.children || [];
        // Kiểm tra xem node đã có trong children chưa
        const alreadyInChildren = parent.children.some((child) => child.id === node.id);
        if (!alreadyInChildren) {
          parent.children.push(node);
        } else {
          console.warn('Node already in parent children, skipping:', node.id);
        }
      } else {
        // Nếu không tìm thấy parent, đặt ở root level
        tree.push(node);
        node.parentId = undefined;
      }
    } else {
      tree.push(node);
    }
  });

  // Third pass: restore children for groups that don't have children in flattened list
  // Chỉ restore nếu group không có children trong flattened list và có children trong original tree
  if (originalTree) {
    tree.forEach((node) => {
      if (node.type === 'group' && node.children && node.children.length === 0) {
        const oldNode = findNodeInTree(originalTree, node.id);
        if (oldNode && oldNode.children && oldNode.children.length > 0) {
          // Kiểm tra xem children có tồn tại trong flattened list không
          const existingChildrenIds = new Set(flattenedItems.map((item) => item.id));
          const missingChildren = oldNode.children.filter((child) => !existingChildrenIds.has(child.id));

          if (missingChildren.length > 0) {
            // Tạo bản copy của children array để tránh lỗi "object is not extensible"
            // VÀ đảm bảo không duplicate với items đã có trong flattened list
            const uniqueMissingChildren = missingChildren.filter((child) => {
              // Kiểm tra xem child này đã tồn tại trong tree chưa
              const existingInTree = tree.some((treeNode) => treeNode.id === child.id);
              return !existingInTree;
            });

            if (uniqueMissingChildren.length > 0) {
              node.children = [...uniqueMissingChildren];
            }
          }
        }
      }
    });
  }

  // Validate và clean tree trước khi return
  const validatedTree = validateAndCleanTree(tree);

  if (validatedTree.length !== tree.length) {
     
  }

  return validatedTree;
}

export function getProjection(
  items: FlatItem[],
  activeId: string,
  overId: string,
  dragOffset: number,
  indentationWidth: number,
) {

  // Always use all items to ensure we can find both active and over items
  const allItems = items;
  const allOverItemIndex = allItems.findIndex(({ id }) => id.toString() === overId);
  const allActiveItemIndex = allItems.findIndex(({ id }) => id.toString() === activeId);
  const activeItem = allItems[allActiveItemIndex];
  const overItem = allItems[allOverItemIndex];


  if (!activeItem) {
    return null;
  }

  if (allOverItemIndex === -1) {
    return null;
  }

  // Helper function to check if an item is a child of a group
  const isChildOfGroup = (itemId: string, groupId: string): boolean => {
    const item = allItems.find((item) => item.id === itemId);
    if (!item) return false;

    // Direct child
    if (item.parentId === groupId) return true;

    // Check if it's a nested child (recursive)
    if (item.parentId) {
      return isChildOfGroup(item.parentId, groupId);
    }

    return false;
  };

  // Helper function to find the parent group of an item
  const findParentGroup = (itemId: string): FlatItem | null => {
    const item = allItems.find((item) => item.id === itemId);
    if (!item || !item.parentId) return null;

    const parent = allItems.find((item) => item.id === item.parentId);
    if (!parent) return null;

    if (parent.type === 'group') {
      return parent;
    }

    // Recursively find the group parent
    return findParentGroup(item.parentId);
  };

  // Check if we're hovering over a child of an open group
  let effectiveOverItem = overItem;
  let effectiveOverIndex = allOverItemIndex;

  // If overItem is a product and has a parent group that is open, treat it as dropping into the group
  if (overItem && overItem.type === 'product' && overItem.parentId) {
    const parentGroup = allItems.find((item) => item.id === overItem.parentId && item.type === 'group');
    if (parentGroup && !parentGroup.isCollapsed) {
      // We're hovering over a child of an open group, treat it as dropping into the group
      effectiveOverItem = parentGroup;
      effectiveOverIndex = allItems.findIndex(({ id }) => id === parentGroup.id);
    }
  }

  // Create a new array with the active item removed and inserted at the over position
  const newItems = [...allItems];
  newItems.splice(allActiveItemIndex, 1);

  // Calculate the correct insert position after removing the active item
  let insertIndex = effectiveOverIndex;
  if (allActiveItemIndex < effectiveOverIndex) {
    // If active item was before over item, adjust the insert index
    insertIndex = effectiveOverIndex - 1;
  }

  newItems.splice(insertIndex, 0, activeItem);

  const previousItem = newItems[insertIndex - 1];
  const nextItem = newItems[insertIndex + 1];

  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;

  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;


  // Enforce group constraints: groups can only be at root level (depth 0)
  if (activeItem.type === 'group') {
    depth = 0;
  } else {
    // For products, they can be at root level or inside groups
    // Kiểm tra vị trí kéo so với group
    if (effectiveOverItem && effectiveOverItem.type === 'group') {
      // Tìm vị trí của group trong danh sách
      const groupIndex = newItems.findIndex((item) => item.id === effectiveOverItem.id);

      if (groupIndex !== -1) {
        // Kiểm soát depth dựa trên dragOffset và vị trí kéo
        if (dragDepth === 0) {
          // Nếu dragDepth = 0, đặt ở root level (trước hoặc sau group)
          depth = 0;
        } else if (dragDepth >= 1) {
          // Nếu dragDepth >= 1, đặt trong group
          depth = 1;
        } else {
          // Fallback: sử dụng logic vị trí để xác định depth
          if (insertIndex > groupIndex) {
            // Nếu đặt sau group, có thể là trong group hoặc sau group
            // Sử dụng dragDepth để quyết định
            depth = dragDepth >= 1 ? 1 : 0;
          } else {
            // Nếu đặt trước group, đặt ở root level
            depth = 0;
          }
        }
      } else {
        // Nếu không tìm thấy group, đặt ở root level
        depth = 0;
      }
    } else {
      // Nếu không kéo qua group, sử dụng logic thông thường
      depth = Math.max(0, Math.min(depth, maxDepth));
    }
  }


  // Validate the drop operation
  if (!isValidDropOperation(activeItem, effectiveOverItem, depth)) {
    return null;
  }

  const getParentId = () => {

    if (depth === 0) {
      return null;
    }

    // Nếu over type là group và depth = 1, trả về group ID
    if (effectiveOverItem && effectiveOverItem.type === 'group' && depth === 1) {
      return effectiveOverItem.id;
    }

    // Nếu depth > 0, chúng ta đang cố gắng drop vào một group
    if (depth >= 1) {
      // Tìm group gần nhất trước vị trí hiện tại
      const groupBefore = newItems
        .slice(0, insertIndex)
        .reverse()
        .find((item) => item.type === 'group');

      if (groupBefore) {
        return groupBefore.id;
      }

      // Nếu không tìm thấy group trước đó, tìm group ở vị trí hiện tại hoặc sau đó
      const groupAtOrAfter = newItems.slice(insertIndex).find((item) => item.type === 'group');

      if (groupAtOrAfter) {
        return groupAtOrAfter.id;
      }
    }

    // Nếu không tìm thấy parent phù hợp, trả về null (root level)
    return null;
  };

  const parentId = getParentId();

  // Đảm bảo tính nhất quán: khi parentId = null thì depth = 0
  let finalDepth = depth;
  if (parentId === null) {
    finalDepth = 0;
  } else if (parentId && depth === 0) {
    // Khi có parentId nhưng depth = 0, đảm bảo depth = 1
    finalDepth = 1;
  }

  return {
    depth: finalDepth,
    maxDepth,
    minDepth,
    parentId,
  };
}

function getDragDepth(offset: number, indentationWidth: number) {
  const depth = Math.round(offset / indentationWidth);
  return depth;
}

function getMaxDepth({ previousItem }: { previousItem: FlatItem | undefined }) {

  if (previousItem) {
    // If the previous item is a group, products can be nested inside it
    if (previousItem.type === 'group') {
      const maxDepth = previousItem.depth + 1;
      return maxDepth;
    }
    // If the previous item is a product, maintain the same depth
    return previousItem.depth;
  }

  // If no previous item, allow depth 0 (root level)
  return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlatItem | undefined }) {

  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

export function removeChildrenOf(items: FlatItem[], ids: string[], activeItemType?: 'group' | 'product') {
  const excludeParentIds = [...ids];

  // If dragging a group, we want to keep its children in the flattened list
  // so they move together with the group
  if (activeItemType === 'group') {
    // Find the active group ID
    const activeGroupId = ids.find((id) => {
      const activeItem = items.find((item) => item.id === id);
      return activeItem?.type === 'group';
    });

    return items.filter((item) => {
      if (item.parentId && excludeParentIds.includes(item.parentId)) {
        // Don't remove children of the active group being dragged
        if (activeGroupId && item.parentId === activeGroupId) {
          return true; // Keep children of the active group
        }
        return false; // Remove children of other collapsed groups
      }
      return true;
    });
  }

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      return false;
    }
    return true;
  });
}

export function findItem(items: FlatItem[], itemId: string) {
  return items.find(({ id }) => id === itemId);
}

export function findItemDeep(items: FlatItem[], itemId: string): FlatItem | undefined {
  for (const item of items) {
    const { id } = item;

    if (id === itemId) {
      return item;
    }
  }

  return undefined;
}

export function removeItem(items: FlatItem[], id: string) {
  return items.filter((item) => item.id !== id);
}

export function setProperty<T extends keyof FlatItem>(
  items: FlatItem[],
  id: string,
  property: T,
  setter: (value: FlatItem[T]) => FlatItem[T],
) {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, [property]: setter(item[property]) };
    }
    return item;
  });
}

export function getChildCount(items: FlatItem[], id: string) {
  const item = findItem(items, id);
  return item ? 1 : 0;
}

export function isValidDropOperation(activeItem: FlatItem, overItem: FlatItem | null, projectedDepth: number): boolean {
  // Groups can only be at root level (depth 0)
  if (activeItem.type === 'group' && projectedDepth > 0) {
    return false;
  }

  // Products can be at root level or inside groups
  if (activeItem.type === 'product') {
    // If trying to drop into a product, it's not allowed
    if (overItem && overItem.type === 'product' && projectedDepth > overItem.depth) {
      return false;
    }

    // Nếu over type là group, cho phép depth = 0 hoặc 1
    if (overItem && overItem.type === 'group') {
      return projectedDepth === 0 || projectedDepth === 1;
    }

    // Khi không kéo vào group, chỉ cho phép depth = 0 (root level)
    if (projectedDepth > 0) {
      return false;
    }

    // Products can be dropped at root level (depth 0)
    if (projectedDepth === 0) {
      return true;
    }
  }

  return true;
}

export function moveGroupWithChildrenToPosition(
  items: FlatItem[],
  groupId: string,
  newPosition: number,
  newDepth: number,
  newParentId: string | null,
): FlatItem[] {
  // Find the group and all its children
  const groupIndex = items.findIndex((item) => item.id === groupId);
  const groupChildren = items.filter((item) => item.parentId === groupId);

  // Get all indices of group items (group + children)
  const childrenIndices = groupChildren.map((child) => items.findIndex((item) => item.id === child.id));
  const groupItemIndices = [groupIndex, ...childrenIndices].sort((a, b) => a - b);

  // Extract group items in order
  const itemsToMove = groupItemIndices.map((index) => items[index]);

  // Remove from current positions
  const remainingItems = items.filter((_, index) => !groupItemIndices.includes(index));

  // Update depth, parentId, and originalIndex for group and children
  const updatedItemsToMove = itemsToMove.map((item, moveIndex) => {
    if (item.id === groupId) {
      return {
        ...item,
        depth: newDepth,
        parentId: newParentId,
        originalIndex: newPosition + moveIndex,
      };
    } else {
      return {
        ...item,
        depth: newDepth + 1,
        parentId: groupId,
        originalIndex: newPosition + moveIndex,
      };
    }
  });

  // Insert at new position
  const finalItems = [
    ...remainingItems.slice(0, newPosition),
    ...updatedItemsToMove,
    ...remainingItems.slice(newPosition),
  ];

  // Kiểm tra và loại bỏ duplicate items
  const itemIds = finalItems.map((item) => item.id);
  const uniqueIds = new Set(itemIds);

  if (itemIds.length !== uniqueIds.size) {
    const duplicates = itemIds.filter((id, index) => itemIds.indexOf(id) !== index);
    console.warn('Duplicate items found in moveGroupWithChildrenToPosition:', {
      totalItems: itemIds.length,
      uniqueItems: uniqueIds.size,
      duplicateIds: Array.from(new Set(duplicates)),
    });

    // Loại bỏ duplicate items
    const seenIds = new Set<string>();
    const cleanedItems = finalItems.filter((item) => {
      if (seenIds.has(item.id)) {
        return false;
      }
      seenIds.add(item.id);
      return true;
    });

    return cleanedItems;
  }

  return finalItems;
}

// Function để validate và loại bỏ duplicate trong tree
function validateAndCleanTree(tree: TreeNode[]): TreeNode[] {
  const seenIds = new Set<string>();
  const cleanedTree: TreeNode[] = [];

  const processNode = (node: TreeNode): TreeNode | null => {
    if (seenIds.has(node.id)) {
      console.warn('Duplicate node found in tree, removing:', node.id);
      return null;
    }
    seenIds.add(node.id);

    const cleanedNode = { ...node };
    if (cleanedNode.children && cleanedNode.children.length > 0) {
      const cleanedChildren = cleanedNode.children
        .map(processNode)
        .filter((child): child is TreeNode => child !== null);
      cleanedNode.children = cleanedChildren;
    }

    return cleanedNode;
  };

  tree.forEach((node) => {
    const cleanedNode = processNode(node);
    if (cleanedNode) {
      cleanedTree.push(cleanedNode);
    }
  });

  return cleanedTree;
}

// Function để validate toàn bộ tree structure
export function validateTreeStructure(tree: TreeNode[]): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  const seenIds = new Set<string>();

  const validateNode = (node: TreeNode, path: string[] = []): void => {
    const currentPath = [...path, node.id];

    // Kiểm tra duplicate ID
    if (seenIds.has(node.id)) {
      issues.push(`Duplicate ID found: ${node.id} at path: ${currentPath.join(' -> ')}`);
      return;
    }
    seenIds.add(node.id);

    // Kiểm tra children
    if (node.children && node.children.length > 0) {
      node.children.forEach((child, index) => {
        validateNode(child, currentPath);
      });
    }

    // Kiểm tra product data
    if (node.type === 'product' && !node.product) {
      issues.push(`Product node missing product data: ${node.id} at path: ${currentPath.join(' -> ')}`);
    }

    // Kiểm tra group data
    if (node.type === 'group' && !node.title) {
      issues.push(`Group node missing title: ${node.id} at path: ${currentPath.join(' -> ')}`);
    }
  };

  tree.forEach((node) => {
    validateNode(node);
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}
