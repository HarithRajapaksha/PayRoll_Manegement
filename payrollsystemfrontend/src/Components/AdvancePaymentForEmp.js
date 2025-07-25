import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ChangebgColour.css'; 
import {jwtDecode} from 'jwt-decode';


function AdvancePaymentForEmp() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // Replace this with your actual token retrieval logic (e.g., from localStorage)
  const token = localStorage.getItem('token') ;
  const decode = jwtDecode(token);
    const userId = decode.id; // Assuming the token contains user ID

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3006/api/users/middle-salary/${userId}`, {
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
        setEmployees(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-bg">
    <div className="container mt-4">
      <h2 className="mb-4">Advance Payment - {currentMonth} {currentYear}</h2>
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
        ) : employees.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No data available.
          </div>
        ) : (
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>EMP ID</th>
                <th>Name</th>
                <th>Advance Amount</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee._id}>
                  <td>{employee.EmpId}</td>
                  <td>{employee.Name}</td>
                  <td>{employee.Salary}</td>
                  <td>
                    {employee.Status === 'Non' ? (
                      <span className="badge bg-warning text-dark">Pending</span>
                    ) : employee.Status === "true" ? (
                      <span className="badge bg-success">Accept</span>
                    ) : (
                      <span className="badge bg-danger">Reject</span>
                    )}
                  </td>
                  <td>{employee.Status === 'Non' || employee.Status === true ? '' : employee.Reason}</td>
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

export default AdvancePaymentForEmp;