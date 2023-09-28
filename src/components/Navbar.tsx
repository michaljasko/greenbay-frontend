import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "../redux/actions/authActions";
import { AppDispatch, RootState } from "../redux/store";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { login } from "../redux/slices/authSlice";
import axiosInstance from "../axiosInstance";


const MyNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);

      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        // Token is expired
        console.log("Token expired");
        // Logout and redirect
        dispatch(performLogout());
        navigate("/login");
      } else {
        // Set token in axiosInstance and isLoggedIn state in store (after page refresh)
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        dispatch(login());
      }
    }
  }, [dispatch, navigate]);

  const handleLogout = () => {
    dispatch(performLogout());
    navigate("/login");
  };

  return (
    <Navbar
      bg="primary"
      data-bs-theme="dark"
      expand="md"
      className="fixed-top px-4 px-lg-5"
    >
      <Navbar.Brand as="a" href="/">
        greenBay
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {isLoggedIn && (
            <>
              <Nav.Link as={NavLink} to="/items">
                Item List
              </Nav.Link>
              <Nav.Link as={NavLink} to="/new-item">
                Sell
              </Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Nav.Link as={NavLink} to="/signup">
                Sign Up
              </Nav.Link>
              <Nav.Link as={NavLink} to="/login">
                Login
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
