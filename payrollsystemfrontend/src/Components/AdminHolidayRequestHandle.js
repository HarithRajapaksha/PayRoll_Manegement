import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';

const AdminHolidayRequestHandle = () => {
  const [holidayData, setHolidayData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [currentHolidayId, setCurrentHolidayId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/HolidayData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setHolidayData(response.data);
      } catch (error) {
        console.error('Data fetch Error:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleAccept = async (id) => {
    try {
      const data = {
        id: id,
        status: true,
        declineReason: ''
      };

      const response = await axios.put('http://localhost:3006/api/users/updateLeave', data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Leave accepted:', response.data);
      // Remove accepted leave from list
      setHolidayData(prevData => prevData.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error accepting leave:', error);
    }
  };

  const handleDecline = (id) => {
    setCurrentHolidayId(id);
    setShowModal(true);
  };

  const handleDeclineSubmit = async () => {
    if (!declineReason.trim()) {
      alert("Please enter a decline reason.");
      return;
    }

    try {
      const data = {
        id: currentHolidayId,
        status: false,
        declineReason
      };

      const response = await axios.put('http://localhost:3006/api/users/updateLeave', data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Leave declined:', response.data);
      setHolidayData(prevData => prevData.filter(item => item._id !== currentHolidayId));
      setShowModal(false);
      setDeclineReason('');
    } catch (error) {
      console.error('Error declining leave:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Full Leave Request Handle</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Leave Holder</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Number of Days</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {holidayData.length > 0 ? (
            holidayData.map((holiday, index) => (
              <tr key={holiday._id}>
                <td>{index + 1}</td>
                <td>{holiday.Name}</td>
                <td>{new Date(holiday.LeaveStartDate).toLocaleDateString()}</td>
                <td>{new Date(holiday.LeaveEndDate).toLocaleDateString()}</td>
                <td>{holiday.NumOfDay}</td>
                <td>
                  <Button variant="success" className="me-2" onClick={() => handleAccept(holiday._id)}>
                    Accept
                  </Button>
                  <Button variant="danger" onClick={() => handleDecline(holiday._id)}>
                    Decline
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No holiday requests available</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Decline Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Decline Holiday Request</Modal.Title>
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
            Close
          </Button>
          <Button variant="danger" onClick={handleDeclineSubmit}>
            Submit Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminHolidayRequestHandle;
