import "./Sidebar.css";
import {
  Drawer,
  Typography,
  List,
  ListItemIcon,
  Box,
  Toolbar,
  Button,
  ListItemButton,
  Chip,
  CircularProgress,
  SxProps,
  IconButton,
  Divider,
  Fade,
} from "@mui/material";
import {
  InboxTwoTone,
  SendTwoTone,
  SaveAsTwoTone,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import {
  DoneTwoTone,
  ReportProblemTwoTone,
  HourglassTopTwoTone,
  ReportTwoTone,
  CancelTwoTone,
} from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PackageContext } from "../../services/packageContext";
import { useCookies } from "react-cookie";
import Axios from "../../services/axios";
import Snackbar from "../snackbar/Snackbar";
import { TempPackSet, TempPackGet, clearApp } from "../../utils/GetRouterState";
import { styled, useTheme } from "@mui/material/styles";

const drawerWidth = 275;

interface Pack {
  RowsUpdate: number;
  open: boolean;
  setOpen: Function;
  sx: SxProps;
  variant: "permanent" | "persistent";
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Sidebar: React.FC<Pack> = ({
  RowsUpdate,
  open,
  setOpen,
  sx,
  variant,
}: Pack) => {
  const { currPackage, setCurrPackage } = useContext(PackageContext);
  let navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);

  const MenuItems = [
    {
      ID: "inbox",
      Text: "Inbox",
      Icon: <InboxTwoTone color={"success"} />,
      Index: 0,
    },
    {
      ID: "sent",
      Text: "Sent",
      Icon: <SendTwoTone color={"success"} />,
      Index: 1,
    },
    {
      ID: "drafts",
      Text: "Drafts",
      Icon: <SaveAsTwoTone color={"success"} />,
      Index: 2,
    },
  ];
  const [ActionItems, setAI] = useState([
    {
      ID: "pending",
      Text: "Pending",
      Icon: <ReportTwoTone color={"primary"} />,
      Index: 3,
      Count: 0,
    },
    {
      ID: "waiting",
      Text: "Waiting for Others",
      Icon: <HourglassTopTwoTone color={"secondary"} />,
      Index: 4,
      Count: 0,
    },
    {
      ID: "declined",
      Text: "Declined",
      Icon: <ReportProblemTwoTone color={"warning"} />,
      Index: 5,
      Count: 0,
    },
    {
      ID: "canceled",
      Text: "Cancelled",
      Icon: <CancelTwoTone color={"error"} />,
      Index: 6,
      Count: 0,
    },
    {
      ID: "completed",
      Text: "Completed",
      Icon: <DoneTwoTone color={"success"} />,
      Index: 7,
      Count: 0,
    },
  ]);

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
          const NewVal = ActionItems.map((item) => {
            item.Count = res.data[item.ID];
            return item;
          });
          setAI(NewVal);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          localStorage.removeItem("AuthToken");
          clearApp();
          navigate("/redirect");
        }
      });
  }, [RowsUpdate]);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    TempPackSet(index);
    setOpen(false);
  };

  const token: string | null = localStorage.getItem("AuthToken");

  const [cookies, setCookie] = useCookies<string>(["package"]);

  const handleStartNow = (event: any) => {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + `${localStorage.getItem("AuthToken")}`,
      },
    };
    Axios.post("/package", {}, config)
      .then((res) => {
        console.log(res.data);
        if (res.data.response_code === 0) {
          setCurrPackage(res.data.packageGuid);
          setCookie("packageId", res.data.packageGuid, { path: "/" });
          navigate("/prepare");
        }
      })
      .catch((err) => {
        if (err.response.status === 403) {
          localStorage.removeItem("AuthToken");
          clearApp();
          navigate("/redirect");
        }
      });
  };

  const [skopen, setSKOpen] = React.useState<boolean>(false);
  const [messageSK, setMsgSK] = React.useState<string>("");
  const [alert, setAlert] = React.useState<string>("");

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Fade in timeout={variant === "permanent" ? 300 : 500}>
        <Drawer variant={variant} sx={sx} open={open} anchor="left">
          {variant === "persistent" && (
            <>
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? (
                    <ChevronLeft />
                  ) : (
                    <ChevronRight />
                  )}
                </IconButton>
              </DrawerHeader>
              <Divider />
            </>
          )}
          {variant === "permanent" && <Toolbar />}
          <Box sx={{ overflow: "auto" }}>
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
            <List>
              {MenuItems?.map((item) => {
                return (
                  <NavLink
                    to={"/" + item.ID.toLowerCase()}
                    style={{ textDecoration: "none", color: "black" }}
                    key={item.Index}
                  >
                    <ListItemButton
                      key={item.Index}
                      selected={TempPackGet() === item.Index}
                      onClick={(event) =>
                        handleListItemClick(event, item.Index)
                      }
                      sx={{ [`&:hover`]: { bgcolor: "rgb(33,150,243, 0.1)" } }}
                    >
                      <ListItemIcon sx={{ mr: -2.5 }}>{item.Icon}</ListItemIcon>

                      <Typography
                        sx={{
                          fontWeight:
                            TempPackGet() === item.Index ? "bold" : "light",
                          fontSize: 16,
                        }}
                      >
                        {item.Text}
                      </Typography>
                    </ListItemButton>
                  </NavLink>
                );
              })}
            </List>

            <Typography
              sx={{
                fontWeight: "bold",
                ml: 2.5,
                mt: 3,
              }}
              align={"left"}
            >
              FILTERS
            </Typography>

            <List component={"nav"}>
              {ActionItems.map((item) => (
                <NavLink
                  to={"/" + item.ID.toLowerCase()}
                  style={{ textDecoration: "none", color: "black" }}
                  key={item.Index}
                >
                  <ListItemButton
                    key={item.Index}
                    selected={TempPackGet() === item.Index}
                    onClick={(event) => handleListItemClick(event, item.Index)}
                    sx={{ [`&:hover`]: { bgcolor: "rgb(33,150,243, 0.1)" } }}
                  >
                    <ListItemIcon sx={{ mr: -2.5 }}>{item.Icon}</ListItemIcon>
                    <Typography
                      sx={{
                        fontWeight:
                          TempPackGet() === item.Index ? "bold" : "light",
                        fontSize: 16,
                      }}
                    >
                      {item.Text}
                    </Typography>
                    {(item.Text === "Pending" ||
                      item.Text === "Waiting for Others") &&
                      item?.Count > 0 && (
                        <Chip
                          label={item?.Count < 999 ? item?.Count : "999+"}
                          size="small"
                          sx={{ ml: 2, color: "gray" }}
                        />
                      )}
                  </ListItemButton>
                </NavLink>
              ))}
            </List>
          </Box>
        </Drawer>
      </Fade>
      <Snackbar
        open={skopen}
        setOpen={setSKOpen}
        message={messageSK}
        alert={alert}
      />
    </>
  );
};

export default Sidebar;
