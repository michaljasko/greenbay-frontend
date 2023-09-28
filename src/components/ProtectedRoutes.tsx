import { Navigate, } from "react-router-dom";
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "../redux/store";


type ProtectedRoutesProps = {
	children: React.ReactNode;
};

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
