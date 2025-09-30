import { PLATFORM } from '@/utils/constant';
import type React from 'react';
import type { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import dynamic from 'next/dynamic';

// Define content types
export enum CONTENT_TYPE {
  VIDEO = 0,
  IMAGE = 1,
  BLOG = 2,
}

interface SocialPreviewProps {
  type: CONTENT_TYPE;
  data?: PostData;
  open: boolean;
  onClose: () => void;
  platform: PLATFORM;
}

// Helper function to dynamically import components
const importComponent = (platform: string, type: string) =>
  dynamic(() => import(`@/app/components/socialsPosting/${platform.toLowerCase()}/${type}`));
// Helper type to ensure all platforms have necessary content types
type PlatformComponents = {
  [P in PLATFORM]: {
    [C in CONTENT_TYPE]?: React.ComponentType<any>;
  };
};
// Map platforms to their respective components
const platformComponents: PlatformComponents = {
  [PLATFORM.Facebook]: {
    [CONTENT_TYPE.IMAGE]: importComponent('facebook', 'image'),
    [CONTENT_TYPE.VIDEO]: importComponent('facebook', 'video'),
  },
  [PLATFORM.Twitter]: {
    [CONTENT_TYPE.IMAGE]: importComponent('twitter', 'image'),
    [CONTENT_TYPE.VIDEO]: importComponent('twitter', 'video'),
  },
  [PLATFORM.Instagram]: {
    [CONTENT_TYPE.IMAGE]: importComponent('instagram', 'image'),
    [CONTENT_TYPE.VIDEO]: importComponent('instagram', 'video'),
  },
  [PLATFORM.Tiktok]: {
    [CONTENT_TYPE.IMAGE]: importComponent('tiktok', 'image'),
    [CONTENT_TYPE.VIDEO]: importComponent('tiktok', 'video'),
  },
  [PLATFORM.Thread]: {
    [CONTENT_TYPE.IMAGE]: importComponent('threads', 'image'),
    [CONTENT_TYPE.VIDEO]: importComponent('threads', 'video'),
  },
  [PLATFORM.Youtube]: {
    [CONTENT_TYPE.VIDEO]: importComponent('youtube', 'video'),
  },
  [PLATFORM.Blog]: {
    [CONTENT_TYPE.BLOG]: importComponent('blog', 'blogPreview'),
  },
};

const SocialPreview: React.FC<SocialPreviewProps> = ({ type, data, platform, open, onClose }) => {
  const ModalComponent = platformComponents[platform]?.[type];

  if (!ModalComponent) {
    // console.warn(`No preview available for platform: ${PLATFORM_TEXT[platform]} and type: ${CONTENT_TYPE[type]}`);
    return null;
  }

  const modalProps = { data, open, onClose };

  return <ModalComponent {...modalProps} />;
};

export default SocialPreview;
