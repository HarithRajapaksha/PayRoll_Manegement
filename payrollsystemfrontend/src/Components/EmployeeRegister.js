import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const bankList = {
  "Sampath Bank": ["Colombo", "Kandy", "Galle"],
  "People's Bank": ["Colombo", "Jaffna", "Matara"],
  "Commercial Bank": ["Colombo", "Kurunegala", "Trincomalee"],
  "HSBC": ["Colombo", "Nugegoda", "Negombo"]
};

function BasicExample() {
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
  const [userAId, setUserId] = useState('');
  const [validated, setValidated] = useState(false);
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
    if (/^\d{9}[vVxX]$|^\d{12}$/.test(nic)) {
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
    }
  }, [formData.nic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(d => ({ ...d, [name]: value, ...(name === 'bankName' ? { bankBranch: '' } : {}) }));
  };

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (f && f.type.startsWith('image/')) {
      setImage(f);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false || !image) {
      return;
    }

    const data = {
      ...formData,
      CorrectuserId: String(parseInt(userAId || '0') + 1).padStart(3, '0')
    };

    try {
      await axios.post('http://localhost:3006/api/auth/register', data);
      await axios.put('http://localhost:3006/api/users/ChangeUserIdData', {
        userId: data.CorrectuserId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('Success!', 'Employee registered successfully', 'success').then(() =>
        navigate(`/UserId/${data.userName}`)
      );
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Registration failed', 'error');
    }
  };

  return (
    <Container className="py-5">
      <div className="bg-white shadow rounded p-5">
        <h2 className="text-center mb-4 text-primary">Employee Registration</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {/* Personal Details */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control required name="name" value={formData.name} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>NIC</Form.Label>
                <Form.Control required name="nic" value={formData.nic} onChange={handleChange} />
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
                <Form.Select required name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option>Male</option><option>Female</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Telephone</Form.Label>
                <Form.Control required pattern="\d{10}" name="telephone" value={formData.telephone} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control required name="address" value={formData.address} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control required type="email" name="email" value={formData.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date of Joining</Form.Label>
                <Form.Control required type="date" name="dateOfJoin" value={formData.dateOfJoin} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Marital Status</Form.Label>
                <Form.Select required name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                  <option value="">Select</option><option>Single</option><option>Married</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Bank Details */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Select required name="bankName" value={formData.bankName} onChange={handleChange}>
                  <option value="">Select Bank</option>
                  {Object.keys(bankList).map(bank => (
                    <option key={bank}>{bank}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Bank Branch</Form.Label>
                <Form.Select required name="bankBranch" value={formData.bankBranch} onChange={handleChange}>
                  <option value="">Select Branch</option>
                  {(bankList[formData.bankName] || []).map(branch => (
                    <option key={branch}>{branch}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Employment Info */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Account Number</Form.Label>
                <Form.Control required name="accountNo" value={formData.accountNo} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Employment Type</Form.Label>
                <Form.Select required name="empType" value={formData.empType} onChange={handleChange}>
                  <option value="">Select Type</option><option>Permanent</option><option>Casual</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Salary and Role */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Basic Salary</Form.Label>
                <Form.Control required type="number" name="basicSal" value={formData.basicSal} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select required name="role" value={formData.role} onChange={handleChange}>
                  <option value="">Select Role</option>
                  <option>Admin</option><option>Manager</option><option>Headchef</option>
                  <option>Subchef</option><option>Supervisior</option><option>Waiter</option><option>Helper</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Credentials */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control required name="userName" value={formData.userName} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control required type="password" name="password" value={formData.password} onChange={handleChange} minLength={6} />
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
  );
}

export default BasicExample;
