import { useState, useEffect, useContext } from "react";
import "./App.css";
import SignIn from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TemporaryDrawer from "./components/Drawer";
import AppContext from "./context/AppContext";
import Cookies from "js-cookie";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Events from "./pages/Events";
import Navigation from "./pages/Navigation";
import Loader from "./components/loader";
import { useFetch } from "./hooks/useFetch";

// import { AppContextProvider } from "./context/AppContext";

const theme = createTheme({
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          marginRight: "0px",
        },
      },
    },
  },
});
function App() {
  const { setIsLoggedIn, isLoggedIn, customerId, setUserEventsList } =
    useContext(AppContext);
  const FetchData = useFetch();

  // useEffect(() => {
  //   console.log("customer Id", customerId);
  //   const sessionedUserInfo = sessionStorage.getItem("customerInfo");
  //   console.log(
  //     "usierrrrijdsoijhdsihfdsiufh",
  //     JSON.parse(sessionedUserInfo).userId
  //   );
  // }, [customerId]);

  const displayedComponent = () => {
    if (isLoggedIn === true) {
      return <TemporaryDrawer />;
    } else if (isLoggedIn === false) {
      return <SignIn />;
    } else {
      return <Loader />;
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* <BrowserRouter>{displayedComponent()}</BrowserRouter> */}
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<SignIn />} />
            <Route path="*" element={<TemporaryDrawer />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
