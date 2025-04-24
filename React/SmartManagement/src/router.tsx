import { createBrowserRouter } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import AppLayout from "./components/AppLayout";
import ExpenseTracker from "./components/Expenses and Imcome/ExpenseTracker";
import Reports from "./components/Expenses and Imcome/Reports";
import IncomeTracker from "./components/Expenses and Imcome/IncomeTracker";
import Dashboard from "./components/Dashboard";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />, // Header will always be present
        errorElement: <h1>Error</h1>,
        children: [

            { path: "reports", element: <Reports /> },
            { path: "income-management", element: <IncomeTracker /> },
            { path: "expense-management", element: <ExpenseTracker /> },
            { path: "graphs", element: <Dashboard /> },
        ],
    },
    { path: "login", element: <Login /> },
    { path: "register", element: <RegistrationForm /> }
]);