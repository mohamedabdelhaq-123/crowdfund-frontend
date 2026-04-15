import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Add slices here as the team builds them
    // profile: profileReducer,
    // auth: authReducer,
    // projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
