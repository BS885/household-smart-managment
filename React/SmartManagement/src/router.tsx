import AppLayout from "./components/AppLayout";
import ExpenseTracker from "./components/Expenses and Imcome/ExpenseTracker";
import IncomeTracker from "./components/Expenses and Imcome/IncomeTracker";
import ReportsScreen from "./components/reports/ReportsScreen";
import Dashboard from "./components/Graphs/Dashboard";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPasswordForm from "./components/Auth/ResetPasswordForm";
import Registr from "./components/Auth/Registr";
import { createHashRouter } from "react-router-dom";
import LoginNotInHomePage from "./components/Auth/LoginNotInHomePage";


export const router = createHashRouter([
    {
        path: "/",
        element: <AppLayout />,
        errorElement: <h1>Error</h1>,
        children: [

            { path: "reports", element: <ReportsScreen /> },
            { path: "income-management", element: <IncomeTracker /> },
            { path: "expense-management", element: <ExpenseTracker /> },
            { path: "graphs", element: <Dashboard /> },
        ],
    },
    { path: "login", element: <LoginNotInHomePage /> },
    { path: "register", element: <Registr /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "reset-password", element: <ResetPasswordForm /> }
]);