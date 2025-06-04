import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const rolesList = [
  'Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3006/api/users/allUsersData', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data.FindUser || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectChange = (e) => {
    const userId = e.target.value;
    const user = users.find((u) => u._id === userId);
    setSelectedUser(user);
  };

  const openEditModal = () => {
    if (selectedUser) {
      setEditRole(selectedUser.role || '');
      setEditSalary(selectedUser.basicSal || '');
      setShowModal(true);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3006/api/users/updateRoleSal/${selectedUser._id}`,
        { role: editRole, basicSal: editSalary },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      Swal.fire('Success', response.data.message, 'success');
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary fw-bold">User Management Panel</h2>

      <div className="mb-4">
        <select className="form-select shadow-sm rounded-3" onChange={handleSelectChange} defaultValue="">
          <option disabled value="">🔍 Select a user</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} | {user.role} | {user.CorrectuserId || 'N/A'}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div className="card shadow rounded-4 p-4 border-0 bg-white">
          <h5 className="text-center text-primary mb-4">👤 User Details</h5>
          <div className="row gy-3 fs-6">
            <div className="col-md-6"><strong>Name:</strong> {selectedUser.name}</div>
            <div className="col-md-6"><strong>Role:</strong> {selectedUser.role}</div>
            <div className="col-md-6"><strong>Telephone:</strong> {selectedUser.telephone}</div>
            <div className="col-md-6"><strong>NIC:</strong> {selectedUser.nic}</div>
            <div className="col-12 text-center">
              <strong>Correct User ID:</strong>
              <div className="mt-1 text-muted fw-semibold">
                {selectedUser.CorrectuserId || 'N/A'}
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-outline-primary px-4 rounded-pill" onClick={openEditModal}>
              ✏️ Edit Details
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-primary text-white rounded-top-4">
                <h5 className="modal-title">Edit User Role & Salary</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option disabled value="">Select role</option>
                    {rolesList.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Basic Salary</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                    placeholder="Enter new salary"
                  />
                </div>
              </div>
              <div className="modal-footer bg-light rounded-bottom-4 d-flex justify-content-between">
                <button className="btn btn-secondary px-4 rounded-pill" onClick={() => setShowModal(false)}>
                  ❌ Cancel
                </button>
                <button className="btn btn-success px-4 rounded-pill" onClick={handleUpdate}>
                  ✅ Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
