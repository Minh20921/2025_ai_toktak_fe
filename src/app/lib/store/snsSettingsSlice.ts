import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SNSSettingState = {
  id: number;
  avatar: string;
  selected: number;
  title: string;
  type: string;
};

export type SNSSettingsState = {
  video: SNSSettingState[];
  image: SNSSettingState[];
};

const initialState: SNSSettingsState = {
  video: [
    {
      id: 1,
      avatar: '',
      title: 'Facebook',
      type: 'FACEBOOK',
      selected: 0,
    },
    {
      id: 2,
      avatar: '',
      title: 'Instagram',
      type: 'INSTAGRAM',
      selected: 0,
    },
    {
      id: 3,
      avatar: '',
      title: 'X',
      type: 'X',
      selected: 0,
    },
    {
      id: 4,
      avatar: '',
      title: 'Tiktok',
      type: 'TIKTOK',
      selected: 0,
    },
    {
      id: 5,
      avatar: '',
      title: 'Youtube',
      type: 'YOUTUBE',
      selected: 0,
    },
    {
      id: 6,
      avatar: '',
      title: 'Thread',
      type: 'THREAD',
      selected: 0,
    },
  ],
  image: [
    {
      id: 1,
      avatar: '',
      title: 'Facebook',
      type: 'FACEBOOK',
      selected: 0,
    },
    {
      id: 2,
      avatar: '',
      title: 'Instagram',
      type: 'INSTAGRAM',
      selected: 0,
    },
    {
      id: 3,
      avatar: '',
      title: 'X',
      type: 'X',
      selected: 0,
    },
    {
      id: 4,
      avatar: '',
      title: 'Tiktok',
      type: 'TIKTOK',
      selected: 0,
    },
    {
      id: 5,
      avatar: '',
      title: 'Youtube',
      type: 'YOUTUBE',
      selected: 0,
    },
    {
      id: 6,
      avatar: '',
      title: 'Thread',
      type: 'THREAD',
      selected: 0,
    },
  ],
};

const snsSettingsSlice = createSlice({
  name: 'snsSettings',
  initialState,
  reducers: {
    setSnsSettingsState: (
      state,
      action: PayloadAction<{
        snsSettings: SNSSettingsState
      }>,
    ) => {
      state.video = action.payload.snsSettings.video;
      state.image = action.payload.snsSettings.image;
    },
  },
});

export const { setSnsSettingsState } = snsSettingsSlice.actions;
export default snsSettingsSlice.reducer;