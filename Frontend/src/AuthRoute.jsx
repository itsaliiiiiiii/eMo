import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthRoute = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('eMoAccessToken');

            if (!token) {
                navigate('/login');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:3000/protected-endpoint', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 200) {
                    setLoading(false);
                } else {
                    navigate('/login');
                }
                
            } catch (error) {
                console.error('Error validating token:', error);
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return children;
};

export default AuthRoute;
