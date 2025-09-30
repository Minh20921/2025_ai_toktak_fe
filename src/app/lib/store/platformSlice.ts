import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PlatformStatus = {
  status: boolean;
  token: string;
  id: number;
  avatar: string;
  social_id: number;
  name: string;
  url: string;
  meta_url?: string;
  page_id?: string;
};

export type PlatformState = {
  facebook: PlatformStatus;
  twitter: PlatformStatus;
  instagram: PlatformStatus;
  youtube: PlatformStatus;
  tiktok: PlatformStatus;
  blog: PlatformStatus;
  threads: PlatformStatus;
};

const initialState: PlatformState = {
  facebook: { status: false, token: '', id: NaN, avatar: '', social_id: NaN, name: '', url: '' },
  twitter: { status: false, token: '', id: NaN, avatar: '', social_id: NaN, name: '', url: '' },
  instagram: { status: false, token: '', id: NaN, avatar: '', social_id: NaN, name: '', url: '' },
  youtube: { status: false, token: '', id: NaN, avatar: '', social_id: NaN, name: '', url: '' },
  tiktok: { status: false, token: '', id: NaN, avatar: '', social_id: NaN, name: '', url: '' },
  blog: { status: false, token: '', id: NaN, avatar: '', social_id: NaN, name: '', url: '' },
  threads: { status: false, token: '', id: NaN, avatar: '', social_id: NaN, name: '', url: '' },
};

const platformSlice = createSlice({
  name: 'platform',
  initialState,
  reducers: {
    setPlatformState: (
      state,
      action: PayloadAction<{
        platform: keyof PlatformState;
        status?: boolean;
        token: string;
        info: Omit<PlatformStatus, 'token' | 'status'> | undefined;
      }>,
    ) => {
      const { platform, token, status, info } = action.payload;
      state[platform] = {
        status: !!status,
        token: token,
        id: info?.id || NaN,
        avatar: info?.avatar || '',
        social_id: info?.social_id || NaN,
        name: info?.name || '',
        url: info?.url || '',
        meta_url: info?.meta_url || '',
        page_id: info?.page_id || '',
      };
    },
  },
});

export const { setPlatformState } = platformSlice.actions;
export default platformSlice.reducer;
