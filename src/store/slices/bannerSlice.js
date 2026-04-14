// ─────────────────────────────────────────────────────────
//  Banner Slice — Redux state & async thunks for Banners
// ─────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bannerApi } from '../../services/api';

// ── Async Thunks ────────────────────────────────────────

export const fetchBanners = createAsyncThunk(
  'banners/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await bannerApi.getAll();
      return Array.isArray(data) ? data : data.results ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createBanner = createAsyncThunk(
  'banners/create',
  async (bannerData, { rejectWithValue }) => {
    try {
      return await bannerApi.create(bannerData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateBanner = createAsyncThunk(
  'banners/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await bannerApi.update(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banners/delete',
  async (id, { rejectWithValue }) => {
    try {
      await bannerApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ───────────────────────────────────────────────

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBannerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createBanner.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(updateBanner.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearBannerError } = bannerSlice.actions;
export default bannerSlice.reducer;
