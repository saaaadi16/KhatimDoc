import React, { useEffect, useState } from "react";
import { User } from "../../App";
import { useNavigate } from "react-router-dom";
import "./signin.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { Typography, Box, Alert, Grid } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCookies } from "react-cookie";
import icon from "../../assets/icon.png";
import { tempAppSet } from "../../utils/GetRouterState";

interface params {
  user: User;
  setUser: (user: User) => void;
  AccSuccess: boolean;
}

const Signin: React.FC<params> = (params: params) => {
  let navigate = useNavigate();

  const [cookies, setCookies] = useCookies(["userID"]);

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.name + ' : ' + e.target.value);
    setError(true);
    setValid({ ...valid, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    if (valid.userID !== "" && valid.userID?.length > 7) {
      params.setUser(valid);
      tempAppSet(1);
      navigate("/signin/password");
    } else {
      navigate("/signin");
    }
    e.preventDefault();
  };

  useEffect(() => {
    setValid({ ...valid, ["userID"]: cookies.userID });
  }, []);

  const [valid, setValid] = useState<User>(params.user);
  const [error, setError] = useState<boolean>(false);

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
            // fontStyle: 'oblique',
            fontWeight: "bold",
            color: "green",
            textDecoration: "none",
          }}
        >
          KhatimDoc - Login
        </Typography>
        <Typography
          variant={"subtitle2"}
          color={"lightslategrey"}
          sx={{ mb: params.AccSuccess ? 3 : 5 }}
        >
          Get documents signed faster, No credit card required.
        </Typography>

        {params.AccSuccess && (
          <Alert variant="outlined" severity="success" sx={{ mb: 3 }}>
            {" "}
            Congratulations your account is created successfully, continue to
            login!{" "}
          </Alert>
        )}
        <div className="signin-body">
          <div className="signin-inner-body">
            <Box component={"form"} sx={{ mt: 2 }}>
              <div>
                <TextField
                  autoFocus
                  required
                  label="User ID"
                  variant="outlined"
                  name="userID"
                  onChange={onchange}
                  onBlur={() => {
                    setError(true);
                  }}
                  defaultValue={cookies.userID}
                  color={"success"}
                  error={error && valid.userID?.length < 8}
                  helperText={
                    !error
                      ? ""
                      : valid.userID?.length < 8
                      ? "User ID must be greater than eight"
                      : ""
                  }
                  sx={{ width: 350, height: "auto", mt: 4.8 }}
                />
              </div>
              <div>
                <Checkbox
                  name="tnc"
                  color={"success"}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setCookies("userID", valid.userID, { path: "/" });
                    }
                  }}
                  sx={{ ml: -0.7 }}
                />
                <Typography
                  component={"span"}
                  variant={"subtitle2"}
                  sx={{ mr: 29 }}
                >
                  Remember Me
                </Typography>
              </div>

              <Button
                variant="contained"
                size={"large"}
                type="submit"
                color={"success"}
                onClick={handleSubmit}
                sx={{ mt: 1.9, width: 170 }}
              >
                Continue
              </Button>

              <Typography
                variant={"subtitle2"}
                className={"a-styling"}
                sx={{ mt: 1 }}
              >
                Dont have an account? Click&nbsp;
                <Typography
                  variant={"subtitle2"}
                  component={"a"}
                  href={""}
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
      
    </>
  );
};

export default Signin;
