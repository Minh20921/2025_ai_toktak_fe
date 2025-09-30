# SSR (Server-Side Rendering) Handling

## Vấn đề

Lỗi "document is not defined" xảy ra khi code chạy trên server-side trong Next.js, nhưng `document` chỉ có sẵn ở client-side.

## Giải pháp

### 1. **ClientOnly Component**

```tsx
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
```

### 2. **Document Availability Check**

```tsx
// Trong useDragAndDrop hook
if (typeof document !== 'undefined') {
  document.body.style.setProperty('cursor', 'grabbing');
}
```

### 3. **Conditional Portal Rendering**

```tsx
{
  isMounted && createPortal(<DragOverlay>...</DragOverlay>, document.body);
}
```

## Các thay đổi đã thực hiện

### **tabs-product-manage.tsx**

- ✅ Thêm `ClientOnly` wrapper component
- ✅ Thêm `isMounted` state để track client-side rendering
- ✅ Conditional rendering cho `createPortal`

### **useDragAndDrop.ts**

- ✅ Kiểm tra `typeof document !== 'undefined'` trước khi sử dụng `document.body`
- ✅ Áp dụng cho cả `handleDragStart` và `resetState`

## Lý do cần thiết

### **Next.js SSR**

- Server-side: Không có `document`, `window`, `navigator`
- Client-side: Có đầy đủ browser APIs
- Hydration: Chuyển từ server HTML sang client JavaScript

### **Drag & Drop Dependencies**

- `@dnd-kit/core`: Cần DOM APIs
- `createPortal`: Cần `document.body`
- `document.body.style`: Cần browser APIs

## Best Practices

### **1. Always Check Environment**

```tsx
if (typeof window !== 'undefined') {
  // Browser-only code
}
```

### **2. Use useEffect for Client-Side Logic**

```tsx
useEffect(() => {
  // This runs only on client-side
}, []);
```

### **3. Conditional Rendering**

```tsx
{
  isClient && <ClientOnlyComponent />;
}
```

### **4. Dynamic Imports**

```tsx
const ClientComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false,
});
```

## Kết quả

✅ **Không còn lỗi "document is not defined"**  
✅ **Drag & drop hoạt động bình thường**  
✅ **SSR vẫn hoạt động đúng**  
✅ **Hydration không bị lỗi**  
✅ **Performance không bị ảnh hưởng**
