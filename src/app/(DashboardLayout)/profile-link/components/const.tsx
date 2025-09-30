import { FacebookOutLine, Instagram, Spotify, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';
import { LayoutType } from '@/app/lib/store/profileSlice';

export enum STATUS {
  NOT_CREATED,
  CREATED,
  EXPORTED,
}

export enum SOCIAL_LINKS {
  spotify = 'spotify',
  threads = 'threads',
  youtube = 'youtube',
  x = 'x',
  instagram = 'instagram',
  tiktok = 'tiktok',
  facebook = 'facebook',
}

export const SOCIAL_ICON = {
  [SOCIAL_LINKS.spotify]: <Spotify className="text-[#6A6A6A] w-8 h-8 p-1" />,
  [SOCIAL_LINKS.threads]: <Threads className="text-[#6A6A6A] w-8 h-8" />,
  [SOCIAL_LINKS.instagram]: <Instagram className="text-[#6A6A6A] w-8 h-8" />,
  [SOCIAL_LINKS.youtube]: <Youtube className="text-[#6A6A6A] w-8 h-8" />,
  [SOCIAL_LINKS.x]: <Twitter className="text-[#6A6A6A] w-8 h-8" />,
  [SOCIAL_LINKS.tiktok]: <TikTok className="text-[#6A6A6A] w-8 h-8" />,
  [SOCIAL_LINKS.facebook]: <FacebookOutLine className="text-[#6A6A6A] w-8 h-8 p-1" />,
};

export const layoutOptions: { type: LayoutType; icon: string }[] = [
  { type: 'grid-2', icon: '/images/profile-link/layout-2.png' },
  { type: 'grid-3', icon: '/images/profile-link/layout-3.png' },
  { type: 'list', icon: '/images/profile-link/layout-1.png' },
];
export const TREE_CONFIG = {
  INDENT_SIZE: 40,
  LOAD_MORE_LIMIT: 10,
  MAX_PAGES: 3,
  API_DELAY: 1000,
} as const;

export const ITEM_TYPES = {
  GROUP: 'group',
  PRODUCT: 'product',
  DROP_INDICATOR: 'drop-indicator',
  DROP_ZONE: 'drop-zone',
} as const;

export type LayoutOption = 'left' | 'center' | 'right';
