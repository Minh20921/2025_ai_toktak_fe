import API from '@service/api';
import { AiGenerationPayload, VideoImageAITemplate } from '../@type/interface';
export const aiGenerationAPI = {
  getListTemplate: async (params: { user_id: number }): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/video_image_ai/template', 'GET', {
        success: (res: VideoImageAITemplate) => resolve(res),
        error: (err) => {
          console.error('getListTemplate error:', err);
          resolve([]);
        },
      });

      api.set({ params: params });
      api.call();
    });
  },
  getListAiGenerationByUser: async (params: { user_id: number; type?: string }): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API(`/api/v1/video_image_ai/${params.user_id}`, 'GET', {
        success: (res: VideoImageAITemplate) => resolve(res),
        error: (err) => {
          console.error('getListAiGenerationByUser error:', err);
          resolve([]);
        },
      });

      api.set({ params: params });
      api.call();
    });
  },
  deleteListAiGenerationByUser: async (params: { id: number; user_id: number }): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API(`/api/v1/video_image_ai`, 'DELETE', {
        success: (res: VideoImageAITemplate) => resolve(res),
        error: (err) => {
          console.error('getListAiGenerationByUser error:', err);
          resolve([]);
        },
      });
      api.set({ params: params });
      api.call();
    });
  },
  createAiGenerationByUser: async (payload: AiGenerationPayload): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/video_image_ai', 'POST', {
        success: (res: VideoImageAITemplate) => resolve(res),
        error: (err) => {
          console.error('createAiGenerationByUser error:', err);
          resolve([]);
        },
      });

      api.config.isForm = true;
      api.config.data = payload;
      api.call();
    });
  },
  updateAiGenerationByUser: async (payload: AiGenerationPayload): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/video_image_ai', 'PUT', {
        success: (res: VideoImageAITemplate) => resolve(res),
        error: (err) => {
          console.error('createAiGenerationByUser error:', err);
          resolve([]);
        },
      });

      api.config.isForm = true;
      api.config.data = payload;
      api.call();
    });
  },
  queryAiGenerationByUser: async (params: { user_id: number }): Promise<any> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/video_image_ai/query-tasks', 'GET', {
        success: (res: VideoImageAITemplate) => resolve(res),
        error: (err) => {
          console.error('queryAiGenerationByUser error:', err);
          resolve([]);
        },
      });

      api.set({ params: params });
      api.call();
    });
  },
};
