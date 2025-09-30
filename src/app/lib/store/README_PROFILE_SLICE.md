# Profile Slice - Drag and Drop Integration

## Tổng quan

ProfileSlice đã được cập nhật để hỗ trợ tích hợp với useDragAndDrop hook, cho phép quản lý state của drag and drop operations và theo dõi các thay đổi của products.

## Các biến state mới

### 1. Drag and Drop State (`dragState`)

```typescript
dragState: {
  activeId: string | null;           // ID của item đang được kéo
  overId: string | null;             // ID của item đang hover
  activeItemType: 'product' | 'group' | null; // Loại item đang kéo
  isDragging: boolean;               // Trạng thái đang kéo
  dragOffset: number;                // Offset của drag operation
  originalTreeState: TreeNode[] | null; // Backup của tree state gốc
  savedCollapsedState: Record<string, boolean> | null; // Backup của collapsed state
}
```

### 2. Product Changes State (`productChanges`)

```typescript
productChanges: {
  movedProducts: Array<{
    // Danh sách products đã di chuyển
    productId: string;
    oldParentId: string | null;
    newParentId: string | null;
    oldOrder: number;
    newOrder: number;
  }>;
  reorderedGroups: Array<{
    // Danh sách groups đã reorder
    groupId: string;
    oldOrder: number;
    newOrder: number;
  }>;
  pendingChanges: boolean; // Có thay đổi chưa commit
}
```

## Các Actions mới

### Drag and Drop Actions

#### `startDrag`

Bắt đầu drag operation:

```typescript
dispatch(
  startDrag({
    activeId: 'product-123',
    activeItemType: 'product',
    originalTreeState: [...currentTree],
    savedCollapsedState: { 'group-1': true },
  }),
);
```

#### `updateDragOver`

Cập nhật trạng thái drag over:

```typescript
dispatch(
  updateDragOver({
    overId: 'group-1',
    dragOffset: 20,
  }),
);
```

#### `endDrag`

Kết thúc drag operation:

```typescript
dispatch(
  endDrag({
    success: true,
    newTreeState: [...newTree],
  }),
);
```

### Product Changes Actions

#### `recordProductMove`

Ghi lại việc di chuyển product:

```typescript
dispatch(
  recordProductMove({
    productId: 'product-123',
    oldParentId: null,
    newParentId: 'group-1',
    oldOrder: 0,
    newOrder: 2,
  }),
);
```

#### `recordGroupReorder`

Ghi lại việc reorder group:

```typescript
dispatch(
  recordGroupReorder({
    groupId: 'group-1',
    oldOrder: 0,
    newOrder: 1,
  }),
);
```

#### `commitProductChanges`

Commit tất cả thay đổi:

```typescript
dispatch(commitProductChanges());
```

#### `clearProductChanges`

Xóa tất cả thay đổi chưa commit:

```typescript
dispatch(clearProductChanges());
```

#### `formatDataForAPI`

Format data cho API mà không thay đổi cấu trúc hiện tại:

```typescript
dispatch(formatDataForAPI());
```

#### `updateTreeState`

Cập nhật tree state trực tiếp (được gọi từ useDragAndDrop):

```typescript
dispatch(updateTreeState(newTreeNodes));
```

#### `saveCollapsedState`

Lưu trạng thái collapsed:

```typescript
dispatch(saveCollapsedState(collapsedState));
```

#### `updateCollapsedStates`

Cập nhật trạng thái collapsed:

```typescript
dispatch(updateCollapsedStates(collapsedState));
```

## Selectors cho API

### `selectFormattedProductsForAPI`

Lấy danh sách products đã được format cho API:

```typescript
const formattedProducts = useSelector(selectFormattedProductsForAPI);
```

### `selectFormattedGroupsForAPI`

Lấy danh sách groups đã được format cho API:

```typescript
const formattedGroups = useSelector(selectFormattedGroupsForAPI);
```

## Cách sử dụng với useDragAndDrop

### 1. Sử dụng hook tích hợp sẵn (Khuyến nghị)

```typescript
import { useDragAndDropWithRedux } from '@/app/(DashboardLayout)/profile-link/components/hooks/useDragAndDropWithRedux';

export function ProductManager() {
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
    // Thêm các tính năng từ Redux
    dragState,
    productChanges,
    formattedProductsForAPI,
    formattedGroupsForAPI,
  } = useDragAndDropWithRedux();

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Component content */}
    </DndContext>
  );
}
```

### 2. Sử dụng useDragAndDrop trực tiếp với Redux

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { useDragAndDrop } from './useDragAndDrop';
import {
  startDrag,
  updateDragOver,
  endDrag,
  updateTreeState,
  selectFormattedProductsForAPI,
  selectFormattedGroupsForAPI
} from '@/app/lib/store/profileSlice';

export function ProductManager() {
  const dispatch = useDispatch();
  const { treeNodes, dragState, productChanges } = useSelector((state) => state.profile);

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
    onTreeChange: (newTree) => {
      // Cập nhật tree state
      dispatch(updateTreeState(newTree));
    },
    onCollapseAllGroups: collapseAllGroups,
    onSaveCollapsedState: saveCollapsedState,
    onUpdateCollapsedStates: updateNodeCollapsedStates,
  });

  // Tùy chỉnh handleDragStart để dispatch Redux actions
  const customHandleDragStart = (event) => {
    handleDragStart(event);

    // Dispatch Redux action
    dispatch(startDrag({
      activeId: event.active.id.toString(),
      activeItemType: activeItemType,
    }));
  };

  // Tùy chỉnh handleDragOver
  const customHandleDragOver = (event) => {
    handleDragOver(event);

    dispatch(updateDragOver({
      overId: event.over?.id?.toString() || null,
      dragOffset: 0
    }));
  };

  // Tùy chỉnh handleDragEnd
  const customHandleDragEnd = (event) => {
    const result = handleDragEnd(event);

    if (result.success) {
      dispatch(endDrag({
        success: true,
        newTreeState: treeNodes
      }));
    } else {
      dispatch(endDrag({ success: false }));
    }
  };

  return (
    <DndContext
      onDragStart={customHandleDragStart}
      onDragOver={customHandleDragOver}
      onDragEnd={customHandleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Component content */}
    </DndContext>
  );
}
```

### 2. Kiểm tra trạng thái thay đổi:

```typescript
const { productChanges } = useSelector((state) => state.profile);

// Kiểm tra có thay đổi chưa commit
if (productChanges.pendingChanges) {
  console.log('Có thay đổi chưa commit:', {
    movedProducts: productChanges.movedProducts,
    reorderedGroups: productChanges.reorderedGroups,
  });
}
```

### 3. Commit thay đổi khi save:

```typescript
const handleSave = async () => {
  try {
    // Sử dụng selectors để lấy data đã được format
    const formattedProducts = useSelector(selectFormattedProductsForAPI);
    const formattedGroups = useSelector(selectFormattedGroupsForAPI);

    // Gửi API với data đã được format (giống đầu vào cũ)
    if (formattedProducts.length > 0) {
      await productAPI.updateProductsMulti(formattedProducts);
    }

    if (formattedGroups.length > 0) {
      await productAPI.updateGroup(formattedGroups);
    }

    // Commit thay đổi trong Redux
    dispatch(commitProductChanges());

    // Clear changes
    dispatch(clearProductChanges());
  } catch (error) {
    console.error('Lỗi khi lưu:', error);
  }
};
```

### 4. Sử dụng trong component hiện tại (không thay đổi logic cũ):

```typescript
// Trong handleSave hiện tại, chỉ cần thêm formatDataForAPI trước khi lấy data
const handleSave = async () => {
  try {
    // Format data cho API
    dispatch(formatDataForAPI());

    // Logic hiện tại vẫn hoạt động bình thường
    if (isProductsChanged()) {
      const updatedProducts = profile.treeNodes
        .filter((node) => node.type === 'product')
        .map((node) => node.product)
        .filter(Boolean) as Product[];

      // API calls với data đã được format
      await productAPI.updateProductsMulti(updatedProducts);
    }

    if (isGroupsChanged()) {
      const updatedGroups = profile.treeNodes
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

      // API calls với data đã được format
      await productAPI.updateGroup(updatedGroups);
    }

    // Commit changes
    dispatch(commitProductChanges());
    dispatch(clearProductChanges());
  } catch (error) {
    console.error('Failed to save:', error);
  }
};
```

## Lợi ích của việc cập nhật

1. **Theo dõi thay đổi**: Có thể biết chính xác products nào đã được di chuyển và groups nào đã được reorder
2. **Undo/Redo**: Có thể implement tính năng undo/redo dựa trên `originalTreeState`
3. **Optimistic Updates**: Có thể cập nhật UI ngay lập tức và rollback nếu có lỗi
4. **Batch Operations**: Có thể gom nhóm nhiều thay đổi và commit cùng lúc
5. **State Persistence**: Có thể lưu trạng thái drag and drop để restore khi cần
6. **API Compatibility**: Không thay đổi đầu vào của các API hiện tại

## Tương thích với API hiện tại

### Không thay đổi đầu vào API

Các tính năng mới được thiết kế để **không thay đổi đầu vào của các API hiện tại**:

- **`productAPI.updateProductsMulti()`**: Vẫn nhận `Product[]` array như cũ
- **`productAPI.updateGroup()`**: Vẫn nhận group structure như cũ
- **`productAPI.createProduct()`**: Vẫn nhận `Product[]` array như cũ
- **`productAPI.deleteProduct()`**: Vẫn nhận `string[]` array như cũ

### Xử lý group_id khi kéo product

Khi kéo product từ group ra root, hệ thống sẽ tự động set `group_id = '0'`:

```typescript
// Khi product được kéo ra root level
if (nodeAtRoot.product) {
  nodeAtRoot.product.group_id = '0'; // Đánh dấu product ở root level
}
```

**Các trường hợp được xử lý:**

1. **drop-indicator-end**: Kéo product ra cuối danh sách root
2. **drop-indicator-before/after với targetParent = null**: Kéo product vào giữa danh sách root
3. **thả trực tiếp lên node không tồn tại**: Kéo product ra root
4. **Case 3: Move về root**: Di chuyển product từ group ra root

### Cách hoạt động

1. **Drag and Drop**: Thay đổi `treeNodes` trong Redux state
2. **Format Data**: Sử dụng `formatDataForAPI()` để sync `products` và `tempProducts` với `treeNodes`
3. **API Call**: Sử dụng data đã được format (giống đầu vào cũ)
4. **Commit**: Sau khi API thành công, commit changes

### Ví dụ tương thích

```typescript
// Trước khi có drag and drop
const products = profile.products; // Lấy từ products array
await productAPI.updateProductsMulti(products);

// Sau khi có drag and drop (vẫn tương thích)
dispatch(formatDataForAPI()); // Sync data
const products = profile.products; // Vẫn lấy từ products array (đã được sync)
await productAPI.updateProductsMulti(products); // API call không thay đổi
```

### Ví dụ xử lý group_id

```typescript
// Product ban đầu trong group
const product = {
  id: '123',
  product_name: 'Test Product',
  group_id: 'group-1', // Đang ở trong group
  order_no: 0,
};

// Sau khi kéo ra root
const productAfterDrag = {
  id: '123',
  product_name: 'Test Product',
  group_id: '0', // Tự động set = '0' khi ở root
  order_no: 2,
};

// API call vẫn giống như cũ
await productAPI.updateProductsMulti([productAfterDrag]);
```

## Lưu ý

- Luôn sử dụng `commitProductChanges()` sau khi save thành công
- Sử dụng `clearProductChanges()` khi cancel hoặc reset
- Kiểm tra `pendingChanges` trước khi cho phép user navigate away
- Backup `originalTreeState` trước khi bắt đầu drag operation
- **Quan trọng**: Sử dụng `formatDataForAPI()` trước khi gọi API để đảm bảo data được sync
- **Tương thích**: Tất cả API calls hiện tại vẫn hoạt động bình thường, không cần thay đổi code
- **group_id**: Tự động set `group_id = '0'` khi product được kéo ra root level
