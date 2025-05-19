import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTherapists, // Assuming this can fetch psychologists by type
  createTherapist, // Assuming this can create a psychologist if therapistType is provided
  deleteTherapist, // Assuming this can delete a psychologist
} from "../../api/therapist"; // Adjust path if your API functions are in a different file or structure

const initialState = {
  psychologists: [], // Changed from therapists
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

// Fetch Psychologists
export const fetchPsychologists = createAsyncThunk(
  "psychologist/fetchPsychologists", // Unique action type
  async ({ fullname = "", page = 1, pageSize = 10 }) => {
    const response = await getTherapists({
      fullname,
      page,
      pageSize,
      therapistType: "Psychologist", // Hardcoded type
    });
    return response; // Expects { data: [], page: number, limit: number, totalRecords: number }
  }
);

// Add New Psychologist
export const addNewPsychologist = createAsyncThunk(
  "psychologist/addNewPsychologist", // Unique action type
  async (psychologistData) => {
    // Ensure psychologistData includes { ..., therapistType: "Psychologist" }
    // If createTherapist doesn't automatically handle therapistType from a common pool,
    // you might need a specific createPsychologist API or ensure type is in psychologistData
    const response = await createTherapist(psychologistData);
    return response;
  }
);

// Remove Psychologist
export const removePsychologist = createAsyncThunk(
  "psychologist/removePsychologist", // Unique action type
  async (id) => {
    await deleteTherapist(id); // Assuming therapistId is sufficient
    return id;
  }
);

const psychologistSlice = createSlice({
  name: "psychologist", // Slice name
  initialState,
  reducers: {
    setPsychologistPagination: (state, action) => { // Renamed
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    resetPsychologists: (state) => { // Renamed
      state.psychologists = []; // Changed
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
      // Fetch Psychologists
      .addCase(fetchPsychologists.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPsychologists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.psychologists = action.payload.data; // Changed
        state.pagination = {
          current: Number(action.payload.page) || 1,
          pageSize: Number(action.payload.limit) || 10,
          total: Number(action.payload.totalRecords) || 0,
        };
      })
      .addCase(fetchPsychologists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add New Psychologist
      .addCase(addNewPsychologist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addNewPsychologist.fulfilled, (state, action) => {
        state.status = "succeeded"; // Or 'idle' if you plan to refetch list manually
        // Optionally, add the new psychologist to the state:
        // state.psychologists.push(action.payload); // If API returns the created object
        // state.pagination.total += 1;
      })
      .addCase(addNewPsychologist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Remove Psychologist
      .addCase(removePsychologist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removePsychologist.fulfilled, (state, action) => {
        state.status = "succeeded"; // Or 'idle'
        // Optionally, remove from local state:
        // state.psychologists = state.psychologists.filter(p => p.id !== action.payload);
        // state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(removePsychologist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setPsychologistPagination, resetPsychologists } = psychologistSlice.actions; // Renamed

// Selectors
export const selectAllPsychologists = (state) => state.psychologist.psychologists;
export const selectPsychologistStatus = (state) => state.psychologist.status;
export const selectPsychologistError = (state) => state.psychologist.error;
export const selectPsychologistPagination = (state) => state.psychologist.pagination;

export default psychologistSlice.reducer;