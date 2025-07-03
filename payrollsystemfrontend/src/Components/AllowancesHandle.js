import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

function AllowanceHandler() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedAllowance, setSelectedAllowance] = useState('');
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

    const getAllowanceData = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/getAllowances', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setAllowances(response.data.allowanceData);
      } catch (error) {
        console.error('Error fetching allowance data:', error);
      }
    };

    getEmployeesData();
    getAllowanceData();
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
    if (!selectedEmployee || !selectedAllowance || !selectedMonth) {
      Swal.fire('Warning', 'Please select employee, month, and allowance', 'warning');
      return;
    }

    try {
      const selectedAllowanceData = allowances.find(
        (a) => a._id === selectedAllowance
      );
      const allowancePrice = selectedAllowanceData ? selectedAllowanceData.price : 0;

      const data = {
        userId: selectedEmployee,
        serviceCharge: 0, // Set to 0 since we're only handling allowances
        allowance: allowancePrice,
      };

      await axios.post('http://localhost:3006/api/users/addPaymentData', data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire('Success', `Allowance added successfully for ${getMonthName(selectedMonth)}!`, 'success');
      setPaymentStatus((prev) => ({ ...prev, [selectedEmployee]: true }));
      
      // Reset form
      setSelectedEmployee('');
      setSelectedAllowance('');
      setSelectedMonth('');
    } catch (error) {
      console.error('Error saving allowance:', error);
      Swal.fire('Error', 'Failed to add allowance. Please try again.', 'error');
    }
  };

  const getSelectedEmployeeInfo = () => {
    if (!selectedEmployee) return null;
    return allEmployees.find(emp => emp._id === selectedEmployee);
  };

  const getSelectedAllowanceInfo = () => {
    if (!selectedAllowance) return null;
    return allowances.find(allow => allow._id === selectedAllowance);
  };

  const isEmployeePaid = () => {
    return selectedEmployee && paymentStatus[selectedEmployee];
  };

  const calculateTotalSalary = () => {
    const employee = getSelectedEmployeeInfo();
    const allowanceData = getSelectedAllowanceInfo();
    if (!employee || !allowanceData) return 0;
    return parseFloat(employee.basicSal || 0) + parseFloat(allowanceData.price || 0);
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
    <Container style={{ marginTop: '50px' }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header className="bg-primary text-white text-center">
              <h4>Allowance Management</h4>
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
                      <p className="mb-1"><strong>Basic Salary:</strong>LKR {getSelectedEmployeeInfo().basicSal}</p>
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

                {/* Allowance Selection */}
                <Form.Group className="mb-3">
                  <Form.Label>Select Allowance</Form.Label>
                  <Form.Select
                    value={selectedAllowance}
                    onChange={(e) => setSelectedAllowance(e.target.value)}
                    disabled={isEmployeePaid()}
                  >
                    <option value="">Choose an allowance...</option>
                    {Array.isArray(allowances) &&
                      allowances.map((allowance) => (
                        <option key={allowance._id} value={allowance._id}>
                          {allowance.allowanceName} - LKR {allowance.price}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Select the allowance type for the selected employee
                  </Form.Text>
                </Form.Group>

                {/* Allowance Info Display */}
                {getSelectedAllowanceInfo() && (
                  <Card className="mb-3 bg-light">
                    <Card.Body>
                      <h6>Selected Allowance:</h6>
                      <p className="mb-1"><strong>Name:</strong> {getSelectedAllowanceInfo().allowanceName}</p>
                      <p className="mb-0"><strong>Amount:</strong> LKR {getSelectedAllowanceInfo().price}</p>
                    </Card.Body>
                  </Card>
                )}

                {/* Salary Calculation Display */}
                {getSelectedEmployeeInfo() && getSelectedAllowanceInfo() && (
                  <Card className="mb-3 bg-light">
                    <Card.Body>
                      <h6>Salary Calculation:</h6>
                      <p className="mb-1"><strong>Basic Salary:</strong> LKR {getSelectedEmployeeInfo().basicSal}</p>
                      <p className="mb-1"><strong>Allowance:</strong> LKR {getSelectedAllowanceInfo().price}</p>
                      <hr />
                      <p className="mb-0 text-primary"><strong>Total Salary:</strong> LKR {calculateTotalSalary()}</p>
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
                      variant="primary" 
                      onClick={handleSubmit}
                      disabled={!selectedEmployee || !selectedAllowance || !selectedMonth}
                    >
                      Add Allowance
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AllowanceHandler;