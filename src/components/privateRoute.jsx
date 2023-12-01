import { useContext } from "react";
import AppContext from "../context/AppContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useFetch } from "../hooks/useFetch";

export default function PrivateRoute() {
  const { isLoggedIn, setIsLoggedIn, handleReset } = useContext(AppContext);
  const cookies = Cookies.get();
  const sessionUserInfo = JSON.parse(sessionStorage.getItem("customerInfo"));
  const id = sessionUserInfo?.userId;
  const FetchData = useFetch();
  const navigation = useNavigate();

  const handleLogOut = () => {
    FetchData("/logout", "get")
      .then((res) => {
        console.log("logout response ", res.data);
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigation("/login");
        handleReset();
        if (!!res.data.isLogOutSuccess === false) {
          console.log(
            "something went wrong with the logging out action",
            res.data
          );
        }
      })
      .catch((err) => {
        // dispatch({ type: "ERROR" });
        console.log(err);
      });
  };

  if (((cookies && cookies.login_session) || isLoggedIn) && !!id === true) {
    return <Outlet />;
  } else {
    handleLogOut();
  }
}
