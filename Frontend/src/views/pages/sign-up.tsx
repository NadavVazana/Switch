import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user.service";
import { useSetRecoilState } from "recoil";
import loggedInUser from "../../atoms/logged-in-user";
import snackbar from "../../atoms/snackbar";
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/NadavVazana">
        Nadav Vazana
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

function SignUp() {
  const setLoggedInUser = useSetRecoilState(loggedInUser);
  const setSnackbar = useSetRecoilState(snackbar);
  const [errorMsg, setErrorMsg] = React.useState("");
  const phoneStarts = ["050", "052", "053", "057", "055"];
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const isPhoneStartValid = phoneStarts.some((phoneStart) =>
      `${data.get("Phone Number")}`.startsWith(phoneStart)
    );

    if (
      !isPhoneStartValid ||
      `${data.get("Phone Number")}`.length !== 10 ||
      isNaN(+`${data.get("Phone Number")}`)
    ) {
      setSnackbar({
        isOpen: true,
        msg: "Phone number not valid..",
        variant: "error",
      });
      return;
    }

    const user = {
      firstName:
        `${data.get("firstName")}`[0].toUpperCase() +
        `${data.get("firstName")}`.substring(1),
      lastName:
        `${data.get("lastName")}`[0].toUpperCase() +
        `${data.get("lastName")}`.substring(1),
      email: `${data.get("email")}`,
      password: `${data.get("password")}`,
      phone: `${data.get("Phone Number")}`,
    };

    const account = await userService.signup(user);
    if (!account) {
      setErrorMsg("Could'nt signup, Try again later...");
    } else {
      setLoggedInUser(account);
      setErrorMsg("");
      navigate("/");
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Phone Number"
                  label="Phone Number"
                  type="Phone Number"
                  id="Phone Number"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle1">{errorMsg}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                  variant="body2"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      <img
        style={{
          position: "fixed",
          width: "70px",
          cursor: "pointer",
          bottom: "10px",
          right: "10px",
        }}
        className="go-back-btn"
        onClick={() => navigate("/login")}
        src={
          require("../../assets/imgs/left-arrow-direction-svgrepo-com.svg")
            .default
        }
        alt="go-back-btn"
      />
    </ThemeProvider>
  );
}

export default SignUp;
