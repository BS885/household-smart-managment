import { ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import { theme } from "../Style/Theme";
import HomePage from "./HomePage";
import Header from "./Header";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Container } from "@mui/material";

const AppLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user); // או state.auth.token

  return (
    <ThemeProvider theme={theme}>
      {user ? (
        <>
          <Header />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Outlet />
          </Container>
        </>
      ) : (
        <HomePage />
      )}
    </ThemeProvider>
  );
};

export default AppLayout;
