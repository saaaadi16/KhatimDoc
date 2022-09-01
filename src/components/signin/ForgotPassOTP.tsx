import React, { useState } from "react";
import { User } from "../../App";
import { useNavigate } from "react-router-dom";
import "./signin.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import validator from "validator";
import Axios from "../../services/axios";
import Snackbar from "../snackbar/Snackbar";
import { LoadingButton } from "@mui/lab";
import icon from "../../assets/icon.png";

interface props {
  user: User;
  otp: string;
  setOtp: Function;
  question: string;
  setQ: Function;
}

const ForgotPassOTP: React.FC<props> = (props: props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");
  const [message, setMsg] = useState<string>("");

  let navigate = useNavigate();

  const handleSubmit = (e: any) => {
    setLoading(true);

    // setError(false);
    const Data = {
      user_id: props.user.userID.toLowerCase(),
      otp: props.otp,
    };

    Axios.put("/user/otp", Data)
      .then((res) => {
        if (res.data.response_code === 0) {
          props.setQ(res.data.security_question);
          navigate("/signin/forgotPassword/SQ");
        } else {
          if (!res.data.otp_valid) {
            setOpen(true);
            setMsg(res.data.error_message);
            setAlert("error");
          } else if (res.data.otp_expired) {
            setOpen(true);
            setMsg(res.data.error_message);
            setAlert("warning");
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setOpen(true);
        setMsg("Internal Server Error!");
        setAlert("error");
        setLoading(false);
      });

    setLoading(false);

    e.preventDefault();
  };

  const handleResendOTP = (e: any) => {
    Axios.get("user/" + props.user.userID.toLowerCase() + "/otp/")
      .then((res) => {
        if (res.data.response_code === 0) {
          setOpen(true);
          setMsg("Kindly Check Your Email!");
          setAlert("success");
        } else {
          setOpen(true);
          setMsg(res.data.error_message);
          setAlert("error");
        }
      })
      .catch((err) => {
        setOpen(true);
        setMsg("Internal Server Error!");
        setAlert("error");
      });
    e.preventDefault();
  };

  const [loading, setLoading] = useState<boolean>(false);

  // const [error, setError] = useState<boolean>(false);

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
          KhatimDoc - Enter OTP
        </Typography>
        <Typography variant={"subtitle2"} color={"red"} sx={{ mb: 5 }}>
          An email is sent with instructions to your registered email account.
          Kindly follow the instructions there.
        </Typography>
        <div className="signin-body">
          <div className="signin-inner-body">
            {/*<Typography variant={'subtitle1'} sx={{fontWeight: 'bold', mb: 2}}>Login to KhatimDoc</Typography>*/}
            <Box component={"form"} sx={{}}>
              <div className={"signin-heading"}>
                <ArrowBackIcon
                  sx={{ mr: 52, cursor: "pointer" }}
                  onClick={() => {
                    navigate("/signin/password");
                  }}
                />
              </div>
              <Typography
                variant={"subtitle2"}
                align={"left"}
                sx={{ ml: 7.5, mb: 2, mt: -1, fontWeight: "bold" }}
                color={"lightslategrey"}
              >
                User ID: {props.user?.userID}
              </Typography>
              <div>
                <TextField
                  autoFocus
                  required
                  label={"OTP"}
                  sx={{ mb: 1, width: 350 }}
                  color={"success"}
                  onChange={(event) => {
                    props.setOtp(event.target.value);
                  }}
                />
              </div>
              <div style={{ marginTop: 1.5 }}>
                <Typography
                  color={"green"}
                  component={"a"}
                  href={""}
                  sx={{ ml: -1.9, mr: 30, [`&:hover`]: { color: "green" } }}
                  onClick={handleResendOTP}
                >
                  Resend OTP
                </Typography>
              </div>
              <div>
                <LoadingButton
                  sx={{ mt: 3, width: 170 }}
                  size={"large"}
                  variant="contained"
                  type="submit"
                  color={"success"}
                  loading={loading}
                  loadingPosition={"end"}
                  onClick={handleSubmit}
                  endIcon={<React.Fragment />}
                >
                  Continue
                </LoadingButton>
              </div>
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

export default ForgotPassOTP;
