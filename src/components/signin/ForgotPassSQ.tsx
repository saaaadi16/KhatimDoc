import React, { useEffect, useState } from "react";
import { User } from "../../App";
import { useNavigate } from "react-router-dom";
import "./signin.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography, Box, Autocomplete } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Axios from "../../services/axios";
import Snackbar from "../snackbar/Snackbar";
import { LoadingButton } from "@mui/lab";
import icon from "../../assets/icon.png";
import { clearApp } from "../../utils/GetRouterState";

interface params {
  user: User;
  otp: string;
  setOtp: Function;
  question: string;
  setQ: Function;
}

interface SQ {
  question: string;
  answer: string;
}

const ForgotPassSQ: React.FC<params> = (params: params) => {
  const [open, setOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");
  const [message, setMsg] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const Config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
    Axios.get("user/basic", Config)
      .then((res) => {
        if (res.data.response_code === 0) {
          params.setQ(res.data.security_question);
        }
      })
      .catch((err) => {
        if (err.response.status === 403) {
          localStorage.removeItem("AuthToken");
          clearApp();
          navigate("/redirect");
        }
      });
  }, []);

  let navigate = useNavigate();

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSQ({ ...SQuestion, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    setLoading(true);
    if (SQuestion.answer !== "") {
      const Data = {
        user_id: params.user.userID.toLowerCase(),
        answer: SQuestion.answer,
      };

      Axios.put("/user/check-security", Data)
        .then((res) => {
          if (res.data.response_code === 0)
            navigate("/signin/forgotPassword/ConfirmPass");
          else {
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
    } else {
      setErrorQ(true);

      // setOpen(true);
      // setMsg('Error cannot send response!')
      // setAlert('warning')
      setLoading(false);
    }

    e.preventDefault();
  };

  const [SQuestion, setSQ] = useState<SQ>({
    answer: "",
    question: "",
  });

  const [errorQ, setErrorQ] = useState<boolean>(false);

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
          KhatimDoc - Verify Security Question
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
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "55ch" },
              }}
            >
              <div>
                <div className={"signin-heading"}>
                  <ArrowBackIcon
                    sx={{ mr: 62, cursor: "pointer" }}
                    onClick={() => {
                      navigate("/signin/forgotPassword/OTP");
                    }}
                  />
                </div>
                <Typography
                  variant={"subtitle2"}
                  align={"left"}
                  sx={{ ml: 4.5, mt: 1, mb: 1, fontWeight: "bold" }}
                  color={"lightslategrey"}
                >
                  User ID: {params.user?.userID}
                </Typography>
                <TextField
                  disabled
                  defaultValue={params.question}
                  color={"success"}
                  id="question"
                  sx={{ mt: 2 }}
                  label={"Question"}
                />
              </div>
              <div>
                <TextField
                  autoFocus
                  required
                  id="answer"
                  label="Answer"
                  color={"success"}
                  onChange={onchange}
                  error={errorQ && SQuestion?.answer === ""}
                  helperText={
                    errorQ &&
                    (SQuestion?.answer === ""
                      ? "Security Answer cannot be empty"
                      : "")
                  }
                />
              </div>
              <div className={"submit-margin"}>
                <LoadingButton
                  type={"submit"}
                  size={"large"}
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  sx={{ width: 170 }}
                  loading={loading}
                  loadingPosition={"end"}
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

export default ForgotPassSQ;
