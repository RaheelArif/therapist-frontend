
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserClient } from '../../api/client';

const initialState = {
    userClient: null,
    status: 'idle', 
    error: null,
};


export const postNewUserClient = createAsyncThunk(
    'userClient/createUserClient',
    async (clientData) => {
        const response = await createUserClient(clientData);
        return response;
    }
);

const userClientSlice = createSlice({
    name: 'userClient',
    initialState,
    reducers: {
      resetUserClient: (state) => {
          state.userClient = null;
          state.status = 'idle';
          state.error = null;
      }
    },
    extraReducers(builder) {
        builder
        .addCase(postNewUserClient.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(postNewUserClient.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.userClient = action.payload;
        })
        .addCase(postNewUserClient.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    }
});

export const { resetUserClient } = userClientSlice.actions;

export const selectUserClient = (state) => state.userClient.userClient;
export const selectUserClientStatus = (state) => state.userClient.status;
export const selectUserClientError = (state) => state.userClient.error;

export default userClientSlice.reducer;