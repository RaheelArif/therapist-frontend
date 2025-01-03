import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, getProfile } from "../../api/auth";

// Modified loginUser to chain the profile fetch
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    const response = await login(credentials);
    // After successful login, immediately fetch profile
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        // Basic user info from login
        state.token = action.payload.access_token;
        state.role = action.payload.user.role;
        // Store in localStorage
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
        // Update role in case it's different in full profile
        state.role = action.payload.role;
        // Store complete user data
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("role", action.payload.role);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;