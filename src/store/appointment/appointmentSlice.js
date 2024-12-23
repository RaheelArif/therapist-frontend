// File 1: store/appointment/appointmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  appointments: [],
  selectedTherapist: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  }
};

// Async Thunks
export const resetAppointmentState = createAsyncThunk(
  'appointment/resetState',
  async (therapist) => {
    return therapist;
  }
);

export const fetchAppointments = createAsyncThunk(
    'appointment/fetchAppointments',
    async (params) => {
      // For calendar view (with therapistId)
      const response = await axios.get('/appointments', {
        params: {
          ...(params.therapistId && { therapistId: params.therapistId }),
          ...(params.status && { status: params.status }),
          ...(params.clientId && { clientId: params.clientId })
        }
      });
      return {
        data: response.data,
        isCalendarView: !!params.therapistId
      };
    }
  );

export const addAppointment = createAsyncThunk(
  'appointment/addAppointment',
  async (appointmentData) => {
    const response = await axios.post('/appointments', appointmentData);
    return response.data;
  }
);

export const updateAppointment = createAsyncThunk(
  'appointment/updateAppointment',
  async ({ id, data }) => {
    const response = await axios.patch(`/appointments/${id}`, data);
    return response.data;
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointment/deleteAppointment',
  async (id) => {
    await axios.delete(`/appointments/${id}`);
    return id;
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearSelectedTherapist: (state) => {
      state.selectedTherapist = null;
      state.appointments = [];
      state.status = 'idle';
      state.error = null;
      state.pagination = {
        current: 1,
        pageSize: 10,
        total: 0
      };
    }
  },
  extraReducers(builder) {
    builder
      // Reset State
      .addCase(resetAppointmentState.pending, (state) => {
        state.status = 'loading';
        state.appointments = [];
        state.error = null;
      })
      .addCase(resetAppointmentState.fulfilled, (state, action) => {
        state.selectedTherapist = action.payload;
        state.status = 'idle';
      })

      // Fetch Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.isCalendarView) {
          // For calendar view
          state.appointments = action.payload.data;
        } else {
          // For list view
          state.appointments = action.payload.data;
          state.pagination = {
            ...state.pagination,
            current: Number(action.payload.page),
            total: Number(action.payload.total)
          };
        }
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add Appointment
      .addCase(addAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments.push(action.payload);
      })
      .addCase(addAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Delete Appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments = state.appointments.filter(
          appointment => appointment.id !== action.payload
        );
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Selectors
export const selectAppointments = (state) => state.appointment.appointments;
export const selectSelectedTherapist = (state) => state.appointment.selectedTherapist;
export const selectAppointmentStatus = (state) => state.appointment.status;
export const selectAppointmentError = (state) => state.appointment.error;
export const selectAppointmentPagination = (state) => state.appointment.pagination;

// Actions
export const { clearSelectedTherapist } = appointmentSlice.actions;

// Reducer
export default appointmentSlice.reducer;