import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
    name: 'searchFilter',
    initialState: {
        searchFilter: '',
        minPrice: null,
        maxPrice: null,
        sort: null
    },
    reducers: {
        setSearchFilter(state, action) {
            state.searchFilter = action.payload;
        },
        setMinPrice(state, action) {
            state.minPrice = action.payload;
        },
        setMaxPrice(state, action) {
            state.maxPrice = action.payload;
        },
        setSort(state, action) {
            state.sort = action.payload;
        }
    }
});

export const { setSearchFilter, setMinPrice, setMaxPrice, setSort } = filterSlice.actions;
export default filterSlice.reducer;