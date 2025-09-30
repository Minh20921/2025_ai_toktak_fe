# Mobile Drag-and-Drop Fixes

## Vấn đề

Trên iPhone và các thiết bị mobile khác, drag-and-drop có thể gặp vấn đề duplicate items do:

1. **Double tap**: Người dùng vô tình tap hai lần nhanh
2. **Accidental touch**: Chạm nhẹ không cố ý
3. **Touch event conflicts**: Xung đột giữa các touch events
4. **iOS Safari quirks**: Các vấn đề đặc thù của iOS Safari

## Giải pháp đã triển khai

### 1. **Drag Processing Flag**

```typescript
const isProcessingDrag = useRef(false);
```

- Ngăn chặn nhiều drag operations đồng thời
- Chỉ cho phép một drag operation tại một thời điểm

### 2. **Time-based Protection**

```typescript
const lastDragEndTime = useRef(0);
const dragStartTime = useRef(0);
const touchStartTime = useRef(0);
```

- **300ms cooldown**: Ngăn chặn drag quá sớm sau drag trước
- **100ms minimum**: Ngăn chặn drag quá nhanh (accidental touch)

### 3. **Touch Device Detection**

```typescript
const isTouchDevice = useRef(false);

useEffect(() => {
  isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}, []);
```

- Tự động phát hiện thiết bị touch
- Áp dụng bảo vệ chỉ trên thiết bị touch

### 4. **Touch Start Tracking**

```typescript
useEffect(() => {
  const handleTouchStart = () => {
    touchStartTime.current = Date.now();
  };

  if (isTouchDevice.current) {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }
}, []);
```

- Track thời điểm touch start
- Sử dụng để tính toán thời gian drag

### 5. **Validation trong các handlers**

#### handleDragStart

```typescript
// Kiểm tra nếu đang xử lý drag khác
if (isProcessingDrag.current) {
  return;
}

// Kiểm tra thời gian giữa các lần drag
if (isTouchDevice.current && now - lastDragEndTime.current < 300) {
  return;
}

// Kiểm tra nếu drag quá nhanh
if (isTouchDevice.current && now - touchStartTime.current < 100) {
  return;
}
```

#### handleDragMove

```typescript
// Bảo vệ chống duplicate
if (!isProcessingDrag.current) {
  return;
}
```

#### handleDragEnd

```typescript
// Bảo vệ chống duplicate
if (!isProcessingDrag.current) {
  return;
}
```

### 6. **State Reset**

```typescript
const resetState = () => {
  // Reset các flag bảo vệ chống duplicate
  isProcessingDrag.current = false;
  lastDragEndTime.current = Date.now();

  // ... other reset logic
};
```

## Cách hoạt động

1. **Khi user touch**: Track thời gian touch start
2. **Khi drag start**:
   - Kiểm tra không có drag đang chạy
   - Kiểm tra thời gian cooldown (300ms)
   - Kiểm tra thời gian drag tối thiểu (100ms)
   - Set flag `isProcessingDrag = true`
3. **Trong quá trình drag**: Chỉ xử lý nếu `isProcessingDrag = true`
4. **Khi drag end**: Reset tất cả flags và update `lastDragEndTime`

## Lợi ích

- ✅ **Ngăn chặn duplicate items**
- ✅ **Giảm accidental drags**
- ✅ **Cải thiện UX trên mobile**
- ✅ **Tương thích với iOS Safari**
- ✅ **Không ảnh hưởng desktop experience**

## Monitoring

Các log messages giúp debug:

- `"Drag already in progress, ignoring new drag start"`
- `"Drag too soon after previous drag, ignoring"`
- `"Drag too fast, likely accidental touch, ignoring"`
- `"Drag move called but no drag in progress, ignoring"`
- `"Drag end called but no drag in progress, ignoring"`

## Tùy chỉnh

Có thể điều chỉnh các thông số:

- **Cooldown time**: Thay đổi `300ms` trong `handleDragStart`
- **Minimum drag time**: Thay đổi `100ms` trong `handleDragStart`
- **Touch detection**: Sửa logic trong `isTouchDevice.current`
