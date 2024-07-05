import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios: npm install axios

function ProductsList() {
    const navigate = useNavigate();
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('eMoAccessToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:3000/get-product', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products. Please try again later.');
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('eMoAccessToken');
        navigate("/login");
    };

    const handleHome = () => {
        navigate("/home");
    };

    const handleAddProduct = () => {
        navigate("/addProduct");
    };

    return (
        <>
            <nav className="navbar navbar-expand-md bg-body py-3">
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center" href="#">
                        <span className="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex justify-content-center align-items-center me-2 bs-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-bezier">
                                <path fillRule="evenodd" d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 0-.5-.5zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"></path>
                                <path d="M6 4.5H1.866a1 1 0 1 0 0 1h2.668A6.517 6.517 0 0 0 1.814 9H2.5c.123 0 .244.015.358.043a5.517 5.517 0 0 1 3.185-3.185A1.503 1.503 0 0 1 6 5.5zm3.957 1.358A1.5 1.5 0 0 0 10 5.5v-1h4.134a1 1 0 1 1 0 1h-2.668a6.517 6.517 0 0 1 2.72 3.5H13.5c-.123 0-.243.015-.358.043a5.517 5.517 0 0 0-3.185-3.185z"></path>
                            </svg>
                        </span>
                        <span>eMo</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navcol-2" aria-controls="navcol-2" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navcol-2">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item mb-1">
                                <a className="btn btn-primary mx-2" type="button" onClick={handleHome}>Home</a>
                            </li>
                            <li className="nav-item mb-1">
                                <a className="btn btn-primary mx-2" type="button" onClick={handleAddProduct}>Add Product</a>
                            </li>
                            <li className="nav-item">
                                <a className="btn btn-primary mx-2" type="button" onClick={handleLogout}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>

            </nav>

            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 style={{ fontWeight: 'bold', textAlign: 'left', marginTop: '40px' }}>Products</h1>
                    </div>
                    <div className='d-flex flex-wrap justify-content-around flex-row'>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className="card" style={{ width: '18rem', marginTop: '20px' }}>
                                    <img
                                        src={`data:image/jpeg;base64,${product.imageProduct}`}
                                        className="card-img-top"
                                        alt={product.nameProduct}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.nameProduct}</h5>
                                        <p className="card-text">{product.descriptionProduct}</p>
                                        <p className="card-text">Price: ${product.priceProduct}</p>
                                        <p className="card-text">Stock: {product.stockProduct}</p>
                                        <p className="card-text">Origin: {product.originProduct}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No products found. Add a product to see it here.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductsList;