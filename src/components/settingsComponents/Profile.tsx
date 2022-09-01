import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  InputAdornment,
  Toolbar,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { User } from "../../App";
import TextField from "@mui/material/TextField";
import Axios from "../../services/axios";

import Autocomplete from "@mui/material/Autocomplete";
import countries, { CountryType } from "../../assets/Countries";
import Snackbar from "../snackbar/Snackbar";
import { clearApp } from "../../utils/GetRouterState";
import { Navigate, useNavigate } from "react-router-dom";

interface Props {
  Title: string;
  User: User;
  setUser: Function;
  setPUp: Function;
  ProfileUpdated: number;
}

const Profile = ({ Title, User, setUser, ProfileUpdated, setPUp }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMsg] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  const [LocalUser, setLocalUser] = useState<User>(User);

  const [phCode, setphCode] = useState("");

  const [errorF, setErrorF] = useState<boolean>(false);
  const [errorL, setErrorL] = useState<boolean>(false);
  const [errorCom, setErrorCom] = useState<boolean>(false);
  const [errorCou, setErrorCou] = useState<boolean>(false);

  const [contVal, setcontVal] = useState<CountryType>({
    code: "",
    label: "",
    phone: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [FetchUser, setFU] = useState<number>(0);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);

    const Config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };

    Axios.get("/user/basic", Config)
      .then((res) => {
        if (res.data.response_code === 0) {
          setUser({
            userID: res.data.user_id,
            email: res.data.email,
            password: "",
            firstname: res.data.first_name,
            lastname: res.data.last_name,
            company: res.data.company_name,
            number: res.data.phone,
            country: res.data.country,
            avatar: res.data.image,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 403) {
          localStorage.removeItem("AuthToken");
          clearApp();
          navigate("/redirect");
        }
      });
  }, [FetchUser]);

  useEffect(() => {
    setLocalUser(User);
  }, [User]);

  useEffect(() => {
    setcontVal(
      countries.filter((country) => {
        return country.label === User?.country;
      })[0]
    );

    setphCode(
      countries.filter((country) => {
        return country?.label === LocalUser?.country;
      })[0]?.phone
    );
  }, [LocalUser]);

  const handleChange = (event: any) => {
    setLocalUser({ ...LocalUser, [event.target.id]: event.target.value });
  };

  const handleUpload = (event: any) => {
    setLoading(true);

    const Data = new FormData();

    Data.append("document", event.target?.files[0]);
    Data.append("image_title", event.target?.files[0]["name"]);

    const Config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };

    Axios.put("/user/avatar", Data, Config)
      .then((res) => {
        if (res.data.response_code === 0) {
          setPUp(ProfileUpdated + 1);
          setLoading(false);
        } else {
          setOpen(true);
          setMsg(res.data.error_message);
          setAlert("error");
          setLoading(false);
        }
      })
      .catch((err) => {
        setOpen(true);
        setMsg("Internal Server Error!");
        setAlert("error");
        setLoading(false);
        if (err.response.status === 403) {
          localStorage.removeItem("AuthToken");
          clearApp();
          navigate("/redirect");
        }
      });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (
      LocalUser?.firstname?.length > 1 &&
      LocalUser?.lastname?.length > 1 &&
      LocalUser?.company !== "" &&
      LocalUser?.country !== ""
    ) {
      const Data = {
        first_name: LocalUser.firstname,
        last_name: LocalUser.lastname,
        company_name: LocalUser.company,
        country: LocalUser.country,
        phone: LocalUser.number,
      };
      const Config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };
      Axios.put("/user/update", Data, Config)
        .then((res) => {
          if (res.data.response_code === 0) {
            setUser({
              userID: User.userID,
              email: User.email,
              password: "",
              firstname: LocalUser.firstname,
              lastname: LocalUser.lastname,
              company: LocalUser.company,
              number: LocalUser.number,
              country: LocalUser.country,
              avatar: User.avatar,
            });
            setFU(FetchUser + 1);

            setOpen(true);
            setMsg("Profile Updated!");
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

  let xs = 12;
  let sm = 5;
  let md = 6;

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
          <div>
            <Typography
              component={"h6"}
              variant={"h6"}
              align={"left"}
              sx={{ fontWeight: "bold", fontSize: 20, mb: 2 }}
            >
              Avatar
            </Typography>
          </div>
          <Box sx={{ textAlign: "left", mb: 2 }}>
            {loading ? (
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                }}
              >
                <CircularProgress color={"success"} size={60} />
              </Avatar>
            ) : !User?.avatar ? (
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 50,
                  mb: 2,
                }}
              >
                {LocalUser?.firstname?.charAt(0).toUpperCase()}
                {LocalUser?.lastname?.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <Avatar
                sx={{ width: 100, height: 100, mb: 2 }}
                alt={"avatar"}
                src={`data:image/png;base64,${User?.avatar}`}
              />
            )}
            <Button
              size={"small"}
              color={"success"}
              variant="contained"
              component="label"
              sx={{ fontWeight: "bold" }}
            >
              Upload
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleUpload}
              />
            </Button>
          </Box>
          <div>
            <Typography
              component={"h6"}
              variant={"h6"}
              align={"left"}
              sx={{ fontWeight: "bold", fontSize: 20, mb: 2, mt: 4 }}
            >
              Basic Information
            </Typography>
          </div>

          <Grid container>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, ml: 0, mr: 2, width: "40ch" },
              }}
            >
              <Grid container item spacing={0}>
                <Grid
                  item
                  md={md}
                  xs={xs}
                  sm={sm}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <TextField
                    disabled
                    id="userID"
                    label="User ID"
                    color={"success"}
                    value={LocalUser.userID}
                  />
                </Grid>
                <Grid
                  item
                  md={md}
                  xs={xs}
                  sm={sm}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <TextField
                    disabled
                    id="email"
                    label="Email"
                    color={"success"}
                    value={LocalUser.email}
                  />
                </Grid>
              </Grid>

              <Grid container item>
                <Grid
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                  xs={xs}
                  md={md}
                  sm={sm}
                >
                  <TextField
                    id="firstname"
                    label="First Name"
                    color={"success"}
                    onChange={handleChange}
                    onBlur={() => {
                      setErrorF(true);
                    }}
                    value={LocalUser?.firstname}
                    error={errorF && LocalUser?.firstname?.length < 1}
                    helperText={
                      errorF &&
                      (LocalUser?.firstname?.length < 1
                        ? "Enter first name"
                        : "")
                    }
                  />
                </Grid>
                <Grid
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                  xs={xs}
                  md={md}
                  sm={sm}
                >
                  <TextField
                    id="lastname"
                    label="Last Name"
                    color={"success"}
                    onChange={handleChange}
                    onBlur={() => {
                      setErrorL(true);
                    }}
                    value={LocalUser?.lastname}
                    error={errorL && LocalUser?.lastname?.length < 1}
                    helperText={
                      errorL &&
                      (LocalUser?.lastname?.length < 1 ? "Enter last name" : "")
                    }
                  />
                </Grid>
              </Grid>

              <Grid container item>
                <Grid
                  item
                  xs={xs}
                  md={md}
                  sm={sm}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    id="company"
                    label="Company Name"
                    color={"success"}
                    onChange={handleChange}
                    onBlur={() => {
                      setErrorCom(true);
                    }}
                    value={LocalUser?.company}
                    error={errorCom && LocalUser?.company === ""}
                    helperText={
                      errorCom &&
                      (LocalUser?.company === "" ? "Enter company name" : "")
                    }
                  />
                </Grid>
                <Grid
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                  xs={xs}
                  md={md}
                  sm={sm}
                >
                  <Autocomplete
                    id="country"
                    options={countries}
                    autoHighlight
                    getOptionLabel={(option: CountryType) => option?.label}
                    isOptionEqualToValue={(
                      option: CountryType,
                      value: CountryType
                    ) => {
                      return option?.label === value?.label;
                    }}
                    noOptionsText={"Country Not Found."}
                    value={contVal}
                    onChange={(event: any, newValue: any) => {
                      setErrorCou(true);
                      setLocalUser({ ...LocalUser, country: newValue?.label });
                      setphCode("+ " + newValue?.phone);
                    }}
                    renderOption={(props, option: CountryType) => (
                      <Box
                        component="li"
                        sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                        {...props}
                        key={option?.code}
                      >
                        <img
                          loading="lazy"
                          width="25"
                          src={`https://flagcdn.com/w20/${option?.code.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${option?.code.toLowerCase()}.png 2x`}
                          alt=""
                        />
                        {option?.label} ({option?.code}) + {option?.phone}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select a Country"
                        inputProps={{
                          ...params?.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                        color={"success"}
                        onBlur={() => {
                          setErrorCou(true);
                        }}
                        error={errorCou && LocalUser?.country === ""}
                        helperText={
                          errorCou &&
                          (LocalUser?.country === "" ? "Select country" : "")
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container item>
                <Grid
                  item
                  xs={xs}
                  md={md}
                  sm={sm}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <TextField
                    id="number"
                    label="Phone"
                    type="text"
                    InputProps={{
                      startAdornment: phCode && (
                        <InputAdornment position="start">
                          {"+"} {phCode}
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ maxLength: 11 }}
                    color={"success"}
                    onChange={handleChange}
                    value={LocalUser.number}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                item
                xs={12}
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
              </Grid>
            </Box>
          </Grid>
        </Box>
      </Box>

      <Snackbar open={open} setOpen={setOpen} message={message} alert={alert} />
    </>
  );
};

export default Profile;
