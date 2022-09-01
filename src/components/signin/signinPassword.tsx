import React, { useEffect, useState } from "react";
import { User } from "../../App";
import { useNavigate } from "react-router-dom";
import "./signin.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Axios from "../../services/axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import Snackbar from "../snackbar/Snackbar";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import icon from "../../assets/icon.png";

interface params {
  user: User;
  setUser: Function;
  setAccSuccess: Function;
  setQ: Function;
}

const SigninPassword: React.FC<params> = (params: params) => {
  let navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorP(true);
    setValid({ ...valid, [e.target.name]: e.target.value });
  };

  const [valid, setValid] = useState<User>(params.user);
  const [showPass, setSP] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setSP(!showPass);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = (e: any) => {
    setLoading(true);
    if (valid.password !== "") {
      params.setUser(valid);

      const Data = btoa(valid.userID.toLowerCase() + ":" + valid.password);

      const BodyData = {
        user_id: valid.userID.toLowerCase(),
        password: valid.password,
      };

      const Config = {
        headers: {
          Authorization: `Basic ${Data}`,
        },
      };

      Axios.put("/user/login", BodyData, Config)
        .then((res) => {
          if (res.data?.token) {
            localStorage.setItem("AuthToken", res.data.token);

            Axios.get("/user/basic", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
              },
            })
              .then((res) => {
                if (res.data.response_code === 0) {
                  params.setUser({
                    userID: res.data.user_id,
                    email: res.data.email,
                    password: params.user.password,
                    firstname: res.data.first_name,
                    lastname: res.data.last_name,
                    company: res.data.company_name,
                    number: res.data.phone,
                    country: res.data.country,
                    avatar: res.data.image,
                  });
                  params.setQ(res.data.question);
                }
              })
              .catch((err) => {
                console.log(err);
              });

            params.setAccSuccess(false);
            navigate("//inbox");
          } else {
            setOpen(true);
            setMessage("Invalid User ID or Password!");
            setAlert("error");
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err.response.data.error) {
            setOpen(true);
            setMessage("Incorrect User ID or Password!");
            setAlert("error");
          } else {
            setOpen(true);
            setMessage("Internal Server Error!");
            setAlert("error");
          }
          setLoading(false);
        });
    } else {
      setErrorP(true);
      setLoading(false);
      // setOpen(true);
      // setMessage('Error cannot send response!');
      // setAlert('warning');
    }

    e.preventDefault();
  };

  const handleForgetPass = (e: any) => {
    e.preventDefault();

    // console.log(valid.userID.toLowerCase(), "UID");

    Axios.get("user/" + valid.userID.toLowerCase() + "/forgot/")
      .then((res) => {
        if (res.data.response_code === 0) {
          navigate("/signin/forgotPassword/OTP");
        } else {
          setOpen(true);
          setMessage("Incorrect User ID or Password!");
          setAlert("error");
        }
      })
      .catch((err) => {
        setOpen(true);
        setMessage("Internal Server Error!");
        setAlert("error");
      });
  };

  const [errorP, setErrorP] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <div className="box-holder">
        <img src={icon} alt={"Company Logo"} className={"image-style-2"} />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            mt: 0,
            display: { md: "flex" },
            fontSize: 30,
            fontFamily: "arial",
            fontWeight: "bold",
            color: "green",
            textDecoration: "none",
          }}
        >
          KhatimDoc - Enter Password
        </Typography>
        <Typography
          variant={"subtitle2"}
          color={"lightslategrey"}
          sx={{ mb: 5 }}
        >
          Get documents signed faster, No credit card required.
        </Typography>
        <div className="signin-body">
          <div className="signin-inner-body">
            <div className={"signin-heading"}>
              <ArrowBackIcon
                sx={{ mr: 52, cursor: "pointer" }}
                onClick={() => {
                  navigate("/signin");
                }}
              />
            </div>
            <Box component={"form"}>
              <Typography
                variant={"subtitle2"}
                align={"left"}
                sx={{ ml: 7.5, mb: 2, mt: -1, fontWeight: "bold" }}
                color={"lightslategrey"}
              >
                User ID: {params.user?.userID}
              </Typography>

              <div className="signin-input-box">
                <TextField
                  autoFocus
                  sx={{ width: 350, height: "auto" }}
                  required
                  label="Password"
                  variant="outlined"
                  name="password"
                  type={showPass ? "text" : "password"}
                  onChange={onchange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  color={"success"}
                  error={errorP && valid.password === ""}
                  helperText={
                    errorP &&
                    (valid.password === "" ? "Password cannot be empty" : "")
                  }
                />
              </div>
              <div style={{ marginTop: 9.5 }}>
                <Typography
                  color={"green"}
                  component={"a"}
                  href={""}
                  sx={{ ml: -1.1, mr: 27, [`&:hover`]: { color: "green" } }}
                  onClick={handleForgetPass}
                >
                  Forgot Password
                </Typography>
              </div>

              <LoadingButton
                sx={{ mt: 2.95, width: 170 }}
                size={"large"}
                variant="contained"
                type="submit"
                color={"success"}
                onClick={handleSubmit}
                loading={loading}
                loadingPosition={"end"}
                endIcon={<React.Fragment />}
              >
                Login
              </LoadingButton>
              <Typography
                className={"a-styling"}
                sx={{ mt: 1 }}
                variant={"subtitle2"}
              >
                Dont have an account? Click&nbsp;
                <Typography
                  component={"a"}
                  href={""}
                  variant={"subtitle2"}
                  style={{ color: "darkgreen" }}
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  here{" "}
                </Typography>
              </Typography>
            </Box>
          </div>
          <Typography
            variant={"subtitle2"}
            color={"lightgray"}
            sx={{ mt: 0.8 }}
          >
            &copy;&nbsp;{new Date()?.getFullYear()} Codegic. All rights
            reserved.
            <Typography
              variant={"subtitle2"}
              component={"a"}
              href={"https://www.codegic.com/privacy-policy/"}
              target="_blank"
              sx={{ ml: 19 }}
              style={{ color: "lightgray", textDecoration: "none" }}
            >
              Privacy Policy{" "}
            </Typography>
          </Typography>
        </div>
      </div>

      <Snackbar open={open} setOpen={setOpen} alert={alert} message={message} />
    </>
  );
};

export default SigninPassword;
