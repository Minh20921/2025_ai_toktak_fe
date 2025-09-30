# Profile Link Drag and Drop System

## Overview

This system implements a hierarchical drag and drop interface for managing products and groups in profile links.

## Constraints

### Groups

- **Root Level Only**: Groups can only be placed at the root level (depth = 0)
- **Cannot be nested**: Groups cannot be placed inside other groups or products
- **Can contain products**: Groups can contain multiple products
- **Children preservation**: When dragging a group, all its children move together

### Products

- **Flexible placement**: Products can be placed at root level or inside groups
- **Cannot contain other items**: Products cannot contain groups or other products
- **Can be moved between groups**: Products can be moved from one group to another

## Key Components

### `dndKitUtils.ts`

Contains the core logic for:

- `flattenTreeForDndKit()`: Converts tree structure to flat array for DND Kit
- `buildTreeFromFlattened()`: Rebuilds tree structure from flat array
- `getProjection()`: Calculates drop position and depth
- `isValidDropOperation()`: Validates if a drop operation is allowed
- `removeChildrenOf()`: Removes children based on item type (preserves group children when dragging groups)
- `moveGroupWithChildrenToPosition()`: **NEW** - Properly moves a group with all its children to a new position

### `useDragAndDrop.ts`

Custom hook that manages:

- Drag state (activeId, overId, offsetLeft, activeItemType)
- Drag event handlers
- Validation logic
- Tree state management
- Group children preservation during drag operations

### `SortableTreeItem.tsx`

Renders individual items with:

- Visual feedback for invalid drops
- Drag handles
- Collapse/expand functionality
- Action buttons (edit, delete)

## Usage

```tsx
const {
  activeId,
  overId,
  projected,
  items,
  activeItemType,
  handleDragStart,
  handleDragMove,
  handleDragOver,
  handleDragEnd,
  handleDragCancel,
  isInvalidDrop,
} = useDragAndDrop({
  treeNodes,
  onTreeChange: setTreeNodes,
  onCollapseAllGroups: collapseAllGroups,
  onSaveCollapsedState: saveCollapsedState,
  onUpdateCollapsedStates: updateNodeCollapsedStates,
});
```

## Visual Feedback

### Invalid Drop Operations

- Red background and border for invalid drop targets
- Warning message appears when hovering over invalid targets
- Drop operation is prevented for invalid combinations

### Valid Drop Operations

- Normal styling for valid drop targets
- Smooth animations during drag operations
- Clear visual indicators for drop zones

## Error Handling

- Invalid drops are prevented and no changes are applied
- Original tree state is restored if drag operation fails
- Collapse states are preserved during drag operations

## Group Dragging Behavior

### **Problem Solved**

- **Issue**: When dragging a group, children were lost because `arrayMove` only moved the group item
- **Solution**: New `moveGroupWithChildrenToPosition()` function that:
  1. Finds all children of the group
  2. Extracts group + children as a unit
  3. Removes them from their current positions
  4. Inserts them at the new position
  5. Updates depths and parentIds correctly

### **How it works**

```typescript
// 1. Find group and all its children
const groupIndex = clonedItems.findIndex((item) => item.id === groupId);
const groupChildren = clonedItems.filter((item) => item.parentId === groupId);

// 2. Get all indices of group items (group + children)
const groupItemIndices = [groupIndex, ...childrenIndices];

// 3. Extract group items in order
const itemsToMove = groupItemIndices.map((index) => clonedItems[index]);

// 4. Remove from current positions and insert at new position
const remainingItems = clonedItems.filter((_, index) => !groupItemIndices.includes(index));
const finalItems = [...remainingItems.slice(0, newPosition), ...itemsToMove, ...remainingItems.slice(newPosition)];
```

### **Key Features**

- **Children preservation**: All children move together with the group
- **Depth maintenance**: Children depth is automatically adjusted
- **Parent relationship**: Parent-child relationships are preserved
- **Order preservation**: Children maintain their relative order within the group

## Recent Fixes

### **Group Children Loss Issue**

- **Problem**: `buildTreeFromFlattened` couldn't find children after group drag
- **Root Cause**: `arrayMove` only moved the group, not its children
- **Solution**: Custom group movement function that preserves the entire group structure
- **Result**: Groups now maintain all their children when dragged
