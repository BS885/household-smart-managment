import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExpenseAndIncome, ExpenseAndIncomeToSave, FileState } from "../models/Expense&Income";
import api from "./api";

interface ExpenseState {
  expenses: ExpenseAndIncomeToSave[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  status: "idle",
  error: null,
};

export const loadExpenses = createAsyncThunk("expenses/loadExpenses", async () => {
  const response = await api.get("/expenses");
  console.log(response.data);
  return response.data.$values;
});

export const addExpenseAsync = createAsyncThunk("expenses/addExpense", async (expense: Omit<ExpenseAndIncome, "id">) => {
  const response = await api.post("/expenses", expense);
  console.log(response.data);
  return response.data;
});

export const addWithFileExpenseAsync = createAsyncThunk("expenses/addExpense", async ({ expense, file }: { expense: Omit<ExpenseAndIncome, "id">; file: FileState }) => {
  const expenseAndFile = {

    Date: new Date(expense.date).toISOString().split('T')[0],
    Category: expense.category,
    Description: expense.description,
    Sum: expense.sum,
    file: true,
    FileName: file.fileName,
    FileType: file.fileType,
    Filesize: file.fileSize.toString(),
  };

  console.log("Sending request with data:", expenseAndFile);

  const response = await api.post("/expenses", expenseAndFile);

  console.log(response.data);
  return response.data;
});

export const updateExpenseAsync = createAsyncThunk("expenses/updateExpense", async (expense: ExpenseAndIncome) => {
  const response = await api.put(`/expenses/${expense.id}`, expense);
  console.log(response.data);
  return response.data;
})

export const updateWithFileExpenseAsync = createAsyncThunk("expenses/updateWithFileExpense", async ({ expense, file }: { expense: ExpenseAndIncome; file: FileState }) => {
  const expenseAndFile = {
    Date: new Date(expense.date).toISOString().split('T')[0],
    Category: expense.category,
    Description: expense.description,
    Sum: expense.sum,
    file: true,
    FileName: file.fileName,
    FileType: file.fileType,
    Filesize: file.fileSize.toString(),
  };

  console.log("Sending request with data:", expenseAndFile);

  const response = await api.put(`/expenses/${expense.id}`, expenseAndFile);

  console.log(response.data);
  return response.data;
});

export const deleteExpenseAsync = createAsyncThunk("expenses/deleteExpense", async (id: number) => {
  const response = await api.delete(`/expenses/${id}`);
  console.log(response.data);
  return id;
})

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    removeExpense: (state, action: PayloadAction<number>) => {
      state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
    },
    updateExpense: (state, action: PayloadAction<{ id: number; expense: ExpenseAndIncome }>) => {
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload.expense;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = action.payload;
      })
      .addCase(loadExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch expenses";
      })
      .addCase(addExpenseAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addExpenseAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses.push(action.payload);
      })
      .addCase(addExpenseAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add expense";
      });
  },
});


export const { removeExpense, updateExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
