import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { performLogin } from "../redux/actions/authActions";
import { AppDispatch, RootState } from "../redux/store";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/items");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Call the performLogin action creator
    dispatch(performLogin(username, password));
    navigate("/items");

    setUsername("");
    setPassword("");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <Row
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "90vh" }}
    >
      <Card className="w-100" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <h2 className="text-center mt-2 mb-4">Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                className="mt-1 mb-4"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                className="mt-1 mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <div className="text-center mt-4">
            <p>Not signed up yet?</p>
            <Button variant="link" onClick={handleSignup}>
              Sign up here
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Row>
  );
};

export default Login;
