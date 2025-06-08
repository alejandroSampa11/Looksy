import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        totalPages: 1
    },
    reducers: {
        setProducts(state, action) {
            state.items = action.payload;
        },
        setTotalPages(state, action) {
            state.totalPages = action.payload;
        }
    }
});

export const { setProducts, setTotalPages } = productSlice.actions;
export default productSlice.reducer;