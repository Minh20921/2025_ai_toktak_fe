# Hướng dẫn sử dụng useDragAndDropWithRedux

## Tổng quan

`useDragAndDropWithRedux` là một hook wrapper cho `useDragAndDrop` gốc, giữ nguyên toàn bộ logic drag-and-drop ban đầu và chỉ thêm tính năng lưu trữ data vào Redux. Hook này **KHÔNG** thay đổi logic của `useDragAndDrop` ban đầu.

## Tính năng chính

### 1. **Giữ nguyên logic gốc**

- Không can thiệp vào logic drag-and-drop của `useDragAndDrop`
- Tất cả các props và handlers hoạt động như bình thường

### 2. **Tự động track thay đổi group_id**

- Tự động phát hiện khi product được di chuyển giữa các groups
- Lưu thay đổi `group_id` vào Redux store
- Track cả `oldGroupId` và `newGroupId` để có thể undo/redo

### 3. **Lưu trữ vào Redux**

- Tự động lưu trạng thái tree vào Redux
- Cung cấp data đã format cho API calls
- Quản lý pending changes

## Cách sử dụng cơ bản

### 1. Import hook

```typescript
import { useDragAndDropWithRedux } from '@/app/(DashboardLayout)/profile-link/components/hooks/useDragAndDropWithRedux';
```

### 2. Sử dụng trong component

```typescript
function MyComponent() {
  const {
    // Tất cả các props từ useDragAndDrop gốc
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
    commitChanges,
    clearChanges,
  } = useDragAndDropWithRedux({
    treeNodes,
    onTreeChange: setTreeNodes,
    onCollapseAllGroups: collapseAllGroups,
    onSaveCollapsedState: saveCollapsedState,
    onUpdateCollapsedStates: updateNodeCollapsedStates,
  });

  // ... rest of component
}
```

### 3. Setup DndContext (giống hệt useDragAndDrop gốc)

```typescript
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function MyComponent() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {/* Your sortable items */}
      </SortableContext>
    </DndContext>
  );
}
```

## Các tính năng bổ sung từ Redux

### 1. Drag State Management

```typescript
const { dragState } = useDragAndDropWithRedux(props);

// dragState.isDragging - boolean, true khi đang drag
// dragState.activeId - ID của item đang được drag
// dragState.overId - ID của item đang được hover
```

### 2. Product Changes Tracking (bao gồm group_id changes)

```typescript
const { productChanges } = useDragAndDropWithRedux(props);

// productChanges.pendingChanges - boolean, true khi có thay đổi chưa save
// productChanges.movedProducts - array các products đã được di chuyển
//   - productId: ID của product
//   - oldParentId: group_id cũ (có thể là null nếu từ root)
//   - newParentId: group_id mới (có thể là null nếu về root)
//   - oldOrder: thứ tự cũ trong group
//   - newOrder: thứ tự mới trong group
// productChanges.reorderedGroups - array các groups đã được sắp xếp lại
```

### 3. Formatted Data cho API

```typescript
const { formattedProductsForAPI, formattedGroupsForAPI } = useDragAndDropWithRedux(props);

// formattedProductsForAPI - array products đã được format cho API
// formattedGroupsForAPI - array groups đã được format cho API
```

## Xử lý Save/Cancel

### Save Changes

```typescript
const { commitChanges, formattedProductsForAPI, formattedGroupsForAPI } = useDragAndDropWithRedux(props);

const handleSave = async () => {
  try {
    // Gọi API với data đã được format
    await productAPI.updateProductsMulti(formattedProductsForAPI);
    await productAPI.updateGroup(formattedGroupsForAPI);

    // Commit changes trong Redux
    commitChanges();

  } catch (error) {
    console.error('Save failed:', error);
  }
};
```

### Cancel Changes

```typescript
const { clearChanges } = useDragAndDropWithRedux(props);

const handleCancel = () => {
  clearChanges();
  console.log('Changes cleared');
};
```

## Hiển thị trạng thái

### Hiển thị trạng thái drag

```typescript
const { dragState, activeId, overId } = useDragAndDropWithRedux(props);

return (
  <div>
    {dragState.isDragging && (
      <div style={{ backgroundColor: 'lightblue', padding: '10px' }}>
        Dragging: {activeId} → {overId}
      </div>
    )}
  </div>
);
```

### Hiển thị thay đổi pending (bao gồm group_id changes)

```typescript
const { productChanges } = useDragAndDropWithRedux(props);

return (
  <div>
    {productChanges.pendingChanges && (
      <div style={{ backgroundColor: 'lightyellow', padding: '10px' }}>
        <div>Pending changes:</div>
        <div>{productChanges.movedProducts.length} products moved</div>
        <div>{productChanges.reorderedGroups.length} groups reordered</div>

        {/* Hiển thị chi tiết thay đổi group_id */}
        {productChanges.movedProducts.map((change, index) => (
          <div key={index}>
            Product {change.productId}:
            {change.oldParentId || 'root'} → {change.newParentId || 'root'}
          </div>
        ))}
      </div>
    )}
  </div>
);
```

## Lợi ích

1. **Giữ nguyên logic gốc**: Không thay đổi bất kỳ logic nào của `useDragAndDrop` ban đầu
2. **Tự động track group_id**: Tự động phát hiện và lưu thay đổi `group_id` khi drag
3. **Tự động đồng bộ**: Tự động lưu trữ trạng thái vào Redux khi có thay đổi
4. **Tracking thay đổi**: Tự động track các thay đổi và cung cấp data đã format cho API
5. **Dễ sử dụng**: Chỉ cần wrap parameters và sử dụng như bình thường
6. **Tương thích**: Hoàn toàn tương thích với `dnd-kit` và Redux hiện tại
7. **Type-safe**: Đầy đủ TypeScript support

## Lưu ý quan trọng

- **KHÔNG thay đổi logic**: Hook này chỉ wrap `useDragAndDrop` gốc, không can thiệp vào logic drag-and-drop
- **Tự động track group_id**: Khi product được di chuyển giữa groups, `group_id` sẽ tự động được track và lưu
- **Tự động lưu trữ**: Mọi thay đổi tree sẽ tự động được lưu vào Redux
- **API compatibility**: Data được format sẵn cho API calls
- **Redux store**: Yêu cầu Redux store đã được setup với `profileSlice`
- **Component wrapper**: Đảm bảo component được wrap trong `Redux Provider`

## Migration từ useDragAndDrop

```typescript
// Trước đây
const dragAndDrop = useDragAndDrop({
  treeNodes,
  onTreeChange: setTreeNodes,
  onCollapseAllGroups: collapseAllGroups,
  onSaveCollapsedState: saveCollapsedState,
  onUpdateCollapsedStates: updateNodeCollapsedStates,
});

// Bây giờ
const dragAndDrop = useDragAndDropWithRedux({
  treeNodes,
  onTreeChange: setTreeNodes,
  onCollapseAllGroups: collapseAllGroups,
  onSaveCollapsedState: saveCollapsedState,
  onUpdateCollapsedStates: updateNodeCollapsedStates,
});

// Tất cả các props khác giữ nguyên
const { activeId, overId, projected, items, handleDragStart, ... } = dragAndDrop;
```

## Ví dụ thay đổi group_id

Khi user kéo một product từ group A sang group B:

1. **Trước khi drag**: `product.group_id = "group-A"`
2. **Sau khi drag**: `product.group_id = "group-B"`
3. **Redux sẽ lưu**:
   ```javascript
   {
     productId: "product-123",
     oldParentId: "group-A",
     newParentId: "group-B",
     oldOrder: 0,
     newOrder: 2
   }
   ```
4. **API call**: Sẽ nhận được product với `group_id` mới

# useDragAndDropWithRedux Hook

Hook này tích hợp `useDragAndDrop` gốc với Redux để quản lý state và theo dõi thay đổi.

## Tính năng

### 1. Tích hợp với Redux

- **Không thay đổi logic drag-and-drop gốc**: Hook gốc `useDragAndDrop` vẫn hoạt động như cũ
- **Redux chỉ lưu trữ state**: Redux được sử dụng để lưu trữ tree state và theo dõi thay đổi
- **Tự động cập nhật group_id**: Khi sản phẩm được kéo ra root, `group_id` tự động được đặt thành `'0'`

### 2. Theo dõi thay đổi group_id

- **Tự động phát hiện**: Khi `handleDragEnd` thay đổi `group_id` của sản phẩm, thay đổi được ghi lại
- **Lưu trữ trong Redux**: Các thay đổi được lưu trong `productChanges` state
- **API compatibility**: Dữ liệu được format để tương thích với API hiện tại

### 3. State Management

- **Tree State**: Lưu trữ cấu trúc tree hiện tại
- **Collapsed States**: Quản lý trạng thái đóng/mở của các group
- **Product Changes**: Theo dõi các thay đổi `group_id` của sản phẩm

## Cách sử dụng

```tsx
import { useDragAndDropWithRedux } from './hooks/useDragAndDropWithRedux';

function MyComponent() {
  const {
    activeId,
    overId,
    projected,
    items,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    isInvalidDrop,
    // Redux features
    dragState,
    productChanges,
    formattedProductsForAPI,
    formattedGroupsForAPI,
    commitChanges,
    clearChanges,
  } = useDragAndDropWithRedux({
    treeNodes,
    onTreeChange,
    onCollapseAllGroups,
    onSaveCollapsedState,
    onUpdateCollapsedStates,
  });

  // Sử dụng như useDragAndDrop gốc
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Your drag-and-drop UI */}
    </DndContext>
  );
}
```

## API Data Format

### Products for API

```typescript
// formattedProductsForAPI
[
  {
    id: '1',
    type: 'product',
    product: {
      id: 1,
      group_id: '0', // "0" for root, group ID for groups
      // ... other product fields
    },
    parentId: null, // null for root, group ID for groups
  },
];
```

### Groups for API

```typescript
// formattedGroupsForAPI
[
  {
    id: 'group1',
    type: 'group',
    title: 'Group Title',
    titleType: 'text',
    order_no: 1,
    isOpen: false,
    children: [
      {
        id: '1',
        type: 'product',
        product: {
          /* product data */
        },
        parentId: 'group1',
      },
    ],
  },
];
```

## Redux Actions

### Tự động dispatch khi drag kết thúc:

- `updateTreeState`: Cập nhật tree state
- `saveCollapsedState`: Lưu trạng thái collapsed
- `updateCollapsedStates`: Cập nhật trạng thái collapsed
- `recordProductMove`: Ghi lại thay đổi group_id của sản phẩm

### Manual actions:

- `commitProductChanges`: Commit các thay đổi
- `clearProductChanges`: Xóa các thay đổi

## Fix cho group_id

### Vấn đề đã được sửa:

- **Kéo sản phẩm ra root**: `group_id` không được cập nhật thành `'0'`
- **Logic cập nhật**: Đã thêm logic trong `useDragAndDrop` để tự động cập nhật `group_id` khi `parentId` thay đổi

### Logic cập nhật:

```typescript
// Trong useDragAndDrop.ts
if (movedItem.product) {
  // Nếu parentId = null (root level), group_id = '0'
  // Nếu parentId có giá trị (trong group), group_id = parentId
  movedItem.product.group_id = finalParentId || '0';
}
```

### Các trường hợp được xử lý:

1. **Group → Root**: `group_id` = `'0'`
2. **Root → Group**: `group_id` = `group_id`
3. **Group → Group**: `group_id` = `new_group_id`

## Lưu ý quan trọng

1. **Không thay đổi logic gốc**: Hook `useDragAndDrop` gốc vẫn hoạt động như cũ
2. **Redux chỉ lưu trữ**: Redux được sử dụng để lưu trữ và theo dõi, không can thiệp vào logic drag-and-drop
3. **API compatibility**: Dữ liệu được format để tương thích với API hiện tại
4. **Tự động cập nhật group_id**: Khi sản phẩm được kéo ra root, `group_id` tự động được đặt thành `'0'`
