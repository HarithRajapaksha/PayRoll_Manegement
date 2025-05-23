import React, { use, useState ,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function BasicExample() {
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [basicSal, setBasicSal] = useState('');
  const [image, setImage] = useState(null);
  const [nic, setNic] = useState('');
  const [userAId, setUserId] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // ✅ Validate Email Format
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ Validate Sri Lankan Phone Number (10 Digits)
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  // ✅ Validate Password (Minimum 6 Characters)
  const validatePassword = (password) => password.length >= 6;

  // ✅ Validate Sri Lankan NIC Number
  const validateNIC = (nic) => {
    return /^(\d{9}[VX]|\d{12})$/.test(nic);
  };

  // ✅ Handle Image Selection and Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({ icon: 'error', title: 'Invalid File', text: 'Please select an image file!' });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Fetch the last user ID when the component mounts
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`http://localhost:3006/api/users/getAllUserIdData`,{
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        const userList = response.data;
      if (Array.isArray(userList) && userList.length > 0) {
        const userAId = userList[0].userId; // Access userId from the first item
        console.log("User ID:", userAId);
        setUserId(userAId);
      } else {
        console.log("No user data found.");
      }
      } catch (error) {
        console.error("Error fetching user ID", error.response ? error.response.data : error.message);
      }
    };

    fetchUserId();
  }, []);


  //Update the newId 
  const updateUserId = async (newId) => {
    try {
      const response = await axios.put(`http://localhost:3006/api/users/ChangeUserIdData`, { userId: newId }, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User ID updated successfully", response.data);
    } catch (error) {
      console.error("Error updating user ID", error.response ? error.response.data : error.message);
    }
  }

 
  // ✅ Submit Form Data
  const Registration = async (e) => {
    e.preventDefault();

    if (!name || !userName || !password || !role || !telephone || !email || !basicSal || !image || !nic) {
      Swal.fire({ icon: 'error', title: 'Missing Fields', text: 'Please fill out all fields!' });
      return;
    }

    if (!validateNIC(nic)) {
      Swal.fire({ icon: 'error', title: 'Invalid NIC', text: 'Enter a valid Sri Lankan NIC number (9-digit or 12-digit).' });
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Enter a valid email address!' });
      return;
    }

    if (!validatePhone(telephone)) {
      Swal.fire({ icon: 'error', title: 'Invalid Phone Number', text: 'Phone number must be 10 digits!' });
      return;
    }

    if (isNaN(basicSal) || Number(basicSal) <= 0) {
      Swal.fire({ icon: 'error', title: 'Invalid Salary', text: 'Basic salary must be a positive number!' });
      return;
    }

    if (!validatePassword(password)) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Password must be at least 6 characters long!' });
      return;
    }

    const nextIdNum = parseInt(userAId, 10) + 1;

        // Pad with leading zeros if needed (e.g., 001, 002, etc.)
    const nextIdStr = String(nextIdNum).padStart(3, '0');

    const userData = { name, userName, password, role, telephone, email, basicSal, nic,CorrectuserId:nextIdStr };

    try {
      const response = await axios.post(`http://localhost:3006/api/auth/register`, userData);
      console.log("Registration Success", response.data);

      const userId = response.data.newUser._id;
      console.log("User ID:", userId);

       updateUserId(userAId + 1);

      Swal.fire({ title: "Success!", text: "Employee Registration successful!", icon: "success" })
        .then(() => navigate(`/UserId/${userId}`));
    } catch (error) {
      console.error("Registration Error", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <Container fluid style={{ height: '120vh' }}>
        <Row className="h-100">
          <Col md={4} sm={8} xs={10} className="mx-auto my-auto d-flex flex-column align-items-center justify-content-center">
            <Form className="w-100 shadow-lg p-4 rounded bg-light" onSubmit={Registration}>
              <h4 className="text-center mb-4 text-primary">Employee Registration</h4>

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>NIC</Form.Label>
                <Form.Control type="text" placeholder="Enter NIC" onChange={(e) => setNic(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Telephone</Form.Label>
                <Form.Control type="text" placeholder="Enter phone number" onChange={(e) => setTelephone(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Basic Salary</Form.Label>
                <Form.Control type="number" placeholder="Enter salary" onChange={(e) => setBasicSal(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Employee Role</Form.Label>
                <Form.Select onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Employee Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Headchef">Headchef</option>
                  <option value="Subchef">Subchef</option>
                  <option value="Supervisior">Supervisior</option>
                  <option value="Waiter">Waiter</option>
                  <option value="Helper">Helper</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>System Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUserName(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>

              {imagePreview && (
                <div className="text-center mb-3">
                  <h6>Image Preview:</h6>
                  <img src={imagePreview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '150px' }} />
                </div>
              )}

              <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit" className="w-50">Register</Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BasicExample;
