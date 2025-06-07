import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: null,
    isAdmin: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload.data;
            state.isAdmin = action.payload.isAdmin;
        },
        clearUser: (state) => {
            state.userInfo = null;
            state.isAdmin = false;
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;