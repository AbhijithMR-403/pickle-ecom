// ─────────────────────────────────────────────────────────
//  Redux Store
// ─────────────────────────────────────────────────────────

import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import authReducer from './slices/authSlice';
import bannerReducer from './slices/bannerSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    banners: bannerReducer,
  },
});

export default store;
