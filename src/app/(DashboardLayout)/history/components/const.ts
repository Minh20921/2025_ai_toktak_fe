import { PLATFORM } from '@/utils/constant';
import { Post } from '@/utils/mockData/sampleBatch';

export const menuMedia = [
  { label: '모두', value: '' },
  { label: '비디오', value: 'video' },
  { label: '이미지', value: 'image' },
  { label: '블로그', value: 'blog' },
  { label: '전송중단', value: 'error_blog' },
];
export const menuDate = [
  { label: '모두', value: '' },
  { label: '오늘', value: 'today' },
  { label: '최근 1주', value: 'last_week' },
  { label: '최근 1개월', value: 'last_month' },
  { label: '최근 1년', value: 'last_year' },
];
export const menuSort = [
  { label: '최신순', value: 'id_desc' },
  { label: '오래된순', value: 'id_asc' },
];
export enum TABS_TYPE {
  POSTED = 1,
  DRAFT = 99,
}
export interface IPost {
  id: number;
  user_id: number;
  batch_id: number;
  thumbnail: string;
  images: Array<string>;
  title: string;
  subtitle: string;
  content: string;
  description: string;
  hashtag: string;
  video_url: string;
  type: number;
  type_string: string;
  status: number;
  process_number: number;
  render_id: number;
  created_at: string;
  updated_at: string;
  social_sns_description: string;
  video_path?: string;
  social_post_detail: Array<any>;
  social_posts: Array<any>;
}
export interface SNSStatus {
  error_message: string;
  id: string;
  link_id: PLATFORM;
  post_id: number;
  process_number: number;
  session_key: string;
  social_link: string;
  status: string;
  title: string;
}
