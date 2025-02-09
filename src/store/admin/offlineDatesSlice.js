// features/admin/offlineDatesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOfflineDates, updateOfflineDates } from "../../api/admin";

// Define initial state
const initialState = {
  offlineDates: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

// Create async thunk for fetching offline dates
export const fetchOfflineDates = createAsyncThunk(
  'offlineDates/fetchOfflineDates',
  async () => {
    const response = await getOfflineDates();
    return response;
  }
);

// Create async thunk for updating offline dates
export const updateOfflineDatesAsync = createAsyncThunk(
  'offlineDates/updateOfflineDates',
  async (offlineDates) => {
    const response = await updateOfflineDates(offlineDates);
    return response;
  }
);

// Create the slice
const offlineDatesSlice = createSlice({
  name: 'offlineDates',
  initialState,
  reducers: {
    // Optionally, add reducers for synchronous state updates (if needed)
    // Example:
    // setOfflineDates: (state, action) => {
    //   state.offlineDates = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfflineDates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOfflineDates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.offlineDates = action.payload;
      })
      .addCase(fetchOfflineDates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateOfflineDatesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOfflineDatesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.offlineDates = action.payload; // Assuming the API returns the updated dates
      })
      .addCase(updateOfflineDatesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Export selectors
export const selectOfflineDates = (state) => state.offlineDates.offlineDates;
export const selectOfflineDatesStatus = (state) => state.offlineDates.status;
export const selectOfflineDatesError = (state) => state.offlineDates.error;

// Export actions (if you have any synchronous actions)
// export const { setOfflineDates } = offlineDatesSlice.actions;

// Export reducer
export default offlineDatesSlice.reducer;