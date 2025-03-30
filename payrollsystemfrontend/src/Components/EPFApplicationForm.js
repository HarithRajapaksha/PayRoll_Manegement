import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const EPFApplicationForm = () => {
  const [formData, setFormData] = useState({
    epfNumber: '',
    etfNumber: '',
    bankAccount: '',
    bankName: '',
    bankBranch: '',
    nic: '',
    address: '',
    fullName: '',
  });

  const token = localStorage.getItem('token');

  const [branches, setBranches] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Hardcoded list of banks and branches
  const banks = [
    { name: "Bank of Ceylon", branches: ["Colombo Fort", "Kandy", "Galle", "Kurunegala", "Matara"] },
    { name: "People's Bank", branches: ["Colombo", "Nugegoda", "Negombo", "Anuradhapura", "Batticaloa"] },
    { name: "Sampath Bank", branches: ["Bambalapitiya", "Wattala", "Panadura", "Jaffna", "Ratnapura"] },
    { name: "Commercial Bank", branches: ["Colombo 07", "Maharagama", "Dehiwala", "Kalutara", "Vavuniya"] },
    { name: "Hatton National Bank", branches: ["Nawala", "Pettah", "Moratuwa", "Kegalle", "Badulla"] }
  ];

  // ✅ Update branch list based on selected bank
  useEffect(() => {
    if (formData.bankName) {
      const selectedBank = banks.find(bank => bank.name === formData.bankName);
      setBranches(selectedBank ? selectedBank.branches : []);
    } else {
      setBranches([]);
    }
  }, [formData.bankName]);

  // ✅ Input Change Handler
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ✅ Sri Lankan NIC Validation
  const validateNIC = (nic) => {
    return /^(\d{9}[VX]|\d{12})$/.test(nic);
  };

  // ✅ Numeric Field Validation
  const isValidNumber = (value, minLength = 6) => {
    return /^[0-9]+$/.test(value) && value.length >= minLength;
  };

  // ✅ Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.nic || !formData.address || !formData.epfNumber || !formData.etfNumber || !formData.bankAccount || !formData.bankName || !formData.bankBranch) {
      Swal.fire({ icon: 'error', title: 'Missing Fields', text: 'Please fill out all fields!' });
      return;
    }

    if (!validateNIC(formData.nic)) {
      Swal.fire({ icon: 'error', title: 'Invalid NIC', text: 'Enter a valid Sri Lankan NIC number (9-digit or 12-digit).' });
      return;
    }

    if (!isValidNumber(formData.epfNumber)) {
      Swal.fire({ icon: 'error', title: 'Invalid EPF Number', text: 'EPF number must be numeric and at least 6 digits.' });
      return;
    }

    if (!isValidNumber(formData.etfNumber)) {
      Swal.fire({ icon: 'error', title: 'Invalid ETF Number', text: 'ETF number must be numeric and at least 6 digits.' });
      return;
    }

    if (!isValidNumber(formData.bankAccount)) {
      Swal.fire({ icon: 'error', title: 'Invalid Bank Account', text: 'Bank account number must be numeric and at least 6 digits.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:3006/api/users/addEPF_EPF', formData,{
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({ icon: 'success', title: 'Success', text: 'EPF Application submitted successfully!' });
      setFormData({ epfNumber: '', etfNumber: '', bankAccount: '', bankName: '', bankBranch: '', nic: '', address: '', fullName: '' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Submission Failed', text: 'Something went wrong, please try again later.' });
      console.error("Error submitting EPF form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '600px', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 className="text-center mb-4">EPF Application Form</h2>
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter full name" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>EPF Number</Form.Label>
                <Form.Control type="text" placeholder="EPF Number" name="epfNumber" value={formData.epfNumber} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>ETF Number</Form.Label>
                <Form.Control type="text" placeholder="ETF Number" name="etfNumber" value={formData.etfNumber} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>NIC</Form.Label>
            <Form.Control type="text" placeholder="NIC Number" name="nic" value={formData.nic} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bank Account Number</Form.Label>
            <Form.Control type="text" placeholder="Account Number" name="bankAccount" value={formData.bankAccount} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bank Name</Form.Label>
            <Form.Select name="bankName" value={formData.bankName} onChange={handleChange} required>
              <option value="">Select Bank</option>
              {banks.map((bank, index) => (<option key={index} value={bank.name}>{bank.name}</option>))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bank Branch</Form.Label>
            <Form.Select name="bankBranch" value={formData.bankBranch} onChange={handleChange} required disabled={!formData.bankName}>
              <option value="">Select Branch</option>
              {branches.map((branch, index) => (<option key={index} value={branch}>{branch}</option>))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter your address" name="address" value={formData.address} onChange={handleChange} required />
          </Form.Group>

          <div className="d-flex justify-content-center mt-4">
            <Button type="submit" variant="primary" style={{ width: '180px' }} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>

        </Form>
      </div>
    </Container>
  );
};

export default EPFApplicationForm;
