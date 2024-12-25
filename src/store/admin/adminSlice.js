import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAdmins, createAdmin, deleteAdmin } from "../../api/admin";

// Async Thunks
export const fetchAdmins = createAsyncThunk(
  "admin/fetchAdmins",
  async ({ fullname = '', page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await getAdmins({ fullname, page, pageSize });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addAdmin = createAsyncThunk(
  "admin/addAdmin",
  async (adminData, { rejectWithValue, dispatch }) => {
    try {
      const response = await createAdmin(adminData);
      // Refresh the admin list after adding
      dispatch(fetchAdmins());
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeAdmin = createAsyncThunk(
  "admin/deleteAdmin",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await deleteAdmin(id);
      // Refresh the admin list after deleting
      dispatch(fetchAdmins());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    total: 0,
    currentPage: 1,
    pageSize: 10,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.data; // Admin data
        state.total = action.payload.total; // Total number of admins
        state.currentPage = action.meta.arg.page; // Current page
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Admin list will be refreshed by fetchAdmins
      })
      .addCase(removeAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
