import { useLocation, Navigate, Outlet } from "react-router-dom";
import { User } from "../App";

const token: string | null = localStorage.getItem("AuthToken");

const RequireAuth = (props: any) => {
  const location = useLocation();

  return token !== null || props.user?.userID !== '' ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default RequireAuth;
