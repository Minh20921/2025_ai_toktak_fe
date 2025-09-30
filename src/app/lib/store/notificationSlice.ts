import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationState {
  total: number;
}
const initialState: NotificationState = {
  total: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationState: (
      state,
      action: PayloadAction<{
        notification:  number
      }>,
    ) => {
      state.total = action.payload.notification;
    },
  },
});

export const { setNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
