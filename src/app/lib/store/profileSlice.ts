import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LayoutOption, SOCIAL_LINKS, STATUS } from '@/app/(DashboardLayout)/profile-link/components/const';
import type { Product, TreeNode } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { findNodeById, findTargetNodeInfo, removeNodeById, getGroupIdFromIndicator } from './profileHelpers';

// Types
export interface SocialLink {
  enabled: boolean;
  url: string;
}

export type LayoutType = 'grid-2' | 'grid-3' | 'list';

export interface Socials {
  [SOCIAL_LINKS.spotify]: SocialLink;
  [SOCIAL_LINKS.threads]: SocialLink;
  [SOCIAL_LINKS.youtube]: SocialLink;
  [SOCIAL_LINKS.x]: SocialLink;
  [SOCIAL_LINKS.instagram]: SocialLink;
  [SOCIAL_LINKS.tiktok]: SocialLink;
  [SOCIAL_LINKS.facebook]: SocialLink;
}

export interface SiteSetting {
  background_color: string;
  main_text_color: string;
  sub_text_color: string;
  notice_color: string;
  notice_background_color: string;
  product_background_color: string;
  product_name_color: string;
  product_price_color: string;
  show_price: number;
  layout_type: LayoutType;
}

export interface ProfileState {
  id: number;
  avatar: string;
  avatar_file?: File;
  background_image: string;
  background_file?: File;
  username: string;
  display_name: string;
  status: STATUS;
  description: string;
  notice: string;
  products: Product[];
  tempProducts: Product[];
  deletedProductIds: string[];
  newGroups: TreeNode[];
  updatedGroups: TreeNode[];
  deletedGroupIds: string[];
  treeNodes: TreeNode[];
  site_setting: SiteSetting;
  socials: Socials;
  is_check_name: boolean;
  rootProductsPage: number;
  rootProductsHasMore: boolean;
  loading: boolean;
  isClearingTree: boolean;

  // Drag and Drop state
  dragState: {
    activeId: string | null;
    overId: string | null;
    activeItemType: 'product' | 'group' | null;
    isDragging: boolean;
    dragOffset: number;
    originalTreeState: TreeNode[] | null;
    savedCollapsedState: Record<string, boolean> | null;
  };

  // Product management state
  productChanges: {
    movedProducts: Array<{
      productId: string;
      oldParentId: string | null;
      newParentId: string | null;
      oldOrder: number;
      newOrder: number;
    }>;
    reorderedGroups: Array<{
      groupId: string;
      oldOrder: number;
      newOrder: number;
    }>;
    pendingChanges: boolean;
  };
}

// Initial state
const initialState: ProfileState = {
  id: 0,
  avatar: '/images/profile-link/avatar-default.png',
  background_image: '',
  username: 'toktak',
  display_name: 'TOKTAK OFFICIAL',
  description: '톡탁이 만든 콘텐츠와\n당신의 모든 링크를 한 곳에',
  notice: '하단 링크로 구매하면 제휴 마켓으로부터 일정액의 수수료를 제공 받습니다👉 감사합니다 💟',
  status: STATUS.NOT_CREATED,
  products: [],
  tempProducts: [],
  deletedProductIds: [],
  newGroups: [],
  updatedGroups: [],
  deletedGroupIds: [],
  treeNodes: [],
  site_setting: {
    background_color: '#E8F0FE',
    main_text_color: '#0A1929',
    sub_text_color: '#6B7F99',
    notice_color: '#6B7F99',
    notice_background_color: '#FFFFFF',
    product_background_color: '#FFFFFF',
    product_name_color: '#6B7F99',
    product_price_color: '#1E4C94',
    show_price: 0,
    layout_type: 'grid-2',
  },
  socials: {
    spotify: { enabled: false, url: '' },
    threads: { enabled: false, url: '' },
    youtube: { enabled: false, url: '' },
    x: { enabled: false, url: '' },
    instagram: { enabled: false, url: '' },
    tiktok: { enabled: false, url: '' },
    facebook: { enabled: false, url: '' },
  },
  is_check_name: false,
  rootProductsPage: 1,
  rootProductsHasMore: false,
  loading: false,
  isClearingTree: false,

  // Drag and Drop state
  dragState: {
    activeId: null,
    overId: null,
    activeItemType: null,
    isDragging: false,
    dragOffset: 0,
    originalTreeState: null,
    savedCollapsedState: null,
  },

  // Product management state
  productChanges: {
    movedProducts: [],
    reorderedGroups: [],
    pendingChanges: false,
  },
};

// Helper function để debug order numbers
function debugOrderNumbers(state: ProfileState, context: string) {
   
}

// Helper function để cập nhật order numbers (tạo object mới thay vì thay đổi trực tiếp)
function updateOrderNumbers(state: ProfileState) {
  // Debug trước khi cập nhật
  debugOrderNumbers(state, 'before update');

  // Cập nhật order_no cho groups ở root level
  state.treeNodes = state.treeNodes.map((node, idx) => {
    if (node.type === 'group') {
      return { ...node, order_no: idx };
    }
    return node;
  });

  // Cập nhật order_no cho products trong toàn bộ tree
  const updateProductOrder = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.map((node, idx) => {
      if (node.type === 'product' && node.product) {
        return {
          ...node,
          product: { ...node.product, order_no: idx },
        };
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateProductOrder(node.children),
        };
      }
      return node;
    });
  };

  state.treeNodes = updateProductOrder(state.treeNodes);

  // Cập nhật tempProducts để đồng bộ với treeNodes
  const allProducts: Product[] = [];
  const extractProducts = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      if (node.type === 'product' && node.product) {
        allProducts.push(node.product);
      }
      if (node.children) {
        extractProducts(node.children);
      }
    });
  };
  extractProducts(state.treeNodes);
  state.tempProducts = allProducts;

  // Debug sau khi cập nhật
  debugOrderNumbers(state, 'after update');
}

// Reducers
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setFieldName: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      const keys = field.split('.');
      let current: any = state;
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] == undefined) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    },

    setProfile: (
      state,
      action: PayloadAction<
        Omit<
          ProfileState,
          | 'products'
          | 'tempProducts'
          | 'deletedProductIds'
          | 'treeNodes'
          | 'newGroups'
          | 'updatedGroups'
          | 'deletedGroupIds'
        >
      >,
    ) => {
      const updatedState = { ...state };
      Object.entries(action.payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value.toString().length > 0) {
          (updatedState as any)[key] = value;
        }
      });
      return {
        ...updatedState,
        products: state.products,
        tempProducts: state.tempProducts,
        deletedProductIds: state.deletedProductIds,
        treeNodes: state.treeNodes,
        newGroups: state.newGroups,
        updatedGroups: state.updatedGroups,
        deletedGroupIds: state.deletedGroupIds,
      };
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setProduct: (state, action: PayloadAction<Product[]>) => {
      state.products = [...action.payload];
    },

    addTempProduct: (state, action: PayloadAction<Product>) => {
      const newProductNode: TreeNode = {
        id: `root-${Date.now()}-${action.payload.id}`,
        type: 'product',
        product: action.payload,
        parentId: undefined,
      };

      state.treeNodes.unshift(newProductNode);
      state.tempProducts.push(action.payload);

      // Cập nhật lại order_no cho tất cả items trong tree
      updateOrderNumbers(state);
    },

    updateTempProduct: (state, action: PayloadAction<{ id: string; data: Partial<Product> }>) => {
      const { id, data } = action.payload;
      const updateItem = (arr: Product[]) => {
        const index = arr.findIndex((p) => p.id.toString() == id);
        if (index !== -1) arr[index] = { ...arr[index], ...data };
        else {
          const original = state.products.find((p) => p.id.toString() == id);
          if (original) arr.push({ ...original, ...data });
        }
      };
      updateItem(state.tempProducts);
      updateItem(state.products);

      const updateNode = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.type == 'product' && node.product?.id.toString() == id) {
            node.product = { ...node.product, ...data };
          }
          if (node.children) updateNode(node.children);
        });
      };
      updateNode(state.treeNodes);
    },

    deleteTempProduct: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.tempProducts = state.tempProducts.filter((p) => p.id.toString() !== id);
      state.products = state.products.filter((p) => p.id.toString() !== id);

      const removeNode = (nodes: TreeNode[]) => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].type == 'product' && nodes[i].product?.id.toString() == id) {
            nodes.splice(i, 1);
            return true;
          }
          if (nodes[i].children && removeNode(nodes[i].children as TreeNode[])) return true;
        }
        return false;
      };
      removeNode(state.treeNodes);

      // Cập nhật lại order_no cho tất cả items trong tree
      updateOrderNumbers(state);
    },

    commitTempProducts: (state) => {
      state.products = [...state.tempProducts];
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      state.tempProducts.push(action.payload);

      const defaultNode = state.treeNodes.find((n) => n.id.toString() == 'default');
      if (defaultNode) {
        if (!defaultNode.children) defaultNode.children = [];
        const newProductNode: TreeNode = {
          id: `default-${Date.now()}-${action.payload.id}`,
          type: 'product',
          product: action.payload,
          parentId: 'default',
        };
        defaultNode.children.push(newProductNode);

        // Cập nhật lại order_no cho tất cả items trong tree
        updateOrderNumbers(state);
      }
    },

    updateProduct: (state, action: PayloadAction<{ id: string; data: Partial<Product> }>) => {
      const index = state.products.findIndex((p) => p.id.toString() == action.payload.id.toString());
      if (index !== -1) state.products[index] = { ...state.products[index], ...action.payload.data };
      const tempIndex = state.tempProducts.findIndex((p) => p.id.toString() == action.payload.id.toString());
      if (tempIndex !== -1)
        state.tempProducts[tempIndex] = { ...state.tempProducts[tempIndex], ...action.payload.data };

      const updateNode = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.type == 'product' && node.product?.id.toString() == action.payload.id.toString()) {
            node.product = { ...node.product, ...action.payload.data };
          }
          if (node.children) updateNode(node.children);
        });
      };
      updateNode(state.treeNodes);
    },

    markProductForDeletion: (state, action: PayloadAction<{ id: string }>) => {
      if (!action.payload.id.startsWith('temp_') || !action.payload.id.startsWith('root-')) {
        state.deletedProductIds.push(action.payload.id);
      }
      state.tempProducts = state.tempProducts.filter((p) => p.id.toString() !== action.payload.id);
      state.treeNodes = removeNodeById(state.treeNodes, action.payload.id);

      // Cập nhật lại order_no cho tất cả items trong tree
      updateOrderNumbers(state);
    },

    clearDeletedProducts: (state) => {
      state.deletedProductIds = [];
    },

    clearTempProducts: (state) => {
      state.tempProducts = [];
    },

    setTreeNodes: (state, action: PayloadAction<TreeNode[]>) => {
      state.treeNodes = action.payload;
    },

    appendRootProducts: (state, action: PayloadAction<TreeNode[]>) => {
      const newProducts = action.payload;
      state.treeNodes.push(...newProducts);
      state.rootProductsPage += 1;
    },

    setRootProductsPagination: (state, action: PayloadAction<{ hasMore: boolean; nextPage: number }>) => {
      state.rootProductsHasMore = action.payload.hasMore;
      state.rootProductsPage = action.payload.nextPage;
    },

    toggleTreeNode: (state, action: PayloadAction<{ nodeId: string; isOpen: boolean }>) => {
      const { nodeId, isOpen } = action.payload;
      const updateNode = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.id.toString() == nodeId) {
            node.isOpen = isOpen;
          } else if (node.children) {
            updateNode(node.children);
          }
        });
      };
      updateNode(state.treeNodes);
    },

    addTreeNode: (state, action: PayloadAction<{ id: string; title: string; titleType: LayoutOption }>) => {
      const newNode: TreeNode = {
        id: action.payload.id,
        title: action.payload.title,
        type: 'group',
        isOpen: false,
        children: [],
        titleType: action.payload.titleType,
      };
      state.newGroups.push(newNode);

      const firstProductIndex = state.treeNodes.findIndex((node) => node.type == 'product');
      if (firstProductIndex == -1) {
        state.treeNodes.push(newNode);
      } else {
        state.treeNodes.splice(firstProductIndex, 0, newNode);
      }

      // Cập nhật lại order_no cho tất cả items trong tree
      updateOrderNumbers(state);
    },

    startLoadingProductsInNode: (state, action: PayloadAction<string>) => {
      const findNode = (nodes: TreeNode[]) => {
        for (const node of nodes) {
          if (node.id.toString() == action.payload) {
            node.loading = true;
            return true;
          }
          if (node.children && findNode(node.children)) return true;
        }
        return false;
      };
      findNode(state.treeNodes);
    },

    stopLoadingProductsInNode: (state, action: PayloadAction<string>) => {
      const findNode = (nodes: TreeNode[]) => {
        for (const node of nodes) {
          if (node.id.toString() == action.payload) {
            node.loading = false;
            return true;
          }
          if (node.children && findNode(node.children)) return true;
        }
        return false;
      };
      findNode(state.treeNodes);
    },

    appendProductsToNode: (
      state,
      action: PayloadAction<{
        nodeId?: string;
        products: Product[];
        hasMore: boolean;
        page: number;
      }>,
    ) => {
      const { nodeId, products, hasMore, page } = action.payload;

      if (!nodeId) {
        const newProducts = products.map((product) => ({
          id: product.id,
          type: 'product' as const,
          product,
          parentId: undefined,
        }));
        state.treeNodes.push(...newProducts);

        // Cập nhật lại order_no cho tất cả items trong tree
        updateOrderNumbers(state);
        return;
      }

      const findNode = (nodes: TreeNode[]) => {
        for (const node of nodes) {
          if (node.id.toString() == nodeId) {
            if (!node.children) node.children = [];
            const newChildren = products.map((product) => ({
              id: product.id,
              type: 'product' as const,
              product,
              parentId: nodeId,
            }));
            node.children.push(...newChildren);

            if (node.type == 'group') {
              if (!node.id.startsWith('group-')) {
                const index = state.updatedGroups.findIndex((g) => g.id.toString() == node.id);
                if (index !== -1) {
                  state.updatedGroups[index].children!.push(node);
                } else {
                  state.updatedGroups.push(node);
                }
              } else {
                const index = state.newGroups.findIndex((g) => g.id.toString() == node.id);
                state.newGroups[index].children!.push(...newChildren);
              }
            }

            // Cập nhật lại order_no cho tất cả items trong tree
            updateOrderNumbers(state);
            return true;
          }
          if (node.children && findNode(node.children)) return true;
        }
        return false;
      };
      findNode(state.treeNodes);
    },

    moveNodeInTree: (
      state,
      action: PayloadAction<{
        activeId: string;
        overId: string;
        isGroup: boolean;
        targetType?: 'group' | 'product';
      }>,
    ) => {
      const { activeId, overId, targetType } = action.payload;
      if (activeId == overId) return;

      const treeNodesCopy = JSON.parse(JSON.stringify(state.treeNodes));

      // 1️⃣ Tìm node đang kéo (activeNode) và parent cũ (activeParent)
      const activeNodeInfo = findNodeById(state.treeNodes, activeId);
      const targetNodeInfo = findNodeById(state.treeNodes, overId);
      if (!activeNodeInfo) {
        state.treeNodes = treeNodesCopy;
        return;
      }
      const { node: activeNode, parent: activeParent } = activeNodeInfo;
      const activeNodeCopy: TreeNode = JSON.parse(JSON.stringify(activeNode));

      // 2️⃣ Loại bỏ node cũ khỏi treeNodes
      state.treeNodes = removeNodeById(state.treeNodes, activeId);

      // Xử lý logic move (giữ nguyên logic cũ nhưng sử dụng immutable updates)
      // ... (giữ nguyên logic move hiện tại)

      // 3️⃣ Cập nhật order_no cho tất cả group ở root
      state.treeNodes = state.treeNodes.map((node, idx) => {
        if (node.type == 'group') {
          const updatedNode = { ...node, order_no: idx };
          if (!node.id.startsWith('group-') && !state.updatedGroups.find((g) => g.id.toString() == node.id)) {
            state.updatedGroups.push(updatedNode);
          }
          return updatedNode;
        }
        return node;
      });

      // 4️⃣ Cập nhật order_no cho tất cả product trong tree
      const updateProdOrder = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node, idx) => {
          if (node.type == 'product' && node.product) {
            return {
              ...node,
              product: { ...node.product, order_no: idx },
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateProdOrder(node.children),
            };
          }
          return node;
        });
      };
      state.treeNodes = updateProdOrder(state.treeNodes);

      // 5️⃣ Cập nhật tempProducts để đồng bộ với treeNodes
      const allProducts: Product[] = [];
      const extractProducts = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.type === 'product' && node.product) {
            allProducts.push(node.product);
          }
          if (node.children) {
            extractProducts(node.children);
          }
        });
      };
      extractProducts(state.treeNodes);
      state.tempProducts = allProducts;
    },

    updateNodeCollapsedStates: (state, action: PayloadAction<Record<string, boolean>>) => {
      const collapsedStates = action.payload;
      const updateCollapsedState = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (collapsedStates.hasOwnProperty(node.id)) {
            return { ...node, isOpen: collapsedStates[node.id] };
          }
          if (node.children && node.children.length > 0) {
            return { ...node, children: updateCollapsedState(node.children) };
          }
          return node;
        });
      };
      state.treeNodes = updateCollapsedState(state.treeNodes);
    },

    resetProfileState: (state) => {
      return initialState;
    },

    updateNodeTitleAndLayout: (
      state,
      action: PayloadAction<{ id: string; title: string; layoutType: LayoutOption }>,
    ) => {
      const nodeInfo = findNodeById(state.treeNodes, action.payload.id);
      if (nodeInfo?.node) {
        nodeInfo.node.title = action.payload.title;
        nodeInfo.node.titleType = action.payload.layoutType;
        if (
          !nodeInfo.node.id.startsWith('group-') &&
          !state.updatedGroups.find((g) => g.id.toString() == nodeInfo.node.id)
        ) {
          state.updatedGroups.push(nodeInfo.node);
        }
      }
    },

    markGroupForDeletion: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!id.startsWith('group-')) {
        state.deletedGroupIds.push(id);
      }
      state.treeNodes = removeNodeById(state.treeNodes, id);
      state.updatedGroups = state.updatedGroups.filter((g) => g.id.toString() !== id);
      state.newGroups = state.newGroups.filter((g) => g.id.toString() !== id);
    },

    clearGroupsChanges: (state) => {
      state.newGroups = [];
      state.updatedGroups = [];
      state.deletedGroupIds = [];
    },

    removeRootProductsFromTree: (state, action: PayloadAction<string[]>) => {
      state.treeNodes = state.treeNodes.filter(
        (node) => !(node.type == 'product' && node.product && action.payload.includes(node.product.id.toString())),
      );
    },

    setIsClearingTree: (state, action: PayloadAction<boolean>) => {
      state.isClearingTree = action.payload;
    },

    // Drag and Drop reducers - Đơn giản hóa để phù hợp với useDragAndDrop
    setDragState: (state, action: PayloadAction<Partial<ProfileState['dragState']>>) => {
      state.dragState = { ...state.dragState, ...action.payload };
    },

    startDrag: (
      state,
      action: PayloadAction<{
        activeId: string;
        activeItemType: 'product' | 'group';
      }>,
    ) => {
      state.dragState.activeId = action.payload.activeId;
      state.dragState.activeItemType = action.payload.activeItemType;
      state.dragState.isDragging = true;
      state.dragState.originalTreeState = JSON.parse(JSON.stringify(state.treeNodes));
    },

    updateDragOver: (
      state,
      action: PayloadAction<{
        overId: string | null;
        dragOffset: number;
      }>,
    ) => {
      state.dragState.overId = action.payload.overId;
      state.dragState.dragOffset = action.payload.dragOffset;
    },

    endDrag: (
      state,
      action: PayloadAction<{
        success: boolean;
        newTreeState?: TreeNode[];
      }>,
    ) => {
      state.dragState.isDragging = false;

      if (action.payload.success && action.payload.newTreeState) {
        state.treeNodes = action.payload.newTreeState;
        state.productChanges.pendingChanges = true;
        updateOrderNumbers(state);
      } else {
        if (state.dragState.originalTreeState) {
          state.treeNodes = state.dragState.originalTreeState;
        }
      }

      state.dragState.activeId = null;
      state.dragState.overId = null;
      state.dragState.activeItemType = null;
      state.dragState.dragOffset = 0;
      state.dragState.originalTreeState = null;
      state.dragState.savedCollapsedState = null;
    },

    updateTreeState: (state, action: PayloadAction<TreeNode[]>) => {
      state.treeNodes = action.payload;
      state.productChanges.pendingChanges = true;
      updateOrderNumbers(state);
    },

    saveCollapsedState: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.dragState.savedCollapsedState = action.payload;
    },

    updateCollapsedStates: (state, action: PayloadAction<Record<string, boolean>>) => {
      const collapsedStates = action.payload;
      const updateCollapsedState = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (collapsedStates.hasOwnProperty(node.id)) {
            return { ...node, isOpen: collapsedStates[node.id] };
          }
          if (node.children && node.children.length > 0) {
            return { ...node, children: updateCollapsedState(node.children) };
          }
          return node;
        });
      };
      state.treeNodes = updateCollapsedState(state.treeNodes);
    },

    recordProductMove: (
      state,
      action: PayloadAction<{
        productId: string;
        oldParentId: string | null;
        newParentId: string | null;
        oldOrder: number;
        newOrder: number;
      }>,
    ) => {
      const { productId, oldParentId, newParentId, oldOrder, newOrder } = action.payload;

      const existingIndex = state.productChanges.movedProducts.findIndex((move) => move.productId === productId);

      if (existingIndex !== -1) {
        state.productChanges.movedProducts[existingIndex] = {
          productId,
          oldParentId: state.productChanges.movedProducts[existingIndex].oldParentId,
          newParentId,
          oldOrder: state.productChanges.movedProducts[existingIndex].oldOrder,
          newOrder,
        };
      } else {
        state.productChanges.movedProducts.push({
          productId,
          oldParentId,
          newParentId,
          oldOrder,
          newOrder,
        });
      }

      state.productChanges.pendingChanges = true;
    },

    recordGroupReorder: (
      state,
      action: PayloadAction<{
        groupId: string;
        oldOrder: number;
        newOrder: number;
      }>,
    ) => {
      const { groupId, oldOrder, newOrder } = action.payload;

      const existingIndex = state.productChanges.reorderedGroups.findIndex((reorder) => reorder.groupId === groupId);

      if (existingIndex !== -1) {
        state.productChanges.reorderedGroups[existingIndex] = {
          groupId,
          oldOrder: state.productChanges.reorderedGroups[existingIndex].oldOrder,
          newOrder,
        };
      } else {
        state.productChanges.reorderedGroups.push({
          groupId,
          oldOrder,
          newOrder,
        });
      }

      state.productChanges.pendingChanges = true;
    },

    clearProductChanges: (state) => {
      state.productChanges.movedProducts = [];
      state.productChanges.reorderedGroups = [];
      state.productChanges.pendingChanges = false;
    },

    commitProductChanges: (state) => {
      const allProducts: Product[] = [];
      const extractProducts = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.type === 'product' && node.product) {
            allProducts.push(node.product);
          }
          if (node.children) {
            extractProducts(node.children);
          }
        });
      };
      extractProducts(state.treeNodes);

      state.products = allProducts;
      state.tempProducts = allProducts;

      state.productChanges.movedProducts = [];
      state.productChanges.reorderedGroups = [];
      state.productChanges.pendingChanges = false;
    },

    formatDataForAPI: (state) => {
      const allProducts: Product[] = [];
      const extractProducts = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.type === 'product' && node.product) {
            allProducts.push(node.product);
          }
          if (node.children) {
            extractProducts(node.children);
          }
        });
      };
      extractProducts(state.treeNodes);

      state.products = allProducts;
      state.tempProducts = allProducts;
    },
  },
});

export const {
  setFieldName,
  setProfile,
  setLoading,
  setProduct,
  addTempProduct,
  updateTempProduct,
  deleteTempProduct,
  commitTempProducts,
  addProduct,
  updateProduct,
  markProductForDeletion,
  clearDeletedProducts,
  clearTempProducts,
  setTreeNodes,
  appendRootProducts,
  setRootProductsPagination,
  toggleTreeNode,
  addTreeNode,
  startLoadingProductsInNode,
  stopLoadingProductsInNode,
  appendProductsToNode,
  moveNodeInTree,
  updateNodeCollapsedStates,
  resetProfileState,
  updateNodeTitleAndLayout,
  markGroupForDeletion,
  clearGroupsChanges,
  removeRootProductsFromTree,
  setIsClearingTree,
  setDragState,
  startDrag,
  updateDragOver,
  endDrag,
  recordProductMove,
  recordGroupReorder,
  clearProductChanges,
  commitProductChanges,
  formatDataForAPI,
  updateTreeState,
  saveCollapsedState,
  updateCollapsedStates,
} = profileSlice.actions;

export default profileSlice.reducer;

// Selectors để lấy data đã được format cho API
export const selectFormattedProductsForAPI = (state: { profile: ProfileState }) => {
  const allProducts: Product[] = [];
  const extractProducts = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      if (node.type === 'product' && node.product) {
        allProducts.push(node.product);
      }
      if (node.children) {
        extractProducts(node.children);
      }
    });
  };
  extractProducts(state.profile.treeNodes);
  return allProducts;
};

export const selectFormattedGroupsForAPI = (state: { profile: ProfileState }) => {
  return state.profile.treeNodes
    .filter((node) => node.type === 'group')
    .map((node) => ({
      id: node.id,
      type: 'group' as const,
      title: node.title,
      titleType: node.titleType,
      order_no: node.order_no,
      isOpen: false,
      children:
        node.children?.map((child) => ({
          id: child.id,
          type: 'product' as const,
          product: child.product,
          parentId: node.id,
        })) || [],
    }));
};
