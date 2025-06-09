import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        refresh: false
    },
    reducers: {
        refreshCategories: (state) => {
            state.refresh = !state.refresh
        }
    }
});

export const { refreshCategories } = categorySlice.actions;
export default categorySlice.reducer;