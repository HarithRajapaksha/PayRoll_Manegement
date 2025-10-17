import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './ChangebgColour.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWHX2jVHS1pUs8RGgiBEL-AMb0VsbpCLM",
  authDomain: "markitupproject.firebaseapp.com",
  projectId: "markitupproject",
  storageBucket: "markitupproject.appspot.com",
  messagingSenderId: "251316166179",
  appId: "1:251316166179:web:96ab9062c734f0979e1b96",
  measurementId: "G-F73MGFE8RC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const bankList = {
  "Sampath Bank": ["Colombo", "Kandy", "Galle", "Kurunegala", "Jaffna"],
  "People's Bank": ["Colombo", "Jaffna", "Matara", "Anuradhapura", "Nuwara Eliya"],
  "Commercial Bank": ["Colombo", "Kurunegala", "Trincomalee", "Gampaha", "Kandy"],
  "HSBC": ["Colombo", "Nugegoda", "Negombo", "Rajagiriya", "Mount Lavinia"],
  "Hatton National Bank (HNB)": ["Colombo", "Hatton", "Batticaloa", "Matara", "Kandy"],
  "Bank of Ceylon (BOC)": ["Colombo", "Kandy", "Trincomalee", "Jaffna", "Badulla"],
  "NDB Bank": ["Colombo", "Negombo", "Kandy", "Kurunegala", "Rathnapura"],
  "Seylan Bank": ["Colombo", "Moratuwa", "Matale", "Panadura", "Galle"],
  "Union Bank": ["Colombo", "Kandy", "Ratnapura", "Negombo"],
  "DFCC Bank": ["Colombo", "Gampaha", "Kurunegala", "Badulla"],
  "Amana Bank": ["Colombo", "Kattankudy", "Kalmunai", "Akkaraipattu"],
  "Cargills Bank": ["Colombo", "Nugegoda", "Kandy", "Galle"],
  "Pan Asia Bank": ["Colombo", "Nugegoda", "Matara", "Negombo"],
  "National Savings Bank (NSB)": ["Colombo", "Gampaha", "Kurunegala", "Anuradhapura"],
  "Standard Chartered Bank": ["Colombo"],
  "Citibank": ["Colombo"],
  "Indian Bank": ["Colombo"],
  "Indian Overseas Bank": ["Colombo"],
  "ICICI Bank": ["Colombo"]
};

const nicPattern = /^(?:\d{9}[vVxX]|\d{12})$/;

function EmployeeRegister() {
  const [formData, setFormData] = useState({
    name: '', nic: '', dob: '', age: '',
    address: '', gender: '', maritalStatus: '',
    telephone: '', email: '', basicSal: '',
    role: '', userName: '', password: '',
    dateOfJoin: '', empType: '', bankName: '',
    bankBranch: '', accountNo: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // New state for Firebase image URL
  const [userAId, setUserId] = useState('');
  const [validated, setValidated] = useState(false);
  const [nicError, setNicError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:3006/api/users/getAllUserIdData', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const u = res.data[0]?.userId;
      if (u) setUserId(u);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const { nic } = formData;
    if (nicPattern.test(nic)) {
      let year = nic.length === 10 ? '19' + nic.slice(0, 2) : nic.slice(0, 4);
      let day = parseInt(nic.length === 10 ? nic.slice(2, 5) : nic.slice(4, 7));
      if (day > 500) day -= 500;
      const dob = new Date(`${year}-01-01`);
      dob.setDate(day);
      const age = new Date().getFullYear() - dob.getFullYear();
      setFormData(d => ({
        ...d,
        dob: dob.toISOString().split('T')[0],
        age
      }));
    } else {
      setFormData(d => ({
        ...d,
        dob: '',
        age: ''
      }));
    }
  }, [formData.nic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nic') {
      setNicError('');
    }
    setFormData(d => ({ ...d, [name]: value, ...(name === 'bankName' ? { bankBranch: '' } : {}) }));
  };

  const handleNicBlur = async () => {
    const { nic } = formData;
    if (!nic || !nicPattern.test(nic)) return;
    try {
      const res = await axios.get(`http://localhost:3006/api/auth/check-nic/${nic}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.exists) {
        setNicError('NIC already exists. Please use a different NIC.');
      } else {
        setNicError('');
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Error checking NIC:', err);
      }
      setNicError('');
    }
  };

  const handleImage = async (e) => {
    const f = e.target.files[0];
    if (f && f.type.startsWith('image/')) {
      setImage(f);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(f);

      // Upload image to Firebase Storage
      try {
        const storageRef = ref(storage, `employee-images/${f.name}-${Date.now()}`);
        await uploadBytes(storageRef, f);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
        Swal.fire('Success!', 'Image uploaded to Firebase successfully', 'success');
      } catch (err) {
        console.error('Error uploading image to Firebase:', err);
        Swal.fire('Error', 'Failed to upload image to Firebase', 'error');
        setImage(null);
        setImagePreview(null);
        setImageUrl('');
      }
    } else {
      setImage(null);
      setImagePreview(null);
      setImageUrl('');
      Swal.fire('Error', 'Please select a valid image file', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false || !image || !imageUrl || nicError) {
      Swal.fire('Error', 'Please complete all required fields, upload a valid image, and ensure NIC is unique', 'error');
      return;
    }

    try {
      // Prepare data with image URL
      const data = {
        ...formData,
        CorrectuserId: String(parseInt(userAId || '0') + 1).padStart(3, '0'),
        image: imageUrl // Use stored image URL
      };

      // Register employee
      await axios.post('http://localhost:3006/api/auth/register', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update user ID
      await axios.put('http://localhost:3006/api/users/ChangeUserIdData', {
        userId: String(parseInt(data.CorrectuserId, 10)).padStart(3, '0')
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userId = String(parseInt(data.CorrectuserId, 10)).padStart(3, '0');

      Swal.fire('Success!', 'Employee registered successfully', 'success').then(() =>
        navigate(`/UserId/${userId}`)
      );
    } catch (err) {
      console.error('Error during registration:', err);
      Swal.fire('Error', err.response?.data?.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="page-bg">
      <Container className="py-5">
        <div className="bg-white shadow rounded p-5">
          <h2 className="text-center mb-4 text-primary">Employee Registration</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Personal Details */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    pattern="[A-Za-z\s]{2,50}"
                    isInvalid={validated && !/^[A-Za-z\s]{2,50}$/.test(formData.name)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid name (2-50 characters, letters and spaces only).
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>NIC</Form.Label>
                  <Form.Control
                    required
                    name="nic"
                    value={formData.nic}
                    onChange={handleChange}
                    onBlur={handleNicBlur}
                    pattern={nicPattern.source}
                    isInvalid={!!nicError || (validated && !nicPattern.test(formData.nic))}
                  />
                  <Form.Control.Feedback type="invalid">
                    {nicError || (validated && !nicPattern.test(formData.nic) ? 'Please enter a valid NIC (9 digits + V/X or 12 digits).' : '')}
                  </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>DOB</Form.Label>
                      <Form.Control readOnly value={formData.dob} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control readOnly value={formData.age} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    required
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    isInvalid={validated && !formData.gender}
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a gender.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Telephone</Form.Label>
                  <Form.Control
                    required
                    pattern="\d{10}"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    isInvalid={validated && !/^\d{10}$/.test(formData.telephone)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid 10-digit telephone number.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    minLength={5}
                    isInvalid={validated && formData.address.length < 5}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid address (minimum 5 characters).
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={validated && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Joining</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="dateOfJoin"
                    value={formData.dateOfJoin}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    isInvalid={validated && !formData.dateOfJoin}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select a valid date of joining.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Select
                    required
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    isInvalid={validated && !formData.maritalStatus}
                  >
                    <option value="">Select</option>
                    <option>Single</option>
                    <option>Married</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select marital status.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Bank Details */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Select
                    required
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    isInvalid={validated && !formData.bankName}
                  >
                    <option value="">Select Bank</option>
                    {Object.keys(bankList).map(bank => (
                      <option key={bank}>{bank}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a bank.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bank Branch</Form.Label>
                  <Form.Select
                    required
                    name="bankBranch"
                    value={formData.bankBranch}
                    onChange={handleChange}
                    isInvalid={validated && !formData.bankBranch}
                  >
                    <option value="">Select Branch</option>
                    {(bankList[formData.bankName] || []).map(branch => (
                      <option key={branch}>{branch}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a bank branch.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Employment Info */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    required
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleChange}
                    pattern="\d{6,20}"
                    isInvalid={validated && !/^\d{6,20}$/.test(formData.accountNo)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid account number (6-20 digits).
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employment Type</Form.Label>
                  <Form.Select
                    required
                    name="empType"
                    value={formData.empType}
                    onChange={handleChange}
                    isInvalid={validated && !formData.empType}
                  >
                    <option value="">Select Type</option>
                    <option>Permanent</option>
                    <option>Casual</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select employment type.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Salary and Role */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Basic Salary(Rs)</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="basicSal"
                    value={formData.basicSal}
                    onChange={handleChange}
                    min="0"
                    isInvalid={validated && (!formData.basicSal || formData.basicSal <= 0)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid salary (greater than 0).
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    required
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    isInvalid={validated && !formData.role}
                  >
                    <option value="">Select Role</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Headchef</option>
                    <option>Subchef</option>
                    <option>Supervisior</option>
                    <option>Waiter</option>
                    <option>Helper</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a role.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Credentials */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    minLength={3}
                    pattern="[A-Za-z0-9_]{3,20}"
                    isInvalid={validated && !/^[A-Za-z0-9_]{3,20}$/.test(formData.userName)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid username (3-20 characters, letters, numbers, or underscores).
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    isInvalid={validated && formData.password.length < 6}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a password (minimum 6 characters).
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Image Upload with Bootstrap Validation */}
            <Form.Group className="mb-4 text-center">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                required
                type="file"
                onChange={handleImage}
                isInvalid={!image && validated}
              />
              <Form.Control.Feedback type="invalid">
                Please upload an image.
              </Form.Control.Feedback>
              {imagePreview && (
                <img
                  src={imagePreview}
                  className="img-thumbnail mt-3"
                  style={{ maxHeight: '150px' }}
                  alt="Preview"
                />
              )}
            </Form.Group>

            {/* Submit Button */}
            <div className="text-center">
              <Button variant="primary" type="submit" size="lg">Register Employee</Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default EmployeeRegister;