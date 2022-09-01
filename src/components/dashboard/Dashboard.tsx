import { User } from "../../App";
import {
  Grid,
  Typography,
  Button,
  Box,
  Avatar,
  Paper,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Axios from "../../services/axios";
import { useCookies } from "react-cookie";
import { PackageContext } from "../../services/packageContext";
import { useNavigate } from "react-router-dom";
import {
  DoneTwoTone,
  ReportProblemTwoTone,
  HourglassTopTwoTone,
  ReportTwoTone,
  CancelTwoTone,
} from "@mui/icons-material";
import background from "../../assets/background.png";
import { clearApp, tempAppSet, TempPackSet } from "../../utils/GetRouterState";

interface Props {
  User: User;
  setUser: any;
  ProfileUpdated: number;
}

interface DItem {
  ID: string;
  Title: string;
  Value: number;
  Color?: any;
  Icon?: any;
}

interface DItemProps {
  element: DItem;
}

interface IStats {
  draft: number;
  pending: number;
  waiting: number;
  declined: number;
  completed: number;
}

const Dashboard = ({ User, setUser, ProfileUpdated }: Props) => {
  let navigate = useNavigate();

  const [Items, setItems] = useState<DItem[]>([
    {
      ID: "pending",
      Title: "Pending",
      Value: 0,
      Color: { R: 25, G: 118, B: 210 },
      Icon: <ReportTwoTone color={"primary"} sx={{ width: 30, height: 30 }} />,
    },
    {
      ID: "waiting",
      Title: "Waiting",
      Value: 0,
      Color: { R: 156, G: 39, B: 176 },
      Icon: (
        <HourglassTopTwoTone
          color={"secondary"}
          sx={{ width: 30, height: 30 }}
        />
      ),
    },
    {
      ID: "declined",
      Title: "Declined",
      Value: 0,
      Color: { R: 237, G: 108, B: 2 },
      Icon: (
        <ReportProblemTwoTone
          color={"warning"}
          sx={{ width: 30, height: 30 }}
        />
      ),
    },
    {
      ID: "canceled",
      Title: "Cancelled",
      Value: 0,
      Color: { R: 211, G: 47, B: 47 },
      Icon: <CancelTwoTone color={"error"} sx={{ width: 30, height: 30 }} />,
    },
    {
      ID: "completed",
      Title: "Completed",
      Value: 0,
      Color: { R: 46, G: 125, B: 50 },
      Icon: <DoneTwoTone color={"success"} sx={{ width: 30, height: 30 }} />,
    },
    // {ID: 'draft', Title: 'Draft', Value: 0, Color: {R: 117, G: 117, B: 117}, Icon: <SaveAsTwoTone sx={{width: 30, height: 30, color: 'rgb(117,117,117)'}}/>}
  ]);

  const [cookies, setCookie] = useCookies<string>(["package"]);

  const { currPackage, setCurrPackage } = useContext(PackageContext);

  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingAva, setLoadingAva] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    const Config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
    Axios.get("/package/stats", Config)
      .then((res) => {
        if (res.data.response_code === 0) {
          const NewVal = Items.map((item) => {
            item.Value = res.data[item.ID];
            return item;
          });
          setItems(NewVal);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 403) {
          localStorage.removeItem("AuthToken");
          clearApp();
          navigate("/redirect");
        }
      });
  }, []);

  useEffect(() => {
    setLoadingAva(true);
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
            firstname: res.data.first_name,
            lastname: res.data.last_name,
            avatar: res.data.image,
          });
        }
        setLoadingAva(false);
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
  }, [ProfileUpdated]);

  const handleStartNow = (event: any) => {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + `${localStorage.getItem("AuthToken")}`,
      },
    };
    Axios.post("/package", {}, config)
      .then((res) => {
        // console.log(res.data);
        if (res.data.response_code === 0) {
          setCurrPackage(res.data.packageGuid);
          setCookie("packageId", res.data.packageGuid, { path: "/" });
          navigate("/prepare");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 403) {
          localStorage.removeItem("AuthToken");
          clearApp();
          navigate("/redirect");
        }
      });
  };

  const DashboardItem = (props: DItemProps) => {
    return (
      <>
        <Grid item xs={12} sm={6} md={4} lg={1.1} sx={{ mt: 5 }}>
          <Grid
            container
            item
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Paper
              onClick={() => {
                if (props.element.ID === "pending") {
                  TempPackSet(3);
                } else if (props.element.ID === "waiting") {
                  TempPackSet(4);
                } else if (props.element.ID === "declined") {
                  TempPackSet(5);
                } else if (props.element.ID === "canceled") {
                  TempPackSet(6);
                } else if (props.element.ID === "completed") {
                  TempPackSet(7);
                }

                tempAppSet(1);
                navigate("/" + props.element.ID);
              }}
              elevation={0}
              sx={{
                width: { xs: "60%", md: "85%" },
                [`&:hover`]: { cursor: "pointer" },
                // bgcolor: 'rgb(0, 0, 0, 0.87)',
                // color: 'white'
              }}
            >
              <>
                {props.element.Icon}
                <Typography
                  sx={{
                    fontSize: 54,
                    // color: `rgb(${props.element.Color.R}, ${props.element.Color.G}, ${props.element.Color.B})`
                  }}
                >
                  {Loading ? (
                    <CircularProgress color="success" />
                  ) : (
                    props?.element?.Value
                  )}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 18,
                    // fontWeight: 'bold',
                    // color: `rgb(${props.element.Color.R}, ${props.element.Color.G}, ${props.element.Color.B})`
                  }}
                >
                  {props?.element?.Title}
                </Typography>
              </>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <img
          src={background}
          alt={"KDBack"}
          style={{
            width: "100%",
            height: "91.5%",
            position: "absolute",
            opacity: 0.6,
            marginTop: 64.3,
            zIndex: -999,
          }}
        />

        <Grid
          container
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ mt: 15 }}
        >
          <Grid
            container
            item
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ mb: { xs: 3 } }}
            >
              {LoadingAva ? (
                <Avatar
                  sx={{
                    width: 150,
                    height: 150,
                  }}
                >
                  <CircularProgress color="success" size={90} />
                </Avatar>
              ) : (
                !User?.avatar &&
                !LoadingAva && (
                  <Avatar
                    sx={{
                      width: 150,
                      height: 150,
                      fontSize: "350%",
                    }}
                  >
                    {User?.firstname?.charAt(0)}
                    {User?.lastname?.charAt(0)}
                  </Avatar>
                )
              )}
              {User?.avatar && !LoadingAva && (
                <Avatar
                  sx={{ width: 150, height: 150 }}
                  alt={"avatar"}
                  src={`data:image/png;base64,${User?.avatar}`}
                />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography fontWeight={"bold"} sx={{ fontSize: "30px" }}>
                {"Welcome, "}
              </Typography>
              <Typography sx={{ fontSize: "30px" }}>
                {!LoadingAva ? (
                  <>
                    &nbsp;
                    {User.firstname} {User.lastname}
                    {"!"}
                  </>
                ) : (
                  <>
                    <Skeleton
                      animation="wave"
                      sx={{ ml: 2 }}
                      width={300}
                      height={40}
                    />
                  </>
                )}
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={12}
              lg={12}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {Items?.map((element: DItem, index: number) => (
                <DashboardItem element={element} key={index} />
              ))}

              <Grid item xs={12}>
                <Box sx={{ mt: 5 }}>
                  <Button
                    variant={"contained"}
                    sx={{
                      mt: 2.4,
                      mb: 1.2,
                      width: 235,
                      height: "auto",
                      fontWeight: "bold",
                      fontSize: 16,
                      bgcolor: "#c6ff00",
                      color: "black",
                      [`&:hover`]: { bgcolor: "#d1ff33" },
                    }}
                    onClick={handleStartNow}
                  >
                    START NOW
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
