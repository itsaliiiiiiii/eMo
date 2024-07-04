import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import RegisterForm from './Register/register.jsx';
import LoginForm from './Login/login.jsx';
import Home from "./Home/home.jsx";
import AuthRoute from './AuthRoute';
import ProductList from './Home/Seller/ProductsList.jsx';
import AddProduct from './Home/Seller/AddProduct.jsx';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/register/*" element={<RegisterForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route
                        path="/home" element={
                            <AuthRoute>
                                <Home />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/addProduct" element={
                            <AuthRoute>
                                <AddProduct />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/productList" element={
                            <AuthRoute>
                                <ProductList />
                            </AuthRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;