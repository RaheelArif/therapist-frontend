// store/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import clientReducer from "./client/clientSlice";
import therapistReducer from "./therapist/therapistSlice";
import appointmentReducer from "./appointment/appointmentSlice";

// Combine all reducers
const appReducer = combineReducers({
  auth: authReducer,
  client: clientReducer,
  therapist: therapistReducer,
  appointment: appointmentReducer,
});

// Root reducer that handles reset on logout
const rootReducer = (state, action) => {
  // When logout is dispatched, reset all state
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

// Create store with root reducer
export const store = configureStore({
  reducer: rootReducer,
});
