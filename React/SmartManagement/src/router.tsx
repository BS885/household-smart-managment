import { createBrowserRouter } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import AppLayout from "./components/AppLayout";
import ExpenseTracker from "./components/Expenses/ExpenseTracker";
import Reports from "./components/Expenses/Reports";
import Graphs from "./components/Graphs";
import IncomeTracker from "./components/Expenses/IncomeTracker";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />, // Header will always be present
        errorElement: <h1>Error</h1>,
        children: [

            { path: "reports", element: <Reports /> },
            { path: "income-management", element: <IncomeTracker /> },
            { path: "expense-management", element: <ExpenseTracker /> },
            { path: "graphs", element: <Graphs /> },
        ],
    },
    { path: "login", element: <Login /> },
    { path: "register", element: <RegistrationForm /> }
]);