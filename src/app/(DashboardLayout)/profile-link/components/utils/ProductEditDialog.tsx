'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Product } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import ProductEditForm from './ProductEditForm';
import { Icon } from '@iconify/react';

interface ProductEditDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onSubmit: (data: Product) => void;
}

export default function ProductEditDialog({ open, onClose, product, onSubmit }: ProductEditDialogProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCrawling, setIsCrawling] = useState<boolean>(false);

  useEffect(() => {
    if (open) setEditedProduct(product);
  }, [open, product]);

  const handleSubmit = () => {
    onSubmit(editedProduct);
    onClose();
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
          p: '18px',
          maxHeight: '90vh',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', position: 'relative', pb: 10 }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: 3,
            fontFamily: 'Pretendard',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '20px',
            letterSpacing: '0px',
            verticalAlign: 'middle',
          }}
        >
          상품 수정
        </Box>
        <ProductEditForm
          product={editedProduct}
          onChange={(partial) => setEditedProduct((prev) => ({ ...prev, ...partial }))}
          isMobile={true}
          doingCrawl={(isCrawling) => setIsCrawling(isCrawling)}
        />
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          sx={{
            backgroundColor: 'white',
            p: 2,
            display: 'flex',
            gap: 2,
            zIndex: 1301,
          }}
        >
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              height: 50,
              borderRadius: '6px',
              bgcolor: '#E7E7E7',
              fontSize: '14.47px',
              fontWeight: '600',
              color: '#6A6A6A',
              width: '50%',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#D0D0D0' },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            loading={isCrawling}
            disabled={isCrawling}
            sx={{
              height: 50,
              borderRadius: '6px',
              bgcolor: '#272727',
              fontSize: '14.47px',
              fontWeight: '600',
              color: 'white',
              width: '50%',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#000' },
            }}
          >
            저장
          </Button>
        </Box>
      </Box>
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
      <DialogTitle sx={{ p: 0, pb: 3.75, fontSize: '21px', fontWeight: '600', lineHeight: '30px', color: '#090909' }}>
        상품 수정
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <ProductEditForm
          product={editedProduct}
          onChange={(partial) => setEditedProduct((prev) => ({ ...prev, ...partial }))}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', p: 0, pt: 6.25 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            minWidth: 158,
            height: 50,
            boxShadow: 0,
            borderRadius: 6,
            p: '12px 38px',
            bgcolor: '#E7E7E7',
            fontSize: '14.47px',
            fontWeight: '600',
            lineHeight: '17px',
            color: '#6A6A6A',
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          loading={isCrawling}
          disabled={isCrawling}
          sx={{
            minWidth: 158,
            height: 50,
            boxShadow: 0,
            borderRadius: 6,
            p: '12px 38px',
            bgcolor: '#272727',
            fontSize: '14.47px',
            fontWeight: '600',
            lineHeight: '17px',
            '&:hover': {
              bgcolor: '#000',
            },
          }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
