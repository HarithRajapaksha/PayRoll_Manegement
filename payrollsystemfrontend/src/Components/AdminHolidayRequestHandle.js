import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  Modal,
  Form,
  Card,
  Badge,
  Spinner,
  Container,
} from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './ChangebgColour.css'; 

const AdminHolidayRequestHandle = () => {
  const [holidayData, setHolidayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [currentHolidayId, setCurrentHolidayId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:3006/api/users/HolidayData',
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHolidayData(data);
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const updateLeave = async ({ id, status, declineReason = '' }) => {
    await axios.put(
      'http://localhost:3006/api/users/updateLeave',
      { id, status, declineReason },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setHolidayData((prev) => prev.filter((item) => item._id !== id));
  };

  const handleAccept = (id) => updateLeave({ id, status: true });

  const handleDecline = (id) => {
    setCurrentHolidayId(id);
    setShowModal(true);
  };

  const handleDeclineSubmit = async () => {
    if (!declineReason.trim()) return alert('Please enter a decline reason.');
    await updateLeave({ id: currentHolidayId, status: false, declineReason });
    setShowModal(false);
    setDeclineReason('');
  };

  return (
    <div className="page-bg">
    <Container className="py-4">
      <Card
        style={{
          background: 'linear-gradient(135deg, #eef3ff, #ffffff)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            fontWeight: '700',
            color: '#121313ff',
            textAlign: 'center',
            marginBottom: '25px',
          }}
        >
          Incoming Leave Requests
        </h3>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            style={{
              textAlign: 'center',
              borderCollapse: 'collapse',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <thead style={{ backgroundColor: '#212529', color: '#fff' }}>
              <tr>
                <th>#</th>
                <th>EMP‑ID</th>
                <th>Name</th>
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {holidayData.length ? (
                holidayData.map((h, i) => (
                  <tr
                    key={h._id}
                    style={{
                      transition: 'background-color 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f8ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                    }}
                  >
                    <td>{i + 1}</td>
                    <td>
                      <Badge bg="secondary">{h.CorrectuserId || 'N/A'}</Badge>
                    </td>
                    <td style={{ fontWeight: '600' }}>{h.Name}</td>
                    <td>{new Date(h.LeaveStartDate).toLocaleDateString()}</td>
                    <td>{new Date(h.LeaveEndDate).toLocaleDateString()}</td>
                    <td>
                      <Badge
                        bg={
                          h.NumOfDay > 5 ? 'danger' : h.NumOfDay > 2 ? 'warning' : 'info'
                        }
                      >
                        {h.NumOfDay}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="success"
                        style={{
                          marginRight: '10px',
                          transition: 'transform 0.2s ease',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = 'scale(1.05)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = 'scale(1)')
                        }
                        onClick={() => handleAccept(h._id)}
                      >
                        <FaCheckCircle className="me-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        style={{
                          transition: 'transform 0.2s ease',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = 'scale(1.05)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = 'scale(1)')
                        }
                        onClick={() => handleDecline(h._id)}
                      >
                        <FaTimesCircle className="me-1" />
                        Decline
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ color: '#6c757d' }}>
                    No holiday requests at the moment
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Decline Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
          }}
        >
          <Modal.Title>Decline Holiday Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="declineReason">
            <Form.Label style={{ fontWeight: '600' }}>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Please provide a brief explanation…"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeclineSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
};

export default AdminHolidayRequestHandle;
