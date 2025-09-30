// components/GroupEditDialog.tsx
'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { LayoutOption } from '@/app/(DashboardLayout)/profile-link/components/const';
import { Product } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ProductItem } from './ProductItem';
import { productAPI } from '@/app/(DashboardLayout)/profile-link/api/product';
import ProductEditDialog from './ProductEditDialog';
import FormInput from '@/app/components/common/ FormInput';
import { showNotice } from '@/utils/custom/notice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/lib/store/store';
import { debounce } from 'lodash';
import {
  updateNodeTitleAndLayout,
  setTreeNodes,
  removeRootProductsFromTree,
  updateProduct,
} from '@/app/lib/store/profileSlice';
import { TreeNode } from '@/app/(DashboardLayout)/profile-link/@type/interface';

interface GroupEditDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  initialTitle: string;
  initialLayout: LayoutOption;
  initialProducts: Product[];
  isDuplicateTitle?: boolean;
}

export default function GroupEditDialog({
  open,
  onClose,
  groupId,
  initialTitle,
  initialLayout,
  initialProducts,
  isDuplicateTitle = false,
}: GroupEditDialogProps) {
  const dispatch = useDispatch();
  const allProducts = useSelector((state: RootState) => state.profile.products);
  const groupList = useSelector((state: RootState) => state.profile.treeNodes);

  const [title, setTitle] = useState(initialTitle);
  const [layoutType, setLayoutType] = useState<LayoutOption>(initialLayout);
  const [linkInput, setLinkInput] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
      scrollBehavior: 'contain',
    }),
  );

  // Lấy rootProducts: sản phẩm không thuộc group nào hoặc chỉ thuộc group hiện tại
  const rootProducts = allProducts.filter((p) => {
    const inOtherGroup = groupList.some(
      (g) => g.type === 'group' && g.id !== groupId && g.children?.some((c) => c.product?.id === p.id),
    );
    return !inOtherGroup;
  });

  // State selectedProducts: các sản phẩm hiện có trong group (checked sẵn) + các sản phẩm root được chọn thêm
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(initialProducts);

  // Debounced crawl logic (like GroupAddForm)
  const handleDebouncedCrawl = useCallback(
    debounce(async (url: string) => {
      if (!url || !url.startsWith('http')) return;
      setIsCrawling(true);
      const tempId = `temp_${Date.now()}`;
      const tempProduct: Product = {
        id: tempId,
        user_id: '',
        product_url: url,
        product_name: '',
        price: '',
        product_image: '',
      };
      setSelectedProducts((prev) => [tempProduct, ...prev]);
      try {
        const result = await productAPI.crawlProduct(url);
        const updated: Product = {
          ...tempProduct,
          user_id: '',
          product_name: result.name || '',
          price: result.price || '',
          product_image: result.image || '',
        };
        setSelectedProducts((prev) => {
          const filtered = prev.filter((p) => p.id !== tempId);
          return [updated, ...filtered];
        });
      } catch (err) {
        console.error('Crawl failed:', err);
      } finally {
        setIsCrawling(false);
        setLinkInput('');
      }
    }, 1000),
    [],
  );

  useEffect(() => {
    handleDebouncedCrawl(linkInput);
    return () => handleDebouncedCrawl.cancel();
  }, [linkInput]);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setLayoutType(initialLayout);
      setSelectedProducts(initialProducts);
      setLinkInput('');
      setEditingProduct(null);
    }
  }, [open, initialTitle, initialLayout, initialProducts]);

  const handleToggleProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Khi kéo thả, reorder selectedProducts
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setSelectedProducts((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // Khi submit, cập nhật group và đẩy sản phẩm bỏ chọn về root
  const handleSave = () => {
    if (!title.trim()) return;
    // 1. Cập nhật title/layout cho group và children là selectedProducts
    let newTreeNodes = groupList.map((node) => {
      if (node.id === groupId && node.type === 'group') {
        return {
          ...node,
          title: title.trim(),
          titleType: layoutType,
          children: selectedProducts.map((product) => ({
            id: product.id.toString(),
            type: 'product' as const,
            product,
            parentId: groupId,
          })) as TreeNode[],
        };
      }
      return node;
    });

    // 2. Đẩy sản phẩm không còn thuộc group về root
    const initialProductIds = initialProducts.map((p) => p.id.toString());
    const selectedProductIds = selectedProducts.map((p) => p.id.toString());
    const removedProducts = initialProducts.filter((p) => !selectedProductIds.includes(p.id.toString()));
    removedProducts.forEach((product) => {
      newTreeNodes.push({
        id: product.id.toString(),
        type: 'product' as const,
        product,
        parentId: undefined,
      });
    });

    // 3. Loại bỏ các sản phẩm vừa được thêm vào group khỏi root level
    newTreeNodes = newTreeNodes.filter(
      (node) =>
        !(node.type === 'product' && node.parentId === undefined && selectedProductIds.includes(node.id.toString())),
    );
    dispatch(removeRootProductsFromTree(selectedProducts.map((p) => p.id.toString())));
    dispatch(setTreeNodes(newTreeNodes as TreeNode[]));
    onClose();
  };

  const handleUpdateProduct = (updated: Product) => {
    dispatch(updateProduct({ id: updated.id, data: updated }));
    setSelectedProducts((prev) => prev.map((p) => (p.id.toString() === updated.id.toString() ? updated : p)));
    setEditingProduct(null);
  };

  return isMobile ? (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          px: '18px',
          maxHeight: '90vh',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 480,
          mx: 'auto',
          position: 'relative',
          pb: 10,
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 80px)',
          '::-webkit-scrollbar': { width: 0, background: 'transparent' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 2.5, md: 3 },
            pt: '18px',
            fontFamily: 'var(--font-pretendard)',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '20px',
            letterSpacing: '0px',
            verticalAlign: 'middle',
            backgroundColor: 'white',
            width: '100%',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          섹션 수정
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <FormInput
            fullWidth
            label="섹션 제목"
            required
            placeholder="Section title*"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            error={isDuplicateTitle}
            helperText={isDuplicateTitle ? '이미 존재하는 섹션 제목입니다.' : ''}
          />
          <Stack direction="row" spacing={0.5} pt={3}>
            <IconButton onClick={() => setLayoutType('left')} color={layoutType === 'left' ? 'primary' : 'default'}>
              <Icon icon="quill:text-left" />
            </IconButton>
            <IconButton onClick={() => setLayoutType('center')} color={layoutType === 'center' ? 'primary' : 'default'}>
              <Icon icon="quill:text-center" />
            </IconButton>
            <IconButton onClick={() => setLayoutType('right')} color={layoutType === 'right' ? 'primary' : 'default'}>
              <Icon icon="quill:text-right" />
            </IconButton>
          </Stack>
        </Box>
        <FormInput
          label="이 섹션에 상품 추가하기"
          fullWidth
          placeholder="Paste a link"
          disabled={isCrawling}
          value={linkInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLinkInput(e.target.value)}
        />
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={rootProducts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <Stack spacing={1.5} mt={3}>
              {rootProducts.map((product, index) => {
                const isSelected = selectedProducts.some((p) => p.id === product.id);
                return (
                  <ProductItem
                    key={product.id}
                    item={{
                      id: product.id,
                      name: product.product_name,
                      depth: 0,
                      product,
                      type: 'product',
                      parentId: groupId,
                      hasChildren: false,
                      isCollapsed: false,
                    }}
                    index={index}
                    isDraggingOver={false}
                    handlers={{
                      onEdit: () => setEditingProduct(product),
                      onDelete: (id) => {
                        showNotice(
                          '😢 제품을 제거하시겠습니까??',
                          '방금 변경한 내용은 손실됩니다.',
                          true,
                          '확인',
                          '취소',
                          () => {
                            setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
                          },
                        );
                      },
                    }}
                    checked={isSelected}
                    onChecked={handleToggleProduct}
                  />
                );
              })}
            </Stack>
          </SortableContext>
        </DndContext>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          pt={6}
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          sx={{
            backgroundColor: 'white',
            p: 2,
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            onClick={onClose}
            sx={{
              bgcolor: '#E7E7E7',
              color: '#6A6A6A',
              fontWeight: 600,
              borderRadius: '6px',
              height: 50,
              width: '50%',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#D0D0D0' },
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            loading={isCrawling}
            disabled={!title?.trim() || isCrawling}
            sx={{
              bgcolor: '#272727',
              fontWeight: 600,
              borderRadius: '6px',
              height: 50,
              width: '50%',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#000' },
            }}
          >
            저장
          </Button>
        </Stack>
      </Box>
      {editingProduct && (
        <ProductEditDialog
          open
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={(updated) => {
            handleUpdateProduct(updated);
            setEditingProduct(null);
          }}
        />
      )}
    </Drawer>
  ) : (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '30px',
            p: '48px 70px',
          },
        },
      }}
    >
      <DialogTitle sx={{ p: 0, pb: 3.75, fontSize: 21, fontWeight: 600 }}>섹션 수정</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <FormInput
            fullWidth
            label="섹션 제목"
            required
            placeholder="Section title*"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            error={isDuplicateTitle}
            helperText={isDuplicateTitle ? '이미 존재하는 섹션 제목입니다.' : ''}
          />
          <Stack direction="row" spacing={0.5} pt={3}>
            <IconButton onClick={() => setLayoutType('left')} color={layoutType === 'left' ? 'primary' : 'default'}>
              <Icon icon="quill:text-left" />
            </IconButton>
            <IconButton onClick={() => setLayoutType('center')} color={layoutType === 'center' ? 'primary' : 'default'}>
              <Icon icon="quill:text-center" />
            </IconButton>
            <IconButton onClick={() => setLayoutType('right')} color={layoutType === 'right' ? 'primary' : 'default'}>
              <Icon icon="quill:text-right" />
            </IconButton>
          </Stack>
        </Box>
        <FormInput
          label="이 섹션에 상품 추가하기"
          fullWidth
          placeholder="Paste a link"
          disabled={isCrawling}
          value={linkInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLinkInput(e.target.value)}
        />
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={rootProducts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <Stack spacing={1.5} mt={3}>
              {rootProducts.map((product, index) => {
                const isSelected = selectedProducts.some((p) => p.id === product.id);
                return (
                  <ProductItem
                    key={product.id}
                    item={{
                      id: product.id,
                      name: product.product_name,
                      depth: 0,
                      product,
                      type: 'product',
                      parentId: groupId,
                      hasChildren: false,
                      isCollapsed: false,
                    }}
                    index={index}
                    isDraggingOver={false}
                    handlers={{
                      onEdit: () => setEditingProduct(product),
                      onDelete: (id) => {
                        showNotice(
                          '😢 제품을 제거하시겠습니까??',
                          '방금 변경한 내용은 손실됩니다.',
                          true,
                          '확인',
                          '취소',
                          () => {
                            setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
                          },
                        );
                      },
                    }}
                    checked={isSelected}
                    onChecked={handleToggleProduct}
                  />
                );
              })}
            </Stack>
          </SortableContext>
        </DndContext>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pt: 6 }}>
        <Button
          variant="contained"
          color="inherit"
          onClick={onClose}
          sx={{
            bgcolor: '#E7E7E7',
            color: '#6A6A6A',
            fontWeight: 600,
            borderRadius: 6,
            height: 50,
            minWidth: 150,
            '&:hover': {
              bgcolor: '#D0D0D0',
            },
          }}
        >
          취소
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          loading={isCrawling}
          disabled={!title?.trim() || isCrawling}
          sx={{
            bgcolor: '#272727',
            fontWeight: 600,
            borderRadius: 6,
            height: 50,
            minWidth: 150,
            '&:hover': {
              bgcolor: '#000',
            },
          }}
        >
          저장
        </Button>
      </DialogActions>
      {editingProduct && (
        <ProductEditDialog
          open
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={(updated) => {
            handleUpdateProduct(updated);
            setEditingProduct(null);
          }}
        />
      )}
    </Dialog>
  );
}
