import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTherapists, // API function
  createTherapist, // API function
  deleteTherapist, // API function
} from "../../api/therapist"; // Adjust path as needed

const initialState = {
  therapists: [], // Generic name for the list, but will hold psychologists
  status: "idle",
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

export const fetchTherapists = createAsyncThunk(
  "psychologist/fetchTherapists",
  async ({ fullname = "", page = 1, pageSize = 10 }) => {
    const response = await getTherapists({
      fullname,
      page,
      pageSize,
      therapistType: "Psychologist",
    });
    return response;
  }
);

export const addNewTherapist = createAsyncThunk(
  "psychologist/addNewTherapist",
  async (therapistData) => {
    const response = await createTherapist(therapistData);
    return response;
  }
);

export const removeTherapist = createAsyncThunk(
  "psychologist/removeTherapist",
  async (id) => {
    await deleteTherapist(id);
    return id;
  }
);

const psychologistSlice = createSlice({
  name: "psychologist",
  initialState,
  reducers: {
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    resetTherapists: (state) => {
      state.therapists = [];
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
      .addCase(fetchTherapists.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTherapists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.therapists = action.payload.data;
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
      // Add New Psychologist
      .addCase(addNewTherapist.pending, (state) => {
        state.status = "loading"; // Good to have pending state
        state.error = null;
      })
      .addCase(addNewTherapist.fulfilled, (state, action) => {
        state.status = "idle"; // <<<< CHANGED TO IDLE to trigger re-fetch
        // No need to manually update state.therapists if re-fetching
      })
      .addCase(addNewTherapist.rejected, (state, action) => {
        state.status = "failed"; // Or 'succeeded' if you want to allow UI interaction
        state.error = action.error.message;
      })
      // Remove Psychologist
      .addCase(removeTherapist.pending, (state) => {
        state.status = "loading"; // Good to have pending state
        state.error = null;
      })
      .addCase(removeTherapist.fulfilled, (state, action) => {
        state.status = "idle"; // <<<< CHANGED TO IDLE to trigger re-fetch
        // No need to manually update state.therapists if re-fetching
      })
      .addCase(removeTherapist.rejected, (state, action) => {
        state.status = "failed"; // Or 'succeeded'
        state.error = action.error.message;
      });
  },
});

export const { setPagination, resetTherapists } = psychologistSlice.actions;

export const selectTherapists = (state) => state.psychologist.therapists;
export const selectTherapistStatus = (state) => state.psychologist.status;
export const selectTherapistError = (state) => state.psychologist.error;
export const selectTherapistPagination = (state) =>
  state.psychologist.pagination;

export default psychologistSlice.reducer;
