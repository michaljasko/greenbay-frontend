import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signUp } from '../redux/actions/authActions';
import { Form, Button, Card, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';


export const SignUp = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();

  // Validate password format and length
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
    return passwordRegex.test(password);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let errors = {};

    if (!validatePassword(password)) {
      errors = {
        ...errors,
        password:
          'Password must contain at least one lowercase letter, one uppercase letter, and a number. Min 6 characters.',
      };
    }

    if (password !== confirmPassword) {
      errors = { ...errors, password: 'Passwords do not match' };
    }

    if (Object.keys(errors).length === 0) {
      dispatch(signUp(username, password));
      try {
        const response = await axiosInstance.post('/auth/signup', {
          username,
          password,
        });

        if (response.status === 201) {
          console.log('User signed up successfully');
          // Redirect to the authenticated page or update the app state accordingly
          navigate('/login');
        } else if (response.status === 500) {
          console.log('Username already in use!');
        } else {
          console.log('Failed to sign up user');
          // Display an error message or update the app state accordingly
        }
      } catch (error: any) {
        console.log('An error occurred:', error.message);
        // Display an error message or update the app state accordingly
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <Row
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '90vh' }}
    >
      <Card className="w-100" style={{ maxWidth: '400px' }}>
        <Card.Body className="d-flex flex-column align-items-center">
          <h2 className="text-center mt-2 mb-4">Sign Up</h2>
          <Form onSubmit={handleSubmit} className="w-100">
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

            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                className="mt-1 mb-4"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
              {errors.password && (
                <Form.Text className="text-danger">{errors.password}</Form.Text>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Row>
  );
};

export default SignUp;
