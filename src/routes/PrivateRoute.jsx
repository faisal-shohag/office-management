import { AuthContext } from "../Providers/AuthProvider";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ProgressWindow from "../components/app_components/ProgressWindow";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  console.log(user)

  const location = useLocation();
  if (loading) {
    return (
      <ProgressWindow
        progressbar={<progress className="progress w-56"></progress>}
      ></ProgressWindow>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;