import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTherapists,
  createTherapist,
  deleteTherapist,
} from "../../api/therapist";

const initialState = {
  therapists: [],
  status: "idle",
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

export const fetchTherapists = createAsyncThunk(
  "therapist/fetchTherapists",
  async ({
    fullname = "",
    page = 1,
    pageSize = 10,
    therapistType = "Therapist",
  }) => {
    const response = await getTherapists({
      fullname,
      page,
      pageSize,
      therapistType,
    });
    return response;
  }
);

export const addNewTherapist = createAsyncThunk(
  "therapist/createTherapist",
  async (therapistData) => {
    const response = await createTherapist(therapistData);
    return response;
  }
);

export const removeTherapist = createAsyncThunk(
  "therapist/deleteTherapist",
  async (id) => {
    await deleteTherapist(id);
    return id;
  }
);

const therapistSlice = createSlice({
  name: "therapist",
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
      })
      .addCase(fetchTherapists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.therapists = action.payload.data;
        state.pagination = {
          current: Number(action.payload.page),
          pageSize: Number(action.payload.limit),
          total: Number(action.payload.totalRecords),
        };
      })
      .addCase(fetchTherapists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewTherapist.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(removeTherapist.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});

export const { setPagination, resetTherapists } = therapistSlice.actions;
export const selectTherapists = (state) => state.therapist.therapists;
export const selectTherapistStatus = (state) => state.therapist.status;
export const selectTherapistError = (state) => state.therapist.error;
export const selectTherapistPagination = (state) => state.therapist.pagination;

export default therapistSlice.reducer;
