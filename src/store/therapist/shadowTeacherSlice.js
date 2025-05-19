import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTherapists, // API function
  createTherapist, // API function
  deleteTherapist, // API function
} from "../../api/therapist"; // Adjust path as needed

const initialState = {
  therapists: [], // Generic name for the list, but will hold shadow teachers
  status: "idle",
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

// Fetch Shadow Teachers (internal thunk name can be specific, action type prefix is key)
export const fetchTherapists = createAsyncThunk( // Generic export name
  "shadowTeacher/fetchTherapists", // <<<< UNIQUE ACTION TYPE PREFIX FOR SHADOW TEACHERS
  async ({ fullname = "", page = 1, pageSize = 10 }) => {
    const response = await getTherapists({
      fullname,
      page,
      pageSize,
      therapistType: "Shadow_Teacher", // Hardcoded type for this slice
    });
    return response;
  }
);

// Add New Shadow Teacher
export const addNewTherapist = createAsyncThunk( // Generic export name
  "shadowTeacher/addNewTherapist", // <<<< UNIQUE ACTION TYPE PREFIX
  async (therapistData) => {
    // Ensure therapistData includes { ..., therapistType: "Shadow_Teacher" } for the API
    const response = await createTherapist(therapistData);
    return response;
  }
);

// Remove Shadow Teacher
export const removeTherapist = createAsyncThunk( // Generic export name
  "shadowTeacher/removeTherapist", // <<<< UNIQUE ACTION TYPE PREFIX
  async (id) => {
    await deleteTherapist(id);
    return id;
  }
);

const shadowTeacherSlice = createSlice({
  name: "shadowTeacher", // <<<< Internal slice name (key in rootReducer)
  initialState,
  reducers: {
    // Generic names for actions
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    resetTherapists: (state) => {
      state.therapists = []; // Operates on this slice's 'therapists' (which are shadow teachers)
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
      .addCase(fetchTherapists.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTherapists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.therapists = action.payload.data; // Populates this slice's 'therapists'
        state.pagination = {
          current: Number(action.payload.page) || 1,
          pageSize: Number(action.payload.limit) || 10,
          total: Number(action.payload.totalRecords) || 0,
        };
      })
      .addCase(fetchTherapists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add New Shadow Teacher
      .addCase(addNewTherapist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addNewTherapist.fulfilled, (state, action) => {
        state.status = "idle"; // <<<< CHANGED TO IDLE to trigger re-fetch
      })
      .addCase(addNewTherapist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Remove Shadow Teacher
      .addCase(removeTherapist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeTherapist.fulfilled, (state, action) => {
        state.status = "idle"; // <<<< CHANGED TO IDLE to trigger re-fetch
      })
      .addCase(removeTherapist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setPagination, resetTherapists } = shadowTeacherSlice.actions; // Export generic names

// Selectors - use generic names
// The `state.shadowTeacher` part is crucial and comes from how you combine reducers in the store
export const selectTherapists = (state) => state.shadowTeacher.therapists;
export const selectTherapistStatus = (state) => state.shadowTeacher.status;
export const selectTherapistError = (state) => state.shadowTeacher.error;
export const selectTherapistPagination = (state) => state.shadowTeacher.pagination;

export default shadowTeacherSlice.reducer;