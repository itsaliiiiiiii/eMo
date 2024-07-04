import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MailPassword({ updateFormData }) {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:3000/check-email', { params: { mail } });
            if (response.data.exists) {
                setError('Email already exists');
            } else {
                updateFormData({ mail, password });
                navigate("/register/phone");
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setError('Error checking email');
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
                                <form className="text-center" method="post" onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input className="form-control" name="mail" type="email"
                                            placeholder="Mail"
                                            value={mail}
                                            onChange={(e) => setMail(e.target.value)}
                                            required />
                                    </div>
                                    <div className="mb-3">
                                        <input className="form-control" type="password" name="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required />
                                    </div>
                                    {error && <p className="text-danger">{error}</p>}
                                    <div className="mb-3">
                                        <button className="btn btn-primary d-block w-100" type="submit">Next</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MailPassword;
