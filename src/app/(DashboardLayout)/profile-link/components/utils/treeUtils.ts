import { FlatItem, TreeNode } from '@/app/(DashboardLayout)/profile-link/@type/interface';

export function saveCollapsedState(nodes: TreeNode[]): Record<string, boolean> {
  const collapsedState: Record<string, boolean> = {};

  function traverse(nodes: TreeNode[]) {
    nodes.forEach((node) => {
      if (node.type === 'group') {
        collapsedState[node.id] = !!node.isOpen;
        if (node.children) {
          traverse(node.children);
        }
      }
    });
  }

  traverse(nodes);
  return collapsedState;
}

export function collapseAllGroups(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((node) => {
    if (node.type === 'group') {
      return {
        ...node,
        isOpen: false,
        children: node.children ? collapseAllGroups(node.children) : undefined,
      };
    }
    return node;
  });
}

export function restoreCollapsedState(nodes: TreeNode[], collapsedState: Record<string, boolean>): TreeNode[] {
  return nodes.map((node) => {
    if (node.type === 'group' && node.id in collapsedState) {
      return {
        ...node,
        isOpen: collapsedState[node.id],
        children: node.children ? restoreCollapsedState(node.children, collapsedState) : undefined,
      };
    }
    return node;
  });
}

export function flattenTreeNodes(nodes: TreeNode[], parentId: string | null = null, depth = 0): FlatItem[] {
  const result: FlatItem[] = [];

  nodes.forEach((node, originalIndex) => {
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

    if (node.type === 'group' && node.isOpen && node.children && node.children.length > 0) {
      result.push(...flattenTreeNodes(node.children, node.id, depth + 1));
    }
  });

  return result;
}

export function findNodeInTree(nodes: TreeNode[], nodeId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      const found = findNodeInTree(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
}
