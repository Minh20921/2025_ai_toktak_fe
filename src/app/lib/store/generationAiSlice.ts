import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IgenerationAiSlice {
  needRefresh: boolean;
};

const initialState: IgenerationAiSlice = {
  needRefresh: false,
};

const generationAiSlice = createSlice({
  name: 'generationAiSlice',
  initialState,
  reducers: {
    refreshAi: (
      state,
      action: PayloadAction<{
        needRefresh: boolean;
      }>,
    ) => {
      state.needRefresh = action.payload.needRefresh;
    },
  },
});

export const { refreshAi } = generationAiSlice.actions;
export default generationAiSlice.reducer;
