'use client';

import { Box, IconButton } from '@mui/material';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Product } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import FormInput from '@/app/components/common/ FormInput';
import { debounce } from 'lodash';
import { productAPI } from '@/app/(DashboardLayout)/profile-link/api/product';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';

interface ProductEditFormProps {
  product: Product;
  onChange: (updated: Partial<Product>) => void;
  isMobile?: boolean;
  doingCrawl?: (isCrawling: boolean) => void;
}

export default function ProductEditForm({ product, onChange, isMobile, doingCrawl }: ProductEditFormProps) {
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const profile = useSelector((state: RootState) => state.profile);

  const handleCrawlLink = useCallback(
    debounce(async (url: string) => {
      if (!url || !url.startsWith('http')) return;

      try {
        setIsCrawling(true);
        doingCrawl?.(true);
        const result = await productAPI.crawlProduct(url);
        if (result) {
          if (result.name) onChange({ product_name: result.name });
          if (result.price && !!profile.site_setting.show_price) onChange({ price: result.price });
          if (result.image) {
            onChange({ product_image: result.image });
            onChange({ product_image_file: undefined });
          }
        }
      } catch (err) {
        console.error('Crawl failed:', err);
      } finally {
        setIsCrawling(false);
        doingCrawl?.(false);
      }
    }, 3000),
    [profile],
  );



  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await productAPI.getProductImgUrl(file);
      onChange({ product_image: result?.data?.file_url });
    }
  };
  useEffect(() => {
    return () => {
      handleCrawlLink.cancel();
    };
  }, [handleCrawlLink]);

  if (isMobile) {
    return (
      <Box width="100%">
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
          {product.product_image ? (
            <img
              src={product.product_image}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
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
        <Box display="flex" flexDirection="column" gap={2} width="100%">
          <FormInput
            label="링크"
            required
            value={product.product_url}
            disabled={isCrawling}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChange({ product_url: e.target.value });
              handleCrawlLink(e.target.value);
            }}
            placeholder="Paste a link"
            fullWidth
          />
          <FormInput
            label="상품명"
            required
            disabled={isCrawling}
            value={product.product_name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ product_name: e.target.value })}
            placeholder="Title"
            fullWidth
          />
          <FormInput
            label="가격/설명"
            disabled={isCrawling}
            value={product.price || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ price: e.target.value })}
            placeholder="Price/description"
            fullWidth
          />
        </Box>
      </Box>
    );
  }
  return (
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
        {product.product_image ? (
          <img src={product.product_image} width="100%" height="100%" style={{ objectFit: 'cover', borderRadius: 8 }} />
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
          value={product.product_url}
          disabled={isCrawling}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange({ product_url: e.target.value });
            handleCrawlLink(e.target.value);
          }}
          placeholder="Paste a link"
        />
        <FormInput
          label="상품명"
          required
          disabled={isCrawling}
          value={product.product_name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ product_name: e.target.value })}
          placeholder="Title"
        />
        <FormInput
          label="가격/설명"
          disabled={isCrawling}
          value={product.price || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ price: e.target.value })}
          placeholder="Price/description"
        />
      </Box>
    </Box>
  );
}
