import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col, Container, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

function AdminSalaryViewer() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState('');
  const [editBasicSal, setEditBasicSal] = useState('');
  const token = localStorage.getItem('token');

  const roles = [
    'Admin',
    'Manager',
    'Headchef',
    'Subchef',
    'Supervisor',
    'Waiter',
    'Helper',
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/AllRegUsersData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const userArray = Array.isArray(response.data)
          ? response.data
          : response.data.users || response.data.AllUsers || response.data.FindUser || [];

        setUsers(userArray);
      } catch (error) {
        console.error('Error fetching user list:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [token]);

  const handleSelectUser = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);

    const user = users.find((u) => u._id === userId);
    setSelectedUser(user || null);
  };

  const handleEdit = () => {
    if (selectedUser) {
      setEditRole(selectedUser.role);
      setEditBasicSal(selectedUser.basicSal || '');
      setShowModal(true);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3006/api/users/updateUserRoleAndSalary/${selectedUserId}`,
        {
          role: editRole,
          basicSal: editBasicSal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUsers = users.map((user) =>
        user._id === selectedUserId
          ? { ...user, role: editRole, basicSal: editBasicSal }
          : user
      );

      setUsers(updatedUsers);
      setSelectedUser((prev) => ({ ...prev, role: editRole, basicSal: editBasicSal }));
      setShowModal(false);

      Swal.fire({
        icon: 'success',
        title: 'Updated Successfully',
        text: 'User role and salary have been updated.',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the user.',
      });
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Employee Details Handler</h3>

      <Form className="mb-4">
        <Row className="align-items-end g-3">
          <Col md={6}>
            <Form.Group controlId="userSelect">
              <Form.Label>Select Employee</Form.Label>
              <Form.Select value={selectedUserId} onChange={handleSelectUser}>
                <option value="">-- Select Employee --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role}) - {user.CorrectuserId}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {selectedUser ? (
        <Card className="p-4 mb-4">
          <Card.Header as="h5">Employee Details</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}><strong>Name:</strong> {selectedUser.name}</Col>
              <Col md={6}><strong>Employee Number:</strong> {selectedUser.CorrectuserId}</Col>
            </Row>
            <Row className="mt-2">
              <Col md={6}><strong>Role:</strong> {selectedUser.role}</Col>
              <Col md={6}><strong>Basic Salary:</strong> Rs. {selectedUser.basicSal}</Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <p className="text-muted text-center">Please select a user to view details.</p>
      )}

      {selectedUser && (
        <div className="text-center">
          <Button variant="warning" onClick={handleEdit}>Edit</Button>
        </div>
      )}

      {/* Bootstrap Modal for Editing */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editRole" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                <option value="">-- Select Role --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="editBasicSal">
              <Form.Label>Basic Salary (Rs.)</Form.Label>
              <Form.Control
                type="number"
                value={editBasicSal}
                onChange={(e) => setEditBasicSal(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminSalaryViewer;
