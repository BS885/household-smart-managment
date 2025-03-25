import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import expenseReducer from "./ExpenseSlice";
import categoriesReducer from "./categoriesSlice";
import fileReducer from "./FileSlice";

export const store = configureStore({
    reducer: {
        auth: userReducer,
        expenses: expenseReducer,
        categories: categoriesReducer,
        File: fileReducer,

    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;