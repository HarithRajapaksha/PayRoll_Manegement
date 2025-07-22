import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Col, Row, Card } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import './ChangebgColour.css'; // Import custom CSS for background color

const HolidayRequestForm = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [holidayDays, setHolidayDays] = useState(0);
  const [name, setName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [reason, setReason] = useState('');
  const [FetchuserData, setUserData] = useState('');
  const [leaveStatus, setLeaveStatus] = useState(false);
  const [leaveCount, setLeaveCount] = useState(0);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);

  console.log('Decoded Token:', decoded);

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
    CorrectuserId: decoded.empId,
  };

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
        setLeaveStatus(response.data.allowed);
        setLeaveCount(response.data.totalDays);
      } catch (error) {
        console.error('Data fetch Error:', error);
      }
    };

    fetchLeaveCountData();
  }, [token, decoded?.id]);

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
    <div className="page-bg">
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className="p-5 shadow-sm bg-light text-dark rounded-4"
        style={{ maxWidth: '800px', width: '100%' }}
      >
        <Card.Header className="text-center bg-secondary bg-opacity-10 p-4 rounded-top-4">
          <h2 className="mb-0 fw-semibold">Full Leave Request Form</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col sm={6}>
                <Form.Group controlId="startDate">
                  <Form.Label className="fs-5">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onBlur={handleDateChange}
                    required
                    className="bg-white border-1 rounded-3 p-2"
                    style={{ fontSize: '1.1rem' }}
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="endDate">
                  <Form.Label className="fs-5">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onBlur={handleDateChange}
                    required
                    className="bg-white border-1 rounded-3 p-2"
                    style={{ fontSize: '1.1rem' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {holidayDays > 0 && (
              <Form.Group controlId="holidayDays" className="mt-4">
                <Form.Label className="fs-5">Number of Holiday Days</Form.Label>
                <Form.Control
                  type="text"
                  value={holidayDays}
                  disabled
                  className="bg-white border-1 rounded-3 p-2"
                  style={{ fontSize: '1.1rem' }}
                />
              </Form.Group>
            )}

            <Form.Group controlId="name" className="mt-4">
              <Form.Label className="fs-5">Your Name</Form.Label>
              <Form.Control
                type="text"
                value={FetchuserData}
                disabled
                className="bg-white border-1 rounded-3 p-2"
                style={{ fontSize: '1.1rem' }}
              />
            </Form.Group>

            <Form.Group controlId="jobRole" className="mt-4">
              <Form.Label className="fs-5">Job Role</Form.Label>
              <Form.Control
                type="text"
                value={jobRole}
                disabled
                className="bg-white border-1 rounded-3 p-2"
                style={{ fontSize: '1.1rem' }}
              />
            </Form.Group>

            <Form.Group controlId="reason" className="mt-4">
              <Form.Label className="fs-5">Reason for Holiday</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="bg-white border-1 rounded-3 p-2"
                style={{ fontSize: '1.1rem', minHeight: '120px' }}
              />
            </Form.Group>

            {isLeaveLimitExceeded && (
              <div className="text-danger text-center fw-medium mt-4" style={{ fontSize: '1.1rem' }}>
                Leave limit exceeded. You can only take 7 days per month.
              </div>
            )}

            <div className="text-center mt-5">
              <Button
                variant="secondary"
                type="submit"
                disabled={isLeaveLimitExceeded}
                className="px-5 py-3 rounded-4"
                style={{ fontSize: '1.2rem' }}
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
};

export default HolidayRequestForm;