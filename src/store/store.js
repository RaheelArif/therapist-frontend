import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import clientReducer from './client/clientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
  },
});