import React, { useState } from "react";
import { User } from "../../App";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import validator from "validator";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import {
  Button,
  Checkbox,
  Grid,
  InputAdornment,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Autocomplete from "@mui/material/Autocomplete";
import Axios from "../../services/axios";
import Stepper from "../stepper/Stepper";
import Snackbar from "../snackbar/Snackbar";
import icon from "../../assets/icon.png";
import countries from "../../assets/Countries";

interface params {
  user: User;
  setUser: (user: User) => void;
}

const Signup: React.FC<params> = (params: params) => {
  let navigate = useNavigate();
  const [errorU, setErrorU] = useState<boolean>(false);
  const [errorE, setErrorE] = useState<boolean>(false);
  const [errorF, setErrorF] = useState<boolean>(false);
  const [errorL, setErrorL] = useState<boolean>(false);
  const [errorCom, setErrorCom] = useState<boolean>(false);
  const [errorCou, setErrorCou] = useState<boolean>(false);
  const [errorPh, setErrorPh] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [LocalUser, setLocal] = useState<User>({
    company: "",
    email: "",
    firstname: "",
    lastname: "",
    number: "",
    password: "",
    userID: "",
    country: "",
  });
  const [checkBox, setcheckBox] = useState<boolean>(false);
  const [phCode, setphCode] = useState<string>("");
  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocal({ ...LocalUser, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setLoading(true);

    if (!checkBox) {
      setCE(true);
    }

    if (
      LocalUser.userID.length > 7 &&
      validator.isEmail(LocalUser.email) &&
      LocalUser.firstname !== "" &&
      LocalUser.lastname !== "" &&
      LocalUser.company !== "" &&
      checkBox &&
      LocalUser.country !== ""
    ) {
      params.setUser(LocalUser);
      const Data = {
        user_id: LocalUser.userID.toLowerCase(),
        email: LocalUser.email.toLowerCase(),
        first_name: LocalUser.firstname,
        last_name: LocalUser.lastname,
        company_name: LocalUser.company,
        phone: LocalUser.number,
        country: LocalUser.country,
        i_agree: true,
      };

      // setOpen(true);
      // setMsg('Kindly check your email for OTP');
      // setAlert('success');

      Axios.post("/user/register", Data)
        .then((res) => {
          if (res.data.response_code === 0) navigate("/signup/otp");
          else {
            setOpen(true);
            setMsg(res.data.error_message);
            setAlert("error");
          }
          setLoading(false);
        })
        .catch((err) => {
          setOpen(true);
          setMsg("Internal Server Error");
          setAlert("error");
          setLoading(false);
        });
    } else {
      setErrorU(true);
      setErrorE(true);
      setErrorF(true);
      setErrorL(true);
      setErrorCom(true);
      setErrorCou(true);

      // setOpen(true);
      // setMsg('Error Cannot Send Response');
      // setAlert('warning');
      setLoading(false);
    }
  };

  const [ValidID, setVI] = React.useState<boolean>(false);
  const [ValidEmail, setVE] = React.useState<boolean>(false);
  const [checkError, setCE] = React.useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMsg] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  return (
    <>
      <Stepper index={0} />
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
          KhatimDoc - Start a Free Account
        </Typography>
        <Typography
          variant={"subtitle2"}
          color={"lightslategrey"}
          sx={{ mb: 5 }}
        >
          Get documents signed faster, No credit card required.
        </Typography>
        <div className={"signup-body"}>
          <div className={"signup-inner-body mb-3"}>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "40ch" },
              }}
            >
              <>
                <div>
                  <TextField
                    autoFocus
                    size={"small"}
                    required
                    id="userID"
                    label="User ID"
                    color={"success"}
                    onChange={onchange}
                    onBlur={(event) => {
                      if (event.target.value.trim() !== "") {
                        setErrorU(true);
                        Axios.get("/user/" + event.target.value.toLowerCase())
                          .then((res) => {
                            if (Number(res.data.response_code) === 0)
                              setVI(false);
                            else setVI(true);
                          })
                          .catch((err) => {
                            setOpen(true);
                            setMsg("Internal Server Error");
                            setAlert("error");
                          });
                      }
                    }}
                    defaultValue={params.user.userID}
                    error={errorU && (LocalUser.userID.length < 8 || ValidID)}
                    helperText={
                      !errorU
                        ? ""
                        : ValidID
                        ? "ID is already taken up - provide a different id"
                        : LocalUser.userID.length < 8
                        ? "User ID must be greater than eight"
                        : ""
                    }
                  />

                  <TextField
                    size={"small"}
                    required
                    id="email"
                    label="Email"
                    color={"success"}
                    onChange={onchange}
                    onBlur={(event) => {
                      if (event.target.value.trim() !== "") {
                        setErrorE(true);
                        Axios.get(
                          "/user/email/" + event.target.value.toLowerCase()
                        )
                          .then((res) => {
                            if (Number(res.data.response_code) === 0)
                              setVE(false);
                            else setVE(true);
                          })
                          .catch((err) => {
                            setOpen(true);
                            setMsg("Internal Server Error");
                            setAlert("error");
                          });
                      }
                    }}
                    defaultValue={params.user.email}
                    error={
                      errorE &&
                      (ValidEmail ||
                        !validator.isEmail(LocalUser.email.toLowerCase()))
                    }
                    helperText={
                      !errorE
                        ? ""
                        : ValidEmail
                        ? "Email is already taken up - provide a different email"
                        : !validator.isEmail(LocalUser.email.toLowerCase())
                        ? "Enter a valid email"
                        : ""
                    }
                  />
                </div>
                <div>
                  <TextField
                    required
                    id="firstname"
                    label="First Name"
                    onBlur={() => {
                      setErrorF(true);
                    }}
                    color={"success"}
                    onChange={onchange}
                    error={errorF && LocalUser.firstname === ""}
                    helperText={
                      !errorF
                        ? ""
                        : LocalUser.firstname === ""
                        ? "Enter first name"
                        : ""
                    }
                    size={"small"}
                  />
                  <TextField
                    required
                    id="lastname"
                    label="Last Name"
                    onBlur={() => {
                      setErrorL(true);
                    }}
                    color={"success"}
                    onChange={onchange}
                    error={errorL && LocalUser.lastname === ""}
                    helperText={
                      !errorL
                        ? ""
                        : LocalUser.lastname === ""
                        ? "Enter last name"
                        : ""
                    }
                    size={"small"}
                  />
                </div>
                <div>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={6}
                      className={"company-margin"}
                    >
                      <TextField
                        required
                        id="company"
                        onBlur={() => {
                          setErrorCom(true);
                        }}
                        label="Company Name"
                        color={"success"}
                        onChange={onchange}
                        error={errorCom && LocalUser.company === ""}
                        helperText={
                          !errorCom
                            ? ""
                            : LocalUser.company === ""
                            ? "Enter company name"
                            : ""
                        }
                        size={"small"} 
                      />
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={6}
                      className={"country-margin"}
                    >
                      <Autocomplete
                        size={"small"}
                        id="country"
                        options={countries}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) =>
                          option.label === value.label
                        }
                        noOptionsText={"Country Not Found."}
                        onChange={(event: any, newValue: any) => {
                          setLocal({
                            ...LocalUser,
                            ["country"]: newValue.label,
                          });
                          setphCode("+ " + newValue.phone);
                        }}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                            key={option.code}
                          >
                            <img
                              loading="lazy"
                              width="25"
                              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                              alt=""
                            />
                            {option.label} ({option.code}) +{option.phone}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            required
                            {...params}
                            label="Select a Country"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "new-password", // disable autocomplete and autofill
                            }}
                            onBlur={() => {
                              setErrorCou(true);
                            }}
                            error={errorCou && LocalUser.country === ""}
                            helperText={
                              !errorCou
                                ? ""
                                : LocalUser.country === ""
                                ? "Select country"
                                : ""
                            }
                            color={"success"}
                            size={"small"}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </div>
                <div className={"d-flex justify-content-start ms-1"}>
                  <TextField
                    id="number"
                    label="Phone"
                    type="text"
                    InputProps={{
                      startAdornment: phCode && (
                        <InputAdornment position="start">
                          {phCode}
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ maxLength: 11 }}
                    color={"success"}
                    onChange={onchange}
                    onBlur={() => {
                      setErrorPh(true);
                    }}
                    size={"small"}
                    // helperText={!errorPh ? '' : validator.isNumeric(LocalUser.number) ? 'Phone number must be a number' : ''}
                  />
                </div>
                <div>
                  <Typography
                    variant={"subtitle2"}
                    sx={{ mr: 32, mb: 1.5, mt: -1 }}
                  >
                    <Checkbox
                      color="success"
                      sx={{ ml: -1.8 }}
                      onChange={(event) => {
                        setcheckBox(event.target.checked);
                        setCE(!event.target.checked);
                      }}
                      required
                    />
                    <span>
                      I agree to Khatim Sign's&nbsp;
                      <a
                        href={"https://www.codegic.com/privacy-policy/"}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        Privacy Policy
                      </a>
                      &nbsp;and&nbsp;
                      <a
                        href={"https://www.codegic.com/privacy-policy/"}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        Terms and Conditions.
                      </a>
                    </span>
                    {checkError && (
                      <Typography
                        variant={"subtitle2"}
                        color={"red"}
                        sx={{ mr: 24.5, mt: -1, fontSize: 12 }}
                      >
                        You must agree to the above before continuing
                      </Typography>
                    )}
                  </Typography>
                </div>
                <div>
                  <LoadingButton
                    type={"submit"}
                    size={"large"}
                    variant="contained"
                    color="success"
                    loading={loading}
                    loadingPosition="end"
                    onClick={handleSubmit}
                    sx={{ mt: 0, width: 170 }}
                    endIcon={<React.Fragment />}
                  >
                    Get Started
                  </LoadingButton>
                </div>
                <Typography
                  variant={"subtitle2"}
                  className={"a-styling"}
                  sx={{ mt: 2 }}
                >
                  Already have an account? Click&nbsp;
                  <Typography
                    variant={"subtitle2"}
                    component={"a"}
                    href={""}
                    style={{ color: "darkgreen" }}
                    onClick={() => {
                      navigate("/signin");
                    }}
                  >
                    here{" "}
                  </Typography>
                </Typography>
              </>
            </Box>
          </div>

          <Typography
            variant={"subtitle2"}
            color={"lightgray"}
            sx={{ mt: -0.5 }}
          >
            &copy;&nbsp;{new Date()?.getFullYear()} Codegic. All rights
            reserved.
            <Typography
              variant={"subtitle2"}
              component={"a"}
              href={"https://www.codegic.com/privacy-policy/"}
              target="_blank"
              sx={{ ml: 51 }}
              style={{ color: "lightgray", textDecoration: "none" }}
            >
              Privacy Policy{" "}
            </Typography>
          </Typography>
        </div>
      </div>
      <Snackbar open={open} setOpen={setOpen} message={message} alert={alert} />
    </>
  );
};

export default Signup;
