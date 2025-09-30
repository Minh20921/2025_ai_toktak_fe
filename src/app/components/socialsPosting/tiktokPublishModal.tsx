'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Material UI imports
import {
  Box,
  Button,
  Dialog,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import type { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { IconVideo } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/lib/store/store';
import { TikTok } from '@/utils/icons/socials';
import { IconImage } from '@/utils/icons/advanced';
import API from '@service/api';
import { toast } from '@/app/components/common/Toast';
import { showNoticeError } from '@/utils/custom/notice_error';

interface TikTokPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoData: PostData;
  imageData: PostData;
  onPublish: () => void;
}

export default function TikTokPublishModal({
  isOpen,
  onClose,
  videoData,
  imageData,
  onPublish,
}: TikTokPublishModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const platform = useSelector((state: RootState) => state.platform);
  // Content type toggle (video or image)
  const [contentType, setContentType] = useState<'video' | 'image'>('video');

  // Common fields
  const [titleVideo, setTitleVideo] = useState(videoData.description || '');
  const [hashtagVideo, setHashtagVideo] = useState(videoData.hashtag || '');
  const [privacyVideo, setPrivacyVideo] = useState('PUBLIC_TO_EVERYONE');
  const [privacyImage, setPrivacyImage] = useState('PUBLIC_TO_EVERYONE');

  // Video-specific fields
  const [allowCommentsVideo, setAllowCommentsVideo] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [allowStitch, setAllowStitch] = useState(true);
  const [discloseContent, setDiscloseContent] = useState(false);
  const [yourBrand, setYourBrand] = useState(false);
  const [brandedContent, setBrandedContent] = useState(false);

  // Tooltip states
  const [showPrivateTooltip, setShowPrivateTooltip] = useState(false);
  const [showWarningTooltip, setShowWarningTooltip] = useState(false);
  const [showPublishTooltip, setShowPublishTooltip] = useState(false);

  // Image-specific fields
  const [titleImage, setTitleImage] = useState(imageData.description || '');
  const [hashtagImage, setHashtagImage] = useState(videoData.hashtag || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allowCommentsImage, setAllowCommentsImage] = useState(true);

  const handleContentTypeChange = (event: React.MouseEvent<HTMLElement>, newContentType: 'video' | 'image' | null) => {
    if (newContentType !== null) {
      setContentType(newContentType);
    }
  };

  useEffect(() => {
    setTitleImage(imageData?.description || '');
    setHashtagImage(imageData.hashtag || '');
    setTitleVideo(videoData.title || '');
    setHashtagVideo(videoData.hashtag || '');
  }, [imageData, videoData]);

  useEffect(() => {
    // If branded content is selected, disable private visibility
    if (brandedContent && contentType === 'video' && privacyVideo === 'SELF_ONLY') {
      setPrivacyVideo('PUBLIC_TO_EVERYONE');
    }

    if (brandedContent && contentType === 'image' && privacyImage === 'SELF_ONLY') {
      setPrivacyImage('PUBLIC_TO_EVERYONE');
    }
  }, [brandedContent, contentType]);

  const apiSave = useRef(
    new API('/api/v1/post/edit_post ', 'POST', {
      success: (res) => {
        if (res?.code === 201) {
          showNoticeError(res?.message, '', false, '확인', '취소', () => {
            // setLoading(false);
          });
        } else {
          toast.success('게시물이 편집되었습니다!');
        }
      },
      error: (err) => {
        toast.error(err.message);
      },
      finally: () => {},
    }),
  );

  const isPublishDisabled = () => {
    if (discloseContent && !yourBrand && !brandedContent) {
      return true;
    }
    return isSubmitting;
  };

  const getDisclosureLabel = () => {
    if (yourBrand && brandedContent) {
      return "Your photo/video will be labeled as 'Paid partnership'";
    } else if (yourBrand) {
      return "Your photo/video will be labeled as 'Promotional content'";
    } else if (brandedContent) {
      return "Your photo/video will be labeled as 'Paid partnership'";
    }
    return '';
  };

  const handlePublishNow = async () => {
    try {
      setIsSubmitting(true);

      // Prepare the payload according to content type
      apiSave.current.config.data = {
        post_id: videoData?.id,
        title: videoData?.title,
        hashtag: videoData?.hashtag,
        content: videoData?.content,
        subtitle: videoData?.subtitle,
        description: titleVideo || [],
        disable_comment: !allowCommentsVideo,
        disable_duet: !allowDuet,
        disable_stitch: !allowStitch,
        privacy_level: privacyVideo,
      };
      await apiSave.current.call();
      apiSave.current.config.data = {
        post_id: imageData?.id,
        title: imageData?.title,
        hashtag: imageData?.hashtag,
        content: imageData?.content,
        subtitle: imageData?.subtitle,
        description: titleImage || [],
        disable_comment: !allowCommentsImage,
        privacy_level: privacyImage,
      };
      await apiSave.current.call();

      // Simulate API call
      await new Promise((resolve) => {
        onPublish();
        setTimeout(resolve, 1000);
      });

      // Close the modal after successful submission
      onClose();
    } catch (error) {
      console.error(`Error publishing ${contentType} to TikTok:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: fullScreen ? '100%' : '90vh',
          maxHeight: '90vh',
          m: 2,
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha('#4776EF', 0.5)} 0%, ${alpha('#4776EF', 0.02)} 100%)`,
          boxShadow: `0 8px 32px ${alpha('#4776EF', 0.15)}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%' }}>
        {/* Left side - Media Display */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '300px', md: 'auto' },
            bgcolor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            borderRight: { md: `1px solid ${alpha('#4776EF', 0.1)}` },
          }}
        >
          {contentType === 'video' ? (
            // Video display
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <video
                src={videoData?.video_url}
                controls
                poster={videoData?.thumbnail}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
          ) : (
            // Image display - use Swiper
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              style={{ width: '100%', height: '100%' }}
            >
              {(imageData.images || []).map((img, index) => (
                <SwiperSlide key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={img || '/placeholder.svg?height=800&width=400&text=Image'}
                    alt={`Media ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Box>

        {/* Right side - Settings */}
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', md: '50%' },
            p: { xs: 2, sm: 3 },
            pb: '0 !important',
            overflowY: 'auto',
            bgcolor: '#fff',
          }}
        >
          <Box mb={3}>
            <Paper
              elevation={0}
              sx={{
                p: 1,
                bgcolor: alpha('#4776EF', 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha('#4776EF', 0.1)}`,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  component="span"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: alpha('#4776EF', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TikTok />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {platform.tiktok.name}
                </Typography>
              </Stack>
            </Paper>
          </Box>

          {/* Content Type Toggle */}
          <Box mb={3}>
            <ToggleButtonGroup
              value={contentType}
              exclusive
              onChange={handleContentTypeChange}
              aria-label="content type"
              fullWidth
              sx={{
                '& .MuiToggleButton-root': {
                  borderColor: alpha('#4776EF', 0.2),
                  '&.Mui-selected': {
                    backgroundColor: alpha('#4776EF', 0.1),
                    color: '#4776EF',
                    borderColor: '#4776EF',
                  },
                  '&:hover': {
                    backgroundColor: alpha('#4776EF', 0.05),
                  },
                },
              }}
            >
              <ToggleButton value="video" aria-label="video content">
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconVideo />
                  <Typography>Video</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="image" aria-label="image content">
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconImage className="w-6 h-6" />
                  <Typography>Image</Typography>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Stack spacing={3}>
            {/* Title */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Typography variant="subtitle1" fontWeight="600">
                  {contentType === 'video' ? 'Video Title' : 'Image Title'}
                </Typography>
              </Stack>
              <TextField
                fullWidth
                value={contentType === 'video' ? titleVideo : titleImage}
                onChange={(e) =>
                  contentType === 'video' ? setTitleVideo(e.target.value) : setTitleImage(e.target.value)
                }
                placeholder={`Enter ${contentType} title`}
                size="small"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#4776EF', 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4776EF',
                    },
                    '.MuiInputBase-root': {
                      padding: 0,
                      border: 'none!important',
                      color: '#686868',
                    },
                    '.MuiInputBase-input:focus-visible': {
                      '--tw-ring-offset-shadow': 'transparent!important',
                    },
                  },
                }}
              />
            </Box>
            {/* Hashtag */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Typography variant="subtitle1" fontWeight="600">
                  {contentType === 'video' ? 'Video Hashtag' : 'Image Hashtag'}
                </Typography>
              </Stack>
              <TextField
                fullWidth
                value={contentType === 'video' ? hashtagVideo : hashtagImage}
                onChange={(e) =>
                  contentType === 'video' ? setHashtagVideo(e.target.value) : setHashtagImage(e.target.value)
                }
                placeholder={`Enter ${contentType} hashtag`}
                size="small"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#4776EF', 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4776EF',
                    },
                    '.MuiInputBase-root': {
                      padding: 0,
                      border: 'none!important',
                      color: '#686868',
                    },
                    '.MuiInputBase-input:focus-visible': {
                      '--tw-ring-offset-shadow': 'transparent!important',
                    },
                  },
                }}
              />
            </Box>
            {/* Privacy Settings */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Typography variant="subtitle1" fontWeight="600">
                  Who can view this {contentType}
                </Typography>
              </Stack>
              <FormControl fullWidth size="small">
                <Select
                  value={contentType === 'video' ? privacyVideo : privacyImage}
                  onChange={(e) =>
                    contentType === 'video' ? setPrivacyVideo(e.target.value) : setPrivacyImage(e.target.value)
                  }
                  sx={{
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#4776EF', 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4776EF',
                    },
                  }}
                >
                  <MenuItem value="PUBLIC_TO_EVERYONE">Public</MenuItem>
                  <MenuItem value="MUTUAL_FOLLOW_FRIENDS">Friends</MenuItem>
                  {/*<MenuItem value="FOLLOWER_OF_CREATOR">Follower</MenuItem>*/}
                  {brandedContent ? (
                    <Tooltip
                      title="Branded content visibility cannot be set to private"
                      placement="right-start"
                      arrow
                      enterDelay={100}
                    >
                      <span>
                        <MenuItem value="SELF_ONLY" disabled>
                          Private
                        </MenuItem>
                      </span>
                    </Tooltip>
                  ) : (
                    <MenuItem value="SELF_ONLY">Private</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                <Typography variant="subtitle1" fontWeight="600">
                  Allow users to
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${alpha('#4776EF', 0.1)}`,
                      transition: 'all 0.2s ease',
                      bgcolor: allowDuet ? alpha('#4776EF', 0.03) : 'transparent',
                      '&:hover': {
                        boxShadow: `0 4px 12px ${alpha('#4776EF', 0.1)}`,
                      },
                    }}
                  >
                    {/* Comments Permission */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Allow Comments
                        </Typography>
                      </Stack>
                      <Switch
                        checked={contentType === 'video' ? allowCommentsVideo : allowCommentsImage}
                        onChange={(e) => {
                          contentType === 'video'
                            ? setAllowCommentsVideo(e.target.checked)
                            : setAllowCommentsImage(e.target.checked);
                        }}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#4776EF',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: alpha('#4776EF', 0.5),
                          },
                        }}
                      />
                    </Stack>
                  </Paper>
                </Grid>
                {contentType == 'video' && (
                  <Grid item xs={6} sm={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: `1px solid ${alpha('#4776EF', 0.1)}`,
                        transition: 'all 0.2s ease',
                        bgcolor: allowDuet ? alpha('#4776EF', 0.03) : 'transparent',
                        '&:hover': {
                          boxShadow: `0 4px 12px ${alpha('#4776EF', 0.1)}`,
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Duet
                        </Typography>
                        <Switch
                          checked={allowDuet}
                          onChange={(e) => setAllowDuet(e.target.checked)}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#4776EF',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: alpha('#4776EF', 0.5),
                            },
                          }}
                        />
                      </Stack>
                    </Paper>
                  </Grid>
                )}
                {contentType == 'video' && (
                  <Grid item xs={6} sm={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: `1px solid ${alpha('#4776EF', 0.1)}`,
                        transition: 'all 0.2s ease',
                        bgcolor: allowStitch ? alpha('#4776EF', 0.03) : 'transparent',
                        '&:hover': {
                          boxShadow: `0 4px 12px ${alpha('#4776EF', 0.1)}`,
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Stitch
                        </Typography>
                        <Switch
                          checked={allowStitch}
                          onChange={(e) => setAllowStitch(e.target.checked)}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#4776EF',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: alpha('#4776EF', 0.5),
                            },
                          }}
                        />
                      </Stack>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
            {/* Video-specific settings */}
            {contentType === 'video' && (
              <>
                {/* Disclose Video Content - Only for Videos */}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha('#4776EF', 0.1)}`,
                      transition: 'all 0.2s ease',
                      bgcolor: discloseContent ? alpha('#4776EF', 0.03) : 'transparent',
                      '&:hover': {
                        boxShadow: `0 4px 12px ${alpha('#4776EF', 0.1)}`,
                      },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight="600">
                          Disclose {contentType === 'video' ? 'Video' : 'Image'} Content
                        </Typography>
                      </Stack>
                      <Switch
                        checked={discloseContent}
                        onChange={(e) => {
                          setDiscloseContent(e.target.checked);
                          if (!e.target.checked) {
                            setYourBrand(false);
                            setBrandedContent(false);
                          }
                        }}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#4776EF',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: alpha('#4776EF', 0.5),
                          },
                        }}
                      />
                    </Stack>
                    {discloseContent && (
                      <>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          Indicate whether this content promotes yourself, a brand, product or service. You must select
                          at least one option below.
                        </Typography>

                        <Box sx={{ height: 1, bgcolor: alpha('#4776EF', 0.1), my: 2 }} />

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                border: `1px solid ${alpha('#4776EF', 0.1)}`,
                                transition: 'all 0.2s ease',
                                bgcolor: yourBrand ? alpha('#4776EF', 0.05) : 'white',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha('#4776EF', 0.1)}`,
                                },
                              }}
                            >
                              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body1" fontWeight="600">
                                    Your Brand
                                  </Typography>
                                </Stack>
                                <Switch
                                  checked={yourBrand}
                                  onChange={(e) => setYourBrand(e.target.checked)}
                                  size="small"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#4776EF',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: alpha('#4776EF', 0.5),
                                    },
                                  }}
                                />
                              </Stack>
                              <Typography variant="body2" color="text.secondary">
                                You are promoting yourself or your own business. This content will be classified as
                                Brand Organic.
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                border: `1px solid ${alpha('#4776EF', 0.1)}`,
                                transition: 'all 0.2s ease',
                                bgcolor: brandedContent ? alpha('#4776EF', 0.05) : 'white',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha('#4776EF', 0.1)}`,
                                },
                              }}
                            >
                              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body1" fontWeight="600">
                                    Branded Content
                                  </Typography>
                                </Stack>
                                <Switch
                                  checked={brandedContent}
                                  onChange={(e) => setBrandedContent(e.target.checked)}
                                  size="small"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#4776EF',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: alpha('#4776EF', 0.5),
                                    },
                                  }}
                                />
                              </Stack>
                              <Typography variant="body2" color="text.secondary">
                                You are promoting another brand or a third party. This content will be classified as
                                Branded Content.
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>

                        {/* Display the disclosure label */}
                        {(yourBrand || brandedContent) && (
                          <Box mt={2} p={2} bgcolor={alpha('#4776EF', 0.05)} borderRadius={2}>
                            <Typography variant="body2" fontWeight="500">
                              {getDisclosureLabel()}
                            </Typography>
                          </Box>
                        )}

                        {/* Display hover message when no options are selected */}
                        {!yourBrand && !brandedContent && (
                          <Box
                            mt={2}
                            p={2}
                            bgcolor={alpha('#FF4D4F', 0.05)}
                            borderRadius={2}
                            border={`1px solid ${alpha('#FF4D4F', 0.2)}`}
                            onMouseEnter={() => setShowWarningTooltip(true)}
                            onMouseLeave={() => setShowWarningTooltip(false)}
                          >
                            <Tooltip
                              title="You need to indicate if your content promotes yourself, a third party, or both."
                              placement="top"
                              arrow
                              open={showWarningTooltip}
                            >
                              <Typography variant="body2" color="error">
                                You need to indicate if your content promotes yourself, a third party, or both.
                              </Typography>
                            </Tooltip>
                          </Box>
                        )}
                      </>
                    )}
                  </Paper>
                </Box>
              </>
            )}

            {/* Image-specific settings */}
            {contentType === 'image' && (
              <>
                {/* Disclose Image Content - For Images */}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha('#4776EF', 0.1)}`,
                      transition: 'all 0.2s ease',
                      bgcolor: discloseContent ? alpha('#4776EF', 0.03) : 'transparent',
                      '&:hover': {
                        boxShadow: `0 4px 12px ${alpha('#4776EF', 0.1)}`,
                      },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight="600">
                          Disclose Image Content
                        </Typography>
                      </Stack>
                      <Switch
                        checked={discloseContent}
                        onChange={(e) => {
                          setDiscloseContent(e.target.checked);
                          if (!e.target.checked) {
                            setYourBrand(false);
                            setBrandedContent(false);
                          }
                        }}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#4776EF',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: alpha('#4776EF', 0.5),
                          },
                        }}
                      />
                    </Stack>
                    {discloseContent && (
                      <>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          Turn on to disclose that this image promotes goods or services in exchange for something of
                          value. Your image could promote yourself, a third party, or both.
                        </Typography>

                        <Box sx={{ height: 1, bgcolor: alpha('#4776EF', 0.1), my: 2 }} />

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                border: `1px solid ${alpha('#4776EF', 0.1)}`,
                                transition: 'all 0.2s ease',
                                bgcolor: yourBrand ? alpha('#4776EF', 0.05) : 'white',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha('#4776EF', 0.1)}`,
                                },
                              }}
                            >
                              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body1" fontWeight="600">
                                    Your Brand
                                  </Typography>
                                </Stack>
                                <Switch
                                  checked={yourBrand}
                                  onChange={(e) => setYourBrand(e.target.checked)}
                                  size="small"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#4776EF',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: alpha('#4776EF', 0.5),
                                    },
                                  }}
                                />
                              </Stack>
                              <Typography variant="body2" color="text.secondary">
                                You are promoting yourself or your own business. This image will be classified as Brand
                                Organic.
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                border: `1px solid ${alpha('#4776EF', 0.1)}`,
                                transition: 'all 0.2s ease',
                                bgcolor: brandedContent ? alpha('#4776EF', 0.05) : 'white',
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${alpha('#4776EF', 0.1)}`,
                                },
                              }}
                            >
                              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body1" fontWeight="600">
                                    Branded Content
                                  </Typography>
                                </Stack>
                                <Switch
                                  checked={brandedContent}
                                  onChange={(e) => setBrandedContent(e.target.checked)}
                                  size="small"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#4776EF',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: alpha('#4776EF', 0.5),
                                    },
                                  }}
                                />
                              </Stack>
                              <Typography variant="body2" color="text.secondary">
                                You are promoting another brand or a third party. This image will be classified as
                                Branded Content.
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>

                        {/* Display the disclosure label */}
                        {(yourBrand || brandedContent) && (
                          <Box mt={2} p={2} bgcolor={alpha('#4776EF', 0.05)} borderRadius={2}>
                            <Typography variant="body2" fontWeight="500">
                              {getDisclosureLabel()}
                            </Typography>
                          </Box>
                        )}

                        {/* Display hover message when no options are selected */}
                        {!yourBrand && !brandedContent && (
                          <Box
                            mt={2}
                            p={2}
                            bgcolor={alpha('#FF4D4F', 0.05)}
                            borderRadius={2}
                            border={`1px solid ${alpha('#FF4D4F', 0.2)}`}
                            onMouseEnter={() => setShowWarningTooltip(true)}
                            onMouseLeave={() => setShowWarningTooltip(false)}
                          >
                            <Tooltip
                              title="You need to indicate if your content promotes yourself, a third party, or both."
                              placement="top"
                              arrow
                              open={showWarningTooltip}
                            >
                              <Typography variant="body2" color="error">
                                You need to indicate if your content promotes yourself, a third party, or both.
                              </Typography>
                            </Tooltip>
                          </Box>
                        )}
                      </>
                    )}
                  </Paper>
                </Box>
              </>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha('#4776EF', 0.02),
                border: `1px solid ${alpha('#4776EF', 0.05)}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                By posting, you agree with TikTok's{' '}
                {brandedContent && (
                  <Typography component="span" color="text.secondary">
                    <Typography
                      component="a"
                      href="https://www.tiktok.com/legal/page/global/bc-policy/en"
                      target="_blank"
                      sx={{
                        color: '#4776EF',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Branded Content Policy
                    </Typography>{' '}
                    and {''}
                  </Typography>
                )}
                <Typography
                  component="a"
                  href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en"
                  target="_blank"
                  sx={{
                    color: '#4776EF',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Music Usage Confirmation
                </Typography>
                .
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Your video and image may need a few minutes to be viewable on TikTok.
              </Typography>
            </Paper>
          </Stack>
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="flex-end"
            sx={{
              width: '100%',
              position: 'sticky',
              bottom: 0,
              right: 0,
              mt: 2,
              py: 2,
              borderTop: `1px solid ${alpha('#4776EF', 0.1)}`,
              backgroundColor: 'white',
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              size="medium"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                borderColor: alpha('#4776EF', 0.3),
                color: '#666',
                '&:hover': {
                  borderColor: '#666',
                  bgcolor: 'rgba(0,0,0,0.05)',
                },
                px: 3,
              }}
            >
              Cancel
            </Button>
            <div
              onMouseEnter={() => discloseContent && !yourBrand && !brandedContent && setShowPublishTooltip(true)}
              onMouseLeave={() => setShowPublishTooltip(false)}
            >
              <Tooltip
                title="You need to select at least one content disclosure option"
                placement="top"
                arrow
                open={discloseContent && !yourBrand && !brandedContent && showPublishTooltip}
              >
                <span>
                  <Button
                    variant="contained"
                    onClick={handlePublishNow}
                    disabled={isPublishDisabled()}
                    size="medium"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      bgcolor: '#4776EF',
                      '&:hover': {
                        bgcolor: '#3A67E0',
                      },
                      boxShadow: `0 4px 12px ${alpha('#4776EF', 0.3)}`,
                      px: 3,
                    }}
                  >
                    {isSubmitting ? 'Publishing...' : `Publish`}
                  </Button>
                </span>
              </Tooltip>
            </div>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
}
