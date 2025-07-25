import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

function UserLeavesStatus() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // Replace with your actual token retrieval logic (e.g., from localStorage)
  const token = localStorage.getItem('token');
  const userId = jwtDecode(token).empId; // From decoded token
  console.log('User ID:', userId);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3006/api/users/leave-data/${userId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLeaves(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leave data:', error);
        setError('Failed to load leave data. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="page-bg">
    <div className="container mt-4">
      <h2 className="mb-4">Leave Status - {currentMonth} {currentYear}</h2>
      <div className="table-responsive">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : leaves.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No leave data available.
          </div>
        ) : (
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>EMP ID</th>
                <th>Leave Number of Days</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Reason for Decline</th>
                <th>Reason for Request Leave</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave._id}>
                  <td>{leave.CorrectuserId}</td>
                  <td>{leave.NumOfDay}</td>
                  <td>{formatDate(leave.LeaveStartDate)}</td>
                  <td>{formatDate(leave.LeaveEndDate)}</td>
                  <td>
                    {leave.status === undefined || leave.status === null ? (
                      <span className="badge bg-warning text-dark">Pending</span>
                    ) : leave.status === true || leave.status === 'true' ? (
                      <span className="badge bg-success">Accept</span>
                    ) : (
                      <span className="badge bg-danger">Rejected</span>
                    )}
                  </td>
                  <td>{leave.declineReason}</td>
                  <td>
                    {(leave.status === undefined || leave.status === null || leave.status === true || leave.status === 'true')
                      ? ''
                      : leave.Reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </div>
  );
}

export default UserLeavesStatus;