import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

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
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          background: "#f8f9fa",
        }}
      >
        <h2 className="text-center mb-4">Half-Day Request</h2>
        <Form onSubmit={handleSubmit}>
          {/* Half-Day Date */}
          <Form.Group className="mb-3">
            <Form.Label>Half-Day Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Which Half (Morning/Evening) */}
          <Form.Group className="mb-3">
            <Form.Label>Which Half</Form.Label>
            <Form.Select
              name="whichHalf"
              value={formData.whichHalf}
              onChange={handleChange}
              required
            >
              <option value="">Select Half</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </Form.Select>
          </Form.Group>

          {/* Reason */}
          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter reason for half-day"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Submit Button */}
          <div className="d-flex justify-content-center mt-4">
            <Button type="submit" variant="primary" style={{ width: "180px" }} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default HalfDayForm;
