import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const SalaryRequestForm = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');
  const uid = jwtDecode(token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/AllLeaveData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setAllData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Data fetch Error:', error);
      }
    };

    fetchData();
  }, [token, uid.id]);

  const handleAccept = async (id) => {
    try {
      const data = {
        id: id,
        Status: true,
        declineReason: ''
      };

      const response = await axios.put('http://localhost:3006/api/users/updateMiddleSal', data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Accepted:', response.data);

      // Update status in state
      setAllData(prev =>
        prev.map(item =>
          item._id === id ? { ...item, Status: true } : item
        )
      );
    } catch (error) {
      console.error('Error accepting salary:', error);
    }
  };

  const handleDeclineClick = (id) => {
    setCurrentId(id);
    setShowModal(true);
  };

  const handleDeclineSubmit = async () => {
    if (!declineReason.trim()) {
      alert("Please enter a reason before declining.");
      return;
    }

    try {
      const data = {
        id: currentId,
        Status: false,
        declineReason: declineReason
      };

      const response = await axios.put('http://localhost:3006/api/users/updateMiddleSal', data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Declined:', response.data);

      // Update status in state
      setAllData(prev =>
        prev.map(item =>
          item._id === currentId ? { ...item, Status: false, declineReason } : item
        )
      );

      setDeclineReason('');
      setShowModal(false);
    } catch (error) {
      console.error('Error declining salary:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Monthly Middle Salary Requests</h2>
      <Table striped bordered hover responsive>
        <thead className="table-dark text-center">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Role</th>
            <th>Requested Salary</th>
            <th>Status / Actions</th>
          </tr>
        </thead>
        <tbody>
          {allData.length > 0 ? (
            allData.map((SalData, index) => (
              <tr key={SalData._id}>
                <td>{index + 1}</td>
                <td>{SalData.Name}</td>
                <td>{SalData.Role}</td>
                <td>Rs {SalData.Salary}</td>
                <td className="text-center">
                  {SalData.Status === 'true' ? (
                    <span className="text-success fw-bold">Accepted</span>
                  ) : SalData.Status === 'false' ? (
                    <span className="text-danger fw-bold">Declined</span>
                  ) : (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleAccept(SalData._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeclineClick(SalData._id)}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No salary requests available</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Decline Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Decline Salary Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="declineReason">
            <Form.Label>Reason for Decline</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Enter reason..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeclineSubmit}>
            Submit Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SalaryRequestForm;
