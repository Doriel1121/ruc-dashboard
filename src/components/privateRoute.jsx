import { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";
import { Outlet, useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
import Cookies from "universal-cookie";
import { useFetch } from "../hooks/useFetch";

export default function PrivateRoute() {
  const { isLoggedIn, setIsLoggedIn, handleReset } = useContext(AppContext);
  const sessionUserInfo = JSON.parse(sessionStorage.getItem("customerInfo"));
  const id = sessionUserInfo?.userId;
  const FetchData = useFetch();
  const navigation = useNavigate();
  const cookies = new Cookies();

  // useEffect(() => {
  //   const myCookie = cookies.get("login_session");
  //   console.log("doc cookie", myCookie);

  //   console.log("reloading because of cookies");
  // }, []);

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
      })
      .finally(() => {
        setIsLoggedIn(false);
        navigation("/login");
      });
  };
  if (!!sessionUserInfo === true) {
    console.log(
      "in case of refresh and cookie was created and there is a session storage this message shouldnt appear"
    );
    return <Outlet />;
  } else {
    console.log("handeling logout");
    handleLogOut();
  }
}
