import { createBrowserRouter } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import AppLayout from "./components/AppLayout";
import ExpenseTracker from "./components/ExpenseTracker";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />, // ה-Header יישאר תמיד
        errorElement: <h1>error</h1>,
        children: [
            { path: "Expense", element: <ExpenseTracker /> },
        ],
    },
    { path: "login", element: <Login /> },
    { path: "register", element: <RegistrationForm /> }
]);