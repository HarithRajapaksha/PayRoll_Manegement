import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const HolidayRequestForm = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [holidayDays, setHolidayDays] = useState(0);
  const [name, setName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [reason, setReason] = useState('');
  const [FetchuserData, setUserData] = useState(null);
  const [leaveStatus, setLeaveStatus] = useState(false);
  const [leaveCount, setLeaveCount] = useState(0);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);

  const calculateHolidayDays = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const timeDiff = endDateObj - startDateObj;
    return timeDiff / (1000 * 3600 * 24) + 1;
  };

  const userData = {
    LeaveHolderId: decoded.id,
    LeaveStartDate: startDate,
    LeaveEndDate: endDate,
    NumOfDay: holidayDays,
    Name: FetchuserData,
    Role: jobRole,
    Reason: reason,
  };

  // Check leave usage for this month
  useEffect(() => {
    const fetchLeaveCountData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/users/getHolidayData/${decoded.id}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Leave count data:', response.data);
        setLeaveStatus(response.data.allowed);
        setLeaveCount(response.data.totalDays);
      } catch (error) {
        console.error('Data fetch Error:', error);
      }
    };

    fetchLeaveCountData();
  }, [token, decoded?.id]);

  // Fetch user data for name
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/users/admin/${decoded.id}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.FindUser.name);
        setJobRole(response.data.FindUser.role);
      } catch (error) {
        console.log('data fetch Error:', error);
      }
    };

    fetchData();
  }, [decoded.id]);

  // Handle date changes
  const handleDateChange = () => {
    if (startDate && endDate) {
      const days = calculateHolidayDays(startDate, endDate);
      setHolidayDays(days);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3006/api/users/addLeave`,
        userData,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Leave data added', response.data);
      Swal.fire({
        title: 'Success!',
        text: 'Leave Added successfully!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Leave data not added', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add leave!',
        icon: 'error',
      });
    }
  };

  const isLeaveLimitExceeded = leaveCount + holidayDays > 7;

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2 className="text-center mb-4">Full Leave Request Form</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={6}>
              <Form.Group controlId="startDate">
                <Form.Label>Select Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onBlur={handleDateChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="endDate">
                <Form.Label>Select End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onBlur={handleDateChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {holidayDays > 0 && (
            <Row className="mt-3">
              <Col>
                <Form.Group controlId="holidayDays">
                  <Form.Label>Number of Holiday Days</Form.Label>
                  <Form.Control type="text" value={holidayDays} disabled />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Form.Group controlId="name" className="mt-3">
            <Form.Label>Your Name</Form.Label>
            <Form.Control type="text" value={FetchuserData} disabled />
          </Form.Group>

          <Form.Group controlId="jobRole" className="mt-3">
            <Form.Label>Job Role</Form.Label>
            <Form.Control
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              disabled
            />
          </Form.Group>

          <Form.Group controlId="reason" className="mt-3">
            <Form.Label>Reason for Holiday</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </Form.Group>

          {isLeaveLimitExceeded && (
            <div className="text-danger text-center mt-3 fw-bold">
              Leave limit exceeded. You can only take 7 days per month.
            </div>
          )}

          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="primary"
              type="submit"
              style={{ width: '150px' }}
              disabled={isLeaveLimitExceeded}
            >
              Submit Request
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default HolidayRequestForm;
