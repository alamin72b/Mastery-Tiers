import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import categoryReducer from '../features/categories/categorySlice'; // 1. Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer, // 2. Add to the store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;