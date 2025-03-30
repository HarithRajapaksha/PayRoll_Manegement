import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function GetTheAllUsersSalDat() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const token = localStorage.getItem('token');
  const userId = jwtDecode(token); // Decode token to get user info
  const slipRef = useRef();
  const id = userId.id; // Get user ID from decoded token

  const fetchSalaryData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3006/api/users/getSalData/${id}/${year}/${month}`,
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
    if (month) fetchSalaryData();
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
      <h3 className="text-center mb-4">Get Salary Payment Slip</h3>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="align-items-end">
          <Col md={5}>
            <Form.Group controlId="year">
              <Form.Label>Select Year</Form.Label>
              <Form.Control
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group controlId="month">
              <Form.Label>Select Month</Form.Label>
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

      {salaryData ? (
        <>
          <div ref={slipRef} style={{ background: 'white', padding: '20px' }}>
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
      ):( <div className="text-center mt-4">
        <p className="text-muted">No salary data found. Please select a user, year, and month.</p>
      </div>)}
    </Container>
  );
}

export default GetTheAllUsersSalDat;
