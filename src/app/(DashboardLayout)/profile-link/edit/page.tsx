'use client';

import { Box, Button, CircularProgress, Typography, useMediaQuery, useTheme, Drawer, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ProfileEditor from '@/app/(DashboardLayout)/profile-link/components/profile-editor';
import ProfilePreview from '@/app/(DashboardLayout)/profile-link/components/profile-preview';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/lib/store/store';
import { IconEdit, IconLink } from '@/utils/icons/profileLink';
import {
  clearDeletedProducts,
  clearGroupsChanges,
  clearTempProducts,
  setFieldName,
  setProduct,
  setProfile,
  setTreeNodes,
} from '@/app/lib/store/profileSlice';
import { SOCIAL_LINKS, STATUS, LayoutOption } from '@/app/(DashboardLayout)/profile-link/components/const';
import { profileAPI } from '@/app/(DashboardLayout)/profile-link/api/profile';
import { productAPI } from '@/app/(DashboardLayout)/profile-link/api/product';
import { uniqueId } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { showNotice } from '@/utils/custom/notice';
import type {
  GroupListResponse,
  GroupWithProducts,
  Product,
  TreeNode,
} from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { Icon } from '@iconify/react';

const multipleLinkDomain = process.env.NEXT_PUBLIC_MUITIPLE_LINK_DOMAIN || 'link.toktak.ai';

export default function EditProfile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const profile = useSelector((state: RootState) => state.profile);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = isMobile ? '100%' : 585;
  const [reload, setReload] = useState(uniqueId());
  const [loading, setLoading] = useState(true);
  const [countLoading, setCountLoading] = useState<number>(0);
  const [tabEdit, setTabEdit] = useState(0);
  const isIntercepting = useRef(false);
  const original = useRef(profile);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setTabEdit(parseInt(tab));
    }
  }, [searchParams]);

  useEffect(() => {
    const message = '정말 페이지를 나가시겠어요?';
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isSaving) {
        event.preventDefault();
        event.returnValue = message;
      }
    };

    const handlePopState = () => {
      if (!isSaving && !window.confirm(message)) {
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const originalPush = router.push;

    router.push = async (url: string) => {
      if (url === pathname || isIntercepting.current) return;
      if (window.__skipConfirm) {
        window.__skipConfirm = false;
        return originalPush(url);
      }

      isIntercepting.current = true;

      showNotice(
        '정말 페이지를 나가시겠어요?',
        '🚨 저장되지 않은 설정은 복구할 수 없어요.',
        true,
        '나가기',
        '취소',
        () => {
          originalPush(url);
        },
      );

      isIntercepting.current = false;
    };

    return () => {
      router.push = originalPush;
    };
  }, [pathname, router]);

  useEffect(() => {
    setLoading(true);
    try {
      (async () => {
        await profileAPI.getProfile().then((data) => {
          setCountLoading((prevState) => prevState + 1);
          if (data) {
            dispatch(
              setProfile({
                id: data.user_id,
                avatar: data.member_avatar || '/images/profile-link/avatar-default.png',
                background_image: data.member_background || '/images/profile-link/background-default.png',
                notice: data.content,
                description: data.description,
                display_name: data.member_name,
                username: data.nick_name,
                site_setting: { ...profile.site_setting, ...data.design_settings },
                status: data.status,
                is_check_name: !!data.nick_name,
                isClearingTree: false,
                socials: {
                  [SOCIAL_LINKS.facebook]: {
                    enabled: data.social_is_facebook,
                    url: data.social_facebook_url,
                  },
                  [SOCIAL_LINKS.x]: {
                    enabled: data.social_is_x,
                    url: data.social_x_url,
                  },
                  [SOCIAL_LINKS.instagram]: {
                    enabled: data.social_is_instagram,
                    url: data.social_instagram_url,
                  },
                  [SOCIAL_LINKS.youtube]: {
                    enabled: data.social_is_youtube,
                    url: data.social_youtube_url,
                  },
                  [SOCIAL_LINKS.spotify]: {
                    enabled: data.social_is_spotify,
                    url: data.social_spotify_url,
                  },
                  [SOCIAL_LINKS.threads]: {
                    enabled: data.social_is_thread,
                    url: data.social_thread_url,
                  },
                  [SOCIAL_LINKS.tiktok]: {
                    enabled: data.social_is_tiktok,
                    url: data.social_tiktok_url,
                  },
                },
                rootProductsPage: 1,
                rootProductsHasMore: true,
                loading: false,
                dragState: {
                  isDragging: false,
                  activeId: null,
                  overId: null,
                  activeItemType: null,
                  dragOffset: 0,
                  originalTreeState: null,
                  savedCollapsedState: null,
                },
                productChanges: {
                  movedProducts: [],
                  reorderedGroups: [],
                  pendingChanges: false,
                },
              }),
            );
            (async () => {
              await productAPI
                .getGroups({
                  page: 1,
                  per_page: 9999,
                  user_id: data.user_id,
                  type_order: 'id_asc',
                })
                .then((response: GroupListResponse) => {
                  if (response) {
                    // Set all products
                    const allProducts = response.data.flatMap((group) => group.products);
                    dispatch(setProduct(allProducts));

                    // Create tree nodes structure
                    const treeNodes: TreeNode[] = [];

                    // First, add root level products (from group id = 0)
                    const rootGroup = response.data.find((group) => group.group.id == '0');
                    if (rootGroup && rootGroup.products) {
                      rootGroup.products.forEach((product) => {
                        treeNodes.push({
                          id: product.id.toString(),
                          type: 'product',
                          product: { ...product, order_no: product.order_no || 0 },
                          parentId: undefined,
                          order_no: product.order_no || 0,
                        });
                      });
                    }

                    // Then add other groups and their products
                    response.data
                      .filter((group) => group.group.id != '0')
                      .forEach((group) => {
                        const groupNode: TreeNode = {
                          id: group.group.id.toString(),
                          type: 'group',
                          title: group.group.name,
                          titleType: (group.group.title_type || 'left') as LayoutOption,
                          order_no: group.group.order_no || 0,
                          isOpen: false,
                          children: [],
                        };

                        if (group.products && group.products.length > 0) {
                          groupNode.children = group.products.map((product: Product) => ({
                            id: product.id.toString(),
                            type: 'product',
                            product: { ...product, order_no: product.order_no || 0 },
                            parentId: group.group.id,
                          }));
                        }

                        treeNodes.push(groupNode);
                      });

                    // Sort treeNodes by order_no, then by updated_at (newest first) if order_no is equal
                    treeNodes.sort((a, b) => {
                      const orderDiff = (a.order_no || 0) - (b.order_no || 0);
                      if (orderDiff !== 0) {
                        return orderDiff;
                      }

                      // If order_no is equal, sort by created_at (newest first)
                      const aCreatedAt = a.product?.created_at || '';
                      const bCreatedAt = b.product?.created_at || '';

                      if (aCreatedAt && bCreatedAt) {
                        return new Date(bCreatedAt).getTime() - new Date(aCreatedAt).getTime();
                      }

                      return 0;
                    });

                    dispatch(setTreeNodes(treeNodes));
                  }
                })
                .finally(() => {
                  setTimeout(() => setLoading(false), 1000);
                });
            })();
          }
        });
      })();
    } catch (e) {
      console.log(e);
    }
  }, [reload]);

  const isProductsChanged = () => {
    const updatedProducts = profile.treeNodes
      .filter((node) => node.type === 'product')
      .map((node) => node.product)
      .filter(Boolean) as Product[];
    const originalProducts = original.current?.treeNodes
      .filter((node) => node.type === 'product')
      .map((node) => node.product)
      .filter(Boolean) as Product[];
    return JSON.stringify(updatedProducts) !== JSON.stringify(originalProducts);
  };

  const isGroupsChanged = () => {
    const updatedGroups = profile.treeNodes
      .filter((node) => node.type === 'group')
      .map((node) => ({
        id: node.id,
        type: 'group' as const,
        title: node.title,
        titleType: node.titleType,
        order_no: node.order_no,
        isOpen: false,
        children:
          node.children?.map((child) => ({
            id: child.id,
            type: 'product' as const,
            product: child.product,
            parentId: node.id,
          })) || [],
      }));
    const originalGroups = original.current?.treeNodes
      .filter((node) => node.type === 'group')
      .map((node) => ({
        id: node.id,
        type: 'group' as const,
        title: node.title,
        titleType: node.titleType,
        order_no: node.order_no,
        isOpen: false,
        children:
          node.children?.map((child) => ({
            id: child.id,
            type: 'product' as const,
            product: child.product,
            parentId: node.id,
          })) || [],
      }));
    return JSON.stringify(updatedGroups) !== JSON.stringify(originalGroups);
  };

  const handleSave = async () => {
    showNotice(
      '설정을 저장하시겠습니까?',
      '🚨 저장한 설정은 즉시 라이브에 반영됩니다.',
      true,
      '저장하기',
      '취소',
      async () => {
        try {
          setIsSaving(true);

          if (JSON.stringify(profile) !== JSON.stringify(original.current)) {
            await profileAPI.updateProfile({
              member_avatar: profile.avatar_file,
              member_background: profile.background_file,
              member_name: profile.display_name,
              nick_name: profile.username,
              description: profile.description,
              content: profile.notice,
              social_is_facebook: profile.socials[SOCIAL_LINKS.facebook].enabled,
              social_is_instagram: profile.socials[SOCIAL_LINKS.instagram].enabled,
              social_is_tiktok: profile.socials[SOCIAL_LINKS.tiktok].enabled,
              social_is_x: profile.socials[SOCIAL_LINKS.x].enabled,
              social_is_youtube: profile.socials[SOCIAL_LINKS.youtube].enabled,
              social_is_thread: profile.socials[SOCIAL_LINKS.threads].enabled,
              social_facebook_url: profile.socials[SOCIAL_LINKS.facebook].url,
              social_instagram_url: profile.socials[SOCIAL_LINKS.instagram].url,
              social_thread_url: profile.socials[SOCIAL_LINKS.threads].url,
              social_tiktok_url: profile.socials[SOCIAL_LINKS.tiktok].url,
              social_x_url: profile.socials[SOCIAL_LINKS.x].url,
              social_youtube_url: profile.socials[SOCIAL_LINKS.youtube].url,
              social_spotify_url: profile.socials[SOCIAL_LINKS.spotify].url,
              social_is_spotify: profile.socials[SOCIAL_LINKS.spotify].enabled,
            });
          }
          if (JSON.stringify(profile.site_setting) !== JSON.stringify(original.current?.site_setting)) {
            await profileAPI.updateSiteSetting(profile.site_setting);
          }
          if (isProductsChanged()) {
            const updatedProducts = profile.treeNodes
              .filter((node) => node.type === 'product')
              .map((node) => node.product)
              .filter(Boolean) as Product[];

            const productsToCreate = updatedProducts.filter((product) => product.id.toString().startsWith('temp_'));
            if (productsToCreate.length > 0) {
              await productAPI.createProduct(productsToCreate);
            }

            const productsToDelete = profile.deletedProductIds.filter(
              (id) => !id.toString().startsWith('temp_') || !id.toString().startsWith('group-'),
            );
            if (productsToDelete.length > 0) {
              await productAPI.deleteProduct(productsToDelete);
            }

            const productsToUpdate = updatedProducts.filter((product) => !product.id.toString().startsWith('temp_'));
            if (productsToUpdate.length > 0) {
              const formatProducts = productsToUpdate.map((product) => ({
                id: product.id,
                group_id: product.group_id,
                group_name: product.group_name,
                order_no: product.order_no,
                product_name: product.product_name,
                product_url: product.product_url,
                product_image: product.product_image,
                price: product.price,
              }));
              await productAPI.updateProductsMulti(formatProducts);
            }
          }
          if (isGroupsChanged()) {
            const updatedGroups = profile.treeNodes
              .filter((node) => node.type === 'group')
              .map((node) => ({
                id: node.id,
                type: 'group' as const,
                title: node.title,
                titleType: node.titleType,
                order_no: node.order_no,
                isOpen: false,
                children:
                  node.children?.map((child) => ({
                    id: child.id,
                    type: 'product' as const,
                    product: child.product,
                    parentId: node.id,
                  })) || [],
              }));

            if (!isProductsChanged()) {
              const productsToDelete = profile.deletedProductIds.filter(
                (id) => !id.toString().startsWith('temp_') || !id.toString().startsWith('group-'),
              );
              if (productsToDelete.length > 0) {
                await productAPI.deleteProduct(productsToDelete);
              }
            }
            const groupsToCreate = updatedGroups.filter((group) => group.id.toString().startsWith('group-'));
            if (groupsToCreate.length > 0) {
              await productAPI.createGroup(groupsToCreate);
            }

            const groupsToUpdate = updatedGroups.filter((group) => !group.id.toString().startsWith('group-'));
            if (groupsToUpdate.length > 0) {
              await productAPI.updateGroup(groupsToUpdate);
            }

            const groupsToDelete = profile.deletedGroupIds.map((id) => id.toString());
            if (groupsToDelete.length > 0) {
              await productAPI.deleteGroup(groupsToDelete);
            }
          }

          dispatch(clearTempProducts());
          dispatch(clearDeletedProducts());
          dispatch(clearGroupsChanges());

          window.__skipConfirm = true;
          router.push('/profile-link');
        } catch (error) {
          console.error('Failed to save:', error);
          showNotice('오류', '저장 중 오류가 발생했습니다.', false, '확인');
        } finally {
          setIsSaving(false);
        }
      },
    );
  };

  const handleCancel = () => {
    showNotice(
      '정말 페이지를 나가시겠어요?',
      '🚨 저장되지 않은 설정은 복구할 수 없어요.',
      true,
      '나가기',
      '취소',
      () => {
        window.__skipConfirm = true;
        dispatch({ type: 'profile/clearTempProducts' });
        dispatch(clearDeletedProducts());
        router.push('/profile-link');
      },
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${multipleLinkDomain}/${profile.username}`);
    showNotice('복사 완료', '링크가 복사되었습니다.', false, '확인');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100dvh',
        overflow: isMobile ? 'hidden' : 'auto',
        position: 'relative',
        background: '#FFFFFF',
      }}
    >
      {loading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={5}
          bgcolor={`rgba(255,255,255,${!countLoading ? 1 : 0.8})`}
          display="flex"
          justifyContent="center"
          alignItems="center"
          pb={30}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100%',
          overflow: isMobile ? 'hidden' : 'auto',
          display: 'flex',
          position: 'relative',
        }}
      >
        <ProfileEditor drawerWidth={drawerWidth} tabDefault={tabEdit} />
        {!isMobile && (
          <Box
            sx={{
              flexGrow: 1,
              height: '100%',
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: '#F8F8F8',
              ml: isMobile ? 0 : `${drawerWidth}px`,
            }}
          >
            <ProfilePreview />
          </Box>
        )}
        {/* Desktop button group */}
        {!isMobile && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              p: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              onClick={handleCancel}
              variant="contained"
              disabled={isSaving}
              sx={{
                borderRadius: 6,
                p: '12px 38px',
                bgcolor: '#EFF5FF',
                fontSize: '14.47px',
                fontWeight: '600',
                lineHeight: '17px',
                color: '#4776EF',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#EFF5FF',
                },
              }}
            >
              나가기
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={isSaving || !profile.is_check_name}
              sx={{
                borderRadius: 6,
                p: '12px 38px',
                bgcolor: '#4776EF',
                fontSize: '14.47px',
                fontWeight: '600',
                lineHeight: '17px',
                color: '#FFFFFF',
                '&:hover': {
                  bgcolor: '#2f66f0',
                },
              }}
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </Button>
          </Box>
        )}
        {/* Mobile fixed bottom button group */}
        {isMobile && !previewOpen && (
          <Box
            sx={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
              background: 'white',
              p: 2,
              display: 'flex',
              gap: 2,
              boxShadow: '0 -2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <Button
              variant="outlined"
              sx={{
                width: '50%',
                height: 50,
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '16px',
                color: '#4776EF',
                bgcolor: '#FFFFFF',
                border: '1.5px solid #4776EF',
                boxShadow: 'none',
              }}
              onClick={() => setPreviewOpen(true)}
            >
              미리보기
            </Button>
            <Button
              variant="contained"
              sx={{
                width: '50%',
                height: 50,
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '16px',
                bgcolor: '#4776EF',
                color: 'white',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#4776EF' },
              }}
              disabled={isSaving || !profile.is_check_name}
              onClick={handleSave}
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </Button>
          </Box>
        )}
        {/* Mobile Preview Drawer */}
        {isMobile && (
          <Drawer
            anchor="bottom"
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            PaperProps={{
              sx: {
                height: '100dvh',
                maxHeight: '100dvh',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                overflow: 'hidden',
              },
            }}
          >
            <Box sx={{ height: '100dvh', overflow: 'auto', bgcolor: '#F8F8F8' }}>
              <IconButton
                onClick={() => setPreviewOpen(false)}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 18,
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  zIndex: 1000,
                  backgroundColor: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#F6F6F6',
                  },
                }}
              >
                <Icon icon={'tabler:x'} width={28} height={28} color="#000000" />
              </IconButton>
              <ProfilePreview />
              <Box sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: 64, zIndex: 20 }}>
                <Box
                  sx={{
                    backgroundColor: '#FFFFFF',
                    p: '8px 18px 20px',
                    width: '100%',
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      border: '1px solid #C5CAD1',
                      borderRadius: '6px',
                      p: 1,
                    }}
                  >
                    <Typography
                      component="span"
                      color="#C5CAD1"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        lineHeight: '20px',
                      }}
                    >
                      <IconLink className="w-6 h-6" />
                      {multipleLinkDomain}/
                    </Typography>
                    <Typography component="span" color="#090909" sx={{ fontSize: '14px', lineHeight: '20px' }}>
                      {profile.username || 'User Account'}
                    </Typography>
                  </Box>
                  <IconButton
                    sx={{ border: '1px solid #C5CAD1', borderRadius: 2, p: '9px', width: 'fit-content', ml: 1 }}
                    onClick={handleCopy}
                  >
                    <Icon icon={'tabler:copy'} className="cursor-pointer" width={20} height={20} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Drawer>
        )}
      </Box>
    </Box>
  );
}
