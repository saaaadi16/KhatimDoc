import { User } from "../../App";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Toolbar,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Snackbar from "../snackbar/Snackbar";
import Axios from "../../services/axios";
import { useNavigate } from "react-router-dom";
import { clearApp } from "../../utils/GetRouterState";

interface Props {
  Title: string;
}

const Password = ({ Title }: Props) => {
  const [CPass, setCPass] = useState<string>("");
  const [NPass, setNPass] = useState<string>("");
  const [CNPass, setCNPass] = useState<string>("");

  const [showPass1, setSP1] = useState<boolean>(false);
  const [showPass2, setSP2] = useState<boolean>(false);
  const [showPass3, setSP3] = useState<boolean>(false);

  const [errorC, setErrorC] = useState<boolean>(false);
  const [errorN, setErrorN] = useState<boolean>(false);
  const [errorCN, setErrorCN] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMsg] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  const navigate = useNavigate();

  const handleClickShowPassword1 = () => {
    setSP1(!showPass1);
  };

  const handleClickShowPassword2 = () => {
    setSP2(!showPass2);
  };

  const handleClickShowPassword3 = () => {
    setSP3(!showPass3);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (
      CPass?.length > 1 &&
      NPass?.length > 1 &&
      CNPass?.length > 1 &&
      NPass === CNPass
    ) {
      const Data = {
        current_password: CPass,
        new_password: NPass,
      };

      Axios.put("user/change_password", Data)
        .then((res) => {
          if (res.data.response_code === 0) {
            setOpen(true);
            setMsg("Password Updated!");
            setAlert("success");
          } else {
            setOpen(true);
            setMsg(res.data.error_message);
            setAlert("error");
          }
        })
        .catch((err) => {
          setOpen(true);
          setMsg("Internal Server Error");
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
                label="Current Password"
                variant="outlined"
                name="password"
                type={showPass1 ? "text" : "password"}
                fullWidth
                onChange={(event) => {
                  setCPass(event.target.value);
                }}
                onBlur={() => {
                  setErrorC(true);
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
                error={errorC && CPass?.length < 1}
                helperText={
                  errorC && (CPass?.length < 1 ? "Enter password" : "")
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
                label="New Password"
                variant="outlined"
                name="password"
                type={showPass2 ? "text" : "password"}
                fullWidth
                onChange={(event) => {
                  setNPass(event.target.value);
                }}
                onBlur={() => {
                  setErrorN(true);
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
                error={errorN && NPass?.length <= 8}
                helperText={
                  errorN &&
                  (NPass?.length <= 8
                    ? "Password length must be greater than 8"
                    : "")
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
                label="Confirm Password"
                variant="outlined"
                name="password"
                type={showPass3 ? "text" : "password"}
                fullWidth
                onChange={(event) => {
                  setCNPass(event.target.value);
                }}
                onBlur={() => {
                  setErrorCN(true);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword3}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPass3 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                color={"success"}
                error={errorCN && (CNPass?.length <= 8 || NPass !== CNPass)}
                helperText={
                  errorCN &&
                  ((CNPass?.length <= 8
                    ? "Password length must be greater than 8"
                    : "") ||
                    (NPass !== CNPass ? "Password do not match" : ""))
                }
              />
            </Box>
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
      <Snackbar open={open} setOpen={setOpen} message={message} alert={alert} />
    </>
  );
};

export default Password;
