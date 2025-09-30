'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  IconButton,
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { productAPI } from '@/app/(DashboardLayout)/profile-link/api/product';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTreeNode,
  appendProductsToNode,
  removeRootProductsFromTree,
  updateProduct,
} from '@/app/lib/store/profileSlice';
import { debounce } from 'lodash';
import { ProductItem } from '@/app/(DashboardLayout)/profile-link/components/utils/ProductItem';
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
import type { RootState } from '@/app/lib/store/store';
import type { Product } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { Icon } from '@iconify/react';
import { LayoutOption } from '@/app/(DashboardLayout)/profile-link/components/const';
import { showNotice } from '@/utils/custom/notice';
import ProductEditDialog from '@/app/(DashboardLayout)/profile-link/components/utils/ProductEditDialog';
import FormInput from '@/app/components/common/ FormInput';

interface GroupAddFormProps {
  open: boolean;
  onClose: () => void;
}

export default function GroupAddForm({ open, onClose }: GroupAddFormProps) {
  const dispatch = useDispatch();
  const groupList = useSelector((state: RootState) => state.profile.treeNodes);
  const allProducts = useSelector((state: RootState) => state.profile.products);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [title, setTitle] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [rootProducts, setRootProducts] = useState<Product[]>([]); // Sản phẩm root
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]); // Sản phẩm sẽ thêm vào group
  const [layoutType, setLayoutType] = useState<LayoutOption>('left');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const isDuplicateTitle = groupList.some((g) => g?.title?.trim() === title.trim());

  // Khi mở popup, lấy sản phẩm root (không thuộc group nào)
  useEffect(() => {
    if (open) {
      // Sản phẩm không thuộc group nào (parentId undefined/null hoặc group_id undefined/null)
      const assignedProductIds = new Set(
        groupList.flatMap((group) => group?.children?.map((p) => p.product?.id) || []),
      );
      const root = allProducts.filter((p) => !assignedProductIds.has(p.id));
      setRootProducts(root);
      setSelectedProducts([]);
    }
  }, [open, allProducts, groupList]);

  // Crawl sản phẩm mới từ link
  const handleDebouncedCrawl = useCallback(
    debounce(async (url: string) => {
      if (!url || !url.startsWith('http')) return;
      setIsCrawling(true);
      const tempId = `temp_${uuidv4()}`;
      const tempProduct: Product = {
        id: tempId,
        user_id: '',
        product_url: url,
        product_name: '',
        price: '',
        product_image: '',
      };
      setRootProducts((prev) => [tempProduct, ...prev]);
      try {
        const result = await productAPI.crawlProduct(url);
        const updatedProduct: Product = {
          ...tempProduct,
          product_name: result.name || '',
          price: result.price || '',
          product_image: result.image || '',
        };
        setRootProducts((prev) => {
          const filtered = prev.filter((p) => p.id !== tempId);
          return [updatedProduct, ...filtered];
        });
        setSelectedProducts((prev) => [...prev, updatedProduct]);
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

  // Toggle chọn sản phẩm
  const handleToggleProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleSubmit = async () => {
    if (!title.trim() || isDuplicateTitle) return;
    const newGroupId = `group-${Date.now()}`;
    dispatch(
      addTreeNode({
        id: newGroupId,
        title: title.trim(),
        titleType: layoutType,
      }),
    );
    if (selectedProducts.length > 0) {
      dispatch(
        appendProductsToNode({
          nodeId: newGroupId,
          products: selectedProducts,
          hasMore: false,
          page: 1,
        }),
      );
      dispatch(removeRootProductsFromTree(selectedProducts.map((p) => p.id.toString())));
    }
    onClose();
    setTitle('');
    setSelectedProducts([]);
    setLayoutType('left');
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setRootProducts((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
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
          새 상품 추가
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
          <SortableContext items={rootProducts} strategy={verticalListSortingStrategy}>
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
                      parentId: null,
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
                            setRootProducts((prev) => prev.filter((p) => p.id !== id));
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
            onClick={handleSubmit}
            loading={isCrawling}
            disabled={!title.trim() || isDuplicateTitle || isCrawling}
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
            추가
          </Button>
        </Stack>
      </Box>
      {editingProduct && (
        <ProductEditDialog
          open
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={(updated) => {
            dispatch(updateProduct({ id: updated.id, data: updated }));
            setRootProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setSelectedProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
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
      <DialogTitle sx={{ p: 0, pb: 3.75, fontSize: 21, fontWeight: 600 }}>섹션 추가</DialogTitle>
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
          <SortableContext items={rootProducts} strategy={verticalListSortingStrategy}>
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
                      parentId: null,
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
                            setRootProducts((prev) => prev.filter((p) => p.id !== id));
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
          onClick={handleSubmit}
          loading={isCrawling}
          disabled={!title.trim() || isDuplicateTitle || isCrawling}
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
          완료
        </Button>
      </DialogActions>
      {editingProduct && (
        <ProductEditDialog
          open
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={(updated) => {
            dispatch(updateProduct({ id: updated.id, data: updated }));
            setRootProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setSelectedProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setEditingProduct(null);
          }}
        />
      )}
    </Dialog>
  );
}
