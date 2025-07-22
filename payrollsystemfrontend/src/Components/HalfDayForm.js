import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import './ChangebgColour.css'; // Import custom CSS for background color

const HalfDayForm = () => {
  const [formData, setFormData] = useState({
    userId: "",
    date: "",
    whichHalf: "",
    reason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Retrieve and Decode Token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFormData((prev) => ({ ...prev, userId: decoded.id }));
        console.log("Decoded Token:", decoded.id);
      } catch (error) {
        console.error("Invalid Token:", error);
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Not Authenticated",
        text: "Please log in to submit a request.",
      });
    }
  }, []);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.whichHalf || !formData.reason) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill out all fields!",
      });
      return;
    }

    if (!formData.userId) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "User ID not found. Please log in again.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3006/api/users/addHalfDay",
        formData,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Half-day request submitted successfully!",
      });

      // ✅ Reset form while preserving userId
      setFormData({
        userId: formData.userId,
        date: "",
        whichHalf: "",
        reason: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || "Something went wrong, please try again later.",
      });
      console.error("Error submitting Half-day request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-bg">
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className="p-5 shadow-sm bg-light text-dark rounded-4"
        style={{ maxWidth: "800px", width: "100%" }}
      >
        <Card.Header className="text-center bg-secondary bg-opacity-10 p-4 rounded-top-4">
          <h2 className="mb-0 fw-semibold">Half-Day Request Form</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fs-5">Half-Day Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="bg-white border-1 rounded-3 p-2"
                style={{ fontSize: "1.1rem" }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fs-5">Which Half</Form.Label>
              <Form.Select
                name="whichHalf"
                value={formData.whichHalf}
                onChange={handleChange}
                required
                className="bg-white border-1 rounded-3 p-2"
                style={{ fontSize: "1.1rem" }}
              >
                <option value="">Select Half</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fs-5">Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter reason for half-day"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="bg-white border-1 rounded-3 p-2"
                style={{ fontSize: "1.1rem", minHeight: "120px" }}
              />
            </Form.Group>

            <div className="text-center mt-5">
              <Button
                type="submit"
                variant="secondary"
                disabled={isSubmitting}
                className="px-5 py-3 rounded-4"
                style={{ fontSize: "1.2rem" }}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </div>
  );
};

export default HalfDayForm;