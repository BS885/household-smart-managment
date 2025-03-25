import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

// הגדרת ממשק ל-state
interface CategoriesState {
  categories: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  status: "idle",
  error: null,
};

// Thunk לקבלת הקטגוריות מה-API
const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching categories...");
      const response = await api.get('CategoryExpense\\list');
      console.log("Fetched categories:", response.data.$values);
      
      return response.data.$values;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
      });
  }
});

export { fetchCategories };
export default categoriesSlice.reducer;
