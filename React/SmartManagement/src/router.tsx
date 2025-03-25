import { createBrowserRouter, Navigate } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import AppLayout from "./components/AppLayout";
import ExpenseTracker from "./components/Expenses/ExpenseTracker";
import Reports from "./components/Expenses/Reports";
import InComeTracker from "./ExpenseTracker";
import Graphs from "./Graphs";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />, // Header will always be present
        errorElement: <h1>Error</h1>,
        children: [
        // {
        //     index: true, // This makes it the default child route
        //     element: <Navigate to="/graphs" replace />
        // },
            { path: "reports", element: <Reports /> },
            { path: "income-management", element: <InComeTracker /> },
            { path: "expense-management", element: <ExpenseTracker /> },
            { path: "graphs", element: <Graphs /> },
        ],
    },
    { path: "login", element: <Login /> },
    { path: "register", element: <RegistrationForm /> }
]);