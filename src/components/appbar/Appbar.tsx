import "./Appbar.css";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import {
  CircularProgress,
  CssBaseline,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import { NavLink, useNavigate } from "react-router-dom";
import { User } from "../../App";
import SearchBar from "../searchBar/SearchBar";
import { useState } from "react";
import Axios from "../../services/axios";
import {
  tempAppSet,
  tempAppGet,
  clearApp,
  clearSett,
  tempSettingsSet,
  clearPack,
} from "../../utils/GetRouterState";
import Sidebar from "../sidebar/Sidebar";
import SidebarAcc from "../sidebar/SidebarAcc";

const pages = [
  { Text: "Home", Index: 0, ID: "home" },
  { Text: "Packages", Index: 1, ID: "inbox" },
  { Text: "Settings", Index: 2, ID: "profile" },
];
const settings = ["Home", "Packages", "Settings", "Logout"];

interface props {
  user: User;
  setUser: Function;
  ProfileUpdated: number;
  SearchText: string;
  setSearchText: Function;
  SearchUpdate: number;
  setSearchUp: Function;
  RowsUpdated: number;
}

const AntTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "white",
    height: "3px",
  },
});

const AntTab = styled((props: any) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    color: "white",
    opacity: 1,
    "&:hover": {
      color: "white",
      backgroundColor: "rgb(255, 255, 255, 0.1)",
    },
    "&.Mui-selected": {
      color: "white",
      backgroundColor: "rgb(255, 255, 255, 0.1)",
      fontWeight: "bold",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "white",
    },
    height: "64px",
  })
);

const Appbar: React.FC<props> = (props) => {
  let navigate = useNavigate();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    tempAppSet(newValue);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (event: any) => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    setLoading(true);
    const Config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
    Axios.get("/user/basic", Config)
      .then((res) => {
        if (res.data.response_code === 0) {
          props.setUser({
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
  }, [props.ProfileUpdated]);

  const handleDrawerOpen = () => {
    tempAppGet() === 1 && setOpen(true);
    tempAppGet() === 2 && setOpen2(true);
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "success.dark",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {(tempAppGet() === 1 || tempAppGet() === 2) && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 1, display: { md: "none", xs: "flex" } }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Tooltip title={"Home"}>
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { sm: "flex", xs: "none" },
                  fontSize: 30,
                  fontFamily: "arial",
                  fontStyle: "oblique",
                  fontWeight: 700,
                  color: "white",
                  textDecoration: "none",
                  [`&:hover`]: { color: "white" },
                }}
              >
                KhatimDoc
              </Typography>
            </Tooltip>

            {tempAppGet() === 1 && open && (
              <Sidebar
                variant="persistent"
                sx={{
                  width: 275,
                  display: { md: "none", xs: "flex" },
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: {
                    width: 275,
                    boxSizing: "border-box",
                  },
                }}
                open={open}
                setOpen={setOpen}
                RowsUpdate={props.RowsUpdated}
              />
            )}

            {tempAppGet() === 2 && open2 && (
              <SidebarAcc
                open={open2}
                setOpen={setOpen2}
                sx={{
                  width: 275,
                  display: { xs: "flex", md: "none" },
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: {
                    width: 275,
                    boxSizing: "border-box",
                  },
                }}
                variant="persistent"
              />
            )}

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
              ></IconButton>
            </Box>

            <Box
              sx={{ ml: 20, flexGrow: 1, display: { xs: "none", md: "flex" } }}
            >
              <AntTabs value={tempAppGet()}>
                {pages.map((page, index) => (
                  <NavLink
                    to={"/" + page.ID.toLowerCase()}
                    className="color-link"
                    key={page.Index}
                  >
                    <AntTab
                      id={index}
                      key={page.Index}
                      value={page.Index}
                      label={page.Text}
                      onClick={(event: any) => {
                        handleChange(event, parseInt(event?.target?.id));
                      }}
                    />
                  </NavLink>
                ))}
              </AntTabs>
            </Box>

            <Box sx={{ mr: 3, display: { xs: "flex" } }}>
              {tempAppGet() === 1 && (
                <SearchBar
                  SearchText={props.SearchText}
                  setSearchText={props.setSearchText}
                  SearchUpdate={props.SearchUpdate}
                  setSearchUp={props.setSearchUp}
                />
              )}
            </Box>

            {/* <Tooltip title={"Help"}>
              <HelpOutlineTwoToneIcon
                sx={{
                  mr: 3,
                  [`&:hover`]: {
                    cursor: "pointer",
                  },
                }}
              />
            </Tooltip> */}

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open Menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {loading ? (
                    <Avatar>
                      <CircularProgress color="success" size={30} />
                    </Avatar>
                  ) : props?.user?.avatar ? (
                    <Avatar
                      alt={"avatar"}
                      src={`data:image/png;base64,${props?.user?.avatar}`}
                    />
                  ) : (
                    <Avatar>
                      {props?.user?.firstname.charAt(0)}
                      {props?.user?.lastname.charAt(0)}
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem
                    id={index.toString()}
                    key={setting}
                    onClick={(e) => {
                      if (setting === "Logout") {
                        localStorage.removeItem("AuthToken");
                        localStorage.clear();
                        clearApp();
                        navigate("/signin");
                      }
                      if (setting === "Settings") {
                        tempAppSet(2);
                        clearSett();
                        tempSettingsSet(0);
                        navigate("/profile");
                      }
                      if (setting === "Home") {
                        tempAppSet(0);
                        navigate("/home");
                      }
                      if (setting === "Packages") {
                        tempAppSet(1);
                        clearPack();
                        navigate("/inbox");
                      }
                      handleCloseUserMenu(e);
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Appbar;
