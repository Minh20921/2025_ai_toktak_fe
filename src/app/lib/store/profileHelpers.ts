import type { TreeNode } from '@/app/(DashboardLayout)/profile-link/@type/interface';

export const findNodeById = (
  nodes: TreeNode[],
  id: string,
): { node: TreeNode; parent: TreeNode | null; index: number } | null => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return { node: nodes[i], parent: null, index: i };
    }
    if (nodes[i].children) {
      const result = findNodeById(nodes[i].children!, id);
      if (result) {
        return { ...result, parent: nodes[i] };
      }
    }
  }
  return null;
};

export const removeNodeById = (nodes: TreeNode[], id: string): TreeNode[] => {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: node.children ? removeNodeById(node.children, id) : undefined,
    }));
};

export const findTargetNodeInfo = (
  nodes: TreeNode[],
  targetId: string,
): { node: TreeNode; parent: TreeNode | null; index: number } | null => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id.toString() === targetId) {
      return { node: nodes[i], parent: null, index: i };
    }
    if (nodes[i].children) {
      for (let j = 0; j < nodes[i].children!.length; j++) {
        if (nodes[i].children![j].id.toString() === targetId) {
          return { node: nodes[i].children![j], parent: nodes[i], index: j };
        }
      }
      const result = findTargetNodeInfo(nodes[i].children!, targetId);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const getGroupIdFromIndicator = (indicatorId: string): string | null => {
  if (indicatorId.startsWith('drop-indicator-after-')) {
    return indicatorId.replace('drop-indicator-after-', '');
  }
  if (indicatorId.startsWith('drop-indicator-end-')) {
    return indicatorId.replace('drop-indicator-end-', '');
  }
  return null;
};
