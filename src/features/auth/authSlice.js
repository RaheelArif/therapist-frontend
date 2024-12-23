import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, getProfile } from "../../api/auth";

export const loginUser = createAsyncThunk("auth/login", async (credentials) => {
  const response = await login(credentials);
  return response;
});

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async () => {
    const response = await getProfile();
    return response;
  }
);


const initialState = {
  user: null,
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
        state.user = action.payload.user;
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
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
