import { useReducer, useContext, useRef } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import { useFetch } from "../hooks/useFetch";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

export default function Logout(props) {
  const { open } = props;
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const FetchData = useFetch();
  const { setIsLoggedIn, handleReset } = useContext(AppContext);
  const navigation = useNavigate();
  const logoutBtnRef = useRef(null);

  const handleLogOut = () => {
    dispatch({ type: "START" });
    FetchData("/logout", "get")
      .then((res) => {
        console.log("logout response ", res.data);
        dispatch({ type: "SUCCESS" });
        // if (res.data.isLogOutSuccess) {
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigation("/login");
        handleReset();
        // }
      })
      .catch((err) => {
        dispatch({ type: "ERROR" });
        console.log(err);
      });
  };
  return (
    <ListItem
      ref={logoutBtnRef}
      id="logoutBtn"
      className="listItem"
      disablePadding
      sx={{ display: "block" }}
      onClick={handleLogOut}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
          flexDirection: "row-reverse",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
            marginRight: 0,
          }}
        >
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary={"התנתק"} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  );
}
