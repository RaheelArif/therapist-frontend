import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, getProfile } from "../../api/auth";

// Existing async thunks remain the same
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    const response = await login(credentials);
    if (response.access_token) {
      localStorage.setItem("token", response.access_token);
      await dispatch(fetchUserProfile());
    }
    return response;
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async () => {
    const response = await getProfile();
    return response;
  }
);

// Add new action for updating therapist profile
export const updateTherapistProfile = createAsyncThunk(
  "auth/updateTherapistProfile",
  async ({ therapistId, updatedData }) => {
    return { therapistId, ...updatedData };
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing cases remain the same
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.role = action.payload.user.role;
        localStorage.setItem("token", action.payload.access_token);
        localStorage.setItem("role", action.payload.user.role);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.role = action.payload.role;
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("role", action.payload.role);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Add new case for updating therapist profile
      .addCase(updateTherapistProfile.fulfilled, (state, action) => {
        if (state.user?.user?.therapist) {
          state.user.user.therapist = {
            ...state.user.user.therapist,
            ...action.payload,
          };
          // Update localStorage
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;