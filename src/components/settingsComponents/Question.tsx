import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Axios from "../../services/axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Snackbar from "../snackbar/Snackbar";
import { clearApp } from "../../utils/GetRouterState";
import { Navigate, useNavigate } from "react-router-dom";

interface Props {
  Title: string;
  question: string;
  setQ: Function;
}

const Question = ({ Title, question, setQ }: Props) => {
  const [Question, setQuestion] = useState<string>("");
  const [Answer, setAnswer] = useState<string>("");
  const [CPass, setCPass] = useState<string>("");

  const [errorQ, setErrorQ] = useState<boolean>(false);
  const [errorA, setErrorA] = useState<boolean>(false);
  const [errorCP, setErrorCP] = useState<boolean>(false);

  const [showPass1, setSP1] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMsg] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  const navigate = useNavigate();
  useEffect(() => {
    const Config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
    Axios.get("/user/basic", Config)
      .then((res) => {
        if (res.data.response_code === 0) {
          setQ(res.data.question);
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

  useEffect(() => {
    setQuestion(question);
  }, [question]);

  const handleClickShowPassword1 = () => {
    setSP1(!showPass1);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (Question?.length > 1 && Answer?.length > 1 && CPass?.length > 1) {
      const Data = {
        current_password: CPass,
        question: Question,
        answer: Answer,
      };
      const Config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };
      Axios.put("/user/security_new", Data, Config)
        .then((res) => {
          if (res.data.response_code === 0) {
            setQ(Question);
            setOpen(true);
            setMsg("Security Question Updated!");
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
          if (err.response.status === 403) {
            localStorage.removeItem("AuthToken");
            clearApp();
            navigate("/redirect");
          }
        });
    }
  };

  return (
    <>
      <Toolbar />
      <Box
        component="main"
        sx={{
          ml: { md: 33.5, xs: 0 },
          width: { md: "calc(100% - 275px)", xs: "100%" },
        }}
      >
        <Box sx={{ p: 2, ml: 2 }}>
          <Typography
            component={"h6"}
            variant={"h6"}
            align={"left"}
            sx={{ fontWeight: "bold", fontSize: 20 }}
          >
            {Title}
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ p: 2, ml: 2, mt: 1.2 }}>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, ml: 0, mr: 2, width: "40ch" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <TextField
                autoFocus
                label="Question"
                variant="outlined"
                name="question"
                onChange={(event) => {
                  setQuestion(event.target.value);
                }}
                onBlur={() => {
                  setErrorQ(true);
                }}
                color={"success"}
                value={Question}
                error={errorQ && Question?.length < 1}
                helperText={
                  errorQ && (Question?.length < 1 ? "Enter question" : "")
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <TextField
                label="Answer"
                variant="outlined"
                name="answer"
                onChange={(event) => {
                  setAnswer(event.target.value);
                }}
                onBlur={() => {
                  setErrorA(true);
                }}
                color={"success"}
                error={errorA && Answer?.length < 1}
                helperText={
                  errorA && (Answer?.length < 1 ? "Enter answer" : "")
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <TextField
                label="Password"
                variant="outlined"
                name="password"
                type={showPass1 ? "text" : "password"}
                fullWidth
                onChange={(event) => {
                  setCPass(event.target.value);
                }}
                onBlur={() => {
                  setErrorCP(true);
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
                error={errorCP && CPass?.length < 1}
                helperText={
                  errorCP && (CPass?.length < 1 ? "Enter password" : "")
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mt: 2,
              }}
            >
              <Button
                type={"submit"}
                size={"large"}
                variant={"contained"}
                color={"success"}
                sx={{ fontWeight: "bold" }}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar open={open} setOpen={setOpen} message={message} alert={alert} />
    </>
  );
};

export default Question;
