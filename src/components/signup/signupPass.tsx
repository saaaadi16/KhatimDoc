import React, { useState } from "react";
import { User } from "../../App";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Axios from "../../services/axios";
import Stepper from "../stepper/Stepper";
import { IconButton, InputAdornment, Typography } from "@mui/material";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import Snackbar from "../snackbar/Snackbar";
import { useCookies } from "react-cookie";
import { LoadingButton } from "@mui/lab";
import icon from "../../assets/icon.png";

interface params {
  user: User;
  setUser: (user: User) => void;
  otp: string;
  setAccSuccess: Function;
}

const SignupPassword: React.FC<params> = (params: params) => {
  let navigate = useNavigate();

  const [cookies, setCookies] = useCookies(["userID"]);

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValid({ ...valid, [e.target.name]: e.target.value });
    setError(true);
  };

  const onchange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValid2(e.target.value);
  };

  const handleSubmit = (e: any) => {
    setLoading(true);
    if (
      valid.password.length <= 8 ||
      valid2.length <= 8 ||
      valid.password !== valid2
    ) {
      setError(true);
      // setOpen(true);
      // setMsg('Error cannot send response!')
      // setAlert('warning')
      setLoading(false);
    } else if (
      valid.password.length > 8 &&
      valid2.length > 8 &&
      valid.password === valid2
    ) {
      params.setUser(valid);

      const Data = {
        user_id: params.user.userID.toLowerCase(),
        password: valid.password,
        otp: params.otp,
      };

      // setOpen(true);
      // setMsg('Account created successfully!')
      // setAlert('success');

      Axios.put("/user/password", Data)
        .then((res) => {
          if (res.data.response_code === 0) {
            setCookies("userID", valid.userID, { path: "/" });
            params.setAccSuccess(true);
            navigate("/signin");
          } else {
            setOpen(true);
            setMsg(res.data.error_message);
            setAlert("error");
          }
          setLoading(false);
        })
        .catch((err) => {
          setOpen(true);
          setMsg("Internal Server Error!");
          setAlert("error");
          setLoading(false);
        });
    }

    e.preventDefault();
  };

  const [valid, setValid] = useState<User>(params.user);

  const [valid2, setValid2] = useState<String>("");

  const [error, setError] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMsg] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  const [showPass1, setSP1] = useState<boolean>(false);
  const [showPass2, setSP2] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const handleClickShowPassword1 = () => {
    setSP1(!showPass1);
  };

  const handleClickShowPassword2 = () => {
    setSP2(!showPass2);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Stepper index={3} />
      <div className="page-holder">
        <img src={icon} alt="Company Logo" className="image-style" />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            mt: 2,
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
          sx={{ mb: 2 }}
        >
          Get documents signed faster, No credit card required.
        </Typography>
        <div className="sq-body">
          <div className="sq-inner-body">
            <div className={"signin-heading"}>
              <ArrowBack
                sx={{ mr: 62, cursor: "pointer" }}
                onClick={() => {
                  navigate("/signin/forgotPassword/SQ");
                }}
              />
              {/*<Typography variant={'subtitle1'} sx={{mr: 18.5, fontWeight: 'bold'}}>Enter Your Password</Typography>*/}
            </div>
            <form>
              <div className="signin-input-box">
                <TextField
                  autoFocus
                  required
                  label="Enter Password"
                  variant="outlined"
                  name="password"
                  type={showPass1 ? "text" : "password"}
                  fullWidth
                  onChange={onchange}
                  onBlur={() => {
                    setError(true);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword1}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPass1 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  color={"success"}
                  error={error && valid.password.length <= 8}
                  helperText={
                    !error
                      ? ""
                      : valid.password.length <= 8
                      ? "Password length must be greater than 8"
                      : ""
                  }
                  sx={{ mt: 3, width: 475 }}
                />
              </div>
              <div className="signin-input-box">
                <TextField
                  sx={{ mt: 2, width: 475 }}
                  required
                  label="Confirm Password"
                  variant="outlined"
                  type={showPass2 ? "text" : "password"}
                  name="password2"
                  fullWidth
                  error={error && valid.password !== valid2}
                  onChange={onchange2}
                  onBlur={() => {
                    setError(true);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword2}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPass2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  color={"success"}
                  helperText={
                    !error
                      ? ""
                      : valid.password !== valid2
                      ? "Password does not match"
                      : ""
                  }
                />
              </div>
              <LoadingButton
                sx={{ mt: 4.2, width: 170 }}
                size={"large"}
                variant="contained"
                type="submit"
                color={"success"}
                onClick={handleSubmit}
                loading={loading}
                loadingPosition={"end"}
                endIcon={<React.Fragment />}
              >
                Finish
              </LoadingButton>
            </form>
          </div>
          <Typography variant={"subtitle2"} color={"lightgray"} sx={{ mt: 1 }}>
            &copy;&nbsp;{new Date()?.getFullYear()} Codegic. All rights
            reserved.
            <Typography
              variant={"subtitle2"}
              component={"a"}
              href={"https://www.codegic.com/privacy-policy/"}
              sx={{ ml: 29 }}
              target="_blank"
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

export default SignupPassword;
