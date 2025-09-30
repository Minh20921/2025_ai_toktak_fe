'use client';

import { Avatar, Box, IconButton, InputBase, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import { IconSearch } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Product } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { SOCIAL_ICON, SOCIAL_LINKS } from '@/app/(DashboardLayout)/profile-link/components/const';
import ProductGroupList from '@/app/(DashboardLayout)/profile-link/components/utils/ProductGroupList';

export default function ProfilePreview() {
  const profile = useSelector((state: RootState) => state.profile);
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const getCombinedProductsList = useCallback(() => {
    // Create a map of all products for easy lookup
    const productMap: Record<string, Product> = {};

    // Add all original products first
    profile.products.forEach((product) => {
      productMap[product.id] = { ...product };
    });

    // Override with temp products (modified versions)
    profile.tempProducts.forEach((product) => {
      productMap[product.id] = product;
    });

    // Filter out deleted products
    profile.deletedProductIds.forEach((id) => {
      delete productMap[id];
    });

    // Convert back to array
    return Object.values(productMap);
  }, [profile.products, profile.tempProducts, profile.deletedProductIds]);
  const getFilteredProducts = useCallback(
    (query: string) => {
      const allProducts = getCombinedProductsList();
      if (!query) return allProducts;
      return allProducts.filter((product) => product.product_name.toLowerCase().includes(query.toLowerCase()));
    },
    [getCombinedProductsList],
  );
  // Handle debounce search
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setFilteredProducts(getFilteredProducts(search));
    }, 1000);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search, getFilteredProducts]);

  // Init
  useEffect(() => {
    setFilteredProducts(getCombinedProductsList());
  }, [getCombinedProductsList]);

  useEffect(() => {
    if (trackRef.current) {
      const scrollWidth = trackRef.current.scrollWidth / 2; // vì có 2 bản sao
      const speed = 80; // px per second
      const newDuration = scrollWidth / speed;
      setDuration(newDuration);
    }
  }, [profile.notice]);
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      setFilteredProducts(getFilteredProducts(search));
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'auto',
      }}
    >
      <Paper
        elevation={1}
        sx={{
          width: '100%',
          maxWidth: 500,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: `${profile.site_setting.background_color}`,
          minHeight: '100vh',
          boxShadow: '0px 10.76px 80.67px 0px #0000000D',
        }}
      >
        {/* Header */}
        <Box sx={{ pb: 3 }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '22 / 9',
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: -1,
                left: 0,
                right: 0,
                width: '100%',
                aspectRatio: '22 / 9',
                backgroundImage: `linear-gradient(180deg, rgba(244, 244, 244, 0) 65.43%, ${profile.site_setting.background_color} 100%), url(${profile?.background_image})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            />

            {/* Thông báo dạng marquee nếu có */}
            {profile?.notice && (
              <Box
                className="loop-container"
                sx={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  backgroundColor: `${profile.site_setting.notice_background_color}99`,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  WebkitBackdropFilter: 'blur(12px)',
                  backdropFilter: 'blur(12px)',
                  '--tw-backdrop-blur': 'blur(12px)',
                  isolation: 'isolate',
                }}
              >
                <Box
                  className="loop-track"
                  ref={trackRef}
                  sx={{
                    display: 'inline-block',
                    animation: duration ? `marquee ${duration}s linear infinite` : 'none',
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <Typography
                      key={i}
                      component="span"
                      className="loop-text"
                      color={profile.site_setting.notice_color}
                      sx={{ px: 2, fontWeight: 600 }}
                    >
                      {profile.notice}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {/* Avatar nổi bên dưới background */}
            <Avatar
              src={profile.avatar}
              alt={profile.display_name}
              sx={{
                position: 'absolute',
                bottom: -18,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 70,
                height: 70,
                boxShadow: '0px 2.57px 6.42px 0px #00000026',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }} color={profile.site_setting.main_text_color}>
              {profile.display_name}
            </Typography>

            <Typography variant="body2" color={profile.site_setting.sub_text_color} sx={{ mb: 1 }}>
              @{profile.username}
            </Typography>

            <Typography
              variant="body2"
              color={profile.site_setting.sub_text_color}
              align="center"
              sx={{ whiteSpace: 'pre-line', maxWidth: '80%' }}
            >
              {profile.description}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                px: '56px',
                gap: 2,
                my: 2.5,
              }}
            >
              {Object.entries(profile.socials).map(([social, data]) => {
                if (!data.enabled) return null;
                return (
                  <IconButton
                    sx={{
                      p: 0,
                    }}
                    key={social}
                  >
                    {SOCIAL_ICON[social as keyof typeof SOCIAL_LINKS]}
                  </IconButton>
                );
              })}
            </Box>
          </Box>

          <Box
            sx={{
              p: '0 26px',
            }}
          >
            <Paper
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{
                p: '2px 16px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                boxShadow: '0px 5.35px 40.1px 0px #0000001A',
                borderRadius: '13px',
              }}
            >
              <IconSearch />
              <InputBase
                sx={{ ml: 0, flex: 1 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                inputProps={{
                  'aria-label': 'search',
                  color: profile.site_setting.main_text_color,
                }}
              />
            </Paper>
          </Box>
        </Box>

        {/* Product list */}

        <ProductGroupList />

        {/*Footer */}
        <Box textAlign="center" marginTop={4} marginBottom={10}>
          <Typography fontSize="13.25px" color="#707B90">
            <Typography component="span" fontSize="13.25px" color="#2C313E" fontWeight="600">
              TokTak
            </Typography>{' '}
            – All links in one place
          </Typography>
          <Typography fontSize="13.25px" color="#686D76">
            ©2025 TokTak
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
