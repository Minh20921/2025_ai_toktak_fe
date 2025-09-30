'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import {
  addTreeNode,
  appendProductsToNode,
  markProductForDeletion,
  moveNodeInTree,
  type ProfileState,
  setTreeNodes,
  startLoadingProductsInNode,
  toggleTreeNode,
  setLoading,
  appendRootProducts,
  setRootProductsPagination,
  markGroupForDeletion,
  setIsClearingTree,
} from '@/app/lib/store/profileSlice';
import { findNodeInTree } from '@/app/(DashboardLayout)/profile-link/components/utils/treeUtils';
import type { TreeNode } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { productAPI } from '@/app/(DashboardLayout)/profile-link/api/product';
import { showNotice } from '@/utils/custom/notice';

export function useProductTree() {
  const dispatch = useDispatch();
  const { id, loading, rootProductsPage, rootProductsHasMore, isClearingTree } = useSelector(
    (state: { profile: ProfileState }) => state.profile,
  );

  // Use a more specific selector to ensure we get fresh state
  const treeNodes = useSelector((state: { profile: ProfileState }) => {
    return state.profile.treeNodes;
  });

  const updateNodeCollapsedStates = useCallback(
    (collapsedStates: Record<string, boolean>) => {
      dispatch({
        type: 'profile/updateNodeCollapsedStates',
        payload: collapsedStates,
      });
    },
    [dispatch],
  );
  // Refs for tracking loading states
  const isLoadingMore = useRef(false);
  const isLoadingGroups = useRef(false);
  const isLoadingRootProducts = useRef(false);
  const groupLoadingStates = useRef<Record<string, boolean>>({});

  // Load groups từ API
  const loadGroups = useCallback(async () => {
    if (isLoadingGroups.current) return [];

    try {
      isLoadingGroups.current = true;
      const response = await productAPI.getGroups({
        user_id: id,
        page: 1,
        per_page: 100,
      });

      const groupNodes: TreeNode[] = response.data.map((group: any) => ({
        id: group.id.toString(),
        title: group.name || group.title,
        type: 'group' as const,
        isOpen: false,
        children: [],
        hasMore: true,
        loading: false,
        page: 1,
      }));

      return groupNodes;
    } catch (error) {
      console.error('Failed to load groups:', error);
      return [];
    } finally {
      isLoadingGroups.current = false;
    }
  }, [id]);

  // Load products không thuộc group nào (group = '')
  const loadRootProducts = useCallback(
    async (page = 1) => {
      if (isLoadingRootProducts.current) return { products: [], hasMore: false, nextPage: page };

      try {
        isLoadingRootProducts.current = true;
        const response = await productAPI.getProduct({
          page,
          per_page: 10,
          user_id: id,
          type_order: 'id_asc',
          group_id: '',
        });

        const rootProducts: TreeNode[] = response.data.map((product: any) => ({
          id: product.id.toString(),
          type: 'product' as const,
          product: {
            id: product.id.toString(),
            product_name: product.product_name,
            price: product.price,
            product_image: product.product_image,
            product_url: product.product_url,
          },
          parentId: undefined,
        }));

        return {
          products: rootProducts,
          hasMore: response.total_pages > response.page,
          nextPage: response.page + 1,
        };
      } catch (error) {
        console.error('Failed to load root products:', error);
        return {
          products: [],
          hasMore: false,
          nextPage: page,
        };
      } finally {
        isLoadingRootProducts.current = false;
      }
    },
    [id],
  );

  // Load products cho một group cụ thể với debouncing
  const loadProductsForGroup = useCallback(
    async (groupId: string, page = 1) => {
      // Prevent multiple simultaneous requests for the same group
      if (groupLoadingStates.current[groupId]) {
        return { hasMore: false, nextPage: page };
      }

      try {
        groupLoadingStates.current[groupId] = true;
        dispatch(startLoadingProductsInNode(groupId));

        console.log('Loading products for group:', groupId, 'page:', page);

        const response = await productAPI.getProduct({
          page,
          per_page: 10,
          user_id: id,
          type_order: 'id_asc',
          group_id: groupId,
        });

        dispatch(
          appendProductsToNode({
            nodeId: groupId,
            products: response.data,
            hasMore: response.total_pages > response.page,
            page: response.page + 1,
          }),
        );

        return {
          hasMore: response.total_pages > response.page,
          nextPage: response.page + 1,
        };
      } catch (error) {
        console.error('Failed to load products:', error);
        return {
          hasMore: false,
          nextPage: page,
        };
      } finally {
        groupLoadingStates.current[groupId] = false;
      }
    },
    [dispatch, id],
  );

  // Initialize data
  const initializeData = useCallback(async () => {
    if (!id) return;

    try {
      dispatch(setLoading(true));

      const [groupNodes, rootProductsResult] = await Promise.all([loadGroups(), loadRootProducts(1)]);

      const allNodes: TreeNode[] = [...groupNodes, ...rootProductsResult.products];

      dispatch(setTreeNodes(allNodes));

      dispatch(
        setRootProductsPagination({
          hasMore: rootProductsResult.hasMore,
          nextPage: rootProductsResult.nextPage,
        }),
      );
    } catch (error) {
      console.error('Failed to initialize data:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [id, loadGroups, loadRootProducts, dispatch]);

  // Load more root products
  const loadMoreRootProducts = useCallback(async () => {
    if (isLoadingMore.current || !rootProductsHasMore) return false;

    try {
      isLoadingMore.current = true;
      const result = await loadRootProducts(rootProductsPage);

      if (result.products.length > 0) {
        dispatch(appendRootProducts(result.products));
      }

      dispatch(
        setRootProductsPagination({
          hasMore: result.hasMore,
          nextPage: result.nextPage,
        }),
      );

      return result.hasMore;
    } catch (error) {
      console.error('Failed to load more root products:', error);
      return false;
    } finally {
      isLoadingMore.current = false;
    }
  }, [loadRootProducts, rootProductsPage, rootProductsHasMore, dispatch]);

  const handleToggle = useCallback(
    (nodeId: string) => {
      const node = findNodeInTree(treeNodes, nodeId);
      if (node) {
        dispatch(toggleTreeNode({ nodeId, isOpen: !node.isOpen }));

        if (!node.isOpen && node.children?.length === 0 && node.hasMore) {
          loadProductsForGroup(nodeId, 1);
        }
      }
    },
    [dispatch, treeNodes, loadProductsForGroup],
  );

  // Updated handleLoadMore for scroll trigger
  const handleLoadMore = useCallback(
    async (groupId: string) => {
      const group = findNodeInTree(treeNodes, groupId);
      if (group && group.page && !group.loading && group.hasMore) {
        await loadProductsForGroup(groupId, group.page);
      }
    },
    [treeNodes, loadProductsForGroup],
  );

  const handleDelete = useCallback(
    async (itemId: string) => {
      try {
        showNotice('😢 제품을 제거하시겠습니까??', '방금 변경한 내용은 손실됩니다.', true, '확인', '취소', () => {
          const node = findNodeInTree(treeNodes, itemId);
          if (!node) return;

          if (node.type === 'product') {
            // If this is the last product, clear the entire tree
            if (treeNodes.length === 1 && treeNodes[0].type === 'product') {
              dispatch(setIsClearingTree(true));
              dispatch(setTreeNodes([]));
            }
            dispatch(markProductForDeletion({ id: itemId }));
          } else if (node.type === 'group') {
            // If this is the last group, clear the entire tree
            if (treeNodes.length === 1 && treeNodes[0].type === 'group') {
              dispatch(setIsClearingTree(true));
              dispatch(setTreeNodes([]));
            }
            dispatch(markGroupForDeletion(itemId));
          }
        });
      } catch (error) {
        console.error('Failed to delete item:', error);
        throw error;
      }
    },
    [dispatch, treeNodes],
  );

  const handleEdit = useCallback((itemId: string) => {
  }, []);

  const handleAddGroup = useCallback(async () => {
    try {
      // const response = await pr.createGroup({
      //   name: '새 그룹',
      //   user_id: id,
      // });
      //
      // const newGroup: TreeNode = {
      //   id: response.data.id.toString(),
      //   title: response.data.name,
      //   type: 'group',
      //   isOpen: false,
      //   children: [],
      //   hasMore: true,
      //   loading: false,
      //   page: 1,
      // };
      //
      // dispatch(addTreeNode({ id: newGroup.id, title: newGroup.title || '새 그룹' }));
    } catch (error) {
      console.error('Failed to create group:', error);
      const newGroupId = `group-${Date.now()}`;
      dispatch(addTreeNode({ id: newGroupId, title: '새 그룹', titleType: 'left' }));
    }
  }, [dispatch, id]);

  // Enhanced move handler with error handling
  const handleMoveNode = useCallback(
    (activeId: string, overId: string, isGroup: boolean, targetType?: string): boolean => {
      try {
        dispatch(
          moveNodeInTree({
            activeId: activeId.toString(),
            overId: overId.toString(),
            isGroup,
            targetType: targetType as 'group' | 'product',
          }),
        );

        return true;
      } catch (error) {
        console.error('Failed to move node:', error);
        return false;
      }
    },
    [dispatch, treeNodes], // Add treeNodes as dependency
  );

  // Auto load data
  // useEffect(() => {
  //   if (id && treeNodes.length === 0 && !isClearingTree) {
  //     console.log('initializeData', isClearingTree, treeNodes);
  //     initializeData();
  //   }
  //   // Reset the flag after the effect runs
  //   if (isClearingTree) {
  //     dispatch(setIsClearingTree(false));
  //   }
  // }, [id, treeNodes.length, initializeData, isClearingTree, dispatch]);

  // Global scroll handler for root products only
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        // Only load more root products when scrolled to bottom
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 300) {
          if (rootProductsHasMore && !isLoadingMore.current) {
            await loadMoreRootProducts();
          }
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [rootProductsHasMore, loadMoreRootProducts]);

  return {
    treeNodes,
    loading,
    handleToggle,
    handleLoadMore,
    handleDelete,
    handleEdit,
    handleAddGroup,
    handleMoveNode,
    loadMoreRootProducts,
    initializeData,
    updateNodeCollapsedStates,
    setTreeNodes: (nodes: TreeNode[]) => dispatch(setTreeNodes(nodes)),
  };
}
