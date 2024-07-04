import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [role, setRole] = useState('');

    useEffect(() => {
        const checkRole = async () => {
            const token = localStorage.getItem('eMoAccessToken');
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/check-SellerOrClient', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setRole(data.role);
            } catch (error) {
                console.error('Error checking role:', error);
                navigate("/login");
            }
        };

        checkRole();
    }, []);



    const HandleAddProduct = () => {
        navigate("/addProduct");
    };

    const handleProductList = () => {
        navigate("/productList");
    };
    
    const handleLogout = () => {
        localStorage.removeItem('eMoAccessToken');
        navigate("/login");
    };

    return (
        <>
            <nav className="navbar navbar-expand-md bg-body py-3">
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center" href="#">
                        <span className="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex justify-content-center align-items-center me-2 bs-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-bezier">
                                <path fillRule="evenodd" d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"></path>
                                <path d="M6 4.5H1.866a1 1 0 1 0 0 1h2.668A6.517 6.517 0 0 0 1.814 9H2.5c.123 0 .244.015.358.043a5.517 5.517 0 0 1 3.185-3.185A1.503 1.503 0 0 1 6 5.5zm3.957 1.358A1.5 1.5 0 0 0 10 5.5v-1h4.134a1 1 0 1 1 0 1h-2.668a6.517 6.517 0 0 1 2.72 3.5H13.5c-.123 0-.243.015-.358.043a5.517 5.517 0 0 0-3.185-3.185z"></path>
                            </svg>
                        </span>
                        <span>eMo</span>
                    </a>
                    <div className="collapse navbar-collapse" id="navcol-3">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item"></li>
                        </ul>
                    </div>
                    {role === "seller" && <button className="btn mx-2 btn-primary" onClick={HandleAddProduct}>Add Product</button>}
                    {role === "seller" && <button className="btn btn-primary mx-2" type="button" onClick={handleProductList}>Product List</button>}
                    
                    <button className="btn btn-primary mx-2" type="button" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
        </>
    );
}

export default Home;
