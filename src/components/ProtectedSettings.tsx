import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  clearSett,
  tempAppGet,
  tempSettingsGet,
} from "../utils/GetRouterState";
import SidebarAcc from "./sidebar/SidebarAcc";

const ProtectedSettings = () => {
  // const [Pack, setPack] = useState<number>(tempSettingsGet);

  useEffect(() => {
    return () => {
      if (tempAppGet() === 1 || tempAppGet() === 0) clearSett();
    };
  }, []);

  return (
    <>
      <SidebarAcc
        open={true}
        setOpen={() => {}}
        sx={{
          width: 275,
          display: { xs: "none", md: "flex" },
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 275,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
      />
      <Outlet />
    </>
  );
};

export default ProtectedSettings;
