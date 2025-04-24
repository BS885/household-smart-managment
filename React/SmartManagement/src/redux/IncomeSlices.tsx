import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction, TransactionToSave, FileState } from "../models/Expense&Income";
import api from "./api";

interface IncomeState {
    incomes: TransactionToSave[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: IncomeState = {
    incomes: [],
    status: "idle",
    error: null,
};

export const loadIncomes = createAsyncThunk("Incomes/loadIncomes", async () => {
    const response = await api.get("/Incomes");
    console.log(response.data);
    return response.data.$values;
});

export const addIncomeAsync = createAsyncThunk("Incomes/addIncome", async (income: Omit<Transaction, "id">) => {
    const response = await api.post("/Incomes", income);
    console.log(response.data);
    return response.data;
});

export const addWithFileIncomeAsync = createAsyncThunk("Incomes/AddIncome", async ({ Income, file }: { Income: Omit<Transaction, "id">; file: FileState }) => {
    const IncomeAndFile = {

        Date: new Date(Income.date).toISOString().split('T')[0],
        Category: Income.category,
        Description: Income.description,
        Sum: Income.sum,
        file: true,
        FileName: file.fileName,
        FileType: file.fileType,
        Filesize: file.fileSize.toString(),
    };

    console.log("Sending request with data:", IncomeAndFile);

    const response = await api.post("/Incomes", IncomeAndFile);

    console.log(response.data);
    return response.data;
});

export const updateIncomeAsync = createAsyncThunk("Incomes/updateIncome", async (Income: Transaction) => {
    const response = await api.put(`/Incomes/${Income.id}`, Income);
    console.log(response.data);
    return response.data;
})

export const updateWithFileIncomeAsync = createAsyncThunk("Incomes/updateWithFileIncome", async ({ Income, file }: { Income: Transaction; file: FileState }) => {
    const IncomeAndFile = {
        Date: new Date(Income.date).toISOString().split('T')[0],
        Category: Income.category,
        Description: Income.description,
        Sum: Income.sum,
        file: true,
        FileName: file.fileName,
        FileType: file.fileType,
        Filesize: file.fileSize.toString(),
    };

    console.log("Sending request with data:", IncomeAndFile);

    const response = await api.put(`/Incomes/${Income.id}`, IncomeAndFile);

    console.log(response.data);
    return response.data;
});

export const deleteIncomeAsync = createAsyncThunk("Incomes/deleteIncome", async (id: number) => {
    const response = await api.delete(`/Incomes/${id}`);
    console.log(response.data);
    return id;
})

const IncomesSlice = createSlice({
    name: "Incomes",
    initialState,
    reducers: {
        removeIncome: (state, action: PayloadAction<number>) => {
            state.incomes = state.incomes.filter((income) => income.id !== action.payload);
        },
        updateIncome: (state, action: PayloadAction<{ id: number; income: Transaction }>) => {
            const index = state.incomes.findIndex((i) => i.id === action.payload.id);
            if (index !== -1) {
                state.incomes[index] = action.payload.income;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadIncomes.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loadIncomes.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.incomes = action.payload;
            })
            .addCase(loadIncomes.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch Incomes";
            })
            .addCase(addIncomeAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addIncomeAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.incomes.push(action.payload);
            })
            .addCase(addIncomeAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add Income";
            });
    },
});


export const { removeIncome, updateIncome } = IncomesSlice.actions;
export default IncomesSlice.reducer;
