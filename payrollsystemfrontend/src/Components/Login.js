import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit triggered");
        console.log("Username:", username);
        console.log("Password:", password);

        const userData = {
            userName: username,
            password: password,
        };

        try {
            const response = await axios.post(`http://localhost:3006/api/auth/login`, userData);
            console.log("Login Success", response.data);
            alert("Login Success as " + response.data.userFind.role);
            localStorage.setItem('token', response.data.token);
            if(response.data.userFind.role === "Admin"){
                navigate(`/HolidayHandle-Admin`);
            }
            else{
                navigate(`/HolidayRequest`);
            }
            

        } catch (error) {
            console.error("Login Error", error.response ? error.response.data : error.message);
            alert("Login Error: " + error.response.data);
        }
    };

    return (
        <Container fluid className="login-page" style={{ height: '100vh', overflow: 'hidden' }}>
            <Row className="h-100">
                <Col
                    md={6}
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{
                        background: 'linear-gradient(135deg,rgb(212, 197, 210),rgb(143, 166, 223))',
                        color: 'white',
                        padding: '2rem',
                    }}
                >
                    <h1 className="mb-4">The Karnivore</h1>
                    <p className="mb-5">WELCOME BACK!.</p>
                </Col>
                <Col md={6} className="d-flex justify-content-center align-items-center">
                    <Form style={{ width: '80%', maxWidth: '400px' }} onSubmit={handleSubmit}>
                        <h2 className="mb-4">Login</h2>
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            style={{
                                background: 'linear-gradient(90deg,rgb(10, 9, 10), #6aa2ff)',
                                border: 'none',
                            }}
                        >
                            LOGIN
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
