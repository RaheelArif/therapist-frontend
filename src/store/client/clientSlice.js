import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getClients, createClient, updateClient, deleteClient } from '../../api/client';

const initialState = {
  clients: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  }
};

export const fetchClients = createAsyncThunk(
  'client/fetchClients',
  async ({ fullname = '', page = 1, pageSize = 10 }) => {
    const response = await getClients({ fullname, page, pageSize });
    return response;
  }
);

export const addNewClient = createAsyncThunk(
  'client/createClient',
  async (clientData) => {
    const response = await createClient(clientData);
    return response;
  }
);

export const editClient = createAsyncThunk(
  'client/updateClient',
  async ({ id, data }) => {
    const response = await updateClient(id, data);
    return response;
  }
);

export const removeClient = createAsyncThunk(
  'client/deleteClient',
  async (id) => {
    await deleteClient(id);
    return id;
  }
);

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    resetClients: (state) => {
      state.clients = [];
      state.status = 'idle';
      state.error = null;
      state.pagination = {
        current: 1,
        pageSize: 5,
        total: 0
      };
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload.data;
        state.pagination = {
          current: Number(action.payload.page),
          pageSize: Number(action.payload.limit),
          total: Number(action.payload.totalRecords)
        };
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewClient.fulfilled, (state) => {
        state.status = 'idle'; // This will trigger a re-fetch
      })
      .addCase(editClient.fulfilled, (state) => {
        state.status = 'idle'; // This will trigger a re-fetch
      })
      .addCase(removeClient.fulfilled, (state) => {
        state.status = 'idle'; // This will trigger a re-fetch
      });
  }
});

export const { setPagination, resetClients } = clientSlice.actions;
export const selectClients = (state) => state.client.clients;
export const selectClientStatus = (state) => state.client.status;
export const selectClientError = (state) => state.client.error;
export const selectClientPagination = (state) => state.client.pagination;

export default clientSlice.reducer;