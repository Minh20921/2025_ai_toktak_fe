export type VideoImageAIType = 'prompt_to_video' | 'image_to_video' | 'prompt_to_image';

export interface DefaultConfig {
  style?: string;
  quality?: string;
  aspect_ratio?: string;
}

export interface VideoImageAITemplate {
  id: number;
  name: string;
  description?: string;
  type: VideoImageAIType;
  prompt: string;
  default_config?: DefaultConfig;
  thumbnail_url?: string;
  url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
interface BasePayload {
  user_id?: string | number;
  type: 'image_to_video' | 'prompt_to_video' | 'prompt_to_image';
  description: string;
  prompt: string;
}

interface ImageToVideoPayload extends BasePayload {
  type: 'image_to_video';
  image: any;
  image_url?: any;
  duration: 5 | 10;
}

interface PromptToVideoPayload extends BasePayload {
  type: 'prompt_to_video';
  duration: number;
}

interface PromptToImagePayload extends BasePayload {
  type: 'prompt_to_image';
  ratio: string;
}
interface UpdateAIGenerationByUser extends BasePayload {
  id: number;
}

export type AiGenerationPayload =
  | ImageToVideoPayload
  | PromptToVideoPayload
  | PromptToImagePayload
  | UpdateAIGenerationByUser;
export interface AiGenerationItem {
  id?: number; // có khi success/failed, pending thì chưa có
  task_id?: string; // pending thì có, success/failed có thể không trả
  user_id: number;
  type: 'prompt_to_image' | 'prompt_to_video' | 'image_to_video' | string;
  description?: string;
  prompt?: string;
  url?: string; // kết quả success mới có
  thumbnail_url?: string;
  status: 'pending' | 'success' | 'failed';
  is_deleted?: boolean;
  created_at?: string; // ISO date string
  updated_at?: string;
  deleted_at?: string | null;
}
