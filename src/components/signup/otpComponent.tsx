import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import "./signup.css";
import Axios from "../../services/axios";
import { User } from "../../App";
import { TextField, Typography, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Stepper from "../stepper/Stepper";
import Snackbar from "../snackbar/Snackbar";
import validator from "validator";
import { LoadingButton } from "@mui/lab";
import icon from "../../assets/icon.png";

interface props {
  user: User;
  otp: string;
  setOtp: Function;
}

const OtpComponent: React.FC<props> = (props) => {
  let navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");
  const [message, setMsg] = useState<string>("");

  const handleSubmit = (e: any) => {
    setLoading(true);
    if (
      props.otp?.length > 5 &&
      props.otp?.length < 7 &&
      validator.isNumeric(props.otp)
    ) {
      setError(false);
      const Data = {
        user_id: props.user.userID.toLowerCase(),
        otp: props.otp,
      };

      // setOpen(true);
      // setMsg('Request Sent')
      // setAlert('success');

      Axios.put("/user/otp", Data)
        .then((res) => {
          if (res.data.response_code === 0) {
            navigate("/signup/securityQuestion");
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
    } else {
      setError(true);
      // setOpen(true);
      // setMsg('Error cannot send response!');
      // setAlert('warning');
      setLoading(false);
    }

    e.preventDefault();
  };

  const handleResendOTP = (e: any) => {
    setOpen(true);
    setMsg("Kindly check your email for OTP");
    setAlert("info");

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

  const [error, setError] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Stepper index={1} />
      <div className={"page-holder"}>
        <img src={icon} alt={"Company Logo"} className={"image-style"} />
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
          KhatimDoc - Enter OTP
        </Typography>
        <Typography variant={"subtitle2"} color={"red"} sx={{ mb: 2 }}>
          An email is sent with instructions to your registered email account.
          Kindly follow the instructions there.
        </Typography>
        <div className="sq-body">
          <div className="sq-inner-body">
            <Box component={"form"}>
              <div className={"signin-heading"}>
                <ArrowBackIcon
                  sx={{ mr: 62, cursor: "pointer" }}
                  onClick={() => {
                    navigate("/signup/otp");
                  }}
                />
              </div>
              <div>
                <TextField
                  autoFocus
                  required
                  label={"OTP"}
                  sx={{ mb: 1, width: 475, mt: 3 }}
                  color={"success"}
                  onChange={(event) => {
                    props.setOtp(event.target.value);
                    setError(true);
                  }}
                  onBlur={() => {
                    setError(true);
                  }}
                  inputProps={{ maxLength: 6 }}
                  error={
                    error &&
                    (props.otp.length < 6 || !validator.isNumeric(props.otp))
                  }
                  helperText={
                    !error
                      ? ""
                      : !validator.isNumeric(props.otp)
                      ? "OTP must be a number"
                      : props.otp.length < 6
                      ? "OTP must be of length six."
                      : ""
                  }
                />
              </div>
              <div style={{ marginTop: 1.5 }}>
                <Typography
                  color={"green"}
                  component={"a"}
                  href={""}
                  sx={{ ml: -17.4, mr: 30, [`&:hover`]: { color: "green" } }}
                  onClick={handleResendOTP}
                >
                  Resend OTP
                </Typography>
              </div>
              <div>
                <LoadingButton
                  sx={{ mt: 2, width: 170 }}
                  size={"large"}
                  variant="contained"
                  type="submit"
                  color={"success"}
                  onClick={handleSubmit}
                  loading={loading}
                  loadingPosition={"end"}
                  endIcon={<React.Fragment />}
                >
                  Continue
                </LoadingButton>
              </div>
            </Box>
          </div>
          <Typography variant={"subtitle2"} color={"lightgray"} sx={{ mt: 1 }}>
            &copy;&nbsp;{new Date()?.getFullYear()} Codegic. All rights
            reserved.
            <Typography
              variant={"subtitle2"}
              component={"a"}
              href={"https://www.codegic.com/privacy-policy/"}
              target="_blank"
              sx={{ ml: 29 }}
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

export default OtpComponent;
