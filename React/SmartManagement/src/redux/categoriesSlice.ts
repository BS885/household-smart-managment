// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from './api';

// // הגדרת ממשק ל-state
// interface CategoriesState {
//   expenseCategories: string[]; // קטגוריות הוצאות
//   incomeCategories: string[]; // קטגוריות הכנסות
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: CategoriesState = {
//   expenseCategories: [],
//   incomeCategories: [],
//   status: "idle",
//   error: null,
// };

// // Thunk לקבלת הקטגוריות של הוצאות
// const fetchExpenseCategories = createAsyncThunk(
//   'categories/fetchExpenseCategories',
//   async (_, { rejectWithValue }) => {
//     try {
//       console.log("Fetching expense categories...");
//       const response = await api.get('Category\\Expense\\list');
//       console.log("Fetched expense categories:", response.data.$values);
//       return response.data.$values;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch expense categories');
//     }
//   }
// );

// const fetchIncomeCategories = createAsyncThunk(
//   'categories/fetchIncomeCategories',
//   async (_, { rejectWithValue }) => {
//     try {
//       console.log("Fetching income categories...");
//       const response = await api.get('Category\\Income\\list');
//       console.log("Fetched income categories:", response.data.$values);
//       return response.data.$values;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch income categories');
//     }
//   }
// );

// const categoriesSlice = createSlice({
//   name: 'categories',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // עדכון סטטוס בקשת הוצאות
//       .addCase(fetchExpenseCategories.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.expenseCategories = action.payload; // עדכון רשימת הוצאות
//       })
//       .addCase(fetchExpenseCategories.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
//       })
//       // עדכון סטטוס בקשת הכנסות
//       .addCase(fetchIncomeCategories.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchIncomeCategories.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.incomeCategories = action.payload; // עדכון רשימת הכנסות
//       })
//       .addCase(fetchIncomeCategories.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
//       });
//   }
// });

// export { fetchExpenseCategories, fetchIncomeCategories };
// export default categoriesSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

// הגדרת ממשק ל-state
interface CategoriesState {
  expenseCategories: string[];
  incomeCategories: string[];
  expenseStatus: "idle" | "loading" | "succeeded" | "failed";
  incomeStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoriesState = {
  expenseCategories: [],
  incomeCategories: [],
  expenseStatus: "idle",
  incomeStatus: "idle",
  error: null,
};

// Thunk לקבלת הקטגוריות של הוצאות
const fetchExpenseCategories = createAsyncThunk(
  'categories/fetchExpenseCategories',
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching expense categories...");
      const response = await api.get('Category\\Expense\\list');
      console.log("Fetched expense categories:", response.data.$values);
      return response.data.$values;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch expense categories');
    }
  }
);

const fetchIncomeCategories = createAsyncThunk(
  'categories/fetchIncomeCategories',
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching income categories...");
      const response = await api.get('Category\\Income\\list');
      console.log("Fetched income categories:", response.data.$values);
      return response.data.$values;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch income categories');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // עדכון סטטוס בקשת הוצאות
      .addCase(fetchExpenseCategories.pending, (state) => {
        state.expenseStatus = 'loading';
      })
      .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
        state.expenseStatus = 'succeeded';
        state.expenseCategories = action.payload;
      })
      .addCase(fetchExpenseCategories.rejected, (state, action) => {
        state.expenseStatus = 'failed';
        state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
      })
      // עדכון סטטוס בקשת הכנסות
      .addCase(fetchIncomeCategories.pending, (state) => {
        state.incomeStatus = 'loading';
      })
      .addCase(fetchIncomeCategories.fulfilled, (state, action) => {
        state.incomeStatus = 'succeeded';
        state.incomeCategories = action.payload;
      })
      .addCase(fetchIncomeCategories.rejected, (state, action) => {
        state.incomeStatus = 'failed';
        state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
      });
  }
});

export { fetchExpenseCategories, fetchIncomeCategories };
export default categoriesSlice.reducer;
