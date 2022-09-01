import {
  Box,
  Toolbar,
  Drawer,
  ListItemButton,
  ListItemIcon,
  Typography,
  List,
  SxProps,
  IconButton,
  Divider,
  Fade,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  AccountBoxTwoTone,
  PasswordTwoTone,
  HelpCenterTwoTone,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import {
  clearSett,
  tempSettingsGet,
  tempSettingsSet,
} from "../../utils/GetRouterState";
import { styled, useTheme } from "@mui/material/styles";

const drawerWidth = 275;

interface Props {
  open: boolean;
  setOpen: Function;
  sx: SxProps;
  variant: "persistent" | "permanent";
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const SidebarAcc = ({ open, setOpen, sx, variant }: Props) => {
  const MenuItems = [
    {
      ID: "profile",
      Text: "Profile",
      Icon: <AccountBoxTwoTone color={"success"} />,
      Index: 0,
    },
    {
      ID: "password",
      Text: "Password",
      Icon: <PasswordTwoTone color={"success"} />,
      Index: 1,
    },
    {
      ID: "security",
      Text: "Security Question",
      Icon: <HelpCenterTwoTone color={"success"} />,
      Index: 2,
    },
  ];

  const [Pack, setPack] = useState<number>(0);

  useEffect(() => {
    setPack(tempSettingsGet());
  }, []);

  const theme = useTheme();
  // const [open, setOpen] = useState<boolean>(false);
  // const [message, setMsg] = useState<string>("");
  // const [alert, setAlert] = useState<string>("");

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setPack(index);
    tempSettingsSet(index);
    setOpen(false);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Fade in timeout={variant === "permanent" ? 300 : 500}>
        <Drawer variant={variant} sx={sx} open={open}>
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
              <Divider sx={{ color: "green" }} />
            </>
          )}
          {variant === "permanent" && <Toolbar />}
          <Box sx={{ overflow: "auto", mt: 1.9 }}>
            <Typography
              align={"left"}
              variant={"h5"}
              component={"h5"}
              sx={{ fontWeight: "bold", ml: 2.3, mb: 1 }}
            >
              Account
            </Typography>

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
                      selected={Pack === item.Index}
                      onClick={(event) =>
                        handleListItemClick(event, item.Index)
                      }
                      sx={{ [`&:hover`]: { bgcolor: "rgb(33,150,243, 0.1)" } }}
                    >
                      <ListItemIcon sx={{ mr: -2.5 }}>{item.Icon}</ListItemIcon>
                      <Typography
                        sx={{
                          fontWeight: Pack === item.Index ? "bold" : "light",
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
          </Box>
        </Drawer>
      </Fade>
      {/* <Snackbar open={open} setOpen={setOpen} message={message} alert={alert} /> */}
    </>
  );
};

export default SidebarAcc;
