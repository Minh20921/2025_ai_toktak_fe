import { useDispatch, useSelector } from 'react-redux';
import { useDragAndDrop } from './useDragAndDrop';
import { useEffect, useRef } from 'react';
import { RootState } from '@/app/lib/store/store';
import { TreeNode, Product } from '@/app/(DashboardLayout)/profile-link/@type/interface';

interface UseDragAndDropWithReduxProps {
  treeNodes: TreeNode[];
  onTreeChange: (newTree: TreeNode[]) => void;
  onCollapseAllGroups?: (tree: TreeNode[]) => TreeNode[];
  onSaveCollapsedState?: (tree: TreeNode[]) => Record<string, boolean>;
  onUpdateCollapsedStates?: (state: Record<string, boolean>) => void;
}

export function useDragAndDropWithRedux(props: UseDragAndDropWithReduxProps) {
  const dispatch = useDispatch();
  const { treeNodes, onTreeChange, onCollapseAllGroups, onSaveCollapsedState, onUpdateCollapsedStates } = props;

  // Ref để lưu trạng thái trước đó
  const previousTreeRef = useRef<TreeNode[]>([]);
  const isDraggingRef = useRef(false);
  const processedDragRef = useRef(false);

  // Cập nhật previousTreeRef khi treeNodes thay đổi (trừ khi đang drag)
  useEffect(() => {
    if (!isDraggingRef.current) {
      previousTreeRef.current = JSON.parse(JSON.stringify(treeNodes));
    }
  }, [treeNodes]);

  // Lấy data từ Redux store
  const dragState = useSelector((state: RootState) => (state.profile as any).dragState);
  const productChanges = useSelector((state: RootState) => (state.profile as any).productChanges);
  const currentTreeNodes = useSelector((state: RootState) => (state.profile as any).treeNodes);

  // Theo dõi thay đổi treeNodes để detect drag completion
  useEffect(() => {
    if (isDraggingRef.current && currentTreeNodes.length > 0 && !processedDragRef.current) {
      const oldTree = previousTreeRef.current;
      const newTree = currentTreeNodes;


      // Tìm các products có thay đổi group_id
      const findProductChanges = (oldNodes: TreeNode[], newNodes: TreeNode[]) => {
        const changes: Array<{
          productId: string;
          oldGroupId: string | null;
          newGroupId: string | null;
          oldOrder: number;
          newOrder: number;
        }> = [];

        // Hàm helper để extract tất cả products từ tree
        const extractProducts = (
          nodes: TreeNode[],
          parentId: string | null = null,
        ): Array<{
          id: string;
          groupId: string | null;
          order: number;
        }> => {
          const products: Array<{
            id: string;
            groupId: string | null;
            order: number;
          }> = [];

          nodes.forEach((node, index) => {
            if (node.type === 'product' && node.product) {
              // Sử dụng group_id từ product thay vì parentId từ tree
              const groupId = node.product.group_id === '0' ? null : node.product.group_id || null;
              products.push({
                id: node.product.id.toString(),
                groupId: groupId,
                order: index,
              });
            }
            if (node.children) {
              products.push(...extractProducts(node.children, node.id));
            }
          });

          return products;
        };

        const oldProducts = extractProducts(oldNodes);
        const newProducts = extractProducts(newNodes);
        // So sánh và tìm thay đổi
        oldProducts.forEach((oldProduct) => {
          const newProduct = newProducts.find((p) => p.id.toString() === oldProduct.id.toString());
          if (newProduct && oldProduct.groupId !== newProduct.groupId) {
            changes.push({
              productId: oldProduct.id,
              oldGroupId: oldProduct.groupId,
              newGroupId: newProduct.groupId,
              oldOrder: oldProduct.order,
              newOrder: newProduct.order,
            });
          }
        });

        return changes;
      };

      const groupIdChanges = findProductChanges(oldTree, newTree);

      // Lưu thay đổi group_id vào Redux
      if (groupIdChanges.length > 0) {
        groupIdChanges.forEach((change) => {
          dispatch({
            type: 'profile/recordProductMove',
            payload: {
              productId: change.productId,
              oldParentId: change.oldGroupId,
              newParentId: change.newGroupId,
              oldOrder: change.oldOrder,
              newOrder: change.newOrder,
            },
          });
        });
      } else {
      }

      isDraggingRef.current = false;
      processedDragRef.current = true;
    }
  }, [currentTreeNodes, dispatch, treeNodes]);

  const formattedProductsForAPI = useSelector((state: RootState) => {
    const profileState = state.profile as any;
    const allProducts: Product[] = [];
    const extractProducts = (nodes: TreeNode[]) => {
      nodes.forEach((node: TreeNode) => {
        if (node.type === 'product' && node.product) {
          allProducts.push(node.product);
        }
        if (node.children) {
          extractProducts(node.children);
        }
      });
    };
    extractProducts(profileState.treeNodes);
    return allProducts;
  });
  const formattedGroupsForAPI = useSelector((state: RootState) => {
    const profileState = state.profile as any;
    return profileState.treeNodes
      .filter((node: TreeNode) => node.type === 'group')
      .map((node: TreeNode) => ({
        id: node.id,
        type: 'group' as const,
        title: node.title,
        titleType: node.titleType,
        order_no: node.order_no,
        isOpen: false,
        children:
          node.children?.map((child: TreeNode) => ({
            id: child.id,
            type: 'product' as const,
            product: child.product,
            parentId: node.id,
          })) || [],
      }));
  });

  // Wrap các callback để lưu trữ vào Redux
  const handleTreeChange = (newTree: TreeNode[]) => {
    // Gọi callback gốc
    onTreeChange(newTree);

    // Lưu trữ vào Redux (sử dụng dispatch trực tiếp)
    dispatch({ type: 'profile/updateTreeState', payload: newTree });
  };

  const handleCollapseAllGroups = (tree: TreeNode[]) => {
    if (onCollapseAllGroups) {
      const result = onCollapseAllGroups(tree);
      return result;
    }
    return tree;
  };

  const handleSaveCollapsedState = (tree: TreeNode[]) => {
    if (onSaveCollapsedState) {
      const collapsedState = onSaveCollapsedState(tree);
      dispatch({ type: 'profile/saveCollapsedState', payload: collapsedState });
      return collapsedState;
    }
    return {};
  };

  const handleUpdateCollapsedStates = (state: Record<string, boolean>) => {
    if (onUpdateCollapsedStates) {
      onUpdateCollapsedStates(state);
    }
    dispatch({ type: 'profile/updateCollapsedStates', payload: state });
  };

  // Sử dụng useDragAndDrop gốc với các callback đã wrap
  const dragAndDropResult = useDragAndDrop({
    treeNodes,
    onTreeChange: handleTreeChange,
    onCollapseAllGroups: handleCollapseAllGroups,
    onSaveCollapsedState: handleSaveCollapsedState,
    onUpdateCollapsedStates: handleUpdateCollapsedStates,
  });

  // Wrap handleDragStart để set flag
  const originalHandleDragStart = dragAndDropResult.handleDragStart;
  const handleDragStart = (event: any) => {
    const container = document.querySelector('.scroll-container');
    if (container) {
      document.body.style.overflow = 'hidden';
    }
    isDraggingRef.current = true;
    processedDragRef.current = false;
    previousTreeRef.current = JSON.parse(JSON.stringify(treeNodes));
    return originalHandleDragStart(event);
  };

  // Wrap handleDragEnd để reset flag
  const originalHandleDragEnd = dragAndDropResult.handleDragEnd;
  const handleDragEnd = (event: any) => {
    const container = document.querySelector('.scroll-container');
    if (container) {
      document.body.style.overflow = '';
    }
    const result = originalHandleDragEnd(event);

    return result;
  };

  // Thêm các actions để quản lý changes
  const commitChanges = () => {
    dispatch({ type: 'profile/commitProductChanges' });
  };

  const clearChanges = () => {
    dispatch({ type: 'profile/clearProductChanges' });
  };

  return {
    ...dragAndDropResult,
    handleDragStart, // Override với version đã wrap
    handleDragEnd, // Override với version đã wrap
    // Thêm các tính năng từ Redux
    dragState,
    productChanges,
    formattedProductsForAPI,
    formattedGroupsForAPI,
    commitChanges,
    clearChanges,
  };
}
