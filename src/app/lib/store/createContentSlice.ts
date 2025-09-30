import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CreateContentState = {
  productUrl: string;
};

const initialState: CreateContentState = {
  productUrl: '',
};

const createContentSlice = createSlice({
  name: 'voices',
  initialState,
  reducers: {
    setProductUrl: (
      state,
      action: PayloadAction<{
        productUrl: string;
      }>,
    ) => {
      state.productUrl = action.payload.productUrl;
    },
  },
});

export const { setProductUrl } = createContentSlice.actions;
export default createContentSlice.reducer;
