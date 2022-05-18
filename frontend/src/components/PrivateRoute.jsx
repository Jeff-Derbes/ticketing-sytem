import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  if (loggedIn) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }

  return <div>PrivateRoute</div>;
};

export default PrivateRoute;
