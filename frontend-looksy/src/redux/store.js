import { configureStore }  from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import productsReducer from './slices/productSlice';
import filterReducer from './slices/filterSlice';
import categoryReducer from './slices/categorySlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        products: productsReducer,
        searchFilter: filterReducer,
        category: categoryReducer,
    }
})