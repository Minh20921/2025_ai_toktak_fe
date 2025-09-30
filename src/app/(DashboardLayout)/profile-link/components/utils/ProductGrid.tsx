'use client';

import { Box, Grid, Paper, Typography, darken } from '@mui/material';
import { Product } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { LayoutOption } from '@/app/(DashboardLayout)/profile-link/components/const';

interface ProductGridProps {
  products: Product[];
  layoutType: 'grid-2' | 'grid-3' | 'list';
  productBgColor: string;
  nameColor: string;
  priceColor: string;
  sectionTitle: string;
  titleType?: LayoutOption;
}

const getGridColumns = (layoutType: string) => {
  switch (layoutType) {
    case 'grid-2':
      return 2;
    case 'grid-3':
      return 3;
    case 'list':
    default:
      return 1;
  }
};

export default function ProductGrid({
  products,
  layoutType,
  productBgColor,
  nameColor,
  priceColor,
  sectionTitle,
  titleType = 'left',
}: ProductGridProps) {
  return (
    <>
      {/* Section Title */}
      <Box
        sx={{
          px: '26px',
          mt: 3,
          mb: 1,
        }}
      >
        <Typography fontWeight={600} fontSize="16px" textAlign={titleType}>
          {sectionTitle}
        </Typography>
      </Box>

      {/* Product Grid */}
      <Grid container spacing={2} px="26px">
        {products.map((product) => (
          <Grid key={product.id} item  xs={12 / getGridColumns(layoutType)}>
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                flexDirection: layoutType === 'list' ? 'row' : 'column',
                alignItems: layoutType === 'list' ? 'center' : 'flex-start',
                p: layoutType === 'list' ? '6px' : 0,
                borderRadius: 2,
                bgcolor: productBgColor,
                border: `2px solid ${darken(productBgColor, 0.1)}`,
                boxShadow: '0px 10.76px 80.67px 0px #0000000D',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={product.product_image}
                alt={product.product_name}
                sx={{
                  width: layoutType === 'list' ? 80 : '100%',
                  height: layoutType === 'list' ? 80 : 'auto',
                  aspectRatio: layoutType === 'list' ? undefined : '1 / 1',
                  objectFit: 'cover',
                  borderRadius: layoutType === 'list' ? '8px' : 0,
                  mr: layoutType === 'list' ? 2 : 0,
                  flexShrink: 0,
                }}
              />
              <Box
                sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: layoutType === 'list' ? '0' : '8px 10px' }}
              >
                <Typography
                  variant="body2"
                  sx={{ mb: 0.5, fontWeight: 500, whiteSpace: 'wrap', flexGrow: 1 }}
                  color={nameColor}
                  className={'line-clamp-2'}
                >
                  {product.product_name}
                </Typography>
                {!!product.price && (
                  <Typography variant="body2" fontWeight="bold" color={priceColor}>
                    {product.price}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
