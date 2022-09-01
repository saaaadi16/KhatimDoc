import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { clearPack, tempAppGet } from "../utils/GetRouterState";
import Sidebar from "./sidebar/Sidebar";

interface Props {
  RowsUpdated: number;
}

const ProtectedPackages = ({ RowsUpdated }: Props) => {
  useEffect(() => {
    return () => {
      (tempAppGet() === 2 || tempAppGet() === 0) && clearPack();
    };
  }, []);

  return (
    <>
      <Sidebar
        RowsUpdate={RowsUpdated}
        open={true}
        setOpen={() => {}}
        variant="permanent"
        sx={{
          width: 275,
          display: { md: "flex", xs: "none" },
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 275,
            boxSizing: "border-box",
          },
        }}
      />
      <Outlet />
    </>
  );
};

export default ProtectedPackages;
