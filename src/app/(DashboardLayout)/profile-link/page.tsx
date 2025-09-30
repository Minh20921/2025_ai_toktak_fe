'use client';

import { productAPI } from '@/app/(DashboardLayout)/profile-link/api/product';
import { profileAPI } from '@/app/(DashboardLayout)/profile-link/api/profile';
import { LayoutOption, SOCIAL_LINKS, STATUS } from '@/app/(DashboardLayout)/profile-link/components/const';
import ProfileHome from '@/app/(DashboardLayout)/profile-link/components/profile-home';
import ProfilePreview from '@/app/(DashboardLayout)/profile-link/components/profile-preview';
import SeoHead from '@/app/components/SeoHead';
import { setProduct, setProfile, setTreeNodes } from '@/app/lib/store/profileSlice';
import type { RootState } from '@/app/lib/store/store';
import { SEO_DATA_PROFILE_LINK } from '@/utils/constant';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { IconAdd, IconEdit, IconLink, IconProduct } from '@/utils/icons/profileLink';
import { Icon } from '@iconify/react';
import { Box, Button, CircularProgress, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import API from '@service/api';
import { uniqueId } from 'lodash';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GroupListResponse, Product, TreeNode } from './@type/interface';

const multipleLinkDomain = process.env.NEXT_PUBLIC_MUITIPLE_LINK_DOMAIN || 'link.toktak.ai';

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const profile = useSelector((state: RootState) => state.profile);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [reload, setReload] = useState(uniqueId());
  const [loading, setLoading] = useState(true);
  const [countLoading, setCountLoading] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const apiCheckMultilinkConnect = useRef(
    new API('/api/v1/user/check_multi_link_sns', 'GET', {
      success: (res, dataSource) => {
        if (res.code == 200) {
          router.push('/profile-link/edit');
        } else if (res.code == 201) {
          showNotice(
            `🔗 멀티링크로 영향력을 확장해 보세요. `,
            `스탠다드 요금제에서 더 많은 생성과 SNS 배포,<br>수익화가 가능합니다.`,
            true,
            '확인',
            '취소',
            () => {
              router.push('/rate-plan');
            },
          );
        } else {
          showNoticeError(res?.message || '', res?.data?.error_message || '', false, '확인');
        }
      },
      error: (err) => {},
    }),
  );

  const handleConnectButton = async () => {
    await apiCheckMultilinkConnect.current.call();
  };

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
                avatar: data.member_avatar,
                background_image: data.member_background || '',
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
                  activeId: null,
                  overId: null,
                  activeItemType: null,
                  isDragging: false,
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${multipleLinkDomain}/${profile.username}` || '');
    showNotice('복사 완료', '링크가 복사되었습니다.', false, '확인');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', background: '#FFFFFF' }}>
      <SeoHead {...SEO_DATA_PROFILE_LINK} />
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
      {profile.status == STATUS.NOT_CREATED ? (
        <ProfileHome />
      ) : (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            position: 'relative',
            pt: { xs: '60px', sm: 0 },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            {isMobile ? (
              <Box sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: 64, zIndex: 20 }}>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: profile.status != STATUS.CREATED ? -76 : -40,
                    right: 18,
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    zIndex: 20,
                    backgroundColor: '#4776EF',
                    '&:hover': {
                      backgroundColor: '#4776EF',
                    },
                  }}
                  onClick={() => router.push('/profile-link/edit')}
                >
                  <Icon icon={'fluent:edit-12-regular'} width={20} height={20} className="text-white" />
                </IconButton>

                {profile.status != STATUS.CREATED && (
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
                )}
              </Box>
            ) : profile.status == STATUS.CREATED ? (
              <Box sx={{ position: 'absolute', top: 40, left: 40 }}>
                <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                  <Box sx={{ mb: 3, zIndex: 9999 }}>
                    <Typography
                      sx={{
                        fontSize: '30px',
                        lineHeight: '26px',
                        height: '36px',
                        mb: '18px',
                      }}
                      component="h1"
                      fontWeight="bold"
                    >
                      멀티링크
                    </Typography>
                    <p style={{ color: '#909090', fontSize: '20px', fontWeight: 500 }}>
                      지금 프로필 링크를 생성하세요!
                    </p>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<IconAdd className="text-[#4776EF]" />}
                    onClick={() => handleConnectButton()}
                    sx={{
                      width: 'fit-content',
                      height: '47px',
                      border: 'none',
                      borderRadius: '9999px',
                      textTransform: 'none',
                      py: '14px',
                      px: '21px',
                      color: '#4776EF',
                      backgroundColor: '#EFF5FF',
                      '&:hover': {
                        backgroundColor: '#e0e7ff',
                        borderColor: '#4f46e5',
                      },
                      fontWeight: 600,
                    }}
                  >
                    프로필 링크 생성하기
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ position: 'absolute', top: 40, left: 40 }}>
                <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 3, zIndex: 9999 }}>
                    <Typography
                      sx={{
                        fontSize: '30px',
                        lineHeight: '26px',
                        height: '36px',
                        mb: '18px',
                      }}
                      component="h1"
                      fontWeight="bold"
                    >
                      멀티링크
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
                      <Typography
                        component="span"
                        color="#C5CAD1"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '16.49px',
                          lineHeight: '24px',
                        }}
                      >
                        <IconLink className="w-6 h-6" />
                        {multipleLinkDomain}/
                      </Typography>
                      <Typography component="span" color="#090909" sx={{ fontSize: '16.49px', lineHeight: '24px' }}>
                        {profile.username || 'User Account'}
                      </Typography>
                      <IconButton
                        sx={{ border: '1px solid #C5CAD1', borderRadius: 2, p: '9px', width: 'fit-content', ml: 1 }}
                        onClick={handleCopy}
                      >
                        <Icon icon={'tabler:copy'} className="cursor-pointer" width={20} height={20} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<IconEdit className="text-[#4776EF]" />}
                    onClick={() => router.push('/profile-link/edit')}
                    sx={{
                      maxWidth: '179px',
                      height: '47px',
                      border: 'none',
                      borderRadius: '9999px',
                      textTransform: 'none',
                      py: '14px',
                      px: '21px',
                      color: '#4776EF',
                      mb: 2.5,
                      backgroundColor: '#EFF5FF',
                      '&:hover': {
                        backgroundColor: '#e0e7ff',
                        borderColor: '#4f46e5',
                      },
                      fontWeight: 600,
                    }}
                  >
                    프로필 링크 설정
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<IconProduct className="text-[#4776EF]" />}
                    onClick={() => router.push('/profile-link/edit?tab=2')}
                    sx={{
                      maxWidth: '179px',
                      height: '47px',
                      border: 'none',
                      borderRadius: '9999px',
                      textTransform: 'none',
                      py: '14px',
                      px: '21px',
                      color: '#4776EF',
                      backgroundColor: '#EFF5FF',
                      '&:hover': {
                        backgroundColor: '#e0e7ff',
                        borderColor: '#4f46e5',
                      },
                      fontWeight: 600,
                    }}
                  >
                    상품 관리
                  </Button>
                </Box>
              </Box>
            )}
            <ProfilePreview />
          </Box>
        </Box>
      )}
    </Box>
  );
}
