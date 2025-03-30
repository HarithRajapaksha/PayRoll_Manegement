import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function AdminSalaryViewer() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const token = localStorage.getItem('token');
  const slipRef = useRef();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/AllRegUsersData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('User data:', response.data); // 🐛 Check the structure here
        const userArray = Array.isArray(response.data)
          ? response.data
          : response.data.users || response.data.AllUsers || response.data.FindUser || [];
  
        setUsers(userArray);
      } catch (error) {
        console.error('Error fetching user list:', error);
        setUsers([]); // ensure fallback to empty array
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

  const handleDownloadPDF = async () => {
    const element = slipRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`SalarySlip_${salaryData.name}_${salaryData.year}_${salaryData.month}.pdf`);
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Admin Salary Payment Viewer</h3>

      {/* Selection Form */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="align-items-end g-3">
          <Col md={4}>
            <Form.Group controlId="userSelect">
              <Form.Label>Select User</Form.Label>
              <Form.Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">-- Select User --</option>
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
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
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
          <div ref={slipRef} style={{ backgroundColor: 'white', padding: '20px' }}>
            <Card className="p-3">
              <Card.Header as="h5">Salary Slip - {salaryData.name}</Card.Header>
              <Card.Body>
                <Row>
                  <Col><strong>Year:</strong> {salaryData.year}</Col>
                  <Col><strong>Month:</strong> {salaryData.month}</Col>
                </Row>
                <hr />
                <Row>
                  <Col md={6}>
                    <p><strong>Basic Salary:</strong> Rs. {salaryData.BasicSal}</p>
                    <p><strong>Allowance:</strong> Rs. {salaryData.allowance}</p>
                    <p><strong>Service Charge:</strong> Rs. {salaryData.serviceCharge}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>EPF:</strong> Rs. {salaryData.EPF}</p>
                    <p><strong>ETF:</strong> Rs. {salaryData.ETF}</p>
                    <p><strong>No Pay:</strong> Rs. {Number(salaryData.NoPay).toFixed(2)}</p>
                    <p><strong>Half Days:</strong> {salaryData.NumberOfHalfDays}</p>
                  </Col>
                </Row>
                <hr />
                <h5 className="text-success">Net Salary: Rs. {Number(salaryData.NetSalary).toFixed(2)}</h5>
              </Card.Body>
            </Card>
          </div>

          <div className="mt-3 text-end">
            <Button variant="secondary" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </div>
        </>
      ):(
        <div className="text-center mt-4">
        <p className="text-muted">No salary data found. Please select a user, year, and month.</p>
      </div>
      )}
    </Container>
  );
}

export default AdminSalaryViewer;
