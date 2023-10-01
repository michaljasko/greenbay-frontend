import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItem } from "../redux/slices/itemSlice";
import { AppDispatch } from "../redux/store";
import { Row, Col, Form, Button } from "react-bootstrap";

export const AddItem: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: number;
    photo: File | null;
  }>({
    name: "",
    description: "",
    price: 0,
    photo: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all the form data before proceeding.
    let isValid = true;
    let newErrors = {};

    if (!formData.name.trim()) {
      isValid = false;
      newErrors = { ...newErrors, name: "This field cannot be empty!" };
    }

    if (!formData.description.trim()) {
      isValid = false;
      newErrors = { ...newErrors, description: "This field cannot be empty!" };
    }

    if (formData.price <= 0) {
      isValid = false;
      newErrors = { ...newErrors, price: "Price must be more than zero!" };
    }

    if (formData.price % 1 !== 0) {
      isValid = false;
      newErrors = { ...newErrors, price: "Price must be a whole number!" };
    }

    setErrors(newErrors);

    if (isValid) {
      dispatch(addItem({ ...formData }));
      navigate("/items");
    } else {
      console.log(newErrors);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle file input
    if (name === "photo") {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0] ?? null;
      setFormData((prevData) => ({ ...prevData, [name]: file }));
      return;
    }

    // Clear any existing error for the field
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });

    if (name === "name" || name === "description") {
      if (value.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "This field is required!",
        }));
      }
    } else if (name === "price") {
      if (Number(value) <= 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Price must be more than zero!",
        }));
      } else if (Number(value) % 1 !== 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Price must be a whole number",
        }));
      }
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

    return (
      <Row className="p-3">
        <h1 className="text-center my-5">Add your item for sale</h1>
        <Col md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group controlId="formMealName">
              <Form.Label>Item name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback d-block">{errors.name}</div>
              )}
            </Form.Group>

            <Form.Group controlId="formDescription" className="mt-4">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <div className="invalid-feedback d-block">{errors.description}</div>
              )}
            </Form.Group>

            <Form.Group controlId="formPrice" className="mt-4">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && (
                <div className="invalid-feedback d-block">{errors.price}</div>
              )}
            </Form.Group>

            <Form.Group controlId="formPrice" className="mt-4">
              <Form.Label>Photo:</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={handleChange}
              />
              {errors.photo && (
                <div className="invalid-feedback d-block">{errors.photo}</div>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-5 w-100">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    );
};

export default AddItem;
