import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import './ChangebgColour.css'; // Import custom CSS for background color

function EpfPayment() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12 for MongoDB
  const [basicSal, setBasicSal] = useState(0);
  const [employeeContribution, setEmployeeContribution] = useState(0);
  const [employerContribution, setEmployerContribution] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch permanent employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (!token) {
          setError('No authentication token found. Please log in.');
          return;
        }

        const response = await axios.get('http://localhost:3006/api/users/AllRegUsersData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response:', response.data); // Debug: Log the raw response data

        // Handle response format
        let data = response.data;
        if (!data) {
          setError('No data returned from the API');
          return;
        }

        // Extract users array if response is { users: [...] }
        if (!Array.isArray(data) && data.users && Array.isArray(data.users)) {
          data = data.users;
        }

        // Ensure data is an array
        if (!Array.isArray(data)) {
          setError(`Invalid response format: Expected an array, received ${typeof data}`);
          return;
        }

        // Filter for permanent employees
        const permanentEmployees = data.filter(user => user.empType === 'Permanent');
        console.log('Permanent Employees:', permanentEmployees); // Debug: Log filtered employees
        if (permanentEmployees.length === 0) {
          setError('No permanent employees found');
        }
        setEmployees(permanentEmployees);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err.response?.data?.message || `Failed to fetch employees: ${err.message}`);
      }
    };
    fetchEmployees();
  }, []);

  // Update contributions when an employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      const employee = employees.find(emp => emp._id === selectedEmployee);
      if (employee) {
        const salary = parseFloat(employee.basicSal) || 0;
        setBasicSal(salary);
        setEmployeeContribution(salary * 0.08);
        setEmployerContribution(salary * 0.12);
      }
    } else {
      setBasicSal(0);
      setEmployeeContribution(0);
      setEmployerContribution(0);
    }
  }, [selectedEmployee, employees]);

  // Handle Employee contribution submission
  const handleEmployeeSubmit = async () => {
    if (!selectedEmployee || !year || !month) {
      setError('Please select an employee, year, and month');
      return;
    }

    const employee = employees.find(emp => emp._id === selectedEmployee);
    if (!employee) {
      setError('Selected employee not found');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const response = await axios.post(
        `http://localhost:3006/api/users/addEPFData/${year}/${month}`,
        {
          UserId: employee._id,
          EmployeeId: employee.CorrectuserId,
          Employee: employeeContribution,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add Employee contribution');
      console.error('Error adding Employee contribution:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Employer contribution submission
  const handleEmployerSubmit = async () => {
    if (!selectedEmployee || !year || !month) {
      setError('Please select an employee, year, and month');
      return;
    }

    const employee = employees.find(emp => emp._id === selectedEmployee);
    if (!employee) {
      setError('Selected employee not found');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const response = await axios.post(
        `http://localhost:3006/api/users/addEPFData/${year}/${month}`,
        {
          UserId: employee._id,
          EmployeeId: employee.CorrectuserId,
          Employer: employerContribution,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add Employer contribution');
      console.error('Error adding Employer contribution:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg">
    <Container className="mt-5">
      <h2 className="text-center mb-4">EPF Payment Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Permanent Employee</Form.Label>
              <Form.Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                disabled={employees.length === 0}
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.CorrectuserId})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Enter year (e.g., 2025)"
                min="2000"
                max="2100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Month</Form.Label>
              <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">-- Select Month --</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Col>
        <Col md={6}>
          <div className="border p-3 rounded">
            <h4>Contribution Details</h4>
            <p><strong>Basic Salary:</strong> {basicSal.toFixed(2)}</p>
            <p><strong>Employee Contribution (8%):</strong> {employeeContribution.toFixed(2)}</p>
            <p><strong>Employer Contribution (12%):</strong> {employerContribution.toFixed(2)}</p>
            <div className="d-flex justify-content-between">
              <Button
                variant="primary"
                onClick={handleEmployeeSubmit}
                disabled={loading || !selectedEmployee || !year || !month}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Submit Employee Contribution'}
              </Button>
              <Button
                variant="success"
                onClick={handleEmployerSubmit}
                disabled={loading || !selectedEmployee || !year || !month}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Submit Employer Contribution'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default EpfPayment;