import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './ChangebgColour.css'; // Import custom CSS for background color

function ServiceChargeHandle() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [serviceChargeAmount, setServiceChargeAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState({});
  const token = localStorage.getItem('token');

  // Get month name from YYYY-MM format
  const getMonthName = (monthValue) => {
    if (!monthValue) return '';
    const [year, month] = monthValue.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    const getEmployeesData = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/allUsersData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setAllEmployees(response.data.FindUser);
        console.log(response.data.FindUser);
      } catch (error) {
        console.error('Error fetching employees data:', error);
      }
    };

    getEmployeesData();
  }, [token]);

  useEffect(() => {
    if (allEmployees.length > 0) {
      const getPaymentStatus = async () => {
        try {
          const statusData = {};
          for (let employee of allEmployees) {
            const response = await axios.get(`http://localhost:3006/api/users/getAllPaymentData/${employee._id}`, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.data.paymentData.length > 0) {
              statusData[employee._id] = response.data.paymentData[0].status === 'true';
            } else {
              statusData[employee._id] = false;
            }
          }
          setPaymentStatus(statusData);
        } catch (error) {
          console.error('Error fetching payment status:', error);
        }
      };
      getPaymentStatus();
    }
  }, [allEmployees, token]);

  const handleSubmit = async () => {
    if (!selectedEmployee || !serviceChargeAmount || !selectedMonth) {
      Swal.fire('Warning', 'Please select employee, month, and enter service charge amount', 'warning');
      return;
    }

    if (parseFloat(serviceChargeAmount) <= 0) {
      Swal.fire('Warning', 'Service charge amount must be greater than 0', 'warning');
      return;
    }

    try {
      const data = {
        userId: selectedEmployee,
        serviceCharge: parseFloat(serviceChargeAmount),
        allowance: 0, // Set to 0 since we're only handling service charges
      };

      await axios.post('http://localhost:3006/api/users/addPaymentData', data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire('Success', `Service charge added successfully for ${getMonthName(selectedMonth)}!`, 'success');
      setPaymentStatus((prev) => ({ ...prev, [selectedEmployee]: true }));
      
      // Reset form
      setSelectedEmployee('');
      setServiceChargeAmount('');
    } catch (error) {
      console.error('Error saving service charge:', error);
      Swal.fire('Error', 'Failed to add service charge. Please try again.', 'error');
    }
  };

  const getSelectedEmployeeInfo = () => {
    if (!selectedEmployee) return null;
    return allEmployees.find(emp => emp._id === selectedEmployee);
  };

  const isEmployeePaid = () => {
    return selectedEmployee && paymentStatus[selectedEmployee];
  };

  const calculateTotalSalary = () => {
    const employee = getSelectedEmployeeInfo();
    if (!employee || !serviceChargeAmount) return 0;
    return parseFloat(employee.basicSal || 0) + parseFloat(serviceChargeAmount || 0);
  };

  // Generate month options (current month and next 11 months)
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    
    return options;
  };

  return (
    <div className="page-bg">
    <Container style={{ marginTop: '50px' }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header className="bg-success text-white text-center">
              <h4>Service Charge Management</h4>
            </Card.Header>
            <Card.Body>
              <Form>
                {/* Month Selection */}
                <Form.Group className="mb-3">
                  <Form.Label>Select Payment Month</Form.Label>
                  <Form.Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Choose a month...</option>
                    {getMonthOptions().map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Employee Selection */}
                <Form.Group className="mb-3">
                  <Form.Label>Select Employee</Form.Label>
                  <Form.Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Choose an employee...</option>
                    {Array.isArray(allEmployees) &&
                      allEmployees.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.CorrectuserId} - {employee.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                {/* Employee Info Display */}
                {getSelectedEmployeeInfo() && (
                  <Card className="mb-3 bg-light">
                    <Card.Body>
                      <h6>Employee Information:</h6>
                      <p className="mb-1"><strong>ID:</strong> {getSelectedEmployeeInfo().CorrectuserId}</p>
                      <p className="mb-1"><strong>Name:</strong> {getSelectedEmployeeInfo().name}</p>
                      <p className="mb-1"><strong>Basic Salary:</strong> LKR {getSelectedEmployeeInfo().basicSal}</p>
                      {selectedMonth && (
                        <p className="mb-0"><strong>Payment Month:</strong> {getMonthName(selectedMonth)}</p>
                      )}
                      {isEmployeePaid() && (
                        <div className="mt-2">
                          <span className="badge bg-success">Already Paid</span>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* Service Charge Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Service Charge Amount</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={serviceChargeAmount}
                    onChange={(e) => setServiceChargeAmount(e.target.value)}
                    placeholder="Enter service charge amount"
                    disabled={isEmployeePaid()}
                  />
                  <Form.Text className="text-muted">
                    Enter the service charge amount for the selected employee
                  </Form.Text>
                </Form.Group>

                {/* Salary Calculation Display */}
                {getSelectedEmployeeInfo() && serviceChargeAmount && (
                  <Card className="mb-3 bg-light">
                    <Card.Body>
                      <h6>Salary Calculation:</h6>
                      <p className="mb-1"><strong>Basic Salary:</strong> LKR {getSelectedEmployeeInfo().basicSal}</p>
                      <p className="mb-1"><strong>Service Charge:</strong> LKR {serviceChargeAmount}</p>
                      <hr />
                      <p className="mb-0 text-success"><strong>Total Salary:</strong> LKR {calculateTotalSalary()}</p>
                    </Card.Body>
                  </Card>
                )}

                {/* Submit Button */}
                <div className="d-grid">
                  {isEmployeePaid() ? (
                    <Button variant="secondary" disabled>
                      Employee Already Paid
                    </Button>
                  ) : (
                    <Button 
                      variant="success" 
                      onClick={handleSubmit}
                      disabled={!selectedEmployee || !serviceChargeAmount || !selectedMonth || parseFloat(serviceChargeAmount) <= 0}
                    >
                      Add Service Charge
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default ServiceChargeHandle;