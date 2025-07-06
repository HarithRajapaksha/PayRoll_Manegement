import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function AdminSalaryViewer() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const token = localStorage.getItem('token');
  const slipRef = useRef();

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/AllRegUsersData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('User data:', response.data);
        const userArray = Array.isArray(response.data)
          ? response.data
          : response.data.users || response.data.AllUsers || response.data.FindUser || [];
  
        setUsers(userArray);
      } catch (error) {
        console.error('Error fetching user list:', error);
        setUsers([]);
      }
    };
  
    fetchUsers();
  }, [token]);

  const fetchSalaryData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3006/api/users/getSalData/${selectedUserId}/${year}/${month}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSalaryData(response.data);
    } catch (error) {
      console.error('Error fetching salary data:', error);
      setSalaryData(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUserId && month) fetchSalaryData();
  };

  // Handle user selection and get user details
  const handleUserSelection = (userId) => {
    setSelectedUserId(userId);
    const user = users.find(u => u._id === userId);
    setSelectedUser(user);
  };

  const handleDownloadPDF = async () => {
    const element = slipRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Payslip_${selectedUser?.name || salaryData.name}_${monthNames[parseInt(month) - 1]}_${year}.pdf`);
  };

  const payslipStyles = {
    container: {
      fontFamily: 'Times New Roman, serif',
      backgroundColor: '#ffffff',
      padding: '30px',
      border: '2px solid #000',
      maxWidth: '800px',
      margin: '0 auto',
      fontSize: '14px',
      lineHeight: '1.4'
    },
    header: {
      textAlign: 'center',
      marginBottom: '25px',
      borderBottom: '2px solid #000',
      paddingBottom: '15px'
    },
    companyName: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '5px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    payslipTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginTop: '10px',
      textDecoration: 'underline'
    },
    employeeInfo: {
      marginBottom: '20px',
      backgroundColor: '#f8f9fa',
      padding: '15px',
      border: '1px solid #dee2e6'
    },
    infoRow: {
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between'
    },
    label: {
      fontWeight: 'bold',
      width: '40%'
    },
    value: {
      width: '60%'
    },
    salarySection: {
      marginBottom: '20px'
    },
    salaryTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '15px'
    },
    tableHeader: {
      backgroundColor: '#343a40',
      color: 'white',
      fontWeight: 'bold',
      padding: '12px',
      textAlign: 'left',
      border: '1px solid #000'
    },
    tableCell: {
      padding: '10px',
      border: '1px solid #000',
      textAlign: 'left'
    },
    netSalary: {
      backgroundColor: '#d4edda',
      border: '2px solid #28a745',
      padding: '15px',
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#155724'
    },
    footer: {
      marginTop: '30px',
      textAlign: 'center',
      fontSize: '12px',
      color: '#6c757d',
      borderTop: '1px solid #dee2e6',
      paddingTop: '10px'
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Employee Payslip Viewer</h3>

      {/* Selection Form */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="align-items-end g-3">
          <Col md={4}>
            <Form.Group controlId="userSelect">
              <Form.Label>Select Employee</Form.Label>
              <Form.Select
                value={selectedUserId}
                onChange={(e) => handleUserSelection(e.target.value)}
              >
                <option value="">-- Select Employee --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group controlId="year">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group controlId="month">
              <Form.Label>Month</Form.Label>
              <Form.Select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">-- Select Month --</option>
                {monthNames.map((monthName, index) => (
                  <option key={index + 1} value={index + 1}>
                    {monthName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2}>
            <Button type="submit" className="w-100">Get</Button>
          </Col>
        </Row>
      </Form>

      {/* Salary Slip View */}
      {salaryData ? (
        <>
          <div ref={slipRef} style={payslipStyles.container}>
            {/* Company Header */}
            <div style={payslipStyles.header}>
              <div style={payslipStyles.companyName}>
                THE CARNIVO RESTAURANT
              </div>
              <div style={payslipStyles.payslipTitle}>
                PAYSLIP
              </div>
            </div>

            {/* Employee Information */}
            <div style={payslipStyles.employeeInfo}>
              <div style={payslipStyles.infoRow}>
                <span style={payslipStyles.label}>Employee ID:</span>
                <span style={payslipStyles.value}>{selectedUser?.CorrectuserId || 'N/A'}</span>
              </div>
              <div style={payslipStyles.infoRow}>
                <span style={payslipStyles.label}>Employee Name:</span>
                <span style={payslipStyles.value}>{selectedUser?.name || salaryData.name}</span>
              </div>
              <div style={payslipStyles.infoRow}>
                <span style={payslipStyles.label}>Job Role:</span>
                <span style={payslipStyles.value}>{selectedUser?.role || 'N/A'}</span>
              </div>
              <div style={payslipStyles.infoRow}>
                <span style={payslipStyles.label}>NIC:</span>
                <span style={payslipStyles.value}>{selectedUser?.nic || 'N/A'}</span>
              </div>
              <div style={payslipStyles.infoRow}>
                <span style={payslipStyles.label}>Pay Period:</span>
                <span style={payslipStyles.value}>
                  {monthNames[parseInt(month) - 1]} {year}
                </span>
              </div>
            </div>

            {/* Salary Details */}
            <div style={payslipStyles.salarySection}>
              <table style={payslipStyles.salaryTable}>
                <thead>
                  <tr>
                    <th style={payslipStyles.tableHeader}>EARNINGS</th>
                    <th style={payslipStyles.tableHeader}>AMOUNT (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={payslipStyles.tableCell}>Basic Salary</td>
                    <td style={payslipStyles.tableCell}>{Number(salaryData.BasicSal).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={payslipStyles.tableCell}>Allowance</td>
                    <td style={payslipStyles.tableCell}>{Number(salaryData.allowance).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={payslipStyles.tableCell}>Service Charge</td>
                    <td style={payslipStyles.tableCell}>{Number(salaryData.serviceCharge).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <table style={payslipStyles.salaryTable}>
                <thead>
                  <tr>
                    <th style={payslipStyles.tableHeader}>DEDUCTIONS</th>
                    <th style={payslipStyles.tableHeader}>AMOUNT (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={payslipStyles.tableCell}>EPF (Employee)</td>
                    <td style={payslipStyles.tableCell}>{Number(salaryData.EPF).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={payslipStyles.tableCell}>ETF</td>
                    <td style={payslipStyles.tableCell}>{Number(salaryData.ETF).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={payslipStyles.tableCell}>No Pay</td>
                    <td style={payslipStyles.tableCell}>{Number(salaryData.NoPay).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={payslipStyles.tableCell}>Half Days</td>
                    <td style={payslipStyles.tableCell}>{salaryData.NumberOfHalfDays}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Net Salary */}
            <div style={payslipStyles.netSalary}>
              NET SALARY: Rs. {Number(salaryData.NetSalary).toFixed(2)}
            </div>

            {/* Footer */}
            <div style={payslipStyles.footer}>
              <p>This is a computer-generated payslip and does not require a signature.</p>
              <p>Generated on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-3 text-center">
            <Button variant="primary" onClick={handleDownloadPDF} size="lg">
              Download PDF
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center mt-4">
          <p className="text-muted">No salary data found. Please select a user, year, and month.</p>
        </div>
      )}
    </Container>
  );
}

export default AdminSalaryViewer;