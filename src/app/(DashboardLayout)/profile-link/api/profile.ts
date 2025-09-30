import API from '@service/api';
import { IProfileLink } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { Socials } from '@/app/lib/store/profileSlice';
export interface UpdateProfilePayload extends Partial<Omit<IProfileLink, 'member_avatar'>> {
  member_avatar?: File | null; // override string → File
  member_background?: File;
  social_is_facebook?: boolean;
  social_is_instagram?: boolean;
  social_is_tiktok?: boolean;
  social_is_x?: boolean;
  social_is_youtube?: boolean;
  social_is_thread?: boolean;
  social_facebook_url?: string;
  social_instagram_url?: string;
  social_tiktok_url?: string;
  social_x_url?: string;
  social_youtube_url?: string;
  social_thread_url?: string;
  social_spotify_url?: string;
  social_is_spotify?: boolean;
}
export const profileAPI = {
  getProfile: async (): Promise<IProfileLink | null> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/profile/profile_detail', 'GET', {
        success: (data: IProfileLink) => {
          return resolve(data);
        },
        error: (err) => {
          console.error('getProfile error:', err);
          reject(err);
        },
      });

      api.call();
    });
  },
  updateStatus: async (): Promise<IProfileLink | null> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/profile/status_update', 'POST', {
        success: (res: { data: IProfileLink }) => {
          resolve(res.data);
        },
        error: (err) => {
          console.error('updateProfile error:', err);
          reject(err);
        },
      });

      api.call();
    });
  },
  updateProfile: async (payload: UpdateProfilePayload): Promise<IProfileLink | null> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/profile/profile_update', 'POST', {
        success: (res: { data: IProfileLink }) => {
          resolve(res.data);
        },
        error: (err) => {
          console.error('updateProfile error:', err);
          reject(err);
        },
      });
      // ✅ Không tạo FormData thủ công, chỉ truyền object
      api.config.isForm = true;
      api.config.data = payload;

      api.call();
    });
  },
  updateSiteSetting: async (payload: IProfileLink['design_settings']): Promise<IProfileLink | null> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/profile/profile_design_settings', 'POST', {
        success: (res: { data: IProfileLink }) => {
          resolve(res.data);
        },
        error: (err) => {
          console.error('updateProfile error:', err);
          reject(err);
        },
      });
      api.config.data = payload;
      api.call();
    });
  },
  checkNickName: async (nick_name: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const api = new API('/api/v1/profile/check_nick_name', 'GET', {
        success: (res) => {
          if (res.code === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          console.error('checkNickName error:', err);
          reject(false);
        },
      });

      api.set({
        params: { nick_name },
      });

      api.call();
    });
  },
};
