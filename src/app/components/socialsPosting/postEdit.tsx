'use client';

import type React from 'react';
import { CONTENT_TYPE } from '@/app/components/socialsPosting/socialPreview';
import dynamic from 'next/dynamic';
import { Box, Drawer, IconButton, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import { CloseIcon } from '@/utils/icons/icons';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { Icon } from '@iconify/react';

interface PostEditProps {
  type: CONTENT_TYPE;
  data: PostData;
  open: boolean;
  onClose: () => void;
  handleReFetch?: () => void;
  isPreview?: boolean;
}

const importComponent = (type: string) =>
  dynamic(() => import(`@/app/components/socialsPosting/edit/${type.toLowerCase()}`));

// Helper type to ensure all platforms have necessary content types
type EditComponents = {
  [C in CONTENT_TYPE]?: React.ComponentType<any>;
};

const editType: EditComponents = {
  [CONTENT_TYPE.IMAGE]: importComponent('image'),
  [CONTENT_TYPE.VIDEO]: importComponent('video'),
  [CONTENT_TYPE.BLOG]: importComponent('blog'),
};

const PostEdit: React.FC<PostEditProps> = ({
  type,
  data,
  open,
  onClose,
  handleReFetch = () => {},
  isPreview = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const ContentComponent = editType[type];

  if (!ContentComponent) {
    return null;
  }

  const contentProps = {
    open,
    data,
    handleReFetch,
    isPreview,
  };

  // Render either Modal or Drawer based on screen size
  return (
    <>
      {isMobile ? (
        <Drawer
          id={`drawer_${data.id}`}
          anchor="bottom"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: false }}
          PaperProps={{
            sx: {
              height: '100%',
            },
          }}
        >
          <Box className="relative h-full">
            <Box className="absolute top-0 left-0 w-full flex justify-center bg-[#fff] h-[50px] z-10 items-center">
              <IconButton
                className="absolute top-1 left-0 "
                sx={{ color: '#000' }}
              >
                <Icon icon="iconamoon:arrow-left-2-duotone" onClick={onClose} />
              </IconButton>
              <Typography
                sx={{
                  fontSize: { xs: 21, sm: 24 },
                  fontWeight: 'bold',
                  color: '#000',
                  lineHeight: { xs: '25px', sm: '30px' },
                  fontFamily: 'var(--font-pretendard)',
                }}
              >
                {Object.keys(CONTENT_TYPE).find((key) => CONTENT_TYPE[key] === type)}
              </Typography>
            </Box>
            {<ContentComponent {...contentProps} />}
          </Box>
        </Drawer>
      ) : (
        <Modal
          id={`Modal_${data.id}`}
          open={open}
          onClose={onClose}
          aria-labelledby="edit-content-modal"
          keepMounted={false}
        >
          <Box className="absolute inset-0 flex items-center justify-center">
            <IconButton className="absolute top-2 right-2 z-10" onClick={onClose}>
              <CloseIcon />
            </IconButton>
            <Box
              className="w-full bg-white shadow-lg overflow-hidden rounded-lg"
              sx={{
                maxWidth: type === CONTENT_TYPE.IMAGE ? '1228px' : '974px',
              }}
            >
              <ContentComponent {...contentProps} />
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default PostEdit;
