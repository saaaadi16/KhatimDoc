import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { User } from "../App";
import Appbar from "./appbar/Appbar";

interface Props {
  User: User;
  setUser: Function;
  ProfileUpdated: number;
  SearchText: string;
  setSearchText: Function;
  SearchUpdate: number;
  setSearchUp: Function;
  RowsUpdated: number;
}

const ProtectedDash = ({
  User,
  setUser,
  ProfileUpdated,
  SearchText,
  setSearchText,
  SearchUpdate,
  setSearchUp,
  RowsUpdated,
}: Props) => {
  return (
    <>
      <Appbar
        user={User}
        setUser={setUser}
        ProfileUpdated={ProfileUpdated}
        SearchText={SearchText}
        setSearchText={setSearchText}
        SearchUpdate={SearchUpdate}
        setSearchUp={setSearchUp}
        RowsUpdated={RowsUpdated}
      />
      <Outlet />
    </>
  );
};

export default ProtectedDash;
