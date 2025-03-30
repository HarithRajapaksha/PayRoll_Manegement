import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

function AllUsersSallaryHandle() {
  const [allData, setAllData] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [serviceCharges, setServiceCharges] = useState({});
  const [selectedAllowances, setSelectedAllowances] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/allUsersData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setAllData(response.data.FindUser);
      } catch (error) {
        console.error('Error fetching all users data:', error);
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

    getUsersDetails();
    getAllowanceData();
  }, [token]);

  useEffect(() => {
    if (allData.length > 0) {
      const getPaymentStatus = async () => {
        try {
          const statusData = {};
          for (let user of allData) {
            const response = await axios.get(`http://localhost:3006/api/users/getAllPaymentData/${user._id}`, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.data.paymentData.length > 0) {
              statusData[user._id] = response.data.paymentData[0].status === 'true';
            } else {
              statusData[user._id] = false;
            }
          }
          setPaymentStatus(statusData);
        } catch (error) {
          console.error('Error fetching payment status:', error);
        }
      };
      getPaymentStatus();
    }
  }, [allData, token]);

  const handleSubmit = async (userId) => {
    try {
      const selectedAllowanceId = selectedAllowances[userId];
      const selectedAllowance = allowances.find(
        (a) => a._id === selectedAllowanceId
      );
      const allowancePrice = selectedAllowance ? selectedAllowance.price : 0;
  
      const data = {
        userId: userId,
        serviceCharge: serviceCharges[userId] || 0,
        allowance: allowancePrice, // now sending allowance price instead of ID
      };
  
      await axios.post('http://localhost:3006/api/users/addPaymentData', data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      Swal.fire('Success', 'Paid', 'success');
      setPaymentStatus((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error('Error saving data:', error);
      Swal.fire('', 'Please double-check your payment', 'error');
    }
  };
  
  const handleServiceChargeChange = (e, userId) => {
    setServiceCharges((prev) => ({
      ...prev,
      [userId]: e.target.value,
    }));
  };

  const handleAllowanceChange = (e, userId) => {
    setSelectedAllowances((prev) => ({
      ...prev,
      [userId]: e.target.value,
    }));
  };

  return (
    <div className="d-flex justify-content-center" style={{ marginTop: '50px' }}>
      <div className="table-responsive" style={{ maxWidth: '1200px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>Allowance and Service Charge Handler</h3>
        </div>
        <Table striped bordered hover variant="dark" className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Basic Salary</th>
              <th>Service Charge</th>
              <th>Allowance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(allData) && allData.length > 0 ? (
              allData.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.basicSal}</td>

                  <td>
                    <Form.Control
                      type="number"
                      value={serviceCharges[item._id] || ''}
                      onChange={(e) => handleServiceChargeChange(e, item._id)}
                      placeholder="Enter Service Charge"
                      disabled={paymentStatus[item._id]}
                    />
                  </td>

                  <td>
                    <Form.Select
                      value={selectedAllowances[item._id] || ''}
                      onChange={(e) => handleAllowanceChange(e, item._id)}
                      disabled={paymentStatus[item._id]}
                    >
                      <option value="">Select Allowance</option>
                      {Array.isArray(allowances) &&
                        allowances.map((allowance) => (
                          <option key={allowance._id} value={allowance._id}>
                            {allowance.allowanceName} - {allowance.price}
                          </option>
                        ))}
                    </Form.Select>
                  </td>

                  <td>
                    {paymentStatus[item._id] ? (
                      <Button variant="secondary" disabled>
                        Paid
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={() => handleSubmit(item._id)}>
                        Save
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No user data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default AllUsersSallaryHandle;
