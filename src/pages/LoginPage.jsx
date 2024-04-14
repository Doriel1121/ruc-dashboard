import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useReducer, useContext, useEffect } from "react";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import Loader from "../components/loader";
import { useFetch } from "../hooks/useFetch";
import Cookies from "js-cookie";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://dev-rucoming.pantheonsite.io/">
        RU-COMING
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const { isLoggedIn, setIsLoggedIn, setCustomerId, setUserInfo } =
    useContext(AppContext);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const navigation = useNavigate();
  const FetchData = useFetch();
  const id = JSON.parse(sessionStorage.getItem("customerInfo"))?.userId;

  useEffect(() => {
    const cookies = Cookies.get();
    if (!!id === true) {
      console.log("im logged innnn");
      navigation("/");
    }
    // if (isLoggedIn) {
    //   console.log("im logged innnn");
    //   navigation("/");
    // }
  }, [isLoggedIn]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      phone: data.get("phone"),
      password: data.get("password"),
    };
    console.log(payload);
    dispatch({ type: "START" });
    FetchData("/login", "post", payload)
      .then((res) => {
        console.log("login response", res);
        dispatch({ type: "SUCCESS", payload: res.data });
        setCustomerId(res.data.userId);
        const { name, lastName, phone, role } = res.data;

        setUserInfo({ name, lastName, phone, role });
        sessionStorage.setItem("customerInfo", JSON.stringify(res.data));
        setIsLoggedIn(true);
        navigation("/");
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: "ERROR" });
        setIsLoggedIn(false);
        navigation("/login");
      });
  };
  if (state.loading) return <Loader />;
  // if (state.error) return "error occurred";
  console.log("loggen in", isLoggedIn);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            התחברות
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="טלפון נייד"
              name="phone"
              autoComplete="phone"
              autoFocus
              dir="rtl"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              dir="rtl"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {state.error ? <Typography>סיסמה שגויה</Typography> : null}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
