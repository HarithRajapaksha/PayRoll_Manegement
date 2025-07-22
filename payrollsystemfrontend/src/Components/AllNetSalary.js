import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Table, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ChangebgColour.css'; // Import custom CSS for background color
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AllNetSalary() {
  const [payrollData, setPayrollData] = useState([]);
  const [summations, setSummations] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Month names for dropdown
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchPayrollData = async () => {
    if (!year || !month || year < 2000 || year > 2100 || month < 1 || month > 12) {
      setError('Please select a valid year and month');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3006/api/users/payroll/${year}/${month}`, {
        headers: {
          Accept: 'application/json',
        },
      });
      console.log('Payroll Data:', response.data.payroll);
      console.log('Summations:', response.data.summations);
      setPayrollData(response.data.payroll || []);
      setSummations(response.data.summations || {});
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      setError(error.response?.data?.error || 'Failed to fetch payroll data');
      setPayrollData([]);
      setSummations({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [year, month]);

  // Helper function to format numbers, handling strings, undefined, or null
  const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Helper function to display EPF/ETF values or hyphen for casual employees
  const displayEPFETF = (value, empType) => {
    return empType?.toLowerCase() === 'casual' ? '-' : formatNumber(value);
  };

  // Function to generate and download PDF
  const downloadPDF = () => {
    try {
      // Validate data
      if (!payrollData.length || !summations) {
        throw new Error('No payroll data available to generate PDF');
      }

      // Validate month
      if (!monthNames[month - 1]) {
        throw new Error('Invalid month selected');
      }

      const doc = new jsPDF();

      // Add header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Karnovo', 105, 20, { align: 'center' });
      doc.setFontSize(14);
      doc.text(`Payroll Report for ${monthNames[month - 1]} ${year}`, 105, 30, { align: 'center' });

      // Prepare table data
      const tableBody = payrollData.map((employee, index) => {
        if (!employee) {
          console.warn(`Invalid employee data at index ${index}`);
          return ['N/A', 'Unknown', 'N/A', 'N/A', '0.00', '0.00', '0.00', '0.00', '-', '-', '-', '0.00'];
        }
        return [
          employee.empId || 'N/A',
          employee.empName || 'Unknown',
          employee.jobRole || 'N/A',
          employee.empType || 'N/A',
          formatNumber(employee.basicSalary),
          formatNumber(employee.allowance),
          formatNumber(employee.serviceCharge),
          formatNumber(employee.noPay),
          displayEPFETF(employee.employeeEPF, employee.empType),
          displayEPFETF(employee.employerEPF, employee.empType),
          displayEPFETF(employee.employeeETF, employee.empType),
          formatNumber(employee.netSalary)
        ];
      });

      // Prepare footer (total row)
      const footerRow = [
        { content: 'Total', colSpan: 4, styles: { halign: 'left', fontStyle: 'bold' } },
        formatNumber(summations.totalBasicSalary || 0),
        formatNumber(summations.totalAllowance || 0),
        formatNumber(summations.totalServiceCharge || 0),
        formatNumber(summations.totalNoPayAmount || 0),
        formatNumber(summations.totalEmployeeEPF || 0),
        formatNumber(summations.totalEmployerEPF || 0),
        formatNumber(summations.totalEmployeeETF || 0),
        formatNumber(summations.totalNetSalary || 0)
      ];

      // Generate table
      autoTable(doc, {
        startY: 40,
        head: [[
          'Emp ID', 'Name', 'Job Role', 'Emp Type', 'Basic Salary (Rs.)',
          'Allowance (Rs.)', 'Service Charge (Rs.)', 
          'Employee EPF (Rs.)', 'Employer EPF (Rs.)', 'Employee ETF (Rs.)',
          'Net Salary (Rs.)'
        ]],
        body: tableBody,
        foot: [footerRow],
        theme: 'grid',
        headStyles: {
          fillColor: [33, 37, 41], // Dark gray (table-dark)
          textColor: [255, 255, 255], // White text
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [33, 37, 41]
        },
        footStyles: {
          fillColor: [200, 200, 200], // Gray for total row
          fontStyle: 'bold',
          fontSize: 9,
          textColor: [33, 37, 41]
        },
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'right' },
          5: { halign: 'right' },
          6: { halign: 'right' },
          7: { halign: 'right' },
          8: { halign: 'right' },
          9: { halign: 'right' },
          10: { halign: 'right' },
          11: { halign: 'right' }
        },
        margin: { top: 40, left: 10, right: 10 }
      });

      // Save PDF
      doc.save(`Payroll_${monthNames[month - 1]}_${year}.pdf`);
    } catch (error) {
      console.error('Detailed PDF generation error:', error.message, error.stack);
      setError(`Failed to generate PDF: ${error.message}`);
    }
  };

  return (
    <div className="page-bg">
      <Container className="mt-5">
        <h3 className="text-center mb-4">All Employees Salary Details</h3>

        {/* Year and Month Selection Form */}
        <Form onSubmit={(e) => { e.preventDefault(); fetchPayrollData(); }} className="mb-4">
          <Row className="align-items-end g-3">
            <Col md={4}>
              <Form.Group controlId="year">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2000"
                  max="2100"
                  placeholder="Enter year"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
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
            <Col md={4}>
              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? 'Fetching...' : 'Fetch Payroll'}
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Download PDF Button */}
        {payrollData.length > 0 && (
          <div className="text-center mb-4">
            <Button
              variant="success"
              onClick={downloadPDF}
              disabled={loading}
              className="px-4"
            >
              Download PDF
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {/* Salary Table */}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : payrollData.length > 0 ? (
          <div className="table-responsive">
            <Table bordered striped>
              <thead className="table-dark">
                <tr>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Job Role</th>
                  <th>Emp Type</th>
                  <th>Basic Salary (Rs.)</th>
                  <th>Allowance (Rs.)</th>
                  <th>Service Charge (Rs.)</th>
                  <th>Employee EPF (Rs.)</th>
                  <th>Employer EPF (Rs.)</th>
                  <th>Employee ETF (Rs.)</th>
                  <th>Net Salary (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((employee, index) => (
                  <tr key={index} className="text-center">
                    <td>{employee.empId || 'N/A'}</td>
                    <td>{employee.empName || 'Unknown'}</td>
                    <td>{employee.jobRole || 'N/A'}</td>
                    <td>{employee.empType || 'N/A'}</td>
                    <td>{formatNumber(employee.basicSalary)}</td>
                    <td>{formatNumber(employee.allowance)}</td>
                    <td>{formatNumber(employee.serviceCharge)}</td>
                    <td>{displayEPFETF(employee.employeeEPF, employee.empType)}</td>
                    <td>{displayEPFETF(employee.employerEPF, employee.empType)}</td>
                    <td>{displayEPFETF(employee.employeeETF, employee.empType)}</td>
                    <td>{formatNumber(employee.netSalary)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-secondary fw-bold text-center">
                  <td colSpan="4">Total</td>
                  <td>{formatNumber(summations.totalBasicSalary)}</td>
                  <td>{formatNumber(summations.totalAllowance)}</td>
                  <td>{formatNumber(summations.totalServiceCharge)}</td>
                  <td>{formatNumber(summations.totalEmployeeEPF)}</td>
                  <td>{formatNumber(summations.totalEmployerEPF)}</td>
                  <td>{formatNumber(summations.totalEmployeeETF)}</td>
                  <td>{formatNumber(summations.totalNetSalary)}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        ) : (
          <p className="text-center text-muted">No salary data found for the selected year and month.</p>
        )}
      </Container>
    </div>
  );
}

export default AllNetSalary;