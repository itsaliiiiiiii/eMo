import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Dropdown, DropdownButton, InputGroup } from 'react-bootstrap';
import axios from 'axios';

function Phone({ formData, updateFormData }) {
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [countryCode, setCountryCode] = useState('+212');
    const [role, setRole] = useState('client');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = { ...formData, phone, username, countryCode, role };

        try {
            const response = await axios.get('http://localhost:3000/check-user', { params: { username } });
            if (response.data.exists) {
                setError('Username already exists');
            } else {
                await axios.post('http://localhost:3000/register', finalData);
                navigate("/login", { state: { showNotification: true } });
            }
        } catch (error) {
            console.error('Error registering:', error);
            setError('Error registering user');
        }
    };

    return (
        <section className="position-relative py-4 py-xl-5">
            <div className="container">
                <div className="row d-flex justify-content-center align-items-center Register-form">
                    <div className="col-md-6 col-xl-4">
                        <div className="card mb-5">
                            <div className="card-body d-flex flex-column align-items-center p-5">
                                <div className="bs-icon-xl bs-icon-circle bs-icon-primary bs-icon my-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-person">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z"></path>
                                    </svg>
                                </div>
                                <Form className="text-center" onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            as="select"
                                            name="role"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                        >
                                            <option value="client">Client</option>
                                            <option value="seller">Seller</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <InputGroup className="mb-3">
                                        <DropdownButton
                                            variant="outline-secondary"
                                            title={countryCode}
                                            id="input-group-dropdown-1"
                                        >
                                            <Dropdown.Item onClick={() => setCountryCode('+212')}>+212</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setCountryCode('+216')}>+216</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setCountryCode('+1')}>+1</Dropdown.Item>
                                        </DropdownButton>
                                        <Form.Control
                                            name="phone"
                                            type="text"
                                            placeholder="Phone Number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </InputGroup>
                                    {error && <p className="text-danger">{error}</p>}
                                    <Button className="d-block w-100" type="submit">Register</Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Phone;
