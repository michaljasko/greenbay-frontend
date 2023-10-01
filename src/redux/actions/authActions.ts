import { createAction } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";
import { login, logout } from "../slices/authSlice";

export const signUp = createAction(
  "auth/signUp",
  (username: string, password: string) => ({
    payload: {
      username,
      password,
    },
  })
);

export const performLogin = (username: string, password: string) => {
  return async (dispatch: any) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const jwtresponse = response.data;
        const token = jwtresponse.token;
        const username = jwtresponse.username;
        const money = jwtresponse.money;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("money", money);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        // Dispatch the login action to update the state
        dispatch(login());
      } else {
        console.log("Login failed");
      }
    } catch (error: any) {
      console.log("An error occurred:", (error as Error).message);
    }
  };
};

export const performLogout = () => {
  return (dispatch: any) => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    delete axiosInstance.defaults.headers.common["Authorization"];

    // Dispatch the logout action to update the state
    dispatch(logout());
  };
};
