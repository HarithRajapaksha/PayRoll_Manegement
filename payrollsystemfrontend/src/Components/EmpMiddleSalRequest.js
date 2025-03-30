import React from 'react'
import {jwtDecode} from "jwt-decode";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';


function EmpMiddleSalRequest() {

    const [jobRole, setJobRole] = useState('');
    const [reason, setReason] = useState('');
    const [FetchuserData, setUserData] = useState(null);



  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token); 
  console.log("Decoded Token:",decoded);

    

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `http://localhost:3006/api/users/admin/${decoded.id}`,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("User data:", response.data.FindUser);
            setUserData(response.data.FindUser.name);
            setJobRole(response.data.FindUser.role);
          } catch (error) {
            console.log("data fetch Error:", error);
          }
        };
    
        fetchData();
      }, [decoded.id,token]);


        const handleSubmit = async (e) => {
            e.preventDefault();

            const data = {
              Uid: decoded.id,
              Name: FetchuserData,
              Role:jobRole,
              Salary: reason,
            };

            try {
              const response = await axios.post('http://localhost:3006/api/users/AddAdditionalSal', data, {
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log('Middle Salary Added:', response.data);
            } catch (error) {
              console.error('Middle Salary Added Error:', error);
            }
        };


  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <div style={{ width: '100%', maxWidth: '500px', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 className="text-center mb-4">Advance Payment Request Form</h2>
      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="name">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            disabled
            value={FetchuserData}
          />
        </Form.Group>

        <Form.Group controlId="jobRole">
          <Form.Label>Job Role</Form.Label>
          <Form.Control
            type="text"
            value={jobRole}
            disabled
            required
          />
        </Form.Group>

        <Form.Group controlId="RequestSalary">
  <Form.Label>Request Salary</Form.Label>
  <Form.Select
    value={reason}
    onChange={(e) => setReason(e.target.value)}
    required
  >
    <option value="">Select Salary</option>
    <option value="5000">5000</option>
    <option value="10000">10000</option>
    <option value="15000">15000</option>
  </Form.Select>
</Form.Group>


        <div className="d-flex justify-content-center mt-4">
          <Button variant="primary" type="submit" style={{ width: '150px' }}>
            Submit Request
          </Button>
        </div>
      </Form>
    </div>
  </Container>
  )
}

export default EmpMiddleSalRequest
