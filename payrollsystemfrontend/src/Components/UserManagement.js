import React, { useEffect, useState } from 'react';

const rolesList = [
  'Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'
];

const genderOptions = ['Male', 'Female'];
const maritalStatusOptions = ['Single', 'Married'];
const empTypeOptions = ['Permanent', 'Casual'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [genderFilter, setGenderFilter] = useState('');
  const [maritalStatusFilter, setMaritalStatusFilter] = useState('');
  
  // Edit form states
  const [editData, setEditData] = useState({
    role: '',
    basicSal: '',
    telephone: '',
    address: '',
    maritalStatus: '',
    empType: '',
    bankName: '',
    bankBranch: '',
    accountNo: ''
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, genderFilter, maritalStatusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3006/api/users/allUsersData', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.FindUser || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];
    
    if (genderFilter) {
      filtered = filtered.filter(user => 
        user.gender && user.gender.toLowerCase() === genderFilter.toLowerCase()
      );
    }
    
    if (maritalStatusFilter) {
      filtered = filtered.filter(user => 
        user.maritalStatus && user.maritalStatus.toLowerCase() === maritalStatusFilter.toLowerCase()
      );
    }
    
    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setGenderFilter('');
    setMaritalStatusFilter('');
    setSelectedUser(null);
  };

  const handleSelectChange = (e) => {
    const userId = e.target.value;
    const user = filteredUsers.find((u) => u._id === userId);
    setSelectedUser(user);
  };

  const openEditModal = () => {
    if (selectedUser) {
      setEditData({
        role: selectedUser.role || '',
        basicSal: selectedUser.basicSal || '',
        telephone: selectedUser.telephone || '',
        address: selectedUser.address || '',
        maritalStatus: selectedUser.maritalStatus || '',
        empType: selectedUser.empType || '',
        bankName: selectedUser.bankName || '',
        bankBranch: selectedUser.bankBranch || '',
        accountNo: selectedUser.accountNo || ''
      });
      setShowModal(true);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3006/api/users/updateRoleSal/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const result = await response.json();
      alert('Employee details updated successfully!');
      
      setShowModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the data
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update employee details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark mb-2">Employee Management</h1>
          <p className="text-muted fs-5">Manage your team efficiently</p>
          <hr className="w-25 mx-auto border-dark border-2" />
        </div>

        {/* Filters Card */}
        <div className="card border-2 border-dark mb-4" style={{ borderRadius: '0' }}>
          <div className="card-body p-4">
            <h4 className="mb-4 text-dark fw-bold border-bottom border-dark pb-2">Filters</h4>
            
            <div className="row g-4">
              <div className="col-lg-4">
                <label className="form-label fw-semibold text-dark mb-2">Filter by Gender</label>
                <select 
                  className="form-select form-select-lg border-2 border-dark" 
                  style={{ borderRadius: '0', backgroundColor: 'white' }}
                  value={genderFilter} 
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="">All Genders</option>
                  {genderOptions.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-lg-4">
                <label className="form-label fw-semibold text-dark mb-2">Marital Status</label>
                <select 
                  className="form-select form-select-lg border-2 border-dark" 
                  style={{ borderRadius: '0', backgroundColor: 'white' }}
                  value={maritalStatusFilter} 
                  onChange={(e) => setMaritalStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  {maritalStatusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-lg-4 d-flex align-items-end">
                <button 
                  className="btn btn-outline-dark btn-lg w-100 fw-semibold border-2" 
                  style={{ borderRadius: '0' }}
                  onClick={clearFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
            
            {/* Results Summary */}
            <div className="mt-4 p-3 bg-dark text-white">
              <div className="text-center">
                <h5 className="mb-1 fw-bold">Results Summary</h5>
                <p className="mb-0">
                  Showing <span className="fw-bold fs-4">{filteredUsers.length}</span> of <span className="fw-bold">{users.length}</span> employees
                  {genderFilter && <span className="badge bg-light text-dark ms-2">Gender: {genderFilter}</span>}
                  {maritalStatusFilter && <span className="badge bg-light text-dark ms-2">Status: {maritalStatusFilter}</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Selection */}
        <div className="card border-2 border-dark mb-4" style={{ borderRadius: '0' }}>
          <div className="card-body p-4">
            <label className="form-label fw-bold text-dark mb-3 fs-5">Select Employee</label>
            <select 
              className="form-select form-select-lg border-2 border-dark" 
              style={{ borderRadius: '0', backgroundColor: 'white', fontSize: '1.1rem' }}
              onChange={handleSelectChange} 
              value={selectedUser?._id || ''}
              disabled={loading}
            >
              <option disabled value="">
                {loading ? 'Loading employees...' : `Choose from ${filteredUsers.length} available employees`}
              </option>
              {filteredUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} • {user.role} • {user. CorrectuserId || 'N/A'} 
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Details */}
        {selectedUser && (
          <div className="card border-2 border-dark mb-4" style={{ borderRadius: '0' }}>
            <div className="card-header bg-dark text-white p-4 border-0">
              <h3 className="text-center fw-bold mb-2">Employee Profile</h3>
              <p className="text-center text-white-50 mb-0">Complete employee information</p>
            </div>
            <div className="card-body p-5">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Full Name</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.name}</h6>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Role</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.role}</h6>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Telephone</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.telephone || 'Not provided'}</h6>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">NIC</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.nic}</h6>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Gender</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.gender || 'Not specified'}</h6>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Marital Status</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.maritalStatus || 'Not specified'}</h6>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Employment Type</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.empType || 'Not specified'}</h6>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Basic Salary(Rs)</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">Rs. {selectedUser.basicSal ? selectedUser.basicSal.toLocaleString() : 'Not set'}</h6>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Employee ID</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.CorrectuserId || 'Not assigned'}</h6>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="p-4 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Address</small>
                    <p className="mb-0 fw-bold text-dark fs-5">{selectedUser.address || 'Address not provided'}</p>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Bank</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.bankName || 'Not provided'}</h6>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Branch</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.bankBranch || 'Not provided'}</h6>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="p-3 border-2 border-dark bg-white">
                    <small className="text-muted fw-semibold d-block">Account No</small>
                    <h6 className="mb-0 fw-bold text-dark fs-5">{selectedUser.accountNo || 'Not provided'}</h6>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-5">
                <button 
                  className="btn btn-dark btn-lg px-5 fw-bold border-2" 
                  style={{ borderRadius: '0' }}
                  onClick={openEditModal}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Edit Employee Details'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content border-2 border-dark" style={{ borderRadius: '0' }}>
                <div className="modal-header bg-dark text-white border-0 p-4">
                  <div className="w-100 text-center">
                    <h3 className="mb-2 fw-bold">Edit Employee: {selectedUser?.name}</h3>
                    <p className="mb-0 text-white-50">Update employee information</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                
                <div className="modal-body p-5" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="row g-4">
                    {/* Role */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark mb-2">Role</label>
                      <select
                        className="form-select form-select-lg border-2 border-dark"
                        style={{ borderRadius: '0', backgroundColor: 'white' }}
                        value={editData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                      >
                        <option disabled value="">Select role</option>
                        {rolesList.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>

                    {/* Basic Salary */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark mb-2">Basic Salary(Rs)</label>
                      <input
                        type="number"
                        className="form-control form-control-lg border-2 border-dark"
                        style={{ borderRadius: '0', backgroundColor: 'white' }}
                        value={editData.basicSal}
                        onChange={(e) => handleInputChange('basicSal', e.target.value)}
                        placeholder="Enter salary amount"
                      />
                    </div>

                    {/* Telephone */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark mb-2">Telephone</label>
                      <input
                        type="tel"
                        className="form-control form-control-lg border-2 border-dark"
                        style={{ borderRadius: '0', backgroundColor: 'white' }}
                        value={editData.telephone}
                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>

                    {/* Marital Status */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark mb-2">Marital Status</label>
                      <select
                        className="form-select form-select-lg border-2 border-dark"
                        style={{ borderRadius: '0', backgroundColor: 'white' }}
                        value={editData.maritalStatus}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                      >
                        <option value="">Select marital status</option>
                        {maritalStatusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    {/* Employee Type */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark mb-2">Employee Type</label>
                      <select
                        className="form-select form-select-lg border-2 border-dark"
                        style={{ borderRadius: '0', backgroundColor: 'white' }}
                        value={editData.empType}
                        onChange={(e) => handleInputChange('empType', e.target.value)}
                      >
                        <option value="">Select employment type</option>
                        {empTypeOptions.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Bank Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark mb-2">Bank Name</label>
                      <input
                        type="text"
                        className="form-control form-control-lg border-2 border-dark"
                        style={{ borderRadius: '0', backgroundColor: 'white' }}
                        value={editData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        placeholder="Enter bank name"
                      />
                    </div>

                    {/* Bank Branch */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark mb-2">Bank Branch</label>
                      <input
                        type="text"
                        className="form-control form-control-lg border-2 border-dark"
                        style={{ borderRadius: '0', backgroundColor: 'white' }}
                        value={editData.bankBranch}
                        onChange={(e) => handleInputChange('bankBranch', e.target.value)}
                        placeholder="Enter bank branch"
                      />
                    </div>

                    {/* Account Number */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark mb-2">Account Number</label>
                      <input
                        type="text"
                        className="form-control form-control-lg border-2 border-dark"
                        style={{ borderRadius: '0', backgroundColor: 'white' }}
                        value={editData.accountNo}
                        onChange={(e) => handleInputChange('accountNo', e.target.value)}
                        placeholder="Enter account number"
                      />
                    </div>

                    {/* Address */}
                    <div className="col-12">
                      <label className="form-label fw-bold text-dark mb-2">Full Address</label>
                      <textarea
                        className="form-control form-control-lg border-2 border-dark"
                        style={{ borderRadius: '0', backgroundColor: 'white' }}
                        rows="4"
                        value={editData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter complete address"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer border-0 p-4 bg-light">
                  <div className="w-100 d-flex justify-content-between">
                    <button 
                      className="btn btn-outline-dark btn-lg px-5 fw-bold border-2" 
                      style={{ borderRadius: '0' }}
                      onClick={() => setShowModal(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-dark btn-lg px-5 fw-bold border-2" 
                      style={{ borderRadius: '0' }}
                      onClick={handleUpdate}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;