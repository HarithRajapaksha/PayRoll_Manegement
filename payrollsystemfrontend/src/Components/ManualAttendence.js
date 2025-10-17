import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function ManualAttendence() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    try {
      const response = await axios.get('http://localhost:3006/api/users/allUsersData', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.FindUser); // Assuming response.data.FindUser is an array of user objects with 'id' and 'name' fields
      console.log('Fetched users:', response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      Swal.fire('Error', 'Failed to fetch users', 'error');
    }
  };

  const handleUserSelect = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedUser || !date || !time) {
      Swal.fire('Error', 'Please select an employee, date, and time', 'error');
      return;
    }
    // Here you can add the actual API call to submit attendance if needed
    // For now, always show success as per requirement
    Swal.fire('Success', 'Attendance added successfully for the selected employee', 'success');
    // Reset form
    setSelectedUser('');
    setDate('');
    setTime('');
  };

  return (
    <div className='page-bg'>
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Manual Attendance</h4>
            </div>
            <div className="card-body">
              <h5 className="card-title">Select Employee</h5>
              <div className="mb-4">
                <label htmlFor="userSelect" className="form-label">Choose Employee</label>
                <select
                  className="form-select"
                  id="userSelect"
                  value={selectedUser}
                  onChange={handleUserSelect}
                >
                  <option value="">Select an employee...</option>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.username || `Employee ${user.id}`} {/* Adjust field as per API response */}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading employees...</option>
                  )}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="dateInput" className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateInput"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="timeInput" className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    id="timeInput"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <button className="btn btn-primary w-100" onClick={handleSubmit}>
                Add Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
 </div>
  );
}

export default ManualAttendence;