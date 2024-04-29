import { useContext } from "react";
import "./App.css";
import SignIn from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
import TemporaryDrawer from "./components/Drawer";
import AppContext from "./context/AppContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import Loader from "./components/loader";
// import { useFetch } from "./hooks/useFetch";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { QueryClient, QueryClientProvider } from "react-query";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// import { AppContextProvider } from "./context/AppContext";

const theme = createTheme({
  // direction: "rtl",
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
  // const stt = useContext(AppContext);
  // const { isLoggedIn, setCustomerId } = useContext(AppContext);
  // const FetchData = useFetch();
  const queryClient = new QueryClient();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const sessionUserInfo = JSON.parse(sessionStorage.getItem("customerInfo"));
  //   const id = sessionUserInfo?.userId;
  //   setCustomerId(id);
  //   console.log("customer id", id);
  //   if (!!id === false) {
  //     navigate("/login");
  //   }
  // }, []);

  // const displayedComponent = () => {
  //   if (isLoggedIn === true) {
  //     return <TemporaryDrawer />;
  //   } else if (isLoggedIn === false) {
  //     return <SignIn />;
  //   } else {
  //     return <Loader />;
  //   }
  // };

  return (
    <>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <div style={{ height: "95%" }}>
            <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <Routes>
                  <Route path="/login" element={<SignIn />} />
                  <Route path="*" element={<TemporaryDrawer />} />
                </Routes>
              </QueryClientProvider>
            </BrowserRouter>
          </div>
          {/* <div style={{ height: "5%" }}>
            <span style={{ fontSize: "12px" }}>כל הזכויות שמורות rucoming</span>
          </div> */}
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}

export default App;
