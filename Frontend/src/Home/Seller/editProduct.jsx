import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nameProduct: '',
        originProduct: '',
        priceProduct: '',
        stockProduct: '',
        descriptionProduct: '',
    });

    const [currentImage, setCurrentImage] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('eMoAccessToken');
            const response = await axios.get(`http://localhost:3000/get-product/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setFormData(response.data);
            setCurrentImage(response.data.imageProduct);
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to fetch product details. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        if (newImage) {
            formDataToSend.append('imageProduct', newImage);
        }

        try {
            const token = localStorage.getItem('eMoAccessToken');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:3000/update-product/${id}`, formDataToSend, config);
            navigate('/productList');
        } catch (error) {
            console.error('Error updating product:', error);
            if (error.response) {
                setError(error.response.data || 'An error occurred while updating the product.');
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
                                <h1 style={{ textAlign: 'left', marginBottom: '20px', fontWeight: 'bold' }}>Edit Product</h1>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nameProduct"
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
                                        placeholder='Stock'
                                        value={formData.stockProduct}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    {currentImage && (
                                        <img
                                            src={`data:image/jpeg;base64,${currentImage}`}
                                            alt="Current product"
                                            style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                                        />
                                    )}
                                    <input
                                        className="form-control"
                                        type="file"
                                        name="imageProduct"
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
                                    {isLoading ? 'Updating...' : 'Update'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default EditProduct;