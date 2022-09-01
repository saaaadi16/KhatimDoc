import React, { useState } from "react";
import { User } from "../../App";
import { useNavigate } from "react-router-dom";
import "./securityQuestion.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Autocomplete, Box, Typography } from "@mui/material";
import Axios from "../../services/axios";
import Stepper from "../stepper/Stepper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Snackbar from "../snackbar/Snackbar";
import { LoadingButton } from "@mui/lab";
import icon from "../../assets/icon.png";

interface params {
  user: User;
  setUser: (user: User) => void;
  otp: string;
}

interface SQ {
  question: string;
  answer: string;
}

const SecurityQuestion: React.FC<params> = (params: params) => {
  let navigate = useNavigate();

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorA(true);
    setSQ({ ...SQuestion, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    setLoading(true);
    if (SQuestion.answer !== "" && SQuestion.question !== "") {
      const Data = {
        user_id: params.user.userID.toLowerCase(),
        security_Question: SQuestion.question,
        security_Answer: SQuestion.answer,
        otp: params.otp,
      };

      Axios.put("/user/security", Data)
        .then((res) => {
          if (res.data.response_code === 0) navigate("/signup/password");
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
      setErrorA(true);
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

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMsg] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  const Questions = ["What is Your Name", "Fav Pet", "Your Age", "Your Gender"];
  const [errorQ, setErrorQ] = useState<boolean>(false);
  const [errorA, setErrorA] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Stepper index={2} />
      <div className={"page-holder"}>
        <img src={icon} alt={"Company Logo"} className={"image-style"} />

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            mr: 2,
            mt: 2,
            display: { md: "flex" },
            fontSize: 30,
            fontFamily: "arial",
            fontWeight: "bold",
            color: "green",
            textDecoration: "none",
          }}
        >
          KhatimDoc - Enter Security Question
        </Typography>
        <Typography
          variant={"subtitle2"}
          color={"lightslategrey"}
          sx={{ mb: 2 }}
        >
          Get documents signed faster, No credit card required.
        </Typography>

        <div className={"sq-body"}>
          <div className={"sq-inner-body"}>
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
                      navigate("/signup/otp");
                    }}
                  />
                </div>

                <Autocomplete
                  disablePortal
                  freeSolo
                  id="question"
                  options={Questions}
                  onChange={(event: any, newVal: any) => {
                    setSQ({ ...SQuestion, ["question"]: newVal });
                    setErrorQ(true);
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      color={"success"}
                      {...params}
                      required
                      label="Questions"
                      onChange={(e) => {
                        setSQ({
                          ...SQuestion,
                          ["question"]: e.target.value,
                        });
                        setErrorQ(true);
                      }}
                      error={errorQ && SQuestion?.question === ""}
                      helperText={
                        errorQ &&
                        (SQuestion?.question === ""
                          ? "Security question cannot be empty"
                          : "")
                      }
                    />
                  )}
                  sx={{ mt: 2 }}
                />
              </div>
              <div>
                <TextField
                  required
                  id="answer"
                  label="Answer"
                  color={"success"}
                  onChange={onchange}
                  error={errorA && SQuestion?.answer === ""}
                  helperText={
                    errorA &&
                    (SQuestion?.answer === ""
                      ? "Security answer cannot be empty"
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

export default SecurityQuestion;
