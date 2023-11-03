import { useContext } from "react";
import AppContext from "../context/AppContext";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export default function PrivateRoute() {
  const { isLoggedIn } = useContext(AppContext);
  const cookies = Cookies.get();

  if ((cookies && cookies.login_session) || isLoggedIn) {
    return <Outlet />;
  }
  return <Navigate to={"/login"} />;
}
