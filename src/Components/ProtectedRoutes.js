import React from "react";
// import { jwtDecode } from "jwt-decode";
import {
  // useDispatch, 
  useSelector
} from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
// import { logoutUser } from "../ReduxManager/action";

const ProtectedRoutes = () => {
  // const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.userAuth);
  // const token = useSelector((state) => state.user.token);

  // const checkTokenExpiry = () => {
  //   if (!token) return;

  //   const decode = jwtDecode(token);

  //   const currentTime = Date.now() / 1000;

  //   if (decode.exp < currentTime) {
  //     dispatch(logoutUser());
  //   }
  //   console.log("exp in", decode.exp - currentTime);
  // };

  // useEffect(() => {
  //   checkTokenExpiry();
  // }, [token]);

  return isLogin ? <Outlet /> : <Navigate to={"/login"} />;
};

export default ProtectedRoutes;
