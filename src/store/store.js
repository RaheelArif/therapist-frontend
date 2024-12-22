import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import clientReducer from "./client/clientSlice";
import therapistReducer from "./therapist/therapistSlice";
import appointmentReducer from './appointment/appointmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
    therapist: therapistReducer,
    appointment: appointmentReducer,
  },
});
