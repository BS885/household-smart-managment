import { ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import { theme } from "./Theme";
import HomePage from "./HomePage";
import Header from "./Header";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const AppLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user); // או state.auth.token

  return (
    <ThemeProvider theme={theme}>
      {user ? (
        <>
          <Header />
          <Outlet />
        </>
      ) : (
        <HomePage />
      )}
    </ThemeProvider>
  );
};

export default AppLayout;
