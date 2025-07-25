import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './ChangebgColour.css'; // Import custom CSS for background color

function EmpMiddleSalRequest() {
  const [jobRole, setJobRole] = useState('');
  const [reason, setReason] = useState('');
  const [FetchuserData, setUserData] = useState(null);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  console.log('Decoded Token:', decoded);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/users/leaveRe/${decoded.id}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('User data:', response.data.FindUser);
        setUserData(response.data.FindUser.name);
        setJobRole(response.data.FindUser.role);
      } catch (error) {
        console.log('data fetch Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch user data. Please try again.',
        });
      }
    };

    fetchData();
  }, [decoded.id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      Uid: decoded.id,
      Name: FetchuserData,
      Role: jobRole,
      Salary: reason,
    };

    try {
      const response = await axios.post('http://localhost:3006/api/users/AddAdditionalSal', data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Middle Salary Added:', response.data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Advance payment request submitted successfully!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Middle Salary Added Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit advance payment request. Please try again.',
      });
    }
  };

  return (
    <div className="page-bg">
      <Container className="py-5 d-flex justify-content-center">
        <Card
          className="p-5 shadow-sm bg-light text-dark rounded-4"
          style={{ maxWidth: '800px', width: '100%' }}
        >
          <Card.Header className="text-center bg-secondary bg-opacity-10 p-4 rounded-top-4">
            <h2 className="mb-0 fw-semibold">Advance Payment Request Form</h2>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="fs-5">Your Name</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  value={FetchuserData || ''}
                  className="bg-white border-1 rounded-3 p-2"
                  style={{ fontSize: '1.1rem' }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fs-5">Job Role</Form.Label>
                <Form.Control
                  type="text"
                  value={jobRole}
                  disabled
                  required
                  className="bg-white border-1 rounded-3 p-2"
                  style={{ fontSize: '1.1rem' }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fs-5">Request Advance Payment</Form.Label>
                <Form.Select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="bg-white border-1 rounded-3 p-2"
                  style={{ fontSize: '1.1rem' }}
                >
                  <option value="">Select Advance Payment</option>
                  <option value="5000">5000</option>
                  <option value="10000">10000</option>
                  <option value="15000">15000</option>
                </Form.Select>
              </Form.Group>

              <div className="text-center mt-5">
                <Button
                  variant="secondary"
                  type="submit"
                  style={{ fontSize: '1.2rem', padding: '0.5rem 2rem' }}
                  className="rounded-4"
                >
                  Submit Request
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default EmpMiddleSalRequest;