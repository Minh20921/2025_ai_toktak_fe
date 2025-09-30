import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VoiceItemState = {
  id: string;
  name: string;
  name_en: string;
  audio_url: string;
  gender: string;
  type: string;
};

export type VoiceState = {
    voices: VoiceItemState[],
    maleVoices: VoiceItemState[],
    femaleVoices: VoiceItemState[],
    loaded: boolean,
}

const initialState: VoiceState = {
    voices: [],
    maleVoices: [],
    femaleVoices: [],
    loaded: false,
}

const voicesSlice = createSlice({
  name: 'voices',
  initialState,
  reducers: {
    setVoices: (
      state,
      action: PayloadAction<{
        voices: VoiceItemState[]
      }>,
    ) => {
      state.voices = action.payload.voices;
      state.maleVoices = action.payload.voices.filter(voice => voice.gender === 'male');
      state.femaleVoices = action.payload.voices.filter(voice => voice.gender === 'female');
    },
    setVoiceLoaded: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loaded = action.payload;
    }
  },
});

export const { setVoices, setVoiceLoaded } = voicesSlice.actions;
export default voicesSlice.reducer;