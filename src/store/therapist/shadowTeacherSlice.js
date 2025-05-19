import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTherapists, // Assuming this can fetch shadow teachers by type
  createTherapist, // Assuming this can create a shadow teacher if therapistType is provided
  deleteTherapist, // Assuming this can delete a shadow teacher
} from "../../api/therapist"; // Adjust path if your API functions are in a different file or structure

const initialState = {
  shadowTeachers: [], // Changed
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

// Fetch Shadow Teachers
export const fetchShadowTeachers = createAsyncThunk(
  "shadowTeacher/fetchShadowTeachers", // Unique action type
  async ({ fullname = "", page = 1, pageSize = 10 }) => {
    const response = await getTherapists({
      fullname,
      page,
      pageSize,
      therapistType: "Shadow_Teacher", // Hardcoded type
    });
    return response; // Expects { data: [], page: number, limit: number, totalRecords: number }
  }
);

// Add New Shadow Teacher
export const addNewShadowTeacher = createAsyncThunk(
  "shadowTeacher/addNewShadowTeacher", // Unique action type
  async (shadowTeacherData) => {
    // Ensure shadowTeacherData includes { ..., therapistType: "Shadow_Teacher" }
    const response = await createTherapist(shadowTeacherData);
    return response;
  }
);

// Remove Shadow Teacher
export const removeShadowTeacher = createAsyncThunk(
  "shadowTeacher/removeShadowTeacher", // Unique action type
  async (id) => {
    await deleteTherapist(id); // Assuming therapistId is sufficient
    return id;
  }
);

const shadowTeacherSlice = createSlice({
  name: "shadowTeacher", // Slice name
  initialState,
  reducers: {
    setShadowTeacherPagination: (state, action) => { // Renamed
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    resetShadowTeachers: (state) => { // Renamed
      state.shadowTeachers = []; // Changed
      state.status = "idle";
      state.error = null;
      state.pagination = {
        current: 1,
        pageSize: 10,
        total: 0,
      };
    },
  },
  extraReducers(builder) {
    builder
      // Fetch Shadow Teachers
      .addCase(fetchShadowTeachers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchShadowTeachers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shadowTeachers = action.payload.data; // Changed
        state.pagination = {
          current: Number(action.payload.page) || 1,
          pageSize: Number(action.payload.limit) || 10,
          total: Number(action.payload.totalRecords) || 0,
        };
      })
      .addCase(fetchShadowTeachers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add New Shadow Teacher
      .addCase(addNewShadowTeacher.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addNewShadowTeacher.fulfilled, (state, action) => {
        state.status = "succeeded"; // Or 'idle'
        // Optionally, add to state:
        // state.shadowTeachers.push(action.payload);
        // state.pagination.total += 1;
      })
      .addCase(addNewShadowTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Remove Shadow Teacher
      .addCase(removeShadowTeacher.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeShadowTeacher.fulfilled, (state, action) => {
        state.status = "succeeded"; // Or 'idle'
        // Optionally, remove from local state:
        // state.shadowTeachers = state.shadowTeachers.filter(st => st.id !== action.payload);
        // state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(removeShadowTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setShadowTeacherPagination, resetShadowTeachers } = shadowTeacherSlice.actions; // Renamed

// Selectors
export const selectAllShadowTeachers = (state) => state.shadowTeacher.shadowTeachers;
export const selectShadowTeacherStatus = (state) => state.shadowTeacher.status;
export const selectShadowTeacherError = (state) => state.shadowTeacher.error;
export const selectShadowTeacherPagination = (state) => state.shadowTeacher.pagination;

export default shadowTeacherSlice.reducer;