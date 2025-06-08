import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
    name: 'searchFilter',
    initialState: {
        searchFilter: ''
    },
    reducers: {
        setSearchFilter(state, action) {
            state.searchFilter = action.payload
        }
    }
});

export const { setSearchFilter } = filterSlice.actions;
export default filterSlice.reducer;