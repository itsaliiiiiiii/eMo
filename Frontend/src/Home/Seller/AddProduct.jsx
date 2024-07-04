import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nameProduct: '',
        originProduct: '',
        priceProduct: '',
        stockProduct: '',
        descriptionProduct: '',
    });
    const [imageProduct, setImageProduct] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('eMoAccessToken');
        navigate("/login");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setImageProduct(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!imageProduct) {
            setError('Please select an image for the product.');
            setIsLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        formDataToSend.append('imageProduct', imageProduct);

        try {
            const token = localStorage.getItem('eMoAccessToken');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.post(`http://localhost:3000/add-product`, formDataToSend, config);
            navigate('/home');
        } catch (error) {
            console.error('Error adding product:', error);
            if (error.response) {
                setError(error.response.data || 'An error occurred while adding the product.');
            } else if (error.request) {
                setError('Unable to reach the server. Please try again later.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-md bg-body py-3">
                {/* ... (navbar code remains the same) ... */}
            </nav>
            <section className="position-relative py-4 py-xl-5">
                <div className="container">
                    <div className="row d-flex justify-content-center mt-4 Register-form">
                        <div className="col-md-6 col-xl-6">
                            <form onSubmit={handleSubmit}>
                                <h1 style={{ textAlign: 'left', marginBottom: '20px', fontWeight: 'bold' }}>Add Product</h1>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nameProduct"
                                        required
                                        placeholder='Name'
                                        value={formData.nameProduct}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="originProduct"
                                        placeholder='Origin'
                                        value={formData.originProduct}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="number"
                                        min={0}
                                        className="form-control"
                                        name="priceProduct"
                                        required
                                        placeholder='Price'
                                        value={formData.priceProduct}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="number"
                                        min={0}
                                        className="form-control"
                                        name="stockProduct"
                                        required
                                        placeholder='Stock'
                                        value={formData.stockProduct}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        className="form-control"
                                        type="file"
                                        name="imageProduct"
                                        required
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        name='descriptionProduct'
                                        placeholder='Description'
                                        style={{ maxHeight: '150px', minHeight: '150px' }}
                                        value={formData.descriptionProduct}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                    {isLoading ? 'Adding...' : 'Add'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AddProduct;