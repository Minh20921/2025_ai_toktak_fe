'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTempProduct } from '@/app/lib/store/profileSlice';
import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import FormInput from '@/app/components/common/ FormInput';
import { debounce } from 'lodash';
import { productAPI } from '@/app/(DashboardLayout)/profile-link/api/product';
import { RootState } from '@/app/lib/store/store';

interface ProductAddFormProps {
  open: boolean;
  onClose: () => void;
}

export default function ProductAddForm({ open, onClose }: ProductAddFormProps) {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);
  const [link, setLink] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCrawlLink = useCallback(
    debounce(async (url: string) => {
      if (!url || !url.startsWith('http')) return;

      try {
        setIsCrawling(true);
        const result = await productAPI.crawlProduct(url);
        if (result) {
          if (result.name) setTitle(result.name);
          if (result.price && !!profile.site_setting.show_price) setPrice(result.price);
          if (result.image) {
            setImage(result.image);
            setImageFile(undefined);
          }
        }
      } catch (err) {
        console.error('Crawl failed:', err);
      } finally {
        setIsCrawling(false);
      }
    }, 1000),
    [profile],
  );
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await productAPI.getProductImgUrl(file);
      setImage(result?.data?.file_url);
    }
  };

  const handleSubmit = () => {
    if (!link || !title || isCrawling) return;

    const newProduct = {
      id: `temp_${uuidv4()}`,
      product_url: link,
      product_name: title,
      price,
      product_image: image,
      order_no: 0,
    };

    dispatch(addTempProduct(newProduct));
    onClose();
  };
  useEffect(() => {
    return () => {
      handleCrawlLink.cancel();
    };
  }, [handleCrawlLink]);

  useEffect(() => {
    if (!open) {
      setLink('');
      setTitle('');
      setPrice('');
      setImage('');
      setImageFile(undefined);
    }
  }, [open]);
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
          새 상품 추가
        </Box>
        <Box display="flex" flexDirection="column" gap={2} mb={2} width="100%">
          <Box
            width={140}
            height={140}
            borderRadius={2}
            bgcolor="#F6F6F6"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            mb={2}
            mx="auto"
          >
            {image ? (
              <img src={image} width="100%" height="100%" style={{ objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              <Icon icon="mdi:image-outline" width={48} height={48} color="#bbb" />
            )}
            <IconButton
              component="label"
              htmlFor="image-upload"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'white',
                boxShadow: 1,
              }}
            >
              <Icon icon="mdi:pencil-outline" />
            </IconButton>
            <input type="file" accept="image/*" hidden id="image-upload" onChange={handleFileChange} />
          </Box>
          <FormInput
            label="링크"
            required
            value={link}
            disabled={isCrawling}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              setLink(val);
              handleCrawlLink(val);
            }}
            placeholder="Paste a link"
            fullWidth
          />
          <FormInput
            label="상품명"
            required
            value={title}
            disabled={isCrawling}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Title"
            fullWidth
          />
          <FormInput
            label="가격/설명"
            value={price}
            disabled={isCrawling}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
            placeholder="Price/description"
            fullWidth
          />
        </Box>
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
            추가
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
        새 상품 추가
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box display="flex" gap={2}>
          <Box
            width={120}
            height={120}
            borderRadius={2}
            bgcolor="#F6F6F6"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            {image ? (
              <img src={image} width="100%" height="100%" style={{ objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              <Icon icon="mdi:image-outline" width={40} height={40} color="#bbb" />
            )}

            <IconButton
              component="label"
              htmlFor="image-upload"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                bgcolor: 'white',
                boxShadow: 1,
              }}
            >
              <Icon icon="mdi:pencil-outline" />
            </IconButton>

            <input type="file" accept="image/*" hidden id="image-upload" onChange={handleFileChange} />
          </Box>

          <Box flex={1} display="flex" flexDirection="column" gap={2}>
            <FormInput
              label="링크"
              required
              value={link}
              disabled={isCrawling}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                setLink(val);
                handleCrawlLink(val);
              }}
              placeholder="Paste a link"
            />
            <FormInput
              label="상품명"
              required
              value={title}
              disabled={isCrawling}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <FormInput
              label="가격/설명"
              value={price}
              disabled={isCrawling}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
              placeholder="Price/description"
            />
          </Box>
        </Box>
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
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}
