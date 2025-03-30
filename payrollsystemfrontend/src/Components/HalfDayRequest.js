import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap'; // Import Modal and Button from Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const HalfDayRequest = () => {
  const [holidayData, setHolidayData] = useState([]); // To store half-day requests
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [declineReason, setDeclineReason] = useState(''); // To store the reason for decline
  const [currentHolidayId, setCurrentHolidayId] = useState(null); // To store the selected request when declined
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/getAllUsersHalfDayData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Half Day Data:', response.data); // Debugging line

        // Check if the response contains the expected data
        if (response.data && Array.isArray(response.data.users)) {
          setHolidayData(response.data.users); // Set the data for the table
        } else {
          console.error('Response data is not in the expected format:', response.data);
          setHolidayData([]); // Fallback to empty array if data is not as expected
        }
      } catch (error) {
        console.error('Data fetch Error:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleAccept = async (id) => {
    try {
      const data = {
        status: 'true', // set status to 'true' when accepted
        reason: ''
      };

      const response = await axios.put(`http://localhost:3006/api/users/updateHalfDayData/${id}`, data, {
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
        status: 'false', // set status to 'false' when declined
        reason: declineReason,
      };

      const response = await axios.put(`http://localhost:3006/api/users/updateHalfDayData/${currentHolidayId}`, data, {
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
      <h2 className="mb-4 text-center">HALF-DAY Request Handle</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Which Half</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {holidayData.length > 0 ? (
            holidayData.map((holiday, index) => (
              <tr key={holiday._id}>
                <td>{holiday.name}</td>
                <td>{new Date(holiday.date).toLocaleDateString()}</td>
                <td>{holiday.whichHalf}</td>
                <td>
                  {holiday.status === 'Non' ? (  // Show buttons when status is 'Non'
                    <>
                      <Button variant="success" className="me-2" onClick={() => handleAccept(holiday._id)}>
                        Accept
                      </Button>
                      <Button variant="danger" onClick={() => handleDecline(holiday._id)}>
                        Decline
                      </Button>
                    </>
                  ) : (
                    <span>{holiday.status === 'true' ? 'Accepted' : 'Declined'}</span>
                  )}
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

export default HalfDayRequest;
