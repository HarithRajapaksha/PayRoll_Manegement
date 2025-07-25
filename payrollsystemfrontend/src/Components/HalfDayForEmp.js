import React, { useState, useEffect } from 'react';
import { Table, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

function HalfDayForEmp() {
  const [halfDayData, setHalfDayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // Fetch half-day data
  useEffect(() => {
    const fetchHalfDayData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:3006/api/users/halfday-data/688121a6775b929144bbb8ca',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
        setHalfDayData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch half-day data');
        setLoading(false);
      }
    };

    fetchHalfDayData();
  }, []);

  return (
    <div className="page-bg">
    <Container className="py-5">
      <h2 className="text-center mb-4">Half-Day Requests - {currentMonth} {currentYear}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : halfDayData.length === 0 ? (
        <Alert variant="info">No half-day requests found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>EmpID</th>
              <th>EmpName</th>
              <th>Reason</th>
              <th>WhichHalf</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {halfDayData.map((request) => (
              <tr key={request._id}>
                <td>{request.EmpID}</td>
                <td>{request.EmpName}</td>
                <td>{request.reason}</td>
                <td>{request.whichHalf}</td>
                <td>
                  {request.status === 'Non' ? (
                    <span className="badge bg-warning text-dark">Pending</span>
                  ) : request.status === true ? (
                    <span className="badge bg-success">Accept</span>
                  ) : (
                    <span className="badge bg-danger">Rejected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
    </div>
  );
}

export default HalfDayForEmp;