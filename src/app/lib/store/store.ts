import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import platformReducer from './platformSlice';
import notificationReducer from './notificationSlice';
import profileReducer, { appendProductsToNode } from './profileSlice';
import snsSettingsReducer from './snsSettingsSlice';
import createContentReducer from './createContentSlice';
import generationAiReducer from './generationAiSlice';
export const treeNodesDebugMiddleware: Middleware = (store) => (next) => (action) => {
  const stateBefore = store.getState().profile.treeNodes;
 

  const result = next(action);

  const stateAfter = store.getState().profile.treeNodes;
 

  // Check if treeNodes changed
  if (JSON.stringify(stateBefore) !== JSON.stringify(stateAfter)) {
  }

  return result;
};
export const store = configureStore({
  reducer: {
    auth: authReducer,
    platform: platformReducer,
    notification: notificationReducer,
    profile: profileReducer,
    snsSettings: snsSettingsReducer,
    createContent: createContentReducer,
    generationAi: generationAiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Bỏ qua check với field cụ thể
        ignoredPaths: [
          'profile.avatar_file',
          'profile.background_file',
          'profile.treeNodes',
          'profile.products',
          'profile.newGroups',
        ],
        ignoredActions: ['profile/setFieldName', 'profile/updateProduct', 'profile/appendProductsToNode'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
