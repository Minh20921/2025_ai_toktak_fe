import { LayoutOption, STATUS } from '@/app/(DashboardLayout)/profile-link/components/const';

export declare class IProfileLink {
  content: string;
  created_at: string;
  description: string;
  design_settings: {
    background_color: string;
    main_text_color: string;
    sub_text_color: string;
    notice_color: string;
    notice_background_color: string;
    product_background_color: string;
    product_name_color: string;
    product_price_color: string;
    show_price: number;
  };
  id: number;
  member_avatar: string;
  member_background?: string;
  member_name: string;
  nick_name: string;
  status: STATUS;
  updated_at: string;
  user_email: string;
  user_id: number;
  social_is_facebook: boolean;
  social_is_instagram: boolean;
  social_is_tiktok: boolean;
  social_is_x: boolean;
  social_is_youtube: boolean;
  social_is_thread: boolean;
  social_facebook_url: string;
  social_instagram_url: string;
  social_tiktok_url: string;
  social_x_url: string;
  social_youtube_url: string;
  social_thread_url: string;
  social_spotify_url: string;
  social_is_spotify: boolean;
}
interface CrawlProductResponse {
  name?: string;
  price?: string;
  image?: string;
}

export interface Product {
  id: string;
  user_id?: string;
  product_name: string;
  product_url: string;
  product_image: string;
  product_image_file?: File;
  group_id?: string;
  group_name?: string;
  order_no?: number;
  created_at?: string;
  updated_at?: string;
  price?: string;
  counts?: number;
}
export interface ProductListResponse {
  data: Product[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface FlatItem {
  id: string;
  name: string;
  type: 'group' | 'product' | 'drop-zone' | 'drop-indicator';
  depth: number;
  parentId: string | null;
  hasChildren: boolean;
  isCollapsed: boolean;
  product?: Product;
  originalIndex?: number;
  isDropTarget?: boolean;
  itemCount?: number;
  hasMore?: boolean;
  loading?: boolean;
  isGroupEnd?: boolean;
  isLevelEnd?: boolean;
}

export interface DragHandlers {
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onLoadMore?: (groupId: string) => void;
}

export interface Group {
  id: string;
  user_id: string;
  name: string;
  title_type?: string;
  order_no?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GroupWithProducts {
  group: Group;
  products: Product[];
  total_products: number;
}

export interface GroupListResponse {
  code: number;
  message: string;
  data: GroupWithProducts[];
}

export interface TreeNode {
  id: string;
  type: 'group' | 'product';
  title?: string;
  titleType?: string;
  order_no?: number;
  isOpen?: boolean;
  children?: TreeNode[];
  product?: Product;
  parentId?: string;
  loading?: boolean;
}
