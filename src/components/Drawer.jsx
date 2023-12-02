import { useReducer, useState, useContext } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import ProfilePage from "../pages/ProfilePage.jsx";
import HomePage from "../pages/HomePage";
import Events from "../pages/Events";
import { Link, useNavigate } from "react-router-dom";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
import { useFetch } from "../hooks/useFetch";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { Routes, Route } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import AppContext from "../context/AppContext";
import LogoutIcon from "@mui/icons-material/Logout";
import PrivateRoute from "./privateRoute";
import "../styles/drawer.css";
import ProfilePage from "../pages/ProfilePage";

const drawerWidth = 240;

const drawerLinks = [
  { name: "אירועים", link: "/", icon: <EventAvailableIcon /> },
  { name: "לוח בקרה", link: "/dashboard", icon: <GridViewIcon /> },
  { name: "עריכה", link: "/edit", icon: <EditCalendarIcon /> },
  { name: "חשבון", link: "/account", icon: <AccountCircleIcon /> },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: open ? "flex-end" : "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  // direction: "rtl",
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const FetchData = useFetch();
  const navigation = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const { guestsList, setGuestsList, setIsLoggedIn, isLoggedIn, handleReset } =
    useContext(AppContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogOut = () => {
    FetchData("/logout", "get")
      .then((res) => {
        console.log("logout response ", res.data);
        if (res.data.isLogOutSuccess) {
          sessionStorage.clear();
          setIsLoggedIn(false);
          navigation("/login");
          handleReset();
        }
      })
      .catch((err) => {
        dispatch({ type: "ERROR" });
        console.log(err);
      });
  };

  return (
    <Box sx={{ display: "flex", height: "100%", alignItems: "center" }}>
      <CssBaseline />
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "#CECE5A",
            color: "#fff",
            boxShadow: "-2px 0px 13px 8px #dedede",
            border: 0,
            left: 0,
          },
        }}
        anchor="right"
        variant="permanent"
        open={open}
      >
        <DrawerHeader open={open}>
          {!open ? (
            <IconButton
              className="menuOpenButton"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginLeft: 0,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton className="menuOpenButton" onClick={handleDrawerClose}>
              <ChevronRightIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List className="listWrapper">
          {drawerLinks.map((item, index) => (
            <ListItem key={item.name} disablePadding sx={{ display: "block" }}>
              <Link to={item.link}>
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
                    {item.icon}
                    {/* {index % 2 === 0 ? (
                    <EventAvailableIcon />
                  ) : (
                    <EditCalendarIcon />
                  )} */}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          <ListItem
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
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: "90dvh" }}>
        {/* <Navigation /> */}
        {/* <HomePage /> */}
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Events />} />
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/account" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Box>
    </Box>
  );
}
